from __future__ import annotations

import json
import os
from pathlib import Path
import re
import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow import keras
from tensorflow.keras.preprocessing.image import img_to_array, load_img

from eyeguard_ml.data.kaggle_download import download_all
from eyeguard_ml.training.model import build_cnn
from eyeguard_ml.training.labeling import eye_state_names, one_hot
from eyeguard_ml.evaluation.metrics import evaluate


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
OPEN_KEYWORDS = {"open", "opened", "awake"}
CLOSED_KEYWORDS = {"closed", "close", "blink", "blinking", "sleepy", "drowsy"}


def infer_eye_state(path: Path) -> int | None:
    lowered = path.as_posix().lower()
    tokens = set(re.split(r"[^a-z0-9]+", lowered))

    if tokens & CLOSED_KEYWORDS:
        return 0
    if tokens & OPEN_KEYWORDS:
        return 1

    # Fallback for common MRL naming pattern where "_0_" often indicates closed eyes.
    filename = path.name.lower()
    if "_0_" in filename:
        return 0
    if "_1_" in filename:
        return 1
    return None


def collect_labeled_images(dataset_roots: dict[str, str], max_samples: int) -> list[tuple[Path, int]]:
    labeled: list[tuple[Path, int]] = []
    per_dataset_cap = max(1, max_samples // max(len(dataset_roots), 1))

    for dataset_name, root in dataset_roots.items():
        dataset_dir = Path(root)
        if not dataset_dir.exists():
            continue

        count = 0
        for image_path in dataset_dir.rglob("*"):
            if image_path.suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            label = infer_eye_state(image_path)
            if label is None:
                continue

            labeled.append((image_path, label))
            count += 1
            if count >= per_dataset_cap:
                break

    return labeled[:max_samples]


def load_dataset(image_size: int = 64, max_samples: int = 16000) -> tuple[np.ndarray, np.ndarray, dict[str, int], dict[str, str]]:
    roots = download_all(os.getenv("EYE_GUARD_DATA_ROOT", "./data/raw"))
    pairs = collect_labeled_images(roots, max_samples=max_samples)
    if len(pairs) < 100:
        raise RuntimeError("Not enough labeled images found across the 4 datasets. Check dataset download paths/labels.")

    x_list: list[np.ndarray] = []
    y_list: list[int] = []
    dataset_counts = {"closed": 0, "open": 0}

    for image_path, label in pairs:
        image = load_img(image_path, color_mode="grayscale", target_size=(image_size, image_size))
        arr = img_to_array(image).astype(np.float32) / 255.0
        x_list.append(arr)
        y_list.append(label)
        if label == 0:
            dataset_counts["closed"] += 1
        else:
            dataset_counts["open"] += 1

    x = np.stack(x_list)
    y = np.array(y_list, dtype=np.int32)

    # Balance classes to avoid an over-optimistic model on majority class.
    rng = np.random.default_rng(42)
    closed_idx = np.where(y == 0)[0]
    open_idx = np.where(y == 1)[0]
    n_keep = min(len(closed_idx), len(open_idx))
    if n_keep < 200:
        raise RuntimeError("Insufficient balanced samples after label extraction.")

    keep_closed = rng.choice(closed_idx, size=n_keep, replace=False)
    keep_open = rng.choice(open_idx, size=n_keep, replace=False)
    keep_idx = np.concatenate([keep_closed, keep_open])
    rng.shuffle(keep_idx)

    x = x[keep_idx]
    y = y[keep_idx]
    dataset_counts = {"closed": int(n_keep), "open": int(n_keep)}
    return x, y, dataset_counts, roots


def run_training(output_dir: str = "./models"):
    image_size = int(os.getenv("EYE_GUARD_IMAGE_SIZE", "64"))
    max_samples = int(os.getenv("EYE_GUARD_MAX_SAMPLES", "16000"))
    epochs = int(os.getenv("EYE_GUARD_EPOCHS", "8"))
    batch_size = int(os.getenv("EYE_GUARD_BATCH_SIZE", "64"))

    x, y, class_balance, dataset_paths = load_dataset(image_size=image_size, max_samples=max_samples)
    y_cat = one_hot(y, n_classes=2)

    x_train, x_temp, y_train, y_temp, y_train_cat, y_temp_cat = train_test_split(
        x, y, y_cat, test_size=0.30, random_state=42, stratify=y
    )
    x_val, x_test, y_val, y_test, y_val_cat, y_test_cat = train_test_split(
        x_temp, y_temp, y_temp_cat, test_size=0.50, random_state=42, stratify=y_temp
    )

    model = build_cnn(image_size=image_size, n_classes=2)
    callbacks = [
        keras.callbacks.EarlyStopping(monitor="val_loss", patience=2, restore_best_weights=True),
        keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=1),
    ]

    history = model.fit(
        x_train,
        y_train_cat,
        validation_data=(x_val, y_val_cat),
        epochs=epochs,
        batch_size=batch_size,
        verbose=1,
        callbacks=callbacks,
    )

    test_pred = np.argmax(model.predict(x_test, verbose=0), axis=1)
    test_metrics = evaluate(y_test, test_pred)

    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)
    model.save(out / "eyeguard_eye_state.keras")

    metadata = {
        "task": "eye_state_classification",
        "classes": eye_state_names(),
        "image_size": image_size,
        "dataset_paths": dataset_paths,
        "class_balance": class_balance,
        "splits": {
            "train": int(len(y_train)),
            "val": int(len(y_val)),
            "test": int(len(y_test)),
        },
        "final_train_accuracy": float(history.history.get("accuracy", [0.0])[-1]),
        "final_val_accuracy": float(history.history.get("val_accuracy", [0.0])[-1]),
        "test": test_metrics,
    }
    (out / "eyeguard_eye_state_metrics.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return metadata


if __name__ == "__main__":
    summary = run_training(output_dir=os.getenv("EYE_GUARD_MODEL_DIR", "./models"))
    print("Training complete.")
    print(f"Train accuracy: {summary['final_train_accuracy']:.4f}")
    print(f"Validation accuracy: {summary['final_val_accuracy']:.4f}")
    print(f"Test accuracy: {summary['test']['accuracy']:.4f}")
    print(f"Test F1: {summary['test']['f1']:.4f}")

