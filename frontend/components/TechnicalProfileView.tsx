"use client";

import React, { useState } from "react";
import { TechnicalCapabilityProfile } from "@/types/career";

interface TechnicalProfileViewProps {
  profile: TechnicalCapabilityProfile;
}

export function TechnicalProfileView({ profile }: TechnicalProfileViewProps) {
  const [showLogOddsDetails, setShowLogOddsDetails] = useState(false);

  const dimensions = [
    { name: "Coding Skills", key: "coding_skills", score: profile.coding_skills, max: 5.0, desc: "Modular architecture, clean OOP, async concurrency, and algorithmic fundamentals" },
    { name: "AI & Machine Learning", key: "ai_and_ml_skills", score: profile.ai_and_ml_skills, max: 5.0, desc: "Statistical learning, model tuning, cross-validation, and deep learning pipelines" },
    { name: "Mathematics & Statistics", key: "maths-stats_skills", score: profile.maths_stats_skills, max: 5.0, desc: "Hypothesis testing, probability distributions, variance analysis, and A/B experiments" },
    { name: "Big Data & Persistence", key: "big_data_skills", score: profile.big_data_skills, max: 5.0, desc: "Relational modeling, indexing, transactions, and distributed data processing" },
    { name: "Dashboarding & Storytelling", key: "dashboard_and_storytelling_skills", score: profile.dashboard_and_storytelling_skills, max: 5.0, desc: "Translating data insights into executive decisions and interactive KPI boards" }
  ];

  const signal = profile.signal || "Moderate Technical Foundation";
  const confidencePct = profile.model_confidence ? Math.round(profile.model_confidence * 100) : 85;

  const isStrong = signal.includes("Strong");
  const isDeveloping = signal.includes("Developing");

  const badgeBg = isStrong
    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
    : isDeveloping
    ? "bg-amber-50 border-amber-200 text-amber-800"
    : "bg-blue-50 border-blue-200 text-blue-700";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      {/* Header section with canonical production model badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700">
              Canonical Production Model • Logistic Regression
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-700">
              Dataset 3 • ROC-AUC 90.35% • Acc 85.29%
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Technical Capability Matrix
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Single verified production machine-learning model evaluating candidate capability signals across 5 normalized dimensions.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className={`px-4 py-2 rounded-xl border flex flex-col items-center shadow-xs ${badgeBg}`}>
            <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">ML Capability Signal</span>
            <span className="text-sm font-bold tracking-tight">{signal}</span>
            <span className="text-[10px] font-mono opacity-80 mt-0.5">Confidence: {confidencePct}%</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Composite</span>
            <span className="text-lg font-extrabold text-blue-700 font-mono">
              {profile.composite_skill_score} / 5.0
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Core Score</span>
            <span className="text-lg font-extrabold text-emerald-700 font-mono">
              {profile.technical_core_score} / 5.0
            </span>
          </div>
        </div>
      </div>

      {/* Model Interpretation */}
      {profile.interpretation && (
        <div className="mb-6 p-3.5 bg-blue-50/50 rounded-xl border border-blue-200/80 text-xs text-slate-700 flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-900">Model Evaluation:</strong> {profile.interpretation}
          </p>
        </div>
      )}

      {/* Positive Drivers & Growth Areas */}
      {((profile.positive_drivers && profile.positive_drivers.length > 0) || (profile.growth_areas && profile.growth_areas.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {profile.positive_drivers && profile.positive_drivers.length > 0 && (
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">↑</span> Primary Positive Drivers (Log-Odds)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.positive_drivers.map((driver, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold shadow-xs">
                    {driver}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.growth_areas && profile.growth_areas.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 shadow-xs">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <span className="text-amber-600 font-bold">↓</span> Targeted Upside Dimensions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.growth_areas.map((growth, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold shadow-xs">
                    {growth}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5-Dimension Skill Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {dimensions.map((dim, idx) => {
          const pct = Math.min(100, (dim.score / dim.max) * 100);
          return (
            <div
              key={idx}
              className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">{dim.name}</span>
                  <span className="text-xs font-mono font-bold text-blue-700">
                    {dim.score.toFixed(1)} / {dim.max.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-blue-600 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {dim.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Explainability Toggle (Log-Odds Contributions) */}
      {profile.feature_explanations && profile.feature_explanations.length > 0 && (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowLogOddsDetails(!showLogOddsDetails)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{showLogOddsDetails ? "▼ Hide" : "▶ View"} Model Explainability &amp; Coefficients (Log-Odds Decomposition)</span>
          </button>

          {showLogOddsDetails && (
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/80 p-3 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="pb-2 font-semibold">Dimension</th>
                    <th className="pb-2 font-semibold">Value</th>
                    <th className="pb-2 font-semibold">Z-Score</th>
                    <th className="pb-2 font-semibold">Logistic Coef</th>
                    <th className="pb-2 font-semibold">Log-Odds Impact</th>
                    <th className="pb-2 font-semibold">Impact Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 font-mono text-[11px]">
                  {profile.feature_explanations.map((exp, i) => (
                    <tr key={i} className="hover:bg-white/60">
                      <td className="py-2 font-sans font-medium text-slate-800">{exp.display_name}</td>
                      <td className="py-2 text-blue-700">{exp.value.toFixed(1)} / 5.0</td>
                      <td className="py-2 text-slate-700">{exp.z_score >= 0 ? `+${exp.z_score.toFixed(2)}` : exp.z_score.toFixed(2)}</td>
                      <td className="py-2 text-slate-700">{exp.coefficient.toFixed(4)}</td>
                      <td className={`py-2 font-bold ${exp.log_odds_contribution >= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                        {exp.log_odds_contribution >= 0 ? `+${exp.log_odds_contribution.toFixed(3)}` : exp.log_odds_contribution.toFixed(3)}
                      </td>
                      <td className="py-2 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          exp.impact_direction.includes("Positive")
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : exp.impact_direction.includes("Growth")
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}>
                          {exp.symbol} {exp.impact_direction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Prominent Ethical Non-Hiring Disclaimer */}
      <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <span className="font-bold text-amber-900 block mb-0.5">Ethical AI Guardrail: Non-Hiring Probability Signal</span>
            <p className="text-amber-800/90 leading-relaxed">
              {profile.ethical_disclaimer || "The Technical Capability Signal is an exploratory evaluation of 5 skill dimensions (Dataset 3). It reflects demonstrated technical artifacts and is strictly NOT a hiring probability or automated employment decision."}
            </p>
          </div>
        </div>
        <div className="shrink-0 font-mono text-amber-900/70 text-[10px] self-end sm:self-center font-medium">
          Model: LogisticRegression (Dataset 3)
        </div>
      </div>
    </div>
  );
}
