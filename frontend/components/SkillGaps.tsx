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

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Ranked Skill Gaps</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono border border-slate-200">
              {gaps.length} evaluated
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Formula: <code className="text-blue-700 font-mono text-[11px] bg-blue-50 px-1 py-0.5 rounded">Role Importance × Evidence Deficit × Actionability</code>
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
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
            Strengths
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredGaps.map((g, idx) => {
          const isTop = idx === 0 && filter === "all";
          const isCritical = g.evidence_deficit >= 0.60;
          const isStrength = g.evidence_deficit < 0.35;

          return (
            <div
              key={idx}
              className={`border rounded-xl p-4 sm:p-5 transition ${
                isTop
                  ? "border-blue-300 bg-blue-50/40 shadow-xs"
                  : isCritical
                  ? "border-rose-200 bg-rose-50/30"
                  : isStrength
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "border-slate-200/80 bg-slate-50/50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isTop ? "text-blue-700" : "text-slate-500"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-900 tracking-tight">
                    {g.skill_name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {g.importance}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                      isCritical
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : isStrength
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {isCritical ? "Critical Gap" : isStrength ? "Strength" : "Developing"}
                  </span>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500">Priority Score:</span>
                    <span className="text-xs font-bold text-blue-700 font-mono ml-1.5">
                      {g.raw_priority_score}
                    </span>
                  </div>
                  {onOpenWorkSample && isCritical && (
                    <button
                      onClick={() => onOpenWorkSample(g.skill_name)}
                      className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer"
                      title="Generate a 45-min work-sample challenge to prove this skill directly"
                    >
                      Prove via Work Sample ⚡
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs bg-white/70 border border-slate-200/60 rounded-lg p-2.5 mb-2.5">
                <div>
                  <span className="text-slate-500 font-medium">Current Level:</span>{" "}
                  <span className="font-bold text-slate-800 ml-1">
                    {g.current_level || (g.current_evidence_type ? "Intermediate" : "Beginner")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Required Level:</span>{" "}
                  <span className="font-bold text-indigo-700 ml-1">
                    {g.required_level || "Advanced"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Level Gap:</span>{" "}
                  <span className={`font-bold ml-1 ${
                    g.gap_level === "None"
                      ? "text-emerald-700"
                      : g.gap_level === "Moderate"
                      ? "text-amber-700"
                      : "text-rose-700"
                  }`}>
                    {g.gap_level || (g.evidence_deficit >= 0.6 ? "High" : g.evidence_deficit > 0.2 ? "Moderate" : "None")}
                  </span>
                </div>
              </div>

              {g.reason && (
                <div className="text-xs text-slate-700 mb-2 leading-relaxed bg-slate-100/50 p-2 rounded-lg border border-slate-200/40">
                  <strong className="text-slate-900 font-semibold">Evidence Evaluation:</strong> {g.reason}
                </div>
              )}

              {g.what_is_missing && (
                <div className="text-xs text-blue-900 mb-2 leading-relaxed bg-blue-50/60 p-2 rounded-lg border border-blue-200/60">
                  <strong className="text-blue-950 font-semibold">What is Still Missing:</strong> {g.what_is_missing}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 mb-2.5">
                <div>
                  <strong className="text-slate-700">Detected Evidence:</strong>{" "}
                  {g.explanation_current_evidence}
                </div>
                <div>
                  <strong className="text-slate-700">Evidence Deficit:</strong>{" "}
                  <span className="font-mono text-blue-700 font-bold">
                    {Math.round(g.evidence_deficit * 100)}%
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 leading-relaxed">
                <strong className="text-slate-600">Target Standard:</strong>{" "}
                {g.missing_evidence_criteria}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
