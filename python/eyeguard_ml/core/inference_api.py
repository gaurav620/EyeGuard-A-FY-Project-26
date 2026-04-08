from __future__ import annotations

import base64
import io
import os
from pathlib import Path

import numpy as np
from flask import Flask, jsonify, request
from PIL import Image
from tensorflow import keras


app = Flask(__name__)


def _model_path() -> Path:
    model_dir = os.getenv("EYE_GUARD_MODEL_DIR", "./models")
    return Path(model_dir) / "eyeguard_eye_state.keras"


def _image_size() -> int:
    return int(os.getenv("EYE_GUARD_IMAGE_SIZE", "64"))


def _decode_image(image_base64: str, image_size: int) -> np.ndarray:
    payload = image_base64
    if "," in payload:
        payload = payload.split(",", 1)[1]

    raw = base64.b64decode(payload)
    image = Image.open(io.BytesIO(raw)).convert("L")
    image = image.resize((image_size, image_size))
    arr = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=(0, -1))


def _load_model() -> keras.Model:
    path = _model_path()
    if not path.exists():
        raise FileNotFoundError(
            f"Model file not found at {path}. Run training first with: npm run ml:train"
        )
    return keras.models.load_model(path)


MODEL = _load_model()


@app.get("/health")
def health() -> tuple[str, int]:
    return jsonify({"ok": True, "modelPath": str(_model_path())}), 200


@app.post("/predict-eye-state")
def predict_eye_state() -> tuple[str, int]:
    body = request.get_json(silent=True) or {}
    image_base64 = body.get("imageBase64")
    if not image_base64:
        return jsonify({"ok": False, "error": "imageBase64 is required"}), 422

    x = _decode_image(str(image_base64), _image_size())
    probs = MODEL.predict(x, verbose=0)[0]

    closed_prob = float(probs[0])
    open_prob = float(probs[1])
    label = "Closed" if closed_prob >= open_prob else "Open"

    return (
        jsonify(
            {
                "ok": True,
                "data": {
                    "label": label,
                    "closedProbability": closed_prob,
                    "openProbability": open_prob,
                },
            }
        ),
        200,
    )


if __name__ == "__main__":
    host = os.getenv("EYE_GUARD_INFERENCE_HOST", "127.0.0.1")
    port = int(os.getenv("EYE_GUARD_INFERENCE_PORT", "5055"))
    app.run(host=host, port=port, debug=False)
