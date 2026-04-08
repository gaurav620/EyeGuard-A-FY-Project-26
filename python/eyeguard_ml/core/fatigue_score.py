from dataclasses import dataclass


@dataclass
class Baseline:
    blink_rate: float = 15.0
    closure_duration: float = 0.35
    gaze_variance: float = 40.0
    ear: float = 0.27


def compute_fatigue_score(
    blink_rate: float,
    closure_duration: float,
    gaze_variance: float,
    elapsed_minutes: float,
    baseline: Baseline,
    w1: float = 0.25,
    w2: float = 0.30,
    w3: float = 0.20,
    w4: float = 0.15,
    w5: float = 0.10,
) -> float:
    br = min(abs(blink_rate - baseline.blink_rate) / max(baseline.blink_rate, 1e-6), 1.0)
    cd = min(closure_duration / max(baseline.closure_duration, 1e-6), 1.0)
    gv = min(gaze_variance / max(baseline.gaze_variance, 1e-6), 1.0)
    tm = min(elapsed_minutes / 120.0, 1.0)
    score = (w1 * br + w2 * cd + w3 * gv + w4 * tm + w5 * abs(br - cd)) * 100.0
    return max(0.0, min(score, 100.0))

