"use client";

import React from "react";
import { RoleReadiness as RoleReadinessType } from "@/types/career";

interface ReadinessProps {
  readiness: RoleReadinessType;
}

export function Readiness({ readiness }: ReadinessProps) {
  const coverage = readiness.evidence_coverage_pct ?? 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Target Role Evidence Alignment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Coverage of empirical artifacts against standard</p>
          </div>
          <span className="text-xs font-mono text-slate-700 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 font-semibold">
            {readiness.role_title}
          </span>
        </div>

        {/* Evidence Coverage Gauge with Emphatic Non-Hiring-Probability Badge */}
        <div className="mb-5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">
              Empirical Coverage Metric
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {coverage}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 rounded-full h-2 mb-2.5 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                coverage >= 70
                  ? "bg-emerald-600"
                  : coverage >= 40
                  ? "bg-blue-600"
                  : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(5, coverage))}%` }}
            ></div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200 shadow-2xs">
            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Evidence Benchmark • Independent of Hiring Probability
          </div>
        </div>

        <p className="text-xs text-slate-700 mb-6 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
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
