"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchRoles,
  fetchRoleDna,
  fetchRoleGraph,
  fetchDemoCandidates,
  fetchWorkSample,
  analyzeCandidate,
} from "@/lib/api";
import {
  AnalysisResponse,
  RoleInfo,
  DemoCandidate,
  RoleGraphData,
  WorkSampleRecommendation,
  TargetRoleDNA,
} from "@/types/career";
import { CandidateInput } from "@/components/CandidateInput";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { NextBestAction } from "@/components/NextBestAction";
import { Readiness } from "@/components/Readiness";
import { SkillGaps } from "@/components/SkillGaps";
import { CandidateIntelligence } from "@/components/CandidateIntelligence";
import { TargetRoleDNAView } from "@/components/TargetRoleDNAView";
import { EvidenceGraphView } from "@/components/EvidenceGraphView";
import { TechnicalProfileView } from "@/components/TechnicalProfileView";
import { WorkStyleProfileView } from "@/components/WorkStyleProfileView";
import { WorkSampleModal } from "@/components/WorkSampleModal";
import { HRDashboard } from "@/components/HRDashboard";

type DemoTab = "candidate" | "hr";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<DemoTab>("candidate");
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [demoCandidates, setDemoCandidates] = useState<DemoCandidate[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("backend-engineer");
  const [roleDna, setRoleDna] = useState<TargetRoleDNA | null>(null);
  const [roleGraph, setRoleGraph] = useState<RoleGraphData | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRoleTitle, setSelectedRoleTitle] = useState("Backend Engineer");
  const [activeWorkSample, setActiveWorkSample] = useState<WorkSampleRecommendation | null>(null);

  useEffect(() => {
    Promise.all([fetchRoles(), fetchDemoCandidates()])
      .then(([rolesData, demoData]) => {
        setRoles(rolesData);
        setDemoCandidates(demoData);
        if (rolesData.length > 0) {
          setSelectedRoleId(rolesData[0].role_id);
          setSelectedRoleTitle(rolesData[0].title);
        }
      })
      .catch((err) => console.error("Demo load error", err));
  }, []);

  useEffect(() => {
    if (!selectedRoleId) return;
    Promise.all([
      fetchRoleDna(selectedRoleId).catch(() => null),
      fetchRoleGraph(selectedRoleId).catch(() => null),
    ]).then(([dna, graph]) => {
      if (dna) setRoleDna(dna);
      if (graph) setRoleGraph(graph);
    });
  }, [selectedRoleId]);

  const handleAnalyze = async (formData: FormData) => {
    setAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);

    const targetRoleId = formData.get("target_role") as string;
    setSelectedRoleId(targetRoleId);
    const matchedRole = roles.find((r) => r.role_id === targetRoleId);
    if (matchedRole) setSelectedRoleTitle(matchedRole.title);

    try {
      const result = await analyzeCandidate(formData);
      setAnalysisResult(result);
      if (result.role_dna) setRoleDna(result.role_dna);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during candidate analysis.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOpenWorkSampleForSkill = async (skillName: string) => {
    try {
      const ws = await fetchWorkSample(skillName);
      setActiveWorkSample(ws);
    } catch {
      setActiveWorkSample({
        skill_name: skillName,
        sample_title: `45-Minute ${skillName} Applied Work-Sample`,
        estimated_duration: "45 minutes",
        skills_evaluated: [skillName],
        prompt_summary: `Author a runnable implementation demonstrating applied mastery of ${skillName}.`,
        why_recommended: `High evidence deficit detected for ${skillName}. Submitting this work sample converts unverified claims into applied evidence.`,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Prominent Demo Notice Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-xs text-amber-800 font-medium flex items-center justify-center gap-3">
        <span className="font-bold uppercase tracking-wider bg-amber-100 border border-amber-300/80 px-2 py-0.5 rounded-full text-[10px] text-amber-900">
          Demo Sandbox
        </span>
        <span>
          You are viewing unauthenticated preview mode. Candidate inputs and actions are ephemeral.
        </span>
        <Link
          href="/login"
          className="font-bold underline text-amber-900 hover:text-amber-950 transition ml-1"
        >
          Sign In with Google to Save Progress →
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex items-center justify-between flex-wrap gap-4 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <Link href="/" className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold text-white text-sm shadow-sm shadow-blue-500/20">
            GPS
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">CareerGPS</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                Demo Sandbox
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Interactive Evaluation Sandbox</p>
          </div>
        </div>

        {/* Demo Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("candidate")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "candidate"
                ? "bg-white text-blue-700 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🎯</span>
            <span>Candidate Preview</span>
          </button>
          <button
            onClick={() => setActiveTab("hr")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "hr"
                ? "bg-white text-teal-700 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🏢</span>
            <span>HR Preview</span>
          </button>
        </div>

        <Link
          href="/login"
          className="text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl transition shadow-xs"
        >
          Sign In →
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {activeTab === "candidate" ? (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5 tracking-tight">
                Candidate CareerGPS Sandbox
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Test with real demo profiles (Alex Sharma or Priya Patel) to see how candidate code produces deterministic actions.
              </p>
            </div>

            <CandidateInput
              roles={roles}
              demoCandidates={demoCandidates}
              onSubmit={handleAnalyze}
              isLoading={analyzing}
            />

            {analyzing && <AnalysisProgress targetRoleTitle={selectedRoleTitle} />}

            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                <p className="font-bold">Error</p>
                <p className="text-xs mt-1">{errorMessage}</p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-8 animate-fade-in">
                <NextBestAction
                  action={analysisResult.next_best_action}
                  targetRole={selectedRoleTitle}
                />

                <Readiness
                  readiness={analysisResult.readiness}
                />

                <SkillGaps
                  gaps={analysisResult.skill_gaps}
                  onOpenWorkSample={handleOpenWorkSampleForSkill}
                />

                <CandidateIntelligence candidate={analysisResult.candidate} />

                {analysisResult.technical_profile && (
                  <TechnicalProfileView profile={analysisResult.technical_profile} />
                )}

                {analysisResult.work_style && (
                  <WorkStyleProfileView workStyle={analysisResult.work_style} />
                )}
              </div>
            )}

            <div className="space-y-8">
              {roleDna && <TargetRoleDNAView roleDna={roleDna} />}
              {roleGraph && <EvidenceGraphView graphData={roleGraph} />}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5 tracking-tight">
                HR Intelligence Sandbox
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Live workforce strain metrics, AI HR Desk queries, and daily executive brief simulation.
              </p>
            </div>

            <HRDashboard />
          </div>
        )}
      </main>

      {activeWorkSample && (
        <WorkSampleModal
          sample={activeWorkSample}
          onClose={() => setActiveWorkSample(null)}
        />
      )}

      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
        CareerGPS Demo Sandbox •{" "}
        <Link href="/responsible-ai" className="hover:text-slate-900 transition underline underline-offset-2">
          Responsible AI Guidelines
        </Link>
      </footer>
    </div>
  );
}
