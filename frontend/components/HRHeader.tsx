"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export function HRHeader({
  activeSection = "overview",
  onSectionClick,
}: {
  activeSection?: string;
  onSectionClick?: (section: string) => void;
}) {
  const { user, profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: "overview", label: "Workforce Overview" },
    { id: "daily-brief", label: "Daily HR Brief" },
    { id: "ai-desk", label: "AI HR Desk" },
    { id: "insights", label: "Workforce Insights" },
  ];

  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="h-9 w-9 rounded-xl bg-teal-600 flex items-center justify-center font-extrabold text-white text-sm shadow-sm shadow-teal-500/20">
            HR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                CareerGPS
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 tracking-wide uppercase">
                Enterprise HR
              </span>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-medium text-emerald-700 hidden md:inline">Live Intelligence</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Workforce Intelligence, Employee Signals & Strategic Talent Insights
            </p>
          </div>
        </div>

        {/* HR Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionClick?.(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeSection === item.id
                  ? "bg-white text-teal-700 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Account & Actions */}
        <div className="flex items-center gap-3 relative">
          <Link
            href="/responsible-ai"
            className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg transition font-medium hidden sm:inline"
          >
            Responsible AI
          </Link>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition cursor-pointer"
            >
              <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() || "H"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.name || "HR Leader"}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">
                  {profile?.account_type === "hr" ? "Workforce Account" : "Active"}
                </p>
              </div>
              <svg className="w-3.5 h-3.5 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "HR Leader"}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || "hr@company.com"}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Role: HR / Workforce
                  </span>
                </div>
                <div className="py-1">
                  <Link
                    href="/responsible-ai"
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    Responsible AI Principles
                  </Link>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer flex items-center gap-2"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
