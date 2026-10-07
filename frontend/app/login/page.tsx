"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, isLoading, signInWithGoogle, signInFast } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [submittingGoogle, setSubmittingGoogle] = useState(false);
  const [submittingFast, setSubmittingFast] = useState<string | null>(null);

  useEffect(() => {
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

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setSubmittingGoogle(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("Failed to authenticate with Google. Please check your connection and retry.");
      }
      setSubmittingGoogle(false);
    }
  };

  const handleFastSignIn = async (role: "candidate" | "hr") => {
    setAuthError(null);
    setSubmittingFast(role);
    try {
      await signInFast(role);
      router.replace(role === "candidate" ? "/candidate" : "/hr");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("Fast sign-in failed. Please retry.");
      }
      setSubmittingFast(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-xs shadow-sm shadow-blue-500/20 group-hover:scale-105 transition">
            GPS
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            CareerGPS
          </span>
        </Link>
        <Link
          href="/demo"
          className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          Explore Demo Mode →
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-7 sm:p-9 shadow-sm">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 items-center justify-center font-extrabold text-blue-600 text-lg mb-3">
              GPS
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In to CareerGPS
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Access your calibrated career intelligence or enterprise workforce workspace.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <span className="text-rose-500 mt-0.5">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold">Authentication Notice</p>
                <p className="mt-0.5 text-rose-600">{authError}</p>
              </div>
            </div>
          )}

          {/* Section 1: Fast 1-Click Workspace Sign-In (Localhost & Demo Reliable) */}
          <div className="mb-6 space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ⚡ 1-Click Fast Sign-In
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Instant Access
              </span>
            </div>

            <button
              onClick={() => handleFastSignIn("candidate")}
              disabled={Boolean(submittingFast) || submittingGoogle}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-blue-900 font-semibold text-xs transition cursor-pointer disabled:opacity-60 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🎯</span>
                <div>
                  <p className="font-bold leading-tight">Alex Sharma (Candidate)</p>
                  <p className="text-[10px] text-blue-700 font-normal">FastAPI dev targeting Backend Engineer</p>
                </div>
              </div>
              <span className="text-blue-600 font-bold text-xs">
                {submittingFast === "candidate" ? "Entering..." : "Enter →"}
              </span>
            </button>

            <button
              onClick={() => handleFastSignIn("hr")}
              disabled={Boolean(submittingFast) || submittingGoogle}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/70 text-teal-900 font-semibold text-xs transition cursor-pointer disabled:opacity-60 text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🏢</span>
                <div>
                  <p className="font-bold leading-tight">Sarah Chen (HR Leader)</p>
                  <p className="text-[10px] text-teal-700 font-normal">Enterprise Workforce Intelligence Desk</p>
                </div>
              </div>
              <span className="text-teal-600 font-bold text-xs">
                {submittingFast === "hr" ? "Entering..." : "Enter →"}
              </span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or Continue with OAuth
            </span>
          </div>

          {/* Section 2: Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            disabled={submittingGoogle || Boolean(submittingFast) || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3 px-4 rounded-xl border border-slate-300 shadow-xs transition duration-200 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
          >
            {submittingGoogle ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-700">Connecting to Google...</span>
              </div>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-xs">Continue with Google OAuth</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500 mt-4 leading-relaxed">
            CareerGPS uses strict role workspaces. New Google accounts choose their role on the next step.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
        CareerGPS • Build For Bharat 2.0 •{" "}
        <Link href="/responsible-ai" className="hover:text-slate-900 transition underline underline-offset-2">
          Responsible AI Guidelines
        </Link>
      </footer>
    </div>
  );
}
