"use client";

import React from "react";

export function ResponsibleAIView() {
  const principles = [
    {
      title: "Decision Support, Not Automated Rejection",
      desc: "CareerGPS is designed for developmental navigation and human-in-the-loop decision making. It never performs binary auto-rejects or fabricates candidate hiring probabilities.",
      icon: "⚖️"
    },
    {
      title: "Strict Personality Non-Filtering Guardrail",
      desc: "Work-style and Big Five insights (Dataset 4) are strictly exploratory guidance for personal onboarding and team collaboration. They are legally and ethically prohibited from being used for candidate screening or evaluation.",
      icon: "🛡️"
    },
    {
      title: "Verifiable Evidence Ladder",
      desc: "Signals are explicitly ranked across the Evidence Ladder (Claim → Coursework → Project Usage → Applied Implementation → Deployed). Self-reported resume mentions are never confused with verified code.",
      icon: "🪜"
    },
    {
      title: "Uncertainty Fallback to Work Samples",
      desc: "When candidate evidence is ambiguous, CareerGPS does not guess or penalize candidates. It offers a standardized 45-minute work-sample challenge for candidates to prove capability directly.",
      icon: "⚡"
    }
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700 mb-3 w-fit">
        <span>✓</span> Responsible AI &amp; Ethical Guardrails Protocol
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1.5">
        Responsible AI Architecture
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-3xl leading-relaxed">
        CareerGPS adheres to strict fairness and algorithmic accountability principles to prevent automated bias and hallucinated talent scoring.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {principles.map((p, idx) => (
          <div
            key={idx}
            className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 sm:p-5 flex gap-3.5 items-start shadow-xs hover:border-slate-300 transition"
          >
            <span className="text-xl shrink-0 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              {p.icon}
            </span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{p.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
