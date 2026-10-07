"use client";

import React, { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { CandidateHeader } from "@/components/CandidateHeader";
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

export default function CandidatePage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [demoCandidates, setDemoCandidates] = useState<DemoCandidate[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("backend-engineer");
  const [selectedRoleTitle, setSelectedRoleTitle] = useState("Backend Engineer");
  const [roleDna, setRoleDna] = useState<TargetRoleDNA | null>(null);
  const [roleGraph, setRoleGraph] = useState<RoleGraphData | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      .catch((err) => console.error("Initial load error", err));
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

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AuthGuard requiredRole="candidate">
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        <CandidateHeader activeSection={activeSection} onSectionClick={scrollToSection} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
          {/* Candidate Product Hero Banner */}
          <div id="overview" className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  Target Role: {selectedRoleTitle}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  What should I do next to become stronger for my target role?
                </h1>
                <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  CareerGPS evaluates your verifiable code and experience against calibrated Target Role DNA (15,841 jobs),
                  identifies your highest-leverage gap, and recommends the <strong className="text-slate-900">ONE next move</strong> that matters most.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Selected Target:</span>
                <select
                  value={selectedRoleId}
                  onChange={(e) => {
                    setSelectedRoleId(e.target.value);
                    const matched = roles.find((r) => r.role_id === e.target.value);
                    if (matched) setSelectedRoleTitle(matched.title);
                  }}
                  className="bg-transparent text-xs font-bold text-blue-700 focus:outline-none cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.role_id} value={r.role_id} className="bg-white text-slate-800">
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 1: Candidate Input (Intake) */}
          <div id="evidence">
            <CandidateInput
              roles={roles}
              demoCandidates={demoCandidates}
              onSubmit={handleAnalyze}
              isLoading={analyzing}
            />
          </div>

          {/* Analysis Progress */}
          {analyzing && <AnalysisProgress targetRoleTitle={selectedRoleTitle} />}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              <p className="font-bold">Analysis Error</p>
              <p className="text-xs mt-1 text-rose-700">{errorMessage}</p>
            </div>
          )}

          {/* Results Views */}
          {analysisResult && (
            <div className="space-y-10 animate-fade-in">
              {/* HERO: ONE Next Best Action */}
              <div id="next-action">
                <NextBestAction
                  action={analysisResult.next_best_action}
                  targetRole={selectedRoleTitle}
                />
              </div>

              {/* Honest Role Readiness Gauge */}
              <div id="readiness">
                <Readiness
                  readiness={analysisResult.readiness}
                />
              </div>

              {/* Ranked Skill Gaps Explorer */}
              <div id="skill-gaps">
                <SkillGaps
                  gaps={analysisResult.skill_gaps}
                  onOpenWorkSample={handleOpenWorkSampleForSkill}
                />
              </div>

              {/* Candidate Intelligence Evidence Chain */}
              <CandidateIntelligence candidate={analysisResult.candidate} />

              {/* Technical Profile View (JDS Model) */}
              {analysisResult.technical_profile && (
                <TechnicalProfileView profile={analysisResult.technical_profile} />
              )}

              {/* Work-Style Profile View (SDS Model) */}
              {analysisResult.work_style && (
                <WorkStyleProfileView workStyle={analysisResult.work_style} />
              )}
            </div>
          )}

          {/* Target Role DNA & Graph Section */}
          <div id="role-dna" className="space-y-8">
            {roleDna && <TargetRoleDNAView roleDna={roleDna} />}
            {roleGraph && <EvidenceGraphView graphData={roleGraph} />}
          </div>
        </main>

        {/* Work Sample Modal */}
        {activeWorkSample && (
          <WorkSampleModal
            sample={activeWorkSample}
            onClose={() => setActiveWorkSample(null)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
