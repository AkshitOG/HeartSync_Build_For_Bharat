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
    <div className="bg-white border border-slate-300 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>Skill Gap Breakdown</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono border border-slate-300">
              {gaps.length} skills evaluated
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Level comparison and empirical deficit analysis
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 border border-slate-200 rounded p-0.5 bg-slate-50">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition cursor-pointer ${
              filter === "all" ? "bg-white text-slate-900 shadow-xs border border-slate-300" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition cursor-pointer ${
              filter === "critical" ? "bg-white text-rose-700 shadow-xs border border-slate-300" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Gaps Only
          </button>
          <button
            onClick={() => setFilter("strengths")}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition cursor-pointer ${
              filter === "strengths" ? "bg-white text-emerald-700 shadow-xs border border-slate-300" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Matches
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredGaps.map((g, idx) => {
          const isCritical = g.evidence_deficit >= 0.60;
          const isStrength = g.evidence_deficit < 0.35;

          return (
            <div
              key={idx}
              className="border border-slate-200 rounded p-3.5 bg-white hover:border-slate-300 transition"
            >
              {/* Header row: Skill title, category, status, priority */}
              <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {g.skill_name}
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded font-mono text-slate-600 bg-slate-100 border border-slate-200 uppercase">
                    {g.importance}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                      isCritical
                        ? "bg-rose-100 text-rose-800"
                        : isStrength
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isCritical ? "Critical Gap" : isStrength ? "Strong Match" : "Partial Gap"}
                  </span>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div className="text-xs font-mono text-slate-600">
                    Score: <strong className="text-slate-900">{g.raw_priority_score}</strong>
                  </div>
                  {onOpenWorkSample && isCritical && (
                    <button
                      onClick={() => onOpenWorkSample(g.skill_name)}
                      className="text-xs font-medium text-blue-700 hover:underline cursor-pointer"
                    >
                      Work Sample Challenge →
                    </button>
                  )}
                </div>
              </div>

              {/* Clean table comparison: Current vs Required vs Deficit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 border border-slate-200 rounded p-2.5 mb-2.5 font-mono">
                <div>
                  <span className="text-slate-500">Current:</span>{" "}
                  <strong className="text-slate-900 font-semibold ml-1">
                    {g.current_level || (g.current_evidence_type ? "Intermediate" : "Beginner")}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Required:</span>{" "}
                  <strong className="text-blue-900 font-semibold ml-1">
                    {g.required_level || "Advanced"}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Deficit:</span>{" "}
                  <strong className={`ml-1 ${isCritical ? "text-rose-700" : isStrength ? "text-emerald-700" : "text-amber-700"}`}>
                    {Math.round(g.evidence_deficit * 100)}% ({g.gap_level || "Moderate"})
                  </strong>
                </div>
              </div>

              {/* Contextual evaluation notes */}
              {g.reason && (
                <div className="text-xs text-slate-700 mb-2 leading-relaxed">
                  <span className="font-semibold text-slate-900">Analysis:</span> {g.reason}
                </div>
              )}

              {g.what_is_missing && (
                <div className="text-xs text-slate-800 mb-2 leading-relaxed bg-slate-100 p-2 rounded border border-slate-200">
                  <span className="font-semibold text-slate-900">Missing Evidence:</span> {g.what_is_missing}
                </div>
              )}

              <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <span className="text-slate-600 font-medium">Detected Evidence:</span> {g.explanation_current_evidence}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
