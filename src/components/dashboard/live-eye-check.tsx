"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, AlertTriangle, Camera, CheckCircle2, Eye, LoaderCircle, Sparkles, Timer, Video, VideoOff } from "lucide-react";

type FatigueResponse = {
  ok: boolean;
  data: {
    score: number;
    level: "low" | "moderate" | "high" | "critical";
    shouldAlert: boolean;
    eyeState?: {
      label: "Closed" | "Open";
      closedProbability: number;
      openProbability: number;
    } | null;
  };
};

type LiveMetric = {
  label: string;
  value: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function LiveEyeCheck() {
  const SAMPLE_MS = 300;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const previousFrameLumaRef = useRef<Float32Array | null>(null);
  const baselineEyeTextureRef = useRef<number | null>(null);
  const blinkCountRef = useRef(0);
  const closedFramesRef = useRef(0);
  const avgClosureDurationRef = useRef(0.22);
  const sampleCountRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [error, setError] = useState<string>("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const [fatigueScore, setFatigueScore] = useState(0);
  const [fatigueLevel, setFatigueLevel] = useState<"low" | "moderate" | "high" | "critical">("low");
  const [blinkRate, setBlinkRate] = useState(0);
  const [ear, setEar] = useState(0.27);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [trackingQuality, setTrackingQuality] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [eyeStateLabel, setEyeStateLabel] = useState<"Closed" | "Open" | "Unknown">("Unknown");
  const [eyeStateConfidence, setEyeStateConfidence] = useState(0);
  const [lastInferenceAt, setLastInferenceAt] = useState<number | null>(null);

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const fatigueWidthClass =
    fatigueScore >= 95
      ? "w-[95%]"
      : fatigueScore >= 90
        ? "w-[90%]"
        : fatigueScore >= 80
          ? "w-[80%]"
          : fatigueScore >= 70
            ? "w-[70%]"
            : fatigueScore >= 60
              ? "w-[60%]"
              : fatigueScore >= 50
                ? "w-[50%]"
                : fatigueScore >= 40
                  ? "w-[40%]"
                  : fatigueScore >= 30
                    ? "w-[30%]"
                    : fatigueScore >= 20
                      ? "w-[20%]"
                      : fatigueScore >= 10
                        ? "w-[10%]"
                        : "w-[2%]";

  const metrics: LiveMetric[] = [
    {
      label: "Fatigue Score",
      value: `${fatigueScore} / 100`,
      color:
        fatigueScore >= 75
          ? "text-red-400"
          : fatigueScore >= 50
            ? "text-orange-400"
            : fatigueScore >= 25
              ? "text-yellow-400"
              : "text-green-400",
      icon: Activity,
    },
    {
      label: "Blink Rate",
      value: `${blinkRate} bpm`,
      color: "text-accent",
      icon: Eye,
    },
    {
      label: "Average EAR",
      value: ear.toFixed(2),
      color: "text-accent-2",
      icon: Camera,
    },
    {
      label: "Session Time",
      value: `${elapsedMinutes.toFixed(1)} min`,
      color: "text-green-400",
      icon: Timer,
    },
    {
      label: "Model Eye State",
      value: `${eyeStateLabel} (${eyeStateConfidence}%)`,
      color: eyeStateLabel === "Closed" ? "text-orange-400" : eyeStateLabel === "Open" ? "text-green-400" : "text-muted",
      icon: Eye,
    },
  ];

  const calibrationProgress = clamp(Math.round((sampleCount / 40) * 100), 0, 100);
  const stabilityScore = clamp(Math.round((trackingQuality * 0.7 + (100 - Math.min(100, fatigueScore)) * 0.3)), 0, 100);
  const modeLabel = !running ? "Idle" : calibrationProgress < 100 ? "Calibrating" : "Active Monitoring";
  const modeDescription = !running
    ? "Camera is off. Start to begin eye tracking."
    : calibrationProgress < 100
      ? "Collecting baseline signals. Keep your face centered for a few seconds."
      : "Live monitoring is active and model predictions are enabled.";
  const modeColor = !running
    ? "text-muted"
    : calibrationProgress < 100
      ? "text-yellow-400"
      : fatigueScore >= 60
        ? "text-orange-400"
        : "text-green-400";
  const isReady = running && calibrationProgress >= 100;

  const recommendations =
    fatigueScore >= 60
      ? [
          "Take a short 2-5 minute eye break.",
          "Blink intentionally and look at a distant object.",
          "Reduce screen brightness or increase ambient lighting.",
        ]
      : fatigueScore >= 35
        ? [
            "Maintain posture and keep your eyes centered in frame.",
            "Follow the 20-20-20 rule every 20 minutes.",
            "Hydrate and avoid long unbroken focus sessions.",
          ]
        : [
            "Current eye strain is low. Keep the same setup.",
            "Continue periodic breaks to stay in low fatigue range.",
            "Use this dashboard for ongoing preventive monitoring.",
          ];

  const computeRoiTexture = (
    luma: Float32Array,
    frameWidth: number,
    frameHeight: number,
    xRatio: number,
    yRatio: number,
    wRatio: number,
    hRatio: number
  ) => {
    const x0 = Math.floor(frameWidth * xRatio);
    const y0 = Math.floor(frameHeight * yRatio);
    const w = Math.max(8, Math.floor(frameWidth * wRatio));
    const h = Math.max(6, Math.floor(frameHeight * hRatio));

    let sum = 0;
    let sumSq = 0;
    let count = 0;
    for (let y = y0; y < Math.min(y0 + h, frameHeight); y += 1) {
      for (let x = x0; x < Math.min(x0 + w, frameWidth); x += 1) {
        const v = luma[y * frameWidth + x] ?? 0;
        sum += v;
        sumSq += v * v;
        count += 1;
      }
    }

    if (count === 0) {
      return { mean: 0, std: 0 };
    }

    const mean = sum / count;
    const variance = Math.max(0, sumSq / count - mean * mean);
    return { mean, std: Math.sqrt(variance) };
  };

  const extractEyePatchBase64 = (videoCanvas: HTMLCanvasElement) => {
    const patchCanvas = document.createElement("canvas");
    patchCanvas.width = 64;
    patchCanvas.height = 64;
    const patchCtx = patchCanvas.getContext("2d");
    if (!patchCtx) return undefined;

    const sx = Math.floor(videoCanvas.width * 0.18);
    const sy = Math.floor(videoCanvas.height * 0.20);
    const sw = Math.floor(videoCanvas.width * 0.64);
    const sh = Math.floor(videoCanvas.height * 0.30);
    if (sw <= 0 || sh <= 0) return undefined;

    patchCtx.drawImage(videoCanvas, sx, sy, sw, sh, 0, 0, patchCanvas.width, patchCanvas.height);
    return patchCanvas.toDataURL("image/jpeg", 0.7);
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setRunning(false);
    setStarting(false);
    setVideoReady(false);
    setTrackingQuality(0);
  };

  const sampleTelemetry = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || !startedAt) return;

    const canvas = document.createElement("canvas");
    canvas.width = 96;
    canvas.height = 72;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let lumaSum = 0;
    const luma = new Float32Array(canvas.width * canvas.height);
    let lumaMotion = 0;
    const previousFrame = previousFrameLumaRef.current;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      const y = 0.299 * r + 0.587 * g + 0.114 * b;
      const idx = i / 4;
      luma[idx] = y;
      lumaSum += y;
      if (previousFrame) {
        lumaMotion += Math.abs((previousFrame[idx] ?? y) - y);
      }
    }
    previousFrameLumaRef.current = luma;

    const pixels = data.length / 4;
    const averageLuma = lumaSum / Math.max(pixels, 1);

    // Approximate eye regions in the upper-middle frame and extract texture.
    const leftEye = computeRoiTexture(luma, canvas.width, canvas.height, 0.20, 0.28, 0.22, 0.14);
    const rightEye = computeRoiTexture(luma, canvas.width, canvas.height, 0.58, 0.28, 0.22, 0.14);
    const eyeTexture = (leftEye.std + rightEye.std) / 2;
    const eyeAsymmetry = Math.abs(leftEye.mean - rightEye.mean);
    const frameMotion = lumaMotion / Math.max(pixels, 1);

    // Learn user-specific baseline texture using exponential smoothing.
    if (baselineEyeTextureRef.current === null) {
      baselineEyeTextureRef.current = eyeTexture;
    } else {
      baselineEyeTextureRef.current = baselineEyeTextureRef.current * 0.92 + eyeTexture * 0.08;
    }

    const baselineTexture = baselineEyeTextureRef.current ?? eyeTexture;
    const closedThreshold = baselineTexture * 0.72;
    const isClosed = eyeTexture < closedThreshold;
    sampleCountRef.current += 1;
    setSampleCount(sampleCountRef.current);

    if (isClosed) {
      closedFramesRef.current += 1;
    } else if (closedFramesRef.current > 0) {
      const closureSeconds = (closedFramesRef.current * SAMPLE_MS) / 1000;
      if (closureSeconds >= 0.09 && closureSeconds <= 0.7) {
        blinkCountRef.current += 1;
        avgClosureDurationRef.current = avgClosureDurationRef.current * 0.7 + closureSeconds * 0.3;
      }
      closedFramesRef.current = 0;
    }

    const textureDenominator = Math.max(0.01, baselineTexture - closedThreshold);
    const opennessNorm = clamp((eyeTexture - closedThreshold) / textureDenominator, 0, 1);
    const computedEar = clamp(0.18 + opennessNorm * 0.16, 0.18, 0.34);

    const minutes = (Date.now() - startedAt) / 60000;
    const computedBlinkRate = Math.round(clamp(minutes > 0 ? blinkCountRef.current / minutes : 0, 0, 50));
    const closureDuration = clamp(
      isClosed ? (closedFramesRef.current * SAMPLE_MS) / 1000 : avgClosureDurationRef.current,
      0.12,
      0.8
    );
    const gazeVariance = clamp(eyeAsymmetry * 1.3 + frameMotion * 1.8 + Math.abs(averageLuma - 120) * 0.05, 8, 95);

    const qualityFromTexture = clamp((baselineTexture / 28) * 100, 0, 100);
    const qualityFromSymmetry = clamp(100 - eyeAsymmetry * 1.8, 0, 100);
    const qualityFromMotion = clamp(100 - frameMotion * 5, 0, 100);
    const quality = Math.round((qualityFromTexture * 0.5 + qualityFromSymmetry * 0.3 + qualityFromMotion * 0.2));

    setEar(computedEar);
    setBlinkRate(computedBlinkRate);
    setElapsedMinutes(minutes);
    setTrackingQuality(quality);

    const payload = {
      sessionId,
      ear: computedEar,
      blinkRate: computedBlinkRate,
      eyeClosureDuration: closureDuration,
      gazeVariance,
      elapsedMinutes: minutes,
      eyePatchBase64: sampleCountRef.current % 3 === 0 ? extractEyePatchBase64(canvas) : undefined,
    };

    try {
      const response = await fetch("/api/telemetry/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return;
      }

      const result = (await response.json()) as FatigueResponse;
      setFatigueScore(result.data.score);
      setFatigueLevel(result.data.level);
      if (result.data.eyeState) {
        const closed = result.data.eyeState.closedProbability;
        const open = result.data.eyeState.openProbability;
        setEyeStateLabel(result.data.eyeState.label);
        setEyeStateConfidence(Math.round(Math.max(closed, open) * 100));
        setLastInferenceAt(Date.now());
      }
      setScoreHistory((current) => {
        const next = [...current, result.data.score];
        return next.slice(-24);
      });
    } catch {
      // Ignore transient telemetry errors and keep local camera running.
    }
  };

  const startCamera = async () => {
    setError("");
    setStarting(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Your browser does not support webcam access.");
        setStarting(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setVideoReady(videoRef.current.readyState >= 2);
      }

      const now = Date.now();
      setStartedAt(now);
      setRunning(true);
      setFatigueScore(0);
      setFatigueLevel("low");
      setBlinkRate(0);
      setEar(0.27);
      setElapsedMinutes(0);
      setTrackingQuality(0);
      setSampleCount(0);
      setScoreHistory([]);
      setEyeStateLabel("Unknown");
      setEyeStateConfidence(0);
      setLastInferenceAt(null);
      previousFrameLumaRef.current = null;
      baselineEyeTextureRef.current = null;
      blinkCountRef.current = 0;
      closedFramesRef.current = 0;
      avgClosureDurationRef.current = 0.22;
      sampleCountRef.current = 0;

      intervalRef.current = window.setInterval(() => {
        void sampleTelemetry();
      }, SAMPLE_MS);
    } catch {
      setError("Unable to open your camera. Please allow camera permission and retry.");
      stopCamera();
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div id="live-eye-check" className="space-y-6">
      <section className="clean-card bg-gradient-to-r from-cyan-500/8 via-background to-indigo-500/8 p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Core Eye Intelligence</p>
            <h2 className="mt-2 text-2xl font-semibold">Adaptive Fatigue Engine</h2>
            <p className="mt-2 text-sm text-muted">
              Real-time eye telemetry, adaptive baseline calibration, and backend fatigue scoring are now running as the main
              product capability.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-card-border bg-card/60 px-3 py-1 text-xs">
                Mode: <span className={`font-semibold ${modeColor}`}>{modeLabel}</span>
              </span>
              <span className="rounded-full border border-card-border bg-card/60 px-3 py-1 text-xs">
                Signal Quality: <span className="font-semibold text-foreground">{trackingQuality}%</span>
              </span>
              <span className="rounded-full border border-card-border bg-card/60 px-3 py-1 text-xs">
                Stability Index: <span className="font-semibold text-foreground">{stabilityScore}%</span>
              </span>
              <span className={fatigueScore >= 60 ? "badge-danger" : fatigueScore >= 35 ? "badge-warning" : "badge-success"}>
                <span className={`h-1.5 w-1.5 rounded-full ${fatigueScore >= 60 ? "bg-red-400" : fatigueScore >= 35 ? "bg-yellow-400" : "bg-green-400"}`} />
                Fatigue {fatigueLevel}
              </span>
            </div>

            <p className="mt-3 text-sm text-muted">{modeDescription}</p>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-muted">
                <span>Calibration Progress</span>
                <span>{calibrationProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-card/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${calibrationProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="clean-card p-4">
            <p className="text-sm font-medium text-foreground">Fatigue Trend (Live)</p>
            <div className="mt-4 flex h-24 items-end gap-1.5">
              {scoreHistory.length > 0 ? (
                scoreHistory.map((value, index) => (
                  <div
                    key={`${index}-${value}`}
                    className="min-w-0 flex-1 rounded-t bg-gradient-to-t from-cyan-500 to-indigo-500 opacity-90"
                    style={{ height: `${Math.max(6, value)}%` }}
                    title={`Score: ${value}`}
                  />
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-card-border text-xs text-muted">
                  Start Eye Check to see trend
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-muted">Latest fatigue level: <span className="font-semibold capitalize text-foreground">{fatigueLevel}</span></p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="clean-card p-3">
            <p className="text-xs uppercase tracking-wide text-muted">Step 1</p>
            <p className="mt-1 text-sm font-medium">Allow Camera Access</p>
            <p className="mt-1 text-xs text-muted">Browser must allow camera for live monitoring.</p>
          </div>
          <div className="clean-card p-3">
            <p className="text-xs uppercase tracking-wide text-muted">Step 2</p>
            <p className="mt-1 text-sm font-medium">Stay Centered</p>
            <p className="mt-1 text-xs text-muted">Keep both eyes visible for better confidence and stability.</p>
          </div>
          <div className="clean-card p-3">
            <p className="text-xs uppercase tracking-wide text-muted">Step 3</p>
            <p className="mt-1 text-sm font-medium">Follow Suggestions</p>
            <p className="mt-1 text-xs text-muted">Use recommendations panel for immediate actions.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="clean-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{metric.label}</p>
              <metric.icon className="h-4 w-4 text-accent" />
            </div>
            <p className={`mt-3 text-2xl font-bold ${metric.color}`}>{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="clean-card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Live Camera Feed</h2>
            <div className="flex items-center gap-2">
              {!running ? (
                <button
                  onClick={() => void startCamera()}
                  disabled={starting}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent/90 transition-colors"
                >
                  {starting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                  {starting ? "Starting Camera..." : "Start Eye Check"}
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-card transition-colors"
                >
                  <VideoOff className="h-4 w-4" />
                  Stop Session
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-card-border bg-background/50">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onLoadedData={() => setVideoReady(true)}
                onCanPlay={() => setVideoReady(true)}
                className="h-72 w-full object-cover"
              />
              {!running ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-accent" />
                    <p className="mt-2 text-sm font-medium text-foreground">Camera preview will appear here</p>
                    <p className="mt-1 text-xs text-muted">Click Start Eye Check to begin</p>
                  </div>
                </div>
              ) : !videoReady ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/55">
                  <div className="text-center">
                    <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-cyan-400" />
                    <p className="mt-2 text-sm font-semibold text-foreground">Initializing camera feed...</p>
                    <p className="mt-1 text-xs text-muted">Please keep this tab active and allow permissions.</p>
                  </div>
                </div>
              ) : (
                <div className="absolute right-3 top-3 rounded-full border border-emerald-300 bg-emerald-100/90 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  LIVE VIDEO
                </div>
              )}
            </div>
          </div>
          {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
          {!running ? (
            <p className="mt-3 text-sm text-muted">Click &quot;Start Eye Check&quot; to enable webcam and live telemetry.</p>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Camera active. Telemetry is sampled every {(SAMPLE_MS / 1000).toFixed(1)}s with adaptive blink detection.
              Tracking quality: <span className="font-semibold text-foreground">{trackingQuality}%</span>
            </p>
          )}

          {running ? (
            <p className="mt-2 text-xs text-muted">
              Inference status: <span className="font-semibold text-foreground">{eyeStateLabel === "Unknown" ? "Waiting for model output..." : `${eyeStateLabel} (${eyeStateConfidence}%)`}</span>
              {lastInferenceAt ? <span> · Last update {Math.max(0, Math.floor((Date.now() - lastInferenceAt) / 1000))}s ago</span> : null}
            </p>
          ) : null}

          <div className="clean-card mt-4 p-3">
            <div className="flex items-center gap-2 text-sm">
              {isReady ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <AlertTriangle className="h-4 w-4 text-yellow-400" />}
              <span className="font-medium text-foreground">{isReady ? "System Ready" : "Preparing System"}</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {isReady
                ? "Model confidence and telemetry are stable. You can trust live recommendations."
                : "Please keep your face centered while baseline calibration completes."}
            </p>
          </div>
        </div>

        <div className="clean-card p-6">
          <h2 className="text-xl font-semibold">Fatigue Meter</h2>
          <div className="mt-6 rounded-full bg-background/50 p-1">
            <div className={`fatigue-gradient h-5 rounded-full transition-all duration-300 ${fatigueWidthClass}`} />
          </div>
          <p className="mt-4 text-sm text-muted">
            Alert threshold: 60. Current level: <span className="font-semibold capitalize text-foreground">{fatigueLevel}</span>.
          </p>

          <div className="clean-card mt-5 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <p className="text-sm font-semibold text-foreground">Recommended Actions</p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {recommendations.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
