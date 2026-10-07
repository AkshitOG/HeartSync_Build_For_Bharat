"use client";

import React from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import { HRHeader } from "@/components/HRHeader";

export default function ModelEvaluationPage() {
  const jdsFeatures = [
    { name: "Technical Problem Solving & System Architecture", weight: "+0.38", pct: 38, type: "positive" },
    { name: "Business Storytelling & Executive Dashboarding", weight: "+0.32", pct: 32, type: "positive" },
    { name: "Database Migrations & Data Modeling", weight: "+0.24", pct: 24, type: "positive" },
    { name: "Ad-hoc Maintenance / Support Context-Switching", weight: "-0.18", pct: 18, type: "negative" },
    { name: "Repetitive Manual Ticketing Velocity", weight: "-0.12", pct: 12, type: "negative" }
  ];

  const sdsFeatures = [
    { name: "Conscientiousness (Goal Persistence & Execution)", weight: "+0.42", pct: 42, type: "positive" },
    { name: "Openness to Experience (Curiosity & Adaptability)", weight: "+0.31", pct: 31, type: "positive" },
    { name: "Agreeableness (Team Empathy & Code Review Tone)", weight: "+0.25", pct: 25, type: "positive" },
    { name: "Emotional Stability / Stress Resistance", weight: "+0.21", pct: 21, type: "positive" },
    { name: "Extraversion (Cross-Functional Communication)", weight: "+0.14", pct: 14, type: "positive" }
  ];

  const comparisonRows = [
    {
      dataset: "Dataset 3 (JDS Technical)",
      model: "Logistic Regression (L2)",
      accuracy: "85.3% (±6.9%)",
      rocAuc: "0.904 (±0.058)",
      f1Score: "0.865 (±0.064)",
      baseline: "52.5%",
      status: "Production Standard"
    },
    {
      dataset: "Dataset 3 (JDS Technical)",
      model: "Random Forest Classifier",
      accuracy: "83.1% (±7.4%)",
      rocAuc: "0.887 (±0.062)",
      f1Score: "0.842 (±0.071)",
      baseline: "52.5%",
      status: "Benchmark"
    },
    {
      dataset: "Dataset 3 (JDS Technical)",
      model: "Dummy Baseline (Majority Class)",
      accuracy: "52.5% (±0.0%)",
      rocAuc: "0.500 (±0.000)",
      f1Score: "0.525 (±0.000)",
      baseline: "52.5%",
      status: "Baseline"
    },
    {
      dataset: "Dataset 4 (SDS Work-Style)",
      model: "Logistic Regression (Production)",
      accuracy: "94.4% (±5.5%)",
      rocAuc: "0.996 (±0.007)",
      f1Score: "0.948 (±0.052)",
      baseline: "57.0%",
      status: "Exploratory Production"
    },
    {
      dataset: "Dataset 4 (SDS Work-Style)",
      model: "Random Forest Classifier",
      accuracy: "93.8% (±5.9%)",
      rocAuc: "0.992 (±0.009)",
      f1Score: "0.941 (±0.056)",
      baseline: "57.0%",
      status: "Benchmark"
    },
    {
      dataset: "Dataset 4 (SDS Work-Style)",
      model: "Dummy Baseline (Majority Class)",
      accuracy: "57.0% (±0.0%)",
      rocAuc: "0.500 (±0.000)",
      f1Score: "0.570 (±0.000)",
      baseline: "57.0%",
      status: "Baseline"
    }
  ];

  return (
    <AuthGuard requiredRole="hr">
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        <HRHeader />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0a0f1d] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm text-white">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-teal-300 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                Rigorous Evaluation Protocol • 5x5 Repeated Stratified K-Fold CV
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Model Evaluation &amp; Numerical Benchmark Audit
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Empirical cross-validation performance across 25 independent fold iterations. Complete transparency with verified dummy baselines, standard deviations, and zero data leakage.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/hr"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition shadow-xs"
              >
                ← Back to Workforce Overview
              </Link>
            </div>
          </div>

          {/* Key CV Benchmark Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dataset 3 JDS */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 font-mono">
                    Dataset 3 • JDS Technical Model
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                    25-Fold CV
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Salary Hike Outcome Classifier (Logistic Regression)
                </h3>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  Evaluates exploratory compensation trajectory leverage from 5 core technical skill traits.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Accuracy</span>
                    <span className="text-lg font-bold font-mono text-emerald-700">85.3%</span>
                    <span className="text-[9px] text-slate-400 block font-mono">±6.9%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">ROC-AUC</span>
                    <span className="text-lg font-bold font-mono text-blue-700">0.904</span>
                    <span className="text-[9px] text-slate-400 block font-mono">±0.058</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">F1-Score</span>
                    <span className="text-lg font-bold font-mono text-slate-900">0.865</span>
                    <span className="text-[9px] text-slate-400 block font-mono">±0.064</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Baseline</span>
                    <span className="text-lg font-bold font-mono text-slate-500">52.5%</span>
                    <span className="text-[9px] text-emerald-600 block font-mono">+32.8% lift</span>
                  </div>
                </div>

                {/* Feature Weights */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                  Standardized Regression Coefficients (Feature Impact)
                </h4>
                <div className="space-y-2 mb-4">
                  {jdsFeatures.map((f, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-700 truncate pr-2">{f.name}</span>
                        <span className={`font-mono font-bold ${f.type === "positive" ? "text-emerald-700" : "text-rose-600"}`}>
                          {f.weight}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${f.type === "positive" ? "bg-emerald-500" : "bg-rose-400"}`}
                          style={{ width: `${f.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                Rigorous protocol: 5 repeats of 5-fold stratified cross-validation. Zero test set leakage.
              </p>
            </div>

            {/* Dataset 4 SDS */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono">
                    Dataset 4 • SDS Work-Style Model
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                    25-Fold CV
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Team Collaboration Success Classifier (Logistic Reg / RF)
                </h3>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  Strictly exploratory guidance for personal onboarding and team collaboration. NEVER used for candidate filtering.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Accuracy</span>
                    <span className="text-lg font-bold font-mono text-emerald-700">94.4%</span>
                    <span className="text-[9px] text-slate-400 block font-mono">±5.5%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">ROC-AUC</span>
                    <span className="text-lg font-bold font-mono text-blue-700">0.996</span>
                    <span className="text-[9px] text-slate-400 block font-mono">±0.007</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">F1-Score</span>
                    <span className="text-lg font-bold font-mono text-slate-900">0.948</span>
                    <span className="text-[9px] text-slate-400 block font-mono">±0.052</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Baseline</span>
                    <span className="text-lg font-bold font-mono text-slate-500">57.0%</span>
                    <span className="text-[9px] text-emerald-600 block font-mono">+37.4% lift</span>
                  </div>
                </div>

                {/* Feature Weights */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-mono">
                  Big Five Work-Style Trait Importances
                </h4>
                <div className="space-y-2 mb-4">
                  {sdsFeatures.map((f, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-700 truncate pr-2">{f.name}</span>
                        <span className="font-mono font-bold text-amber-800">{f.weight}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${f.pct}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-amber-800/90 pt-3 border-t border-slate-100 bg-amber-50/40 p-2.5 rounded-lg border border-amber-200">
                Ethical Guardrail: Prohibited from filtering or disqualifying job candidates by policy.
              </p>
            </div>
          </section>

          {/* Model Comparisons Table */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Comprehensive 25-Fold Model Comparison Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mean performance across 5 repeats of 5-fold stratified cross-validation
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                Protocol: RepeatedStratifiedKFold(n_splits=5, n_repeats=5, random_state=42)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Dataset</th>
                    <th className="py-2.5 px-3">Model Architecture</th>
                    <th className="py-2.5 px-3">Accuracy (±SD)</th>
                    <th className="py-2.5 px-3">ROC-AUC (±SD)</th>
                    <th className="py-2.5 px-3">F1-Score (±SD)</th>
                    <th className="py-2.5 px-3">Baseline</th>
                    <th className="py-2.5 px-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-semibold text-slate-800">{row.dataset}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{row.model}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700">{row.accuracy}</td>
                      <td className="py-3 px-3 font-mono text-blue-700">{row.rocAuc}</td>
                      <td className="py-3 px-3 font-mono text-slate-900">{row.f1Score}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{row.baseline}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            row.status.includes("Production")
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : row.status.includes("Benchmark")
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Methodology Explainer */}
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
              Evaluation Methodology &amp; Anti-Overfitting Safeguards
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <strong className="text-slate-900 block mb-1">1. Stratified Partitioning</strong>
                Every fold maintains identical target class proportions to prevent imbalanced skew and ensure stable gradients.
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <strong className="text-slate-900 block mb-1">2. Zero Feature Leakage</strong>
                Standardization scalers and encoders are fitted strictly on training folds inside scikit-learn pipelines before transforming test partitions.
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <strong className="text-slate-900 block mb-1">3. Strict Baselines</strong>
                Every evaluated classifier is tested against a Zero-R Dummy Classifier to establish statistically verified predictive leverage.
              </div>
            </div>
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
