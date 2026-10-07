"use client";

import React, { useState } from "react";
import { NextBestAction as NextBestActionType } from "@/types/career";
import { submitActionFeedback } from "@/lib/api";

interface NextBestActionProps {
  action: NextBestActionType;
  targetRole: string;
}

export function NextBestAction({ action, targetRole }: NextBestActionProps) {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackUseful, setFeedbackUseful] = useState<boolean | null>(null);

  const handleFeedback = async (useful: boolean) => {
    try {
      await submitActionFeedback(action.title, targetRole, useful);
      setFeedbackUseful(useful);
      setFeedbackSent(true);
    } catch (err) {
      console.error("Feedback error", err);
    }
  };

  return (
    <section className="bg-white border border-slate-300 rounded-lg p-5">
      {/* Top Header Status */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-blue-700 text-white font-mono text-xs font-semibold uppercase">
            Recommended Action
          </span>
          <span className="text-xs text-slate-700 font-medium">
            Targets: <strong className="font-semibold text-slate-900">{action.primary_gap_targeted}</strong>
          </span>
        </div>
        <div className="text-xs font-mono text-slate-600">
          Leverage Score: <strong className="text-slate-900">{action.leverage_score}</strong>
        </div>
      </div>

      {/* Hero Title & Headline */}
      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
        {action.title}
      </h3>
      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        {action.headline}
      </p>

      {/* Grid: What to Build vs Verifiable Evidence Artifacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 border border-slate-200 rounded p-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Build Specifications
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {action.what_to_build.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-blue-600 mt-0.5 font-bold">›</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-50/40 border border-emerald-200/70 rounded-xl p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3.5 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Expected Verifiable Evidence Artifacts
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {action.expected_evidence_artifacts.map((art, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                <span className="leading-relaxed">{art}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Explainability & Counterfactual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="bg-amber-50/40 border border-amber-200/70 rounded-xl p-4.5">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Why This Action?
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {action.why_this_action}
          </p>
        </div>

        <div className="bg-purple-50/40 border border-purple-200/70 rounded-xl p-4.5">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Why Not Something Else? (Counterfactual Rationale)
          </span>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {action.counterfactual_comparison}
          </p>
        </div>
      </div>

      {/* Simulated Readiness Delta & Synergies Banner */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-3 text-xs text-slate-600 mb-5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Simulated Readiness Impact:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100/70 text-blue-800 font-semibold font-mono text-xs">
            {action.readiness_impact_preview}
          </span>
        </div>
        {action.secondary_gaps_closed.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium">Synergy closures:</span>
            {action.secondary_gaps_closed.map((gap, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium"
              >
                + Closes {gap}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Inline Feedback Loop */}
      <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs">
          <span className="text-slate-800 font-semibold">Was this recommendation high-leverage and actionable?</span>
          <span className="text-slate-500 text-[11px] block mt-0.5">
            Calibrates CareerGPS decision and counterfactual engines
          </span>
        </div>
        {!feedbackSent ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback(true)}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-xs font-medium text-slate-700 transition shadow-xs cursor-pointer"
            >
              👍 Yes, makes sense
            </button>
            <button
              onClick={() => handleFeedback(false)}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-200 text-xs font-medium text-slate-700 transition shadow-xs cursor-pointer"
            >
              👎 No, missed priority
            </button>
          </div>
        ) : (
          <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
            <span>✓ Feedback captured ({feedbackUseful ? "Positive" : "Critical"}). Thank you.</span>
          </div>
        )}
      </div>
    </section>
  );
}
