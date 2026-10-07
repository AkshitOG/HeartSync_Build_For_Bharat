"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    // 1. If Supabase redirected back to root domain with OAuth hash or code, forward to callback handler
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash.includes("access_token") || search.includes("code=") || search.includes("error=")) {
        router.replace(`/auth/callback${search}${hash}`);
        return;
      }
    }

    // 2. If user is authenticated, route immediately to their workspace
    if (!isLoading && user) {
      if (profile?.account_type === "candidate") {
        router.replace("/candidate");
      } else if (profile?.account_type === "hr") {
        router.replace("/hr");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [user, profile, isLoading, router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-sm shadow-sm shadow-blue-500/20">
              GPS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                  CareerGPS
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 tracking-wide uppercase">
                  Enterprise Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Workforce Intelligence &amp; Highest-Leverage Next Career Action
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-xs transition"
            >
              Explore Demo Sandbox
            </Link>

            {user ? (
              <Link
                href={profile?.account_type === "hr" ? "/hr" : "/candidate"}
                className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition cursor-pointer"
              >
                Go to Workspace ({user.name?.split(" ")[0] || "User"}) →
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition cursor-pointer"
              >
                Sign In →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-14 sm:py-20 flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
          <span>⚡ Build For Bharat 2.0</span>
          <span className="text-blue-300">•</span>
          <span>Calibrated on 15,841 Job Postings</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> 85.3% Accuracy (JDS Model)
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-[1.15]">
          Evidence-Grounded Workforce &amp; Career Decision Engine
        </h1>

        {/* Hero Subheadline */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mt-5 leading-relaxed">
          CareerGPS replaces arbitrary percentages and generic 10-step roadmaps with
          deterministic evidence deficits, verified work samples, and organizational intelligence.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8">
          {user ? (
            <Link
              href={profile?.account_type === "hr" ? "/hr" : "/candidate"}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Continue to Workspace</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Sign In / Get Started</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          )}

          <Link
            href="/demo"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Demo Sandbox</span>
            <span className="text-amber-500">⚡</span>
          </Link>
        </div>

        {/* Two Products Showcase */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 text-left">
          {/* Card 1: Candidate CareerGPS */}
          <div className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-7 sm:p-9 transition duration-200 shadow-xs hover:shadow-sm flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center text-xl font-bold">
                  🎯
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  Candidate Product
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                Candidate CareerGPS
              </h2>
              <p className="text-sm font-semibold text-blue-700 italic mb-3">
                &ldquo;What should I do next to become stronger for my target role?&rdquo;
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Evaluates candidate code and resume claims against calibrated Target Role DNA,
                pinpoints evidence deficits, and delivers the single highest-leverage Next Best Action.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 mb-5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Target Role DNA calibration across 15,841 jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Objective Evidence Ladder (Claim ➔ Applied ➔ Deployed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Single HERO Next Best Action with concrete deliverables</span>
                </div>
              </div>
            </div>

            <Link
              href="/candidate"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 pt-2 transition group-hover:translate-x-1"
            >
              <span>Enter Candidate Portal</span>
              <span>→</span>
            </Link>
          </div>

          {/* Card 2: HR Intelligence */}
          <div className="bg-white border border-slate-200/80 hover:border-teal-300 rounded-2xl p-7 sm:p-9 transition duration-200 shadow-xs hover:shadow-sm flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center text-xl font-bold">
                  🏢
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
                  Enterprise HR
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1.5">
                HR Intelligence Desk
              </h2>
              <p className="text-sm font-semibold text-teal-700 italic mb-3">
                &ldquo;What is happening across my workforce and what needs attention?&rdquo;
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Real-time organizational analytics monitoring team strain, workload balance,
                attendance anomalies, and talent mobility matches through an evidence-grounded AI HR Desk.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 mb-5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Workforce workload status &amp; strain anomaly detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>AI HR Desk answering executive queries with verified log evidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Daily HR Executive Brief with concrete recommendations</span>
                </div>
              </div>
            </div>

            <Link
              href="/hr"
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700 pt-2 transition group-hover:translate-x-1"
            >
              <span>Enter HR Intelligence</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>CareerGPS • Build For Bharat 2.0 (SAS &amp; Data Science Track)</p>
          <div className="flex items-center gap-5">
            <Link href="/demo" className="hover:text-slate-900 transition">
              Explore Demo Sandbox
            </Link>
            <Link href="/responsible-ai" className="hover:text-slate-900 transition">
              Responsible AI Governance
            </Link>
            {user ? (
              <span className="text-slate-600 font-medium">
                Signed in: {user.name}
              </span>
            ) : (
              <Link href="/login" className="hover:text-blue-600 font-medium transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
