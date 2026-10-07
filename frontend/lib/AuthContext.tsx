"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import { UserProfile, fetchUserProfile, saveUserProfile } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInFast: (role: "candidate" | "hr") => Promise<void>;
  setAccountRole: (role: "candidate" | "hr") => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "careergps_auth_user";
const LOCAL_STORAGE_PROFILE_KEY = "careergps_auth_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Synchronous initialization from localStorage prevents flash of unauthenticated state
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load profile from backend or local storage
  const loadProfile = useCallback(async (userId: string, userEmail: string, userName: string): Promise<UserProfile | null> => {
    // 1. Try local cache first for instant response
    let cachedProfile: UserProfile | null = null;
    if (typeof window !== "undefined") {
      const localProfileStr = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (localProfileStr) {
        try {
          const parsed = JSON.parse(localProfileStr);
          if (parsed.user_id === userId || parsed.email === userEmail) {
            cachedProfile = parsed;
            setProfile(parsed);
          }
        } catch {
          // ignore parse error
        }
      }
    }

    // 2. Try fetching freshest profile from backend
    try {
      const backendProfile = await fetchUserProfile(userId);
      if (backendProfile) {
        setProfile(backendProfile);
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(backendProfile));
        }
        return backendProfile;
      }
    } catch (err) {
      console.warn("Backend profile fetch warning (using cached if available):", err);
    }

    return cachedProfile;
  }, []);

  // Initialize session
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
              avatar_url: session.user.user_metadata?.avatar_url,
            };
            setUser(authUser);
            if (typeof window !== "undefined") {
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(authUser));
            }
            await loadProfile(authUser.id, authUser.email, authUser.name);
          }
        } catch (err) {
          console.warn("Supabase auth session error:", err);
        }
      } else {
        // Zero-credential offline fallback
        if (typeof window !== "undefined") {
          const savedUserStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
          if (savedUserStr && isMounted) {
            try {
              const savedUser = JSON.parse(savedUserStr);
              setUser(savedUser);
              await loadProfile(savedUser.id, savedUser.email, savedUser.name);
            } catch {
              localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            }
          }
        }
      }

      if (isMounted) setIsLoading(false);
    }

    initAuth();

    // Listen for Supabase auth state changes if configured
    let subscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            avatar_url: session.user.user_metadata?.avatar_url,
          };
          setUser(authUser);
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(authUser));
          }
          await loadProfile(authUser.id, authUser.email, authUser.name);
          setIsLoading(false);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
            localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
          }
          setIsLoading(false);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [loadProfile]);

  // Google OAuth Trigger with precise origin detection
  const signInWithGoogle = async () => {
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      // Redirect to the exact current origin /auth/callback (works for localhost:3000, 127.0.0.1:3000, or production)
      const redirectTo = `${currentOrigin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) {
        setIsLoading(false);
        throw error;
      }
    } else {
      // Offline fallback: simulated authentic sign-in
      await signInFast("candidate");
    }
  };

  // Instant 1-Click Fast Sign-In (ideal for localhost development & demonstration)
  const signInFast = async (role: "candidate" | "hr") => {
    setIsLoading(true);
    const mockUser: AuthUser = role === "candidate"
      ? {
          id: "usr_alex_sharma",
          email: "alex.sharma@careergps.ai",
          name: "Alex Sharma",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
        }
      : {
          id: "usr_sarah_chen",
          email: "sarah.chen@enterprise.com",
          name: "Sarah Chen (VP Workforce)",
          avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
        };

    const newProfile: UserProfile = {
      user_id: mockUser.id,
      account_type: role,
      display_name: mockUser.name,
      email: mockUser.email,
    };

    setUser(mockUser);
    setProfile(newProfile);

    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
    }

    // Attempt to persist to backend in background
    try {
      await saveUserProfile(newProfile);
    } catch {
      // Backend offline or local fallback
    }

    setIsLoading(false);
  };

  // Set account type / role
  const setAccountRole = async (role: "candidate" | "hr") => {
    if (!user) throw new Error("Cannot set account role without an authenticated user.");

    const newProfile: UserProfile = {
      user_id: user.id,
      account_type: role,
      display_name: user.name,
      email: user.email,
    };

    setProfile(newProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
    }

    // Save to backend if available
    try {
      const saved = await saveUserProfile(newProfile);
      if (saved) {
        setProfile(saved);
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(saved));
        }
      }
    } catch {
      // Local storage persistence already active as fallback
    }
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase signOut error:", err);
      }
    }
    setUser(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
      window.location.href = "/login";
    }
    setIsLoading(false);
  };

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    return await loadProfile(user.id, user.email, user.name);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signInWithGoogle,
        signInFast,
        setAccountRole,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
