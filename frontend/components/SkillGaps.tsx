"use client";

import React, { useState } from "react";
import { SkillGap } from "@/types/career";

interface SkillGapsProps {
  gaps: SkillGap[];
  onOpenWorkSample?: (skillName: string) => void;
}

export function SkillGaps({ gaps, onOpenWorkSample }: SkillGapsProps) {
  const [filter, setFilter] = useState<"all" | "critical" | "strengths">("all");

  const filteredGaps = gaps.filter((g) => {
    if (filter === "critical") return g.evidence_deficit >= 0.60;
    if (filter === "strengths") return g.evidence_deficit < 0.35;
    return true;
  });

  const levelBars = (lvl?: string) => {
    const l = (lvl || "Beginner").toLowerCase();
    if (l === "advanced") return { filled: 3, total: 3, color: "bg-blue-600" };
    if (l === "intermediate") return { filled: 2, total: 3, color: "bg-blue-500" };
    return { filled: 1, total: 3, color: "bg-slate-400" };
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Ranked Skill Gap Analysis</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono border border-slate-200 font-semibold">
              {gaps.length} evaluated
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-tier evidence calibration: <code className="text-blue-700 font-mono text-[11px] bg-blue-50 px-1 py-0.5 rounded font-medium">Role Importance × Evidence Deficit × Project Actionability</code>
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              filter === "all" ? "bg-white text-blue-700 shadow-xs border border-slate-200/60" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Gaps
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              filter === "critical" ? "bg-white text-rose-700 shadow-xs border border-slate-200/60" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Critical Only
          </button>
          <button
            onClick={() => setFilter("strengths")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              filter === "strengths" ? "bg-white text-emerald-700 shadow-xs border border-slate-200/60" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Verified Strengths
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        {filteredGaps.map((g, idx) => {
          const isTop = idx === 0 && filter === "all";
          const isCritical = g.evidence_deficit >= 0.60;
          const isStrength = g.evidence_deficit < 0.35;
          const currentBars = levelBars(g.current_level);
          const reqBars = levelBars(g.required_level);

          return (
            <div
              key={idx}
              className={`border rounded-xl p-4 sm:p-5 transition ${
                isTop
                  ? "border-blue-300 bg-blue-50/30 shadow-xs ring-1 ring-blue-500/10"
                  : isCritical
                  ? "border-rose-200 bg-rose-50/20"
                  : isStrength
                  ? "border-emerald-200 bg-emerald-50/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* Header row: Skill title, category, status pill, priority */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      isTop ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    {g.skill_name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                    {g.importance}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      isCritical
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : isStrength
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {isCritical ? "Critical Deficit" : isStrength ? "Demonstrated" : "Partial Gap"}
                  </span>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div className="bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                    <span className="text-[11px] text-slate-500 font-medium">Priority:</span>
                    <span className="text-xs font-bold text-blue-700 font-mono ml-1.5">
                      {g.raw_priority_score}
                    </span>
                  </div>
                  {onOpenWorkSample && isCritical && (
                    <button
                      onClick={() => onOpenWorkSample(g.skill_name)}
                      className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg border border-blue-200 transition cursor-pointer"
                      title="Generate a 45-min work-sample challenge to prove this skill directly"
                    >
                      Prove via Work Sample ⚡
                    </button>
                  )}
                </div>
              </div>

              {/* Level comparison cards: Current vs Required vs Gap */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50/70 border border-slate-200/70 rounded-xl p-3 mb-3">
                <div className="flex flex-col justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Current Practical Level</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-slate-900 text-xs">
                      {g.current_level || (g.current_evidence_type ? "Intermediate" : "Beginner")}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`w-3.5 h-1.5 rounded-xs ${
                            step <= currentBars.filled ? currentBars.color : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Required Role Level</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-indigo-700 text-xs">
                      {g.required_level || "Advanced"}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`w-3.5 h-1.5 rounded-xs ${
                            step <= reqBars.filled ? "bg-indigo-600" : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Evidence Deficit</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`font-bold text-xs ${
                      g.gap_level === "None"
                        ? "text-emerald-700"
                        : g.gap_level === "Moderate"
                        ? "text-amber-700"
                        : "text-rose-700"
                    }`}>
                      {g.gap_level ? `${g.gap_level} Gap` : `${Math.round(g.evidence_deficit * 100)}% Deficit`}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-500">
                      ({Math.round(g.evidence_deficit * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Contextual evaluation notes */}
              {g.reason && (
                <div className="text-xs text-slate-700 mb-2 leading-relaxed bg-white border border-slate-200/80 p-2.5 rounded-lg shadow-2xs">
                  <strong className="text-slate-900 font-semibold">Evidence Evaluation:</strong> {g.reason}
                </div>
              )}

              {g.what_is_missing && (
                <div className="text-xs text-blue-950 mb-2.5 leading-relaxed bg-blue-50/50 border border-blue-200/60 p-2.5 rounded-lg">
                  <strong className="text-blue-900 font-semibold">What is Still Missing:</strong> {g.what_is_missing}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100 flex-wrap gap-2">
                <div className="truncate max-w-xl">
                  <strong className="text-slate-700">Detected Signals:</strong>{" "}
                  {g.explanation_current_evidence}
                </div>
                <div className="text-[11px] text-slate-500">
                  <strong className="text-slate-600">Expected:</strong> {g.missing_evidence_criteria.split(".")[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
