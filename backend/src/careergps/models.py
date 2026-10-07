from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class EvidenceType(str, Enum):
    CLAIM = "claim"                    # Explicit text mention or bullet
    COURSEWORK = "coursework"          # Education, certificates, tutorials
    PROJECT_USAGE = "project_usage"    # Repository/Project using tech
    APPLIED_IMPL = "applied_impl"      # Non-trivial code, schemas, architecture
    DEPLOYED = "deployed"              # Production, live demo, CI/CD, releases

class EvidenceSource(str, Enum):
    RESUME_EXP = "resume_experience"
    RESUME_PROJECT = "resume_project"
    RESUME_SKILL_LIST = "resume_skill_list"
    GITHUB_REPO = "github_repo"
    GITHUB_README = "github_readme"
    GITHUB_LANGUAGE = "github_language"

class EvidenceItem(BaseModel):
    source: EvidenceSource
    source_title: str
    evidence_type: EvidenceType
    detail: str
    url: Optional[str] = None
    recency_months: Optional[int] = None
    confidence: float = Field(ge=0.0, le=1.0, description="Certainty that this evidence exists, NOT proficiency")

class SkillEvidence(BaseModel):
    skill_name: str
    category: str
    evidence_items: List[EvidenceItem] = []
    highest_evidence_type: EvidenceType = EvidenceType.CLAIM
    aggregated_confidence: float = Field(ge=0.0, le=1.0)
    evidence_summary: str
    current_level: str = "Beginner"                     # Beginner, Intermediate, Advanced
    evidence_strength: str = "SELF-REPORTED"           # STRONG (backed by projects) vs SELF-REPORTED
    verified_projects: List[str] = []

class CandidateIntelligence(BaseModel):
    raw_name: Optional[str] = None
    target_role: str
    skills: Dict[str, SkillEvidence] = {}
    education_mentions: List[str] = []
    experience_highlights: List[str] = []
    github_repositories_analyzed: int = 0
    total_evidence_signals: int = 0

class ImportanceLevel(str, Enum):
    CRITICAL = "critical"      # Weight 1.0
    HIGH = "high"              # Weight 0.8
    MEDIUM = "medium"          # Weight 0.5
    NICE_TO_HAVE = "low"       # Weight 0.2

class ExpectedEvidence(BaseModel):
    description: str
    minimum_evidence_type: EvidenceType
    sample_artifacts: List[str]

class RoleSkillRequirement(BaseModel):
    skill_name: str
    category: str
    importance: ImportanceLevel
    weight: float
    expected_evidence: ExpectedEvidence
    prerequisites: List[str] = []
    synergies: List[str] = []

class TargetRoleDNA(BaseModel):
    role_id: str
    title: str
    description: str
    core_competencies: List[str]
    skills: Dict[str, RoleSkillRequirement]
    market_benchmarks: Optional[Dict[str, Any]] = None
    skill_adjacencies: Optional[List[Dict[str, Any]]] = None

class SkillGap(BaseModel):
    skill_name: str
    category: str
    importance: ImportanceLevel
    importance_weight: float
    current_evidence_type: Optional[EvidenceType] = None
    current_confidence: float
    evidence_deficit: float     # 0.0 to 1.0 gap in evidence quality
    actionability: float        # How practical it is to close via a direct project
    raw_priority_score: float   # importance_weight * evidence_deficit * actionability
    explanation_why_matters: str
    explanation_current_evidence: str
    missing_evidence_criteria: str
    current_level: str = "Beginner"         # Beginner, Intermediate, Advanced
    required_level: str = "Advanced"        # Beginner, Intermediate, Advanced
    gap_level: str = "Moderate"             # None, Partial Gap / Moderate, High
    reason: Optional[str] = None
    what_is_missing: Optional[str] = None
    project_evidence: List[str] = []

