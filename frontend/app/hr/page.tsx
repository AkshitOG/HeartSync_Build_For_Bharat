"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { HRHeader } from "@/components/HRHeader";
import { HRDashboard } from "@/components/HRDashboard";

export default function HRPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AuthGuard requiredRole="hr">
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        <HRHeader activeSection={activeSection} onSectionClick={scrollToSection} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
          {/* HR Product Hero Banner */}
          <div id="overview" className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
                Enterprise Workforce Intelligence
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                What is happening across my workforce and what needs attention?
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                CareerGPS monitors employee workload strain, attendance anomalies, task distribution, and skill gaps across departments—grounding every insight in structured organizational logs.
              </p>
            </div>
          </div>

          {/* Full HR Intelligence Dashboard */}
          <HRDashboard />
        </main>
      </div>
    </AuthGuard>
  );
}
