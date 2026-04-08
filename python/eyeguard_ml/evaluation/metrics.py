import numpy as np
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, precision_recall_fscore_support


def evaluate(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    cm = confusion_matrix(y_true, y_pred)
    p, r, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="macro", zero_division=0)
    accuracy = accuracy_score(y_true, y_pred)
    report = classification_report(y_true, y_pred, zero_division=0)
    return {
        "confusion_matrix": cm.tolist(),
        "accuracy": float(accuracy),
        "precision": float(p),
        "recall": float(r),
        "f1": float(f1),
        "report": report,
    }

