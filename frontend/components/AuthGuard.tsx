"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

interface AuthGuardProps {
  requiredRole: "candidate" | "hr";
  children: React.ReactNode;
}

export function AuthGuard({ requiredRole, children }: AuthGuardProps) {
  const router = useRouter();
  const { user, profile, isLoading, setAccountRole } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Small delay to ensure client-side state hydration
    const timer = setTimeout(() => {
      setHydrated(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || !hydrated) return;

    // 1. Unauthenticated users must be redirected to /login
    if (!user) {
      router.replace("/login");
      return;
    }

    // 2. New users without an account role must configure one
    if (!profile || !profile.account_type) {
      router.replace("/onboarding");
      return;
    }

    // 3. Prevent cross-role access: route to their active role workspace
    if (profile.account_type !== requiredRole) {
      if (profile.account_type === "candidate") {
        router.replace("/candidate");
      } else if (profile.account_type === "hr") {
        router.replace("/hr");
      }
    }
  }, [user, profile, isLoading, hydrated, requiredRole, router]);

  // Loading or redirecting state
  if (isLoading || !hydrated || !user || !profile || profile.account_type !== requiredRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 px-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-sm w-full text-center shadow-xs">
          <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-800">
            Verifying Workspace Access
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Loading {requiredRole === "candidate" ? "Candidate" : "HR"} intelligence session...
          </p>

          {user && profile && profile.account_type !== requiredRole && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-600 mb-2">
                Active account is set to: <strong className="capitalize">{profile.account_type}</strong>
              </p>
              <button
                onClick={() => setAccountRole(requiredRole)}
                className="w-full py-2 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer"
              >
                Switch to {requiredRole === "candidate" ? "Candidate" : "HR"} Workspace
              </button>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-700">Login</Link>
            <span>•</span>
            <Link href="/demo" className="hover:text-slate-700">Demo</Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
