import numpy as np


def hybrid_label(model_score_0_100: float, self_report_1_5: int, model_weight: float = 0.7) -> float:
    self_report_norm = ((self_report_1_5 - 1) / 4.0) * 100.0
    return model_weight * model_score_0_100 + (1.0 - model_weight) * self_report_norm


def to_class(score: float) -> int:
    if score < 25:
        return 0
    if score < 50:
        return 1
    if score < 75:
        return 2
    return 3


def class_names() -> list[str]:
    return ["Normal", "Mild", "Moderate", "Severe"]


def eye_state_names() -> list[str]:
    return ["Closed", "Open"]


def one_hot(y: np.ndarray, n_classes: int = 4) -> np.ndarray:
    out = np.zeros((len(y), n_classes), dtype=np.float32)
    out[np.arange(len(y)), y] = 1.0
    return out