class NextBestAction(BaseModel):
    title: str
    headline: str
    primary_gap_targeted: str
    secondary_gaps_closed: List[str]
    leverage_score: float
    what_to_build: List[str]
    expected_evidence_artifacts: List[str]
    why_this_action: str
    counterfactual_comparison: str
    readiness_impact_preview: str
    is_insufficient_evidence: bool = False

class RoleReadiness(BaseModel):
    role_title: str
    strong_evidence_skills: List[str]
    needs_stronger_evidence_skills: List[str]
    major_gap_skills: List[str]
    evidence_coverage_pct: float = 0.0
    summary_verdict: str

class TechnicalCapabilityProfile(BaseModel):
    coding_skills: float = 4.2
    ai_and_ml_skills: float = 3.8
    maths_stats_skills: float = 3.5
    big_data_skills: float = 3.1
    dashboard_and_storytelling_skills: float = 3.2
    composite_skill_score: float = 3.6
    technical_core_score: float = 3.8
    signal: str = "Strong Technical Foundation"
    model_confidence: float = 0.85
    model_name: str = "technical_capability_logistic_regression"
    model_version: str = "1.0.0"
    interpretation: str = "The candidate's technical capability profile demonstrates strong alignment with higher-tier engineering benchmarks (Logistic Regression model confidence: 85.3%)."
    feature_explanations: List[Dict[str, Any]] = []
    positive_drivers: List[str] = []
    growth_areas: List[str] = []
    ethical_disclaimer: str = "Technical capability signal is an exploratory evaluation of 5 skill dimensions (Dataset 3). It reflects demonstrated technical artifacts and is strictly NOT a hiring probability or automated employment decision."
    provenance_note: str = "Measured on standard 1-5 technical capability scale; evaluated via canonical Logistic Regression model."

class TechnicalCapabilityRequest(BaseModel):
    big_data_skills: float = Field(..., ge=0.0, le=5.0, description="Score on 0.0-5.0 scale")
    maths_stats_skills: float = Field(..., ge=0.0, le=5.0, description="Score on 0.0-5.0 scale")
    coding_skills: float = Field(..., ge=0.0, le=5.0, description="Score on 0.0-5.0 scale")
    ai_and_ml_skills: float = Field(..., ge=0.0, le=5.0, description="Score on 0.0-5.0 scale")
    dashboard_and_storytelling_skills: float = Field(..., ge=0.0, le=5.0, description="Score on 0.0-5.0 scale")

class TechnicalCapabilityResponse(BaseModel):
    signal: str
    confidence: float
    probability_high_capability: float
    probability_low_capability: float
    model: str = "technical_capability_logistic_regression"
    model_version: str = "1.0.0"
    features_evaluated: Dict[str, float]
    explanations: List[Dict[str, Any]]
    positive_drivers: List[str]
    growth_areas: List[str]
    interpretation: str
    disclaimer: str

class WorkStyleProfile(BaseModel):
    conscientiousness: str = "High (Disciplined & Reliable Execution)"
    openness_to_experience: str = "High (Curious, Explores New Toolchains)"
    extraversion: str = "Balanced (Effective Cross-functional Communicator)"
    agreeableness: str = "High (Collaborative & Constructive Peer Reviewer)"
    neuroticism: str = "Resilient (Maintains Stability Under Production Incidents)"
    collaboration_insights: List[str] = [
        "Excels in autonomous deep work blocks paired with clear async ticket specs.",
        "Benefits from pairing with senior system architects during early interface design.",
        "Highly receptive to metric-driven constructive code reviews."
    ]
    learning_preferences: List[str] = [
        "Prefers hands-on architecture implementation over passive video tutorials.",
        "Fastest ramp-up occurs when provided reference production schemas."
    ]
    ethical_guardrail_notice: str = "Work-style insights are strictly advisory for personal development & team collaboration. NEVER used for automated candidate filtering or hiring decisions."

class WorkSampleRecommendation(BaseModel):
    skill_name: str
    sample_title: str
    estimated_duration: str
    skills_evaluated: List[str]
    prompt_summary: str
    why_recommended: str
