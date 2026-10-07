"use client";

import React, { useState } from "react";
import { CandidateIntelligence as CandidateIntelligenceType } from "@/types/career";

interface CandidateIntelligenceProps {
  candidate: CandidateIntelligenceType;
}

export function CandidateIntelligence({ candidate }: CandidateIntelligenceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const skillEntries = Object.entries(candidate.skills);

  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Candidate Intelligence — Evidence Chain
            </h3>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold border border-slate-200 shadow-xs transition cursor-pointer"
            >
              {isOpen ? "Collapse Evidence ↑" : "Expand All Citations ↓"}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every skill is mapped to its exact source citation, evidence ladder tier, and detection confidence.
          </p>
        </div>

        <div className="text-xs text-slate-600 font-mono flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span>
            Signals: <strong className="text-blue-700 font-bold">{candidate.total_evidence_signals}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span>
            Repos: <strong className="text-blue-700 font-bold">{candidate.github_repositories_analyzed}</strong>
          </span>
        </div>
      </div>

      {skillEntries.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-50 rounded-xl border border-slate-200">
          No demonstrable technical skills detected from the provided inputs.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillEntries.map(([k, sk]) => {
            const hasGitHub = sk.evidence_items.some((it) => it.source.includes("github"));

            return (
              <div
                key={k}
                className="border border-slate-200/90 bg-white rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-300 transition shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-bold text-slate-900 tracking-tight">
                      {sk.skill_name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70 font-mono font-semibold">
                      {Math.round(sk.aggregated_confidence * 100)}% Conf
                    </span>
                  </div>

                  {/* Dual Provenance Tag & Evidence Strength */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${
                        hasGitHub
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {sk.evidence_strength ? `${sk.evidence_strength}: ` : ""}{hasGitHub ? "Project Verified" : "Self-Reported"}
                    </span>
                    {sk.current_level && (
                      <span className="text-[9px] px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {sk.current_level}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 mb-2 flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-[11px]">Evidence Tier:</span>{" "}
                    <strong className="text-slate-900 uppercase font-mono text-[10px]">
                      {sk.highest_evidence_type}
                    </strong>
                  </div>

                  {sk.verified_projects && sk.verified_projects.length > 0 && (
                    <div className="text-[11px] text-slate-700 mb-2.5 bg-emerald-50/40 border border-emerald-200/50 p-2 rounded-lg">
                      <span className="font-semibold text-emerald-950">Verified In:</span> {sk.verified_projects.join(", ")}
                    </div>
                  )}

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {sk.evidence_summary}
                  </p>
                </div>

                {isOpen && (
                  <div className="space-y-2 border-t border-slate-200 pt-2.5 max-h-40 overflow-y-auto">
                    {sk.evidence_items.map((it, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs"
                      >
                        <div className="font-semibold text-slate-900 text-[10px] mb-0.5 flex items-center justify-between">
                          <span>{it.source_title}</span>
                          <span className="font-mono text-blue-700">({it.evidence_type})</span>
                        </div>
                        <div className="text-slate-600 truncate leading-snug">{it.detail}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
