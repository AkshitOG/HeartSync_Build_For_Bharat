"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, isLoading, setAccountRole } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"candidate" | "hr" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (profile?.account_type === "candidate") {
        router.replace("/candidate");
      } else if (profile?.account_type === "hr") {
        router.replace("/hr");
      }
    }
  }, [user, profile, isLoading, router]);

  const handleSelectRole = async (role: "candidate" | "hr") => {
    setSelectedRole(role);
    setSubmitting(true);
    setErrorMessage(null);

    try {
      await setAccountRole(role);
      if (role === "candidate") {
        router.replace("/candidate");
      } else {
        router.replace("/hr");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to establish account role. Please try again.");
      }
      setSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
        <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-medium">Loading account status...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Minimal Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-xs shadow-sm shadow-blue-500/20">
            GPS
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            CareerGPS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Signed in as:</span>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 truncate max-w-[200px]">
            {user.email || user.name}
          </span>
        </div>
      </header>

      {/* Main Choice View */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-4xl w-full">
          {/* Headline */}
          <div className="text-center mb-10 max-w-xl mx-auto">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 tracking-wide uppercase inline-block mb-3">
              Account Setup
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How will you use CareerGPS?
            </h1>
            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
              Select your primary account workspace. This configures your dedicated intelligence workflows and analytical models.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-8 max-w-lg mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center">
              {errorMessage}
            </div>
          )}

          {/* Account Type Grid: 2 Distinct Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* OPTION 1: CANDIDATE */}
            <div className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                    🎯
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                    Candidate Workspace
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                  Candidate
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Build your career around evidence, market requirements, and your highest-leverage next best action.
                </p>

                <div className="space-y-2.5 border-t border-slate-100 pt-5 mb-8">
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Target Role DNA calibration across 15,841 job postings</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Verifiable code, schema, and architectural gap analysis</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Single HERO: ONE Next Best Action with full deliverables</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectRole("candidate")}
                disabled={submitting}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting && selectedRole === "candidate" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Setting up Candidate Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Continue as Candidate</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>

            {/* OPTION 2: HR / WORKFORCE */}
            <div className="bg-white border border-slate-200/90 hover:border-teal-400 rounded-2xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center text-2xl group-hover:scale-105 transition">
                    🏢
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
                    Enterprise HR Desk
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                  HR / Workforce
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Understand workforce signals, team strain, attendance, and strategic talent mobility.
                </p>

                <div className="space-y-2.5 border-t border-slate-100 pt-5 mb-8">
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Real-time employee strain, attendance, and workload health</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>AI HR Desk answering workforce inquiries with structured evidence</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Daily HR Executive Brief with actionable priority recommendations</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectRole("hr")}
                disabled={submitting}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting && selectedRole === "hr" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Setting up HR Intelligence...</span>
                  </>
                ) : (
                  <>
                    <span>Continue as HR</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
        CareerGPS • Account Selection establishes your workspace profile.
      </footer>
    </div>
  );
}
