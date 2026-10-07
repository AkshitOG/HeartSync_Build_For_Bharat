"use client";

import React from "react";
import { RoleReadiness as RoleReadinessType } from "@/types/career";

interface ReadinessProps {
  readiness: RoleReadinessType;
}

export function Readiness({ readiness }: ReadinessProps) {
  const coverage = readiness.evidence_coverage_pct ?? 0;

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-5">
      <div>
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Role Evidence Coverage
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Empirical alignment against target standard</p>
          </div>
          <span className="text-xs font-mono text-slate-700 px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
            {readiness.role_title}
          </span>
        </div>

        {/* Evidence Coverage Gauge */}
        <div className="mb-4 p-3 rounded bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
            <span className="text-slate-600 font-medium">Verified Coverage</span>
            <span className="font-bold text-slate-900">{coverage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-xs h-2 mb-2 overflow-hidden">
            <div
              className={`h-2 transition-all duration-500 ${
                coverage >= 70
                  ? "bg-emerald-600"
                  : coverage >= 40
                  ? "bg-blue-600"
                  : "bg-amber-600"
              }`}
              style={{ width: `${Math.min(100, Math.max(5, coverage))}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500">
            Evidence measurement only (not an automated hiring evaluation)
          </div>
        </div>

        <p className="text-xs text-slate-700 mb-4 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
          {readiness.summary_verdict}
        </p>

        <div className="space-y-4">
          {/* Strong Evidence Tier */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Strong Evidence (Applied / Deployed)
              </span>
              <span className="font-mono text-slate-500 text-xs font-semibold">
                {readiness.strong_evidence_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[28px]">
              {readiness.strong_evidence_skills.length > 0 ? (
                readiness.strong_evidence_skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">None currently detected</span>
              )}
            </div>
          </div>

          {/* Needs Stronger Evidence Tier */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-amber-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Needs Stronger Evidence (Claim / Coursework)
              </span>
              <span className="font-mono text-slate-500 text-xs font-semibold">
                {readiness.needs_stronger_evidence_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[28px]">
              {readiness.needs_stronger_evidence_skills.length > 0 ? (
                readiness.needs_stronger_evidence_skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">None currently detected</span>
              )}
            </div>
          </div>

          {/* Major Gaps Tier */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-rose-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Major Evidence Gaps (Zero Signals)
              </span>
              <span className="font-mono text-slate-500 text-xs font-semibold">
                {readiness.major_gap_skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[28px]">
              {readiness.major_gap_skills.length > 0 ? (
                readiness.major_gap_skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">None currently detected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
        * CareerGPS measures verifiable evidence artifacts against Target Role DNA. It never calculates automated hiring odds or binary qualification cutoffs.
      </div>
    </div>
  );
}
