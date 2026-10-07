"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const [statusText, setStatusText] = useState("Finalizing authentication...");

  useEffect(() => {
    let resolved = false;

    async function routeUserWithProfile() {
      if (resolved) return;
      resolved = true;
      setStatusText("Verifying workspace permissions...");

      try {
        const prof = await refreshProfile();
        if (prof?.account_type === "candidate") {
          router.replace("/candidate");
        } else if (prof?.account_type === "hr") {
          router.replace("/hr");
        } else {
          router.replace("/onboarding");
        }
      } catch {
        router.replace("/onboarding");
      }
    }

    // 1. If user is already loaded in context
    if (user) {
      routeUserWithProfile();
      return;
    }

    // 2. Listen to Supabase auth state change (catches hash tokens from OAuth redirect)
    let subscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
          await routeUserWithProfile();
        }
      });
      subscription = data.subscription;

      // 3. Concurrently check getSession directly
      supabase.auth.getSession().then(({ data: sessionData, error }) => {
        if (error) {
          console.error("Auth callback error:", error);
          router.replace("/login?error=" + encodeURIComponent(error.message));
          return;
        }
        if (sessionData?.session?.user) {
          routeUserWithProfile();
        }
      });
    }

    // 4. Safe timeout fallback: if not resolved within 3 seconds, check if user exists or route to login
    const timer = setTimeout(() => {
      if (!resolved) {
        if (user) {
          routeUserWithProfile();
        } else {
          router.replace("/login");
        }
      }
    }, 3500);

    return () => {
      if (subscription) subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [user, profile, refreshProfile, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium tracking-wide text-slate-400">
          {statusText}
        </p>
      </div>
    </div>
  );
}
