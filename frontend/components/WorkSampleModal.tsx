"use client";

import React from "react";
import { WorkSampleRecommendation } from "@/types/career";

interface WorkSampleModalProps {
  sample: WorkSampleRecommendation;
  onClose: () => void;
}

export function WorkSampleModal({ sample, onClose }: WorkSampleModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
        >
          ✕
        </button>

        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700 mb-3">
          Uncertainty Fallback • 45-Minute Work Sample Challenge
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          {sample.sample_title}
        </h3>

        <div className="flex items-center gap-2.5 text-xs mb-4 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
            ⏱️ {sample.estimated_duration}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            Target Skill: <strong>{sample.skill_name}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
          <strong className="text-slate-800">Why recommended:</strong> {sample.why_recommended}
        </p>

        <div className="space-y-4 text-xs text-slate-700 mb-6">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Challenge Specification:
            </h4>
            <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
              {sample.prompt_summary}
            </p>
          </div>

          {sample.tasks && sample.tasks.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Specific Tasks to Complete:
              </h4>
              <ul className="space-y-1.5 list-disc list-inside bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700">
                {sample.tasks.map((task, idx) => (
                  <li key={idx} className="leading-relaxed">{task}</li>
                ))}
              </ul>
            </div>
          )}

          {sample.deliverables && sample.deliverables.length > 0 && (
            <div>
              <h4 className="font-bold text-emerald-800 uppercase tracking-wider text-[11px] mb-2">
                Expected Artifact Deliverables:
              </h4>
              <ul className="space-y-1.5 list-disc list-inside bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200 text-emerald-800">
                {sample.deliverables.map((d, idx) => (
                  <li key={idx} className="leading-relaxed">{d}</li>
                ))}
              </ul>
            </div>
          )}

          {sample.rubric && (
            <div>
              <h4 className="font-bold text-blue-700 uppercase tracking-wider text-[11px] mb-2">
                Evaluation Rubric:
              </h4>
              <div className="bg-blue-50/40 p-3.5 rounded-xl border border-blue-200 space-y-1.5">
                {Object.entries(sample.rubric).map(([k, v]) => (
                  <div key={k} className="text-[11px]">
                    <strong className="text-blue-900 capitalize">{k}:</strong> {v}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <span className="text-[11px] text-slate-500">
            Work-sample submissions directly upgrade candidate skill status to <strong>Applied Implementation</strong>.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
          >
            Close Challenge Brief
          </button>
        </div>
      </div>
    </div>
  );
}
