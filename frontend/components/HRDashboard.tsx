"use client";

import React, { useState, useEffect } from "react";
import {
  HROverviewResponse,
  DailyBriefResponse,
  HRInsightItem,
  HRDeskQAResponse
} from "@/types/hr";
import {
  fetchHROverview,
  fetchDailyBrief,
  fetchHRInsights,
  queryHRDesk,
  fetchModelResults
} from "@/lib/api";

export function HRDashboard() {
  const [overview, setOverview] = useState<HROverviewResponse | null>(null);
  const [dailyBrief, setDailyBrief] = useState<DailyBriefResponse | null>(null);
  const [insights, setInsights] = useState<HRInsightItem[]>([]);
  const [queryInput, setQueryInput] = useState("");
  const [qaResult, setQaResult] = useState<HRDeskQAResponse | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModelModal, setShowModelModal] = useState(false);
  const [modelData, setModelData] = useState<any>(null);

  useEffect(() => {
    async function loadHRData() {
      try {
        setLoading(true);
        const [ov, db, ins, md] = await Promise.all([
          fetchHROverview(),
          fetchDailyBrief(),
          fetchHRInsights(),
          fetchModelResults()
        ]);
        setOverview(ov);
        setDailyBrief(db);
        setInsights(ins);
        setModelData(md);
      } catch (err) {
        console.error("Failed to load HR data", err);
      } finally {
        setLoading(false);
      }
    }
    loadHRData();
  }, []);

  const handleQuery = async (q: string) => {
    const text = q.trim();
    if (!text) return;
    setQueryInput(text);
    setIsQuerying(true);
    try {
      const res = await queryHRDesk(text);
      setQaResult(res);
    } catch (err) {
      console.error("Query failed", err);
    } finally {
      setIsQuerying(false);
    }
  };

  const sampleQueries = [
    "Which department is overloaded?",
    "Who is at risk of burnout?",
    "What is the Monday attendance pattern?",
    "Summarize today's urgent issues"
  ];

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-medium">Loading Workforce Intelligence &amp; HR Telemetry...</p>
      </div>
    );
  }

  const ovMetrics = overview?.overview;
  const depts = overview?.departments || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner (Executive Brand Dark Gradient) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0a0f1d] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-teal-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Enterprise Workforce Operations &amp; Talent Health
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            HR Intelligence Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Real-time workforce health, attendance telemetry, workload strain diagnostics, and AI HR Desk decision support.
          </p>
        </div>

        <button
          onClick={() => setShowModelModal(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer shadow-xs"
        >
          <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          View Model Evaluation (CV Results) ↗
        </button>
      </div>

      {/* 1. Workforce Overview KPI Grid */}
      {ovMetrics && (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Workforce Health Overview</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">
                {ovMetrics.health_index}
              </span>
            </h3>
            <span className="text-xs font-mono text-slate-500 font-medium">Cycle 2026-Q4</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Active Headcount</span>
              <span className="text-xl font-extrabold text-slate-900 font-mono">{ovMetrics.total_employees}</span>
            </div>
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Attendance Rate</span>
              <span className="text-xl font-extrabold text-emerald-700 font-mono">{ovMetrics.overall_attendance_pct}%</span>
            </div>
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Departments</span>
              <span className="text-xl font-extrabold text-teal-700 font-mono">{ovMetrics.active_departments}</span>
            </div>
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Tasks Assigned</span>
              <span className="text-xl font-extrabold text-slate-700 font-mono">{ovMetrics.tasks_assigned_this_cycle}</span>
            </div>
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Tasks Completed</span>
              <span className="text-xl font-extrabold text-slate-700 font-mono">{ovMetrics.tasks_completed_this_cycle}</span>
            </div>
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Critical Pending</span>
              <span className="text-xl font-extrabold text-rose-700 font-mono">{ovMetrics.pending_critical_tasks}</span>
            </div>
          </div>

          {/* Department Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Department Workload &amp; Velocity Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {depts.map((d, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate">{d.name}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                          d.workload_status === "Overloaded"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : d.workload_status === "Moderate"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {d.workload_status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>Headcount: <span className="font-mono text-slate-900 font-bold">{d.headcount}</span></div>
                      <div>Attendance: <span className="font-mono text-slate-900 font-bold">{d.attendance_pct}%</span></div>
                      <div>Pending Tasks: <span className="font-mono text-rose-700 font-bold">{d.pending_tasks}</span></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200 leading-tight">
                    {d.key_focus_area}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. Daily HR Brief: Top 3 Actionable Items */}
      {dailyBrief && (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                <span>⚡</span> Daily HR Executive Brief
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                3 Priority Action Items Requiring Attention
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">{dailyBrief.date}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dailyBrief.items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/60 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {item.department} • {item.category}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase border ${
                        item.severity === "High"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : item.severity === "Medium"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {item.severity} Priority
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h4>

                  <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 mb-3 leading-relaxed shadow-xs">
                    <strong className="text-slate-800 block mb-0.5">Evidence Trail:</strong>
                    {item.evidence}
                  </div>
                </div>

                <div className="text-[11px] text-emerald-900 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 leading-relaxed shadow-xs">
                  <strong className="text-emerald-800 block mb-0.5">Recommended Action:</strong>
                  {item.recommended_action}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. AI HR Desk: Natural Language Inquiry Console */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            <span>💬</span> AI HR Intelligence Desk
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Workforce Inquiry Console (Answer + Evidence + Action)
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Ask any question about workforce workload, attendance patterns, burnout risk, or department status.
          </p>
        </div>

        {/* Quick Question Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuery(sq)}
              className="text-[11px] px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer shadow-xs font-medium"
            >
              &ldquo;{sq}&rdquo;
            </button>
          ))}
        </div>

        {/* Search input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuery(queryInput);
          }}
          className="flex gap-2 mb-4"
        >
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Type your HR question (e.g. Which team is experiencing high workload?)..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder-slate-400 transition shadow-xs"
          />
          <button
            type="submit"
            disabled={isQuerying}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition disabled:bg-teal-300 cursor-pointer"
          >
            {isQuerying ? "Analyzing..." : "Ask Desk →"}
          </button>
        </form>

        {/* Structured QA Output */}
        {qaResult && (
          <div className="bg-slate-50 border border-teal-200 rounded-xl p-5 space-y-3 animate-fade-in shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-600">
                Query: <strong className="text-slate-900">&ldquo;{qaResult.query}&rdquo;</strong>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                {qaResult.confidence}
              </span>
            </div>

            <div>
              <strong className="text-xs uppercase tracking-wider text-teal-700 block mb-1">
                Direct Answer:
              </strong>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {qaResult.answer}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                <strong className="text-[11px] uppercase tracking-wider text-slate-500 block mb-1">
                  Evidence Trail:
                </strong>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {qaResult.evidence}
                </p>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200 shadow-xs">
                <strong className="text-[11px] uppercase tracking-wider text-emerald-800 block mb-1">
                  Recommended Action:
                </strong>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {qaResult.recommended_action}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Strategic Workforce Insights */}
      {insights.length > 0 && (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="mb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
              <span>📈</span> Strategic Workforce Insights
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Capability Design &amp; Organizational Intelligence
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Connecting internal skill telemetry, retention factors, and market transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((ins, idx) => (
              <div
                key={idx}
                className="bg-slate-50/60 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
                    {ins.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mb-2 leading-snug">
                    {ins.observation}
                  </h4>
                  <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 mb-3 leading-relaxed shadow-xs">
                    <strong className="text-slate-800 block mb-0.5">Evidence Trail:</strong>
                    {ins.evidence_trail}
                  </div>
                </div>

                <div className="text-[11px] text-emerald-900 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200 leading-relaxed shadow-xs">
                  <strong className="text-emerald-800 block mb-0.5">Strategic Action:</strong>
                  {ins.strategic_recommendation}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Model Evaluation Drawer / Modal */}
      {showModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModelModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700 mb-3">
              Rigorous Evaluation Protocol • 5x5 Repeated Stratified K-Fold CV
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              Model Evaluation &amp; Numerical Benchmark Results
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Real cross-validated results across 25 fold evaluations. No data leakage, strict baselines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Dataset 3 JDS Model */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                  Dataset 3 • JDS Technical Model
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  Salary Hike Outcome Classifier (Logistic Regression)
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700 mb-3 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Accuracy:</span>
                    <span className="font-bold text-emerald-700">85.3% (±6.9%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ROC-AUC:</span>
                    <span className="font-bold text-blue-700">0.904 (±0.058)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">F1-Score:</span>
                    <span className="font-bold text-slate-900">0.865 (±0.064)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Baseline (Dummy):</span>
                    <span className="text-slate-400">52.5%</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Evaluates exploratory compensation leverage from 5 core skill traits.
                </p>
              </div>

              {/* Dataset 4 SDS Model */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Dataset 4 • SDS Work-Style Model
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  Success Classification (Random Forest / Logistic Reg)
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700 mb-3 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Accuracy:</span>
                    <span className="font-bold text-emerald-700">94.4% (±5.5%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ROC-AUC:</span>
                    <span className="font-bold text-blue-700">0.996 (±0.007)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">F1-Score:</span>
                    <span className="font-bold text-slate-900">0.948 (±0.052)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Baseline (Dummy):</span>
                    <span className="text-slate-400">57.0%</span>
                  </div>
                </div>
                <p className="text-[10px] text-amber-800/90 leading-tight">
                  Strictly exploratory for team collaboration. NEVER used for candidate filtering.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowModelModal(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
