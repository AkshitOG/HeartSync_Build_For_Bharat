"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export function HRHeader({
  activeSection,
  onSectionClick,
}: {
  activeSection?: string;
  onSectionClick?: (section: string) => void;
}) {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/hr", label: "Workforce Overview", id: "overview" },
    { href: "/hr/daily-brief", label: "Daily HR Brief", id: "daily-brief" },
    { href: "/hr/ai-desk", label: "AI HR Desk", id: "ai-desk" },
    { href: "/hr/workforce-insights", label: "Workforce Insights", id: "workforce-insights" },
    { href: "/hr/responsible-ai", label: "Responsible AI", id: "responsible-ai" },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    if (pathname === item.href) return true;
    if (item.href === "/hr" && pathname === "/hr") return true;
    if (activeSection && activeSection === item.id) return true;
    return false;
  };

  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/hr" className="flex items-center space-x-3 shrink-0 group">
          <div className="h-9 w-9 rounded-xl bg-teal-600 flex items-center justify-center font-extrabold text-white text-sm shadow-sm shadow-teal-500/20 group-hover:scale-105 transition">
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
              <div className="flex items-center gap-1.5 ml-1 hidden sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-medium text-emerald-700 hidden md:inline">Live Intelligence</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
              Workforce Intelligence, Employee Signals &amp; Strategic Talent Insights
            </p>
          </div>
        </Link>

        {/* HR Navigation (Desktop / Wide screens) */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onSectionClick?.(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-white text-teal-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Medium screens navigation (1024px to 1279px) */}
        <nav className="hidden lg:flex xl:hidden items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onSectionClick?.(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-white text-teal-700 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: User Account & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User Account Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 sm:gap-2.5 bg-white hover:bg-slate-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition cursor-pointer"
            >
              <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center text-xs font-bold shrink-0">
                {user?.name?.[0]?.toUpperCase() || "H"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.name || "HR Leader"}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">
                  {profile?.account_type === "hr" ? "Workforce Account" : "Enterprise"}
                </p>
              </div>
              <svg className="w-3.5 h-3.5 text-slate-400 ml-0.5 sm:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "HR Leader"}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || "hr@company.com"}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Role: HR / Enterprise Operations
                  </span>
                </div>
                <div className="py-1">
                  <Link
                    href="/hr"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    Workforce Overview
                  </Link>
                  <Link
                    href="/hr/daily-brief"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    Daily HR Brief
                  </Link>
                  <Link
                    href="/hr/ai-desk"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    AI HR Desk
                  </Link>
                  <Link
                    href="/hr/workforce-insights"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    Workforce Insights
                  </Link>
                  <Link
                    href="/hr/responsible-ai"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition"
                  >
                    Responsible AI Principles
                  </Link>
                  <Link
                    href="/candidate"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-xs text-teal-700 hover:bg-teal-50 font-medium transition"
                  >
                    Candidate Experience Platform ↗
                  </Link>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer flex items-center gap-2"
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile / Tablet Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSectionClick?.(item.id);
                }}
                className={`block px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  active
                    ? "bg-teal-50 text-teal-700 border border-teal-200 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
