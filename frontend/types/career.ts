export type EvidenceType = "claim" | "coursework" | "project_usage" | "applied_impl" | "deployed";

export type EvidenceSource =
  | "resume_experience"
  | "resume_project"
  | "resume_skill_list"
  | "github_repo"
  | "github_readme"
  | "github_language";

export interface EvidenceItem {
  source: EvidenceSource;
  source_title: string;
  evidence_type: EvidenceType;
  detail: string;
  url?: string | null;
  recency_months?: number | null;
  confidence: number;
}

export interface SkillEvidence {
  skill_name: string;
  category: string;
  evidence_items: EvidenceItem[];
  highest_evidence_type: EvidenceType;
  aggregated_confidence: number;
  evidence_summary: string;
}

export interface CandidateIntelligence {
  raw_name?: string | null;
  target_role: string;
  skills: Record<string, SkillEvidence>;
  education_mentions: string[];
  experience_highlights: string[];
  github_repositories_analyzed: number;
  total_evidence_signals: number;
}

export type ImportanceLevel = "critical" | "high" | "medium" | "low";

export interface ExpectedEvidence {
  description: string;
  minimum_evidence_type: EvidenceType;
  sample_artifacts: string[];
}

export interface RoleSkillRequirement {
  skill_name: string;
  category: string;
  importance: ImportanceLevel;
  weight: number;
  expected_evidence: ExpectedEvidence;
  prerequisites: string[];
  synergies: string[];
}

export interface TargetRoleDNA {
  role_id: string;
  title: string;
  description: string;
  core_competencies: string[];
  skills: Record<string, RoleSkillRequirement>;
  market_benchmarks?: {
    job_title?: string;
    market_demand?: string;
    median_salary_lakhs?: number;
    senior_salary_lakhs?: number;
    min_experience_years?: number;
    senior_experience_years?: number;
    sample_size_jobs?: number;
    source?: string;
  };
}

export interface SkillGap {
  skill_name: string;
  category: string;
  importance: ImportanceLevel;
  importance_weight: number;
  current_evidence_type?: EvidenceType | null;
  current_confidence: number;
  evidence_deficit: number;
  actionability: number;
  raw_priority_score: number;
  explanation_why_matters: string;
  explanation_current_evidence: string;
  missing_evidence_criteria: string;
}

export interface NextBestAction {
  title: string;
  headline: string;
  primary_gap_targeted: string;
  secondary_gaps_closed: string[];
  leverage_score: number;
  what_to_build: string[];
  expected_evidence_artifacts: string[];
  why_this_action: string;
  counterfactual_comparison: string;
  readiness_impact_preview: string;
  is_insufficient_evidence: boolean;
}

export interface RoleReadiness {
  role_title: string;
  strong_evidence_skills: string[];
  needs_stronger_evidence_skills: string[];
  major_gap_skills: string[];
  evidence_coverage_pct: number;
  summary_verdict: string;
}

export interface FeatureExplanation {
  feature: string;
  display_name: string;
  value: number;
  coefficient: number;
  z_score: number;
  log_odds_contribution: number;
  impact_direction: string;
  symbol: string;
}

export interface TechnicalCapabilityProfile {
  coding_skills: number;
  ai_and_ml_skills: number;
  maths_stats_skills: number;
  big_data_skills: number;
  dashboard_and_storytelling_skills: number;
  composite_skill_score: number;
  technical_core_score: number;
  signal?: string;
  model_confidence?: number;
  model_name?: string;
  model_version?: string;
  interpretation?: string;
  feature_explanations?: FeatureExplanation[];
  positive_drivers?: string[];
  growth_areas?: string[];
  ethical_disclaimer?: string;
  provenance_note?: string;
}

export interface WorkStyleProfile {
  conscientiousness: string;
  openness_to_experience: string;
  extraversion: string;
  agreeableness: string;
  neuroticism: string;
  collaboration_insights: string[];
  learning_preferences: string[];
  ethical_guardrail_notice: string;
}

export interface WorkSampleRecommendation {
  skill_name: string;
  sample_title: string;
  estimated_duration: string;
  skills_evaluated: string[];
  prompt_summary: string;
  why_recommended: string;
  tasks?: string[];
  deliverables?: string[];
  rubric?: Record<string, string>;
}

export interface AnalysisResponse {
  candidate: CandidateIntelligence;
  role_dna: TargetRoleDNA;
  skill_gaps: SkillGap[];
  next_best_action: NextBestAction;
  readiness: RoleReadiness;
  technical_profile: TechnicalCapabilityProfile;
  work_style: WorkStyleProfile;
  work_sample?: WorkSampleRecommendation | null;
}

export interface RoleInfo {
  role_id: string;
  title: string;
  description: string;
  market_benchmarks?: Record<string, any>;
}

export interface DemoCandidate {
  candidate_id: string;
  name: string;
  current_title: string;
  target_role: string;
  summary: string;
  expected_primary_gap: string;
  resume_text?: string;
  github_handle?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "role" | "category" | "skill";
  category?: string;
  importance?: string;
  weight?: number;
  evidence_status?: string;
  evidence_tier?: string;
  confidence?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
  weight?: number;
  cooccurrence_count?: number;
}

export interface RoleGraphData {
  role_id: string;
  title: string;
  total_nodes: number;
  total_edges: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  provenance: string;
}
