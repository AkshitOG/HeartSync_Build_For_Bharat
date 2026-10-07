"use client";

import React from "react";
import { WorkStyleProfile } from "@/types/career";

interface WorkStyleProfileViewProps {
  workStyle: WorkStyleProfile;
}

export function WorkStyleProfileView({ workStyle }: WorkStyleProfileViewProps) {
  const traits = [
    { name: "Conscientiousness", value: workStyle.conscientiousness, icon: "🎯" },
    { name: "Openness to Experience", value: workStyle.openness_to_experience, icon: "💡" },
    { name: "Extraversion", value: workStyle.extraversion, icon: "🤝" },
    { name: "Agreeableness", value: workStyle.agreeableness, icon: "🌱" },
    { name: "Emotional Stability", value: workStyle.neuroticism, icon: "🛡️" }
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-[11px] font-semibold text-purple-700 mb-2">
            Work-Style &amp; Team Collaboration Guidance • Dataset 4 Model
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Work-Style &amp; Learning Orientation
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Provides developmental self-awareness and team collaboration strategies grounded in the Big Five personality dimensions.
          </p>
        </div>

        {/* Emphatic Non-Filtering Guardrail Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 max-w-xs shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 text-xs font-bold mb-1">
            <svg className="w-4 h-4 shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Ethical AI Non-Filtering Rule
          </div>
          <p className="text-[10px] text-amber-800 leading-tight">
            Strictly advisory for team fit &amp; onboarding. NEVER used for candidate rejection or filtering.
          </p>
        </div>
      </div>

      {/* Big Five Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {traits.map((t, idx) => (
          <div
            key={idx}
            className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">{t.icon}</span>
              <span className="text-[11px] font-bold text-slate-800">{t.name}</span>
            </div>
            <span className="text-xs font-semibold text-purple-700 font-mono">
              {t.value}
            </span>
          </div>
        ))}
      </div>

      {/* Collaboration & Learning Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-4 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
            <span>🤝</span> Optimal Team Collaboration Modes
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {workStyle.collaboration_insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">›</span>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-purple-50/40 border border-purple-200 rounded-xl p-4 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-3 flex items-center gap-2">
            <span>📚</span> Recommended Learning Accelerators
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {workStyle.learning_preferences.map((pref, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">›</span>
                <span className="leading-relaxed">{pref}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
        <strong>Responsible AI Notice:</strong> {workStyle.ethical_guardrail_notice}
      </div>
    </div>
  );
}
