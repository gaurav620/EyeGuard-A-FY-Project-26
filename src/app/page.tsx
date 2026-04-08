"use client";

import Link from "next/link";
import { Eye, Shield, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

const diagnostics = [
  { label: "EAR (LEFT)", value: "0.312", sub: "Target: 0.220" },
  { label: "EAR (RIGHT)", value: "0.308", sub: "Target: 0.220" },
  { label: "BLINK RATE", value: "14.2/m", sub: "Target: 12-18/m" },
  { label: "CLINICAL FATIGUE", value: "23%", sub: "Target: < 45 %" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-slate-100 text-slate-900">
        <section className="bg-gradient-to-r from-slate-200 to-cyan-100 py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-4 py-1 text-xs font-semibold tracking-wide text-emerald-700">
              <Shield className="h-3.5 w-3.5" /> NON-INVASIVE TELEMETRY · JISTECH 2026
            </p>
            <h1 className="mt-6 text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
              Clinical-Grade <span className="text-teal-600">Ocular</span>
              <br />
              <span className="text-blue-600">Health</span> Monitoring
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
              EyeGuard utilizes secure computer vision and predictive analytics
              to detect and prevent Computer Vision Syndrome. No special
              hardware required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
                Open Free Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/sign-in" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                Portal Login
              </Link>
            </div>

            <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><Eye className="h-4 w-4" /> Diagnostic Live Feed</p>
                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">SYSTEM ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {diagnostics.map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-100 p-3">
                    <p className="text-[10px] font-semibold tracking-wide text-slate-500">{item.label}</p>
                    <p className="mt-1 text-3xl font-bold text-blue-600">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                Ocular baseline calibrated. Real-time telemetry connection established and secure.
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#06173a] py-20 text-center text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="mb-4 text-teal-300">◐</p>
            <h2 className="text-4xl font-bold">Collaborating for Better Vision</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              EyeGuard is actively enrolling participants for the 2026 JisTech Longitudinal Study.
              Contribute a secure 30-minute diagnostic session to advance ophthalmic AI.
            </p>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-sm">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-semibold">Research Publication Pending</h3>
                  <p className="mt-1 text-sm text-slate-300">Read our methodology on EAR evaluation heuristics and deep learning fatigue thresholds.</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/sign-up" className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-500 transition-colors">Enroll in Study</Link>
                  <Link href="/docs" className="rounded-lg border border-slate-400 px-5 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 transition-colors">View Protocols</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
