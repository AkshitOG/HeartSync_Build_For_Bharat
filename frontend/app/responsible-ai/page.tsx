"use client";

import React from "react";
import Link from "next/link";
import { ResponsibleAIView } from "@/components/ResponsibleAIView";

export default function ResponsibleAIPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-xs shadow-sm shadow-blue-500/20 group-hover:scale-105 transition">
            GPS
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            CareerGPS
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition shadow-xs"
        >
          ← Back to Platform
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider inline-block mb-3">
            Governance &amp; Ethics
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Responsible AI &amp; Transparency Principles
          </h1>
          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
            CareerGPS operates under strict ethical guardrails designed to prevent algorithmic bias, eliminate automated disqualification, and ensure complete explainability across every recommendation.
          </p>
        </div>

        <ResponsibleAIView />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
        CareerGPS • Build For Bharat 2.0 • Responsible AI Architecture
      </footer>
    </div>
  );
}
