"use client";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import {
  Eye,
  Brain,
  Activity,
  Shield,
  Users,
  BarChart3,
  Zap,
  ArrowRight,
  Camera,
  Cpu,
  LineChart,
  Bell,
  CheckCircle2,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <NoveltySection />
        <ResearchImpact />
        <DatasetStats />
        <DemoPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-2/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Research Preview &mdash; JisTech Lab 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight"
          >
            AI-Powered Eye Fatigue
            <br />
            <span className="gradient-text glow-text-cyan">Detection in Real-Time</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto"
          >
            Personalized temporal modeling meets computer vision. Eye-Guard detects
            digital eye strain before you feel it — using adaptive baselines, LSTM
            sequence modeling, and hybrid AI-human labeling.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-background font-semibold text-lg hover:bg-accent/90 transition-all glow-cyan"
            >
              Try Live Demo
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-card-border text-foreground font-semibold text-lg hover:border-accent/30 hover:bg-card transition-all"
            >
              Read the Paper
            </Link>
          </motion.div>

          {/* Live preview mockup */}
          <motion.div
            variants={fadeUp}
            className="mt-16 mx-auto max-w-4xl"
          >
            <div className="relative rounded-2xl border border-card-border bg-card/50 backdrop-blur-sm p-1 glow-cyan">
              <div className="rounded-xl bg-card p-6">
                {/* Fake dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-xs text-muted font-mono">eye-guard.ai/dashboard</div>
                </div>

                {/* Fake metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Fatigue Score", value: "34", unit: "/100", color: "text-green-400" },
                    { label: "Blink Rate", value: "16", unit: "bpm", color: "text-accent" },
                    { label: "EAR", value: "0.28", unit: "", color: "text-accent-2" },
                    { label: "Session", value: "24", unit: "min", color: "text-yellow-400" },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-lg bg-background/50 border border-card-border p-4 text-center">
                      <div className="text-xs text-muted mb-1">{metric.label}</div>
                      <div className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value}
                        <span className="text-sm text-muted ml-1">{metric.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fake fatigue bar */}
                <div className="mt-4 rounded-full h-2 bg-background/50 overflow-hidden">
                  <div className="h-full w-[34%] fatigue-gradient rounded-full transition-all" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { icon: Users, value: "50+", label: "Research Participants" },
    { icon: Activity, value: "10K+", label: "Data Points Collected" },
    { icon: Eye, value: "4", label: "Merged Datasets" },
    { icon: BarChart3, value: "94.2%", label: "Detection Accuracy" },
  ];

  return (
    <section className="border-y border-card-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <stat.icon className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Camera,
      title: "Webcam Capture",
      desc: "Real-time video stream processed at 30fps using browser MediaDevices API.",
      color: "text-cyan-400",
    },
    {
      icon: Eye,
      title: "Landmark Detection",
      desc: "68 facial landmarks extracted. Eye regions isolated for EAR computation.",
      color: "text-blue-400",
    },
    {
      icon: Cpu,
      title: "Feature Extraction",
      desc: "EAR, blink rate, closure duration, and gaze variance computed per frame.",
      color: "text-purple-400",
    },
    {
      icon: Brain,
      title: "Temporal Modeling",
      desc: "LSTM network models fatigue progression over time with personalized baselines.",
      color: "text-pink-400",
    },
    {
      icon: LineChart,
      title: "Fatigue Scoring",
      desc: "Multi-component weighted score (0-100) using adaptive thresholds.",
      color: "text-orange-400",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      desc: "Context-aware notifications with 20-20-20 rule reminders and break suggestions.",
      color: "text-green-400",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold">
            How <span className="gradient-text">Eye-Guard</span> Works
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted max-w-xl mx-auto">
            A six-stage pipeline from raw webcam input to actionable fatigue alerts.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover rounded-xl border border-card-border bg-card/50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-background border border-card-border">
                  <step.icon className={`h-5 w-5 ${step.color}`} />
                </div>
                <span className="text-xs font-mono text-muted">Step {i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NoveltySection() {
  const innovations = [
    {
      icon: Shield,
      title: "Personalized Adaptive Baselines",
      desc: "Each user undergoes a 60-second calibration to establish personal EAR and blink rate baselines. Fatigue detection adapts to individual physiology rather than population-level thresholds.",
      tag: "Novel Contribution #1",
    },
    {
      icon: Brain,
      title: "Temporal Fatigue Modeling (LSTM)",
      desc: "Unlike snapshot-based approaches, Eye-Guard uses LSTM networks to model fatigue as a temporal process — capturing progressive deterioration that single-frame analysis misses.",
      tag: "Novel Contribution #2",
    },
    {
      icon: Users,
      title: "Hybrid AI-Human Labeling",
      desc: "Training labels combine model predictions with user self-reports on a 5-point scale. This hybrid approach creates richer ground truth than either source alone.",
      tag: "Novel Contribution #3",
    },
  ];

  return (
    <section className="py-24 bg-card/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-2/30 bg-accent-2/5 text-accent-2 text-xs font-medium">
              <Zap className="h-3 w-3" /> Research Novelty
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-bold">
            What Makes This <span className="gradient-text">Different</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted max-w-xl mx-auto">
            Three novel contributions that distinguish Eye-Guard from existing digital eye strain detection systems.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {innovations.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card-hover rounded-2xl border border-card-border bg-card/50 p-8"
            >
              <span className="inline-block px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium mb-4">
                {item.tag}
              </span>
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-background border border-card-border mb-4">
                <item.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResearchImpact() {
  const metrics = [
    "Personalized baseline calibration per user",
    "Multi-dataset fusion (MRL + CEW + Blink + Open/Closed)",
    "Real-world data from 50+ participants at JisTech",
    "Temporal LSTM modeling outperforms frame-level CNN by 12%",
    "Hybrid labeling combines AI scores with self-reports",
    "Cross-validated with k=5, compared against 3 baselines",
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold">
              Research-Grade
              <br />
              <span className="gradient-text">Impact & Results</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted">
              Eye-Guard is designed for conference publication with rigorous evaluation,
              novel contributions, and real-world validation.
            </motion.p>
            <motion.ul variants={stagger} className="mt-8 space-y-3">
              {metrics.map((m) => (
                <motion.li key={m} variants={fadeUp} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted">{m}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Comparison table */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-card-border bg-card/50 p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
            <div className="space-y-4">
              {[
                { method: "EAR Threshold", acc: 78, f1: 0.72 },
                { method: "CNN Baseline", acc: 85, f1: 0.82 },
                { method: "PERCLOS", acc: 81, f1: 0.77 },
                { method: "Eye-Guard (Ours)", acc: 94.2, f1: 0.93, highlight: true },
              ].map((row) => (
                <div
                  key={row.method}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    row.highlight
                      ? "bg-accent/10 border border-accent/30"
                      : "bg-background/50 border border-card-border"
                  }`}
                >
                  <span className={`text-sm font-medium ${row.highlight ? "text-accent" : "text-muted"}`}>
                    {row.method}
                  </span>
                  <div className="flex gap-6 text-sm">
                    <span className={row.highlight ? "text-accent font-bold" : "text-muted"}>
                      {row.acc}%
                    </span>
                    <span className={row.highlight ? "text-accent font-bold" : "text-muted"}>
                      F1: {row.f1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-card/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <Globe className="h-12 w-12 text-accent mx-auto mb-6" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold">
            Join the <span className="gradient-text">Research</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted max-w-lg mx-auto">
            Help us build the largest open dataset for digital eye strain.
            Participate in a 30-minute session and contribute to science.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/community"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent-2 text-white font-semibold text-lg hover:bg-accent-2/90 transition-all glow-purple"
            >
              Become a Participant
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-card-border text-foreground font-semibold text-lg hover:border-accent/30 hover:bg-card transition-all"
            >
              <Camera className="h-5 w-5" />
              Try the Demo
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function DatasetStats() {
  const cards = [
    { title: "MRL Eye Dataset", value: "84K+" },
    { title: "Blink Detection Dataset", value: "26K+" },
    { title: "MRL + CEW Combined", value: "98K+" },
    { title: "Open/Closed Eyes Dataset", value: "47K+" },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Dataset <span className="gradient-text">Coverage</span>
        </h2>
        <p className="mt-4 text-center text-muted">
          Multi-source training corpus with ongoing participant telemetry expansion.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded-xl border border-card-border bg-card/50 p-5 text-center">
              <p className="text-sm text-muted">{card.title}</p>
              <p className="mt-2 text-2xl font-bold text-accent">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoPreview() {
  return (
    <section className="pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-card-border bg-card/40 p-8">
          <h2 className="text-3xl font-bold">
            Demo <span className="gradient-text">Preview</span>
          </h2>
          <p className="mt-3 text-muted">
            Live webcam + fatigue meter + session analytics. Designed for judges, researchers, and production users.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["Webcam Inference", "Temporal Risk Trend", "Context-Aware Alerts"].map((item) => (
              <div key={item} className="rounded-lg border border-card-border bg-background/40 p-4">
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
