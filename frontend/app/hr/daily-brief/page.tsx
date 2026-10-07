"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import { HRHeader } from "@/components/HRHeader";
import {
  DAILY_BRIEF_ITEMS,
  DEPARTMENT_SUMMARIES,
  WORKFORCE_OVERVIEW_METRICS,
  getAttendanceMetrics,
  WORKFORCE_EMPLOYEES
} from "@/lib/workforceData";
import { fetchDailyBrief } from "@/lib/api";

export default function DailyBriefPage() {
  const [items, setItems] = useState(DAILY_BRIEF_ITEMS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("Just now");
  const [todayFormatted, setTodayFormatted] = useState<string>("");

  useEffect(() => {
    const d = new Date();
    setTodayFormatted(
      d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    );
    setLastRefreshed(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));

    // Try fetching from backend if available
    fetchDailyBrief()
      .then((res) => {
        if (res?.items && res.items.length > 0) {
          setItems(res.items);
        }
      })
      .catch(() => {
        // Fall back gracefully to DAILY_BRIEF_ITEMS
      });
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchDailyBrief().catch(() => null);
      if (res?.items && res.items.length > 0) {
        setItems(res.items);
      } else {
        setItems(DAILY_BRIEF_ITEMS);
      }
    } finally {
      setTimeout(() => {
        const d = new Date();
        setLastRefreshed(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
        setIsRefreshing(false);
      }, 500);
    }
  };

  const attMetrics = getAttendanceMetrics();
  const highRiskEmployees = WORKFORCE_EMPLOYEES.filter((e) => e.riskLevel === "High");

  return (
    <AuthGuard requiredRole="hr">
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        <HRHeader activeSection="daily-brief" />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0a0f1d] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm text-white">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-amber-300 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Daily HR Operational Briefing
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Daily HR Executive Brief
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Aggregated daily pulse across attendance fluctuations, engineering workload bottlenecks, and priority interventions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-xs font-semibold text-slate-200 block">
                  {todayFormatted || "Today's Briefing"}
                </span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  Refreshed: {lastRefreshed}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-teal-700 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <svg
                  className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isRefreshing ? "Refreshing Brief..." : "Refresh Brief"}
              </button>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Attention Items
                </span>
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-mono mb-1">
                {items.length}
              </div>
              <p className="text-xs text-slate-600">
                Active alerts requiring HR or management action
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  High Severity Alerts
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                  Critical
                </span>
              </div>
              <div className="text-3xl font-extrabold text-rose-600 font-mono mb-1">
                {items.filter((i) => i.severity === "High").length}
              </div>
              <p className="text-xs text-slate-600">
                Engineering PR review bottleneck (14 stalled tasks)
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Operations Monday Anomaly
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                  Attendance
                </span>
              </div>
              <div className="text-3xl font-extrabold text-amber-600 font-mono mb-1">
                84.1%
              </div>
              <p className="text-xs text-slate-600">
                Operations Monday dip vs 94.2% company baseline
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Pending Upskilling Requests
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                  Subsidies
                </span>
              </div>
              <div className="text-3xl font-extrabold text-teal-600 font-mono mb-1">
                4
              </div>
              <p className="text-xs text-slate-600">
                PySpark &amp; AWS certifications pending 12+ days
              </p>
            </div>
          </section>

          {/* Priority HR Actions: Top 3 Action Items */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
                  <span>⚡</span> Priority HR Action Items
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Ranked Priority Interventions
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Sorted by Operational Impact &amp; Severity
              </span>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-6 w-6 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold font-mono flex items-center justify-center">
                        #{index + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {item.department}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          item.severity === "High"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : item.severity === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-teal-50 text-teal-700 border-teal-200"
                        }`}
                      >
                        {item.severity} Priority
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-slate-200">
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      <strong className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Evidence Trail:
                      </strong>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {item.evidence}
                      </p>
                    </div>

                    <div className="bg-emerald-50/70 p-3.5 rounded-lg border border-emerald-200 shadow-xs">
                      <strong className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                        Recommended Action:
                      </strong>
                      <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                        {item.recommended_action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Attendance Summary & Workload Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Summary */}
            <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Attendance Summary &amp; Pattern Tracking
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time attendance rates across 5 departments
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {WORKFORCE_OVERVIEW_METRICS.overall_attendance_pct}% Baseline
                </span>
              </div>

              <div className="space-y-3 mb-5">
                {DEPARTMENT_SUMMARIES.map((d) => (
                  <div key={d.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{d.name}</span>
                      <span className="font-mono font-bold text-slate-700">{d.attendance_pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          d.attendance_pct < 90
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${d.attendance_pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
                <strong className="block font-bold text-amber-900 mb-0.5">
                  ⚠️ Anomaly Detection Alert:
                </strong>
                Operations drops to <strong>84.1% on Mondays</strong> vs <strong>94.6% on Wednesdays</strong> across the last 4 consecutive payroll cycles. 3 specific team members drive 72% of the differential due to shift transit issues.
              </div>
            </section>

            {/* Workload Alerts & Employee Signals */}
            <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Workload Alerts &amp; Strain Signals
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Burnout indicators and concentration bottlenecks
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    24 Pending Tasks
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-900 font-bold">Engineering Overload (87% Capacity)</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        High Strain
                      </span>
                    </div>
                    <p className="text-slate-600">
                      14 pending critical tasks. Senior backend engineers logging 50+ hr sprints. 62% of code reviews awaiting approval.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-900 font-bold">High Risk Employees Flagged</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        {highRiskEmployees.length} Staff
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Engineering: Tech Lead Aarav Sharma, Staff Engineers Rohan Verma &amp; Vikram Malhotra. Operations: Kavita Rao, Deepak Joshi, Suresh Kumar.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-900 font-bold">Data &amp; Analytics Upskilling Signal</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        Optimal
                      </span>
                    </div>
                    <p className="text-slate-600">
                      4 analysts submitted AWS &amp; PySpark subsidy requests. Approving will accelerate ML workflow pivots.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/hr/ai-desk"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
                >
                  Consult AI HR Desk for Action Steps →
                </Link>
                <Link
                  href="/hr/workforce-insights"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  View All 48 Employees →
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
