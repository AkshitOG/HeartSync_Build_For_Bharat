"use client";

import React, { useState } from "react";
import { TargetRoleDNA } from "@/types/career";

interface TargetRoleDNAViewProps {
  roleDna: TargetRoleDNA;
}

export function TargetRoleDNAView({ roleDna }: TargetRoleDNAViewProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const skillsList = Object.entries(roleDna.skills);
  const benchmarks = roleDna.market_benchmarks;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700 mb-2">
            Target Role DNA &amp; Market Benchmarks
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {roleDna.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {roleDna.description}
          </p>
        </div>

        {/* Real Market Intelligence Card */}
        {benchmarks && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-[280px] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Job-Market Intelligence ({benchmarks.sample_size_jobs?.toLocaleString() || "15,841"} Jobs)
            </span>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <span className="text-[10px] text-slate-500 block">Median Salary:</span>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  ₹{benchmarks.median_salary_lakhs} Lakhs
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Senior Comp:</span>
                <span className="text-xs font-bold text-blue-700 font-mono">
                  ₹{benchmarks.senior_salary_lakhs} Lakhs
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Typical Exp:</span>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {benchmarks.min_experience_years}+ yrs
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Market Demand:</span>
                <span className="text-[11px] font-semibold text-teal-700 truncate block">
                  {benchmarks.market_demand || "High"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Core Competencies Badges */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Core Competency Domains
        </span>
        <div className="flex flex-wrap gap-2">
          {roleDna.core_competencies.map((comp, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      {/* Skills Matrix */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
          Required Competencies &amp; Expected Evidence Standards
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skillsList.map(([key, req]) => {
            const isSelected = selectedSkill === key;
            return (
              <div
                key={key}
                onClick={() => setSelectedSkill(isSelected ? null : key)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? "bg-blue-50/50 border-blue-400 shadow-xs"
                    : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {req.skill_name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold uppercase border border-slate-200">
                      {req.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                    {req.importance.toUpperCase()} ({(req.weight * 100).toFixed(0)}%)
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                  {req.expected_evidence.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200/80">
                  <span>
                    Min tier: <strong className="text-slate-700">{req.expected_evidence.minimum_evidence_type}</strong>
                  </span>
                  <span className="text-blue-600 font-medium">Click for details →</span>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-blue-200 space-y-2 text-xs">
                    <div>
                      <strong className="text-slate-800 text-[11px] block">Expected Evidence Artifacts:</strong>
                      <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5 mt-1">
                        {req.expected_evidence.sample_artifacts.map((art, aIdx) => (
                          <li key={aIdx}>{art}</li>
                        ))}
                      </ul>
                    </div>
                    {req.synergies && req.synergies.length > 0 && (
                      <div className="text-[10px] text-blue-700 pt-1 font-medium">
                        <strong>Synergies with:</strong> {req.synergies.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
