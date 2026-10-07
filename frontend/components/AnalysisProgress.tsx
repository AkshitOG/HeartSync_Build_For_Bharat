"use client";

import React, { useEffect, useState } from "react";

interface AnalysisProgressProps {
  targetRoleTitle: string;
}

export function AnalysisProgress({ targetRoleTitle }: AnalysisProgressProps) {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Reading candidate evidence & ladder tiering", detail: "Extracting skills, projects, and original repositories" },
    { title: "Compiling Candidate Intelligence", detail: "Distinguishing claims from applied implementations" },
    { title: `Comparing against ${targetRoleTitle} DNA`, detail: "Evaluating competency weights and expected artifacts" },
    { title: "Deterministic Gap & Action Leverage Calculation", detail: "Identifying highest-leverage gap closure" },
    { title: "Synthesizing Counterfactual & Expected Evidence", detail: "Generating concrete project specifications" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="border border-slate-200 rounded-2xl bg-white p-8 sm:p-10 text-center max-w-xl mx-auto my-10 shadow-sm">
      <div className="inline-block relative mb-5">
        <div className="w-10 h-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto"></div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1.5 tracking-tight">
        Evaluating Candidate Intelligence
      </h3>
      <p className="text-xs text-slate-600 mb-6 max-w-md mx-auto">
        CareerGPS is executing deterministic gap reasoning from your real submitted evidence.
      </p>

      <div className="space-y-2.5 text-left max-w-md mx-auto">
        {steps.map((s, idx) => {
          const isDone = idx < step;
          const isCurrent = idx === step;
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                isCurrent
                  ? "bg-blue-50 border-blue-200 text-blue-950 shadow-xs"
                  : isDone
                  ? "bg-slate-50 border-slate-200 text-slate-700"
                  : "border-transparent text-slate-400"
              }`}
            >
              <span className="mt-0.5 text-xs font-mono font-bold">
                {isDone ? (
                  <span className="text-emerald-600">✓</span>
                ) : isCurrent ? (
                  <span className="text-blue-600 animate-pulse">◉</span>
                ) : (
                  <span className="text-slate-300">○</span>
                )}
              </span>
              <div>
                <p className="text-xs font-bold leading-tight">{s.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
