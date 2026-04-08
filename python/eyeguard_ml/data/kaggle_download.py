from pathlib import Path
import os
import kagglehub


def dataset_handles_from_env() -> dict[str, str]:
    return {
        "mrl_eye_dataset": os.getenv("EYE_GUARD_KAGGLE_DATASET_1", "akashshingha850/mrl-eye-dataset"),
        "blink_detection": os.getenv("EYE_GUARD_KAGGLE_DATASET_2", "inder123/blinking-eye-detection"),
        "mrl_cew_combined": os.getenv("EYE_GUARD_KAGGLE_DATASET_3", "prasadvpatil/mrl-dataset"),
        "open_closed_eyes": os.getenv("EYE_GUARD_KAGGLE_DATASET_4", "sehriyarmemmedli/open-closed-eyes-dataset"),
    }


def download_all(data_root: str) -> dict[str, str]:
    root = Path(data_root)
    root.mkdir(parents=True, exist_ok=True)
    resolved: dict[str, str] = {}
    for key, handle in dataset_handles_from_env().items():
        path = kagglehub.dataset_download(handle)
        resolved[key] = path
    return resolved


if __name__ == "__main__":
    from pprint import pprint

    data_root = os.getenv("EYE_GUARD_DATA_ROOT", "./data/raw")
    pprint(download_all(data_root))

