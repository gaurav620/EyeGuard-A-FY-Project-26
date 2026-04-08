"use client";

import { useMemo } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { LiveEyeCheck } from "@/components/dashboard/live-eye-check";
import { Sparkles, Zap } from "lucide-react";

export default function DashboardPage() {
  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="section-label">Monitoring Center</p>
              <h1 className="mt-2 text-4xl font-bold">
                Live Monitoring <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="mt-2 text-sm text-muted">{currentDate}</p>
              <p className="mt-2 text-muted">
                Real-time telemetry, personalized fatigue scoring, and adaptive alerting.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="#live-eye-check"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent/90 transition-colors"
              >
                <Zap className="h-4 w-4" />
                Start Session
              </a>
              <a
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-card transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Help Guide
              </a>
            </div>
          </div>
          <div className="mt-8">
            <LiveEyeCheck />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

