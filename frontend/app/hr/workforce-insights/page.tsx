"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import { HRHeader } from "@/components/HRHeader";
import {
  WORKFORCE_EMPLOYEES,
  DEPARTMENT_SUMMARIES,
  WORKFORCE_OVERVIEW_METRICS,
  WEEKLY_ATTENDANCE_HISTORY,
  RiskLevel
} from "@/lib/workforceData";

export default function WorkforceInsightsPage() {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | "All">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const departments = [
    "All",
    "Engineering",
    "Data & Analytics",
    "Operations",
    "Product & Design",
    "Client Solutions"
  ];

  const riskLevels: (RiskLevel | "All")[] = ["All", "High", "Medium", "Low"];

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return WORKFORCE_EMPLOYEES.filter((emp) => {
      const matchDept = selectedDept === "All" || emp.department === selectedDept;
      const matchRisk = selectedRisk === "All" || emp.riskLevel === selectedRisk;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q) ||
        (emp.notes && emp.notes.toLowerCase().includes(q));

      return matchDept && matchRisk && matchSearch;
    });
  }, [selectedDept, selectedRisk, searchQuery]);

  // Department workloads for chart
  const deptWorkloads = [
    { name: "Engineering", workload: 87, status: "Overloaded", color: "bg-rose-500" },
    { name: "Operations", workload: 74, status: "Moderate", color: "bg-amber-500" },
    { name: "Data & Analytics", workload: 68, status: "Optimal", color: "bg-teal-500" },
    { name: "Product & Design", workload: 64, status: "Optimal", color: "bg-emerald-500" },
    { name: "Client Solutions", workload: 62, status: "Optimal", color: "bg-blue-500" }
  ];

  const highRiskCount = WORKFORCE_EMPLOYEES.filter((e) => e.riskLevel === "High").length;
  const medRiskCount = WORKFORCE_EMPLOYEES.filter((e) => e.riskLevel === "Medium").length;
  const lowRiskCount = WORKFORCE_EMPLOYEES.filter((e) => e.riskLevel === "Low").length;

  return (
    <AuthGuard requiredRole="hr">
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        <HRHeader activeSection="workforce-insights" />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0a0f1d] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm text-white">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-teal-300 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Workforce Telemetry &amp; Roster Intelligence
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Workforce Insights &amp; Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Granular personnel telemetry across all 48 employees in 5 business units. Filter by risk profile, department, and attendance trends.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/hr/ai-desk"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white transition flex items-center gap-2 shadow-xs"
              >
                Query AI HR Desk ↗
              </Link>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block mb-1">
                Total Headcount
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {WORKFORCE_OVERVIEW_METRICS.total_employees}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Across 5 departments</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block mb-1">
                Average Workload
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
                76%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Engineering high at 87%</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block mb-1">
                Attendance Baseline
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
                {WORKFORCE_OVERVIEW_METRICS.overall_attendance_pct}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Operations Monday drop (84.1%)</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block mb-1">
                Pending Critical Tasks
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-mono">
                {WORKFORCE_OVERVIEW_METRICS.pending_critical_tasks}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">14 tasks in Engineering PR queue</p>
            </div>
          </section>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workload by Department Chart */}
            <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Average Workload by Department
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Target ceiling: 80% capacity
              </p>

              <div className="space-y-4">
                {deptWorkloads.map((dw) => (
                  <div key={dw.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{dw.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{dw.workload}%</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            dw.status === "Overloaded"
                              ? "bg-rose-50 text-rose-700"
                              : dw.status === "Moderate"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {dw.status}
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${dw.color}`}
                        style={{ width: `${dw.workload}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Attendance Trend Chart */}
            <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Day-of-Week Attendance Telemetry
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Comparing Company vs Operations
              </p>

              <div className="space-y-3.5">
                {WEEKLY_ATTENDANCE_HISTORY.map((dayData) => (
                  <div key={dayData.day} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{dayData.day}</span>
                      <span className="text-[11px] font-mono text-slate-600">
                        Company: {dayData.companyRate}% | Ops:{" "}
                        <span className={dayData.day === "Monday" ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}>
                          {dayData.operationsRate}%
                        </span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${dayData.companyRate}%` }}
                          title={`Company: ${dayData.companyRate}%`}
                        ></div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dayData.day === "Monday" ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${dayData.operationsRate}%` }}
                          title={`Ops: ${dayData.operationsRate}%`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center">
                Teal: Company Avg | Color: Operations Shift
              </p>
            </section>

            {/* Risk Breakdown Chart */}
            <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Employee Risk Distribution
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Assessed from workload strain &amp; absences
                </p>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-rose-800">High Risk (Attention Needed)</span>
                      <span className="text-sm font-mono font-extrabold text-rose-700">{highRiskCount}</span>
                    </div>
                    <p className="text-[11px] text-rose-700 leading-snug">
                      8 Senior Engineers (50+ hr sprints) + 3 Operations staff (Monday drop)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-amber-800">Medium Risk (Watchlist)</span>
                      <span className="text-sm font-mono font-extrabold text-amber-700">{medRiskCount}</span>
                    </div>
                    <p className="text-[11px] text-amber-700 leading-snug">
                      Mid-level engineers handling secondary support queues &amp; ops leads
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-emerald-800">Low Risk (Optimal)</span>
                      <span className="text-sm font-mono font-extrabold text-emerald-700">{lowRiskCount}</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-snug">
                      Healthy pacing across Product, Design, Analytics, and Client Solutions
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                Total assessed: 48 active employees
              </div>
            </section>
          </div>

          {/* Department Breakdown Overview Table */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Department Telemetry Summary
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Consolidated health status and key organizational focus areas
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Headcount</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Workload Status</th>
                    <th className="py-2.5 px-3">Pending Tasks</th>
                    <th className="py-2.5 px-3">Key Focus Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DEPARTMENT_SUMMARIES.map((d) => (
                    <tr key={d.name} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-bold text-slate-900">{d.name}</td>
                      <td className="py-3 px-3 font-mono">{d.headcount}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-emerald-700">{d.attendance_pct}%</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            d.workload_status === "Overloaded"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : d.workload_status === "Moderate"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {d.workload_status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-rose-700">{d.pending_tasks}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs">{d.key_focus_area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Interactive Employee Roster Filter & Table */}
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Individual Employee Roster Telemetry
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredEmployees.length} of {WORKFORCE_EMPLOYEES.length} employees
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, role, ID, or notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500 mr-1 font-mono uppercase">
                  Dept:
                </span>
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedDept === dept
                        ? "bg-teal-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                <span className="text-[11px] font-bold text-slate-500 mr-1 font-mono uppercase">
                  Risk:
                </span>
                {riskLevels.map((risk) => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => setSelectedRisk(risk)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedRisk === risk
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            {/* Employee Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Employee &amp; Role</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Workload</th>
                    <th className="py-2.5 px-3">Attendance</th>
                    <th className="py-2.5 px-3">Tasks</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                    <th className="py-2.5 px-3">Late / Absences</th>
                    <th className="py-2.5 px-3">Telemetry Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {emp.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-500">{emp.role}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                        {emp.department}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span
                          className={`font-bold ${
                            emp.workload >= 85
                              ? "text-rose-600"
                              : emp.workload >= 75
                              ? "text-amber-600"
                              : "text-slate-700"
                          }`}
                        >
                          {emp.workload}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {emp.weeklyHours}h/wk
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                        {emp.attendance}%
                      </td>
                      <td className="py-3 px-3 font-mono text-center">
                        <span
                          className={`font-bold ${
                            emp.tasks >= 3 ? "text-rose-600" : "text-slate-700"
                          }`}
                        >
                          {emp.tasks}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            emp.riskLevel === "High"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : emp.riskLevel === "Medium"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {emp.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {emp.lateDays}d late / {emp.absenceDays}d abs
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs text-[11px] leading-snug">
                        {emp.notes || "—"}
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        No employees found matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
