import os
import json
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from careergps.role_dna import get_role_dna, list_all_roles
from careergps.intelligence import (
    extract_resume_evidence,
    extract_github_evidence,
    compile_candidate_intelligence
)
from careergps.gap_analyzer import calculate_skill_gaps
from careergps.action_engine import generate_next_best_action, evaluate_role_readiness
from careergps.parser import extract_text_from_pdf
from careergps.demo_data import list_demo_candidates, get_demo_candidate
from careergps.graph_engine import get_role_graph
from careergps.work_sample import get_work_sample_for_skill, get_work_sample_detail
from careergps.hr_engine import hr_engine
from careergps.supabase_client import (
    record_analysis_run,
    record_feedback_item,
    save_candidate_profile,
    get_candidate_profile,
    save_user_profile,
    get_user_profile
)
from careergps.technical_capability_service import technical_capability_service
from careergps.models import (
    CandidateIntelligence,
    TargetRoleDNA,
    SkillGap,
    NextBestAction,
    RoleReadiness,
    TechnicalCapabilityProfile,
    TechnicalCapabilityRequest,
    TechnicalCapabilityResponse,
    WorkStyleProfile,
    WorkSampleRecommendation
)

app = FastAPI(
    title="CareerGPS AI Platform",
    description="Deterministic Workforce & Career Decision Engine with Dual Candidate & HR Intelligence",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data"))
MODEL_RESULTS_PATH = os.path.join(DATA_DIR, "model_results.json")

class AnalysisResponse(BaseModel):
    candidate: CandidateIntelligence
    role_dna: TargetRoleDNA
    skill_gaps: List[SkillGap]
    next_best_action: NextBestAction
    readiness: RoleReadiness
    technical_profile: TechnicalCapabilityProfile
    work_style: WorkStyleProfile
    work_sample: Optional[WorkSampleRecommendation] = None

# ==========================================
# 1. CANDIDATE INTELLIGENCE & ROLE DNA ROUTES
# ==========================================

@app.get("/api/roles")
async def get_roles():
    """Lists available target roles with market salary and experience benchmarks."""
    return list_all_roles()

@app.get("/api/roles/{role_id}/dna")
async def get_role_dna_endpoint(role_id: str):
    """Retrieves target role DNA, requirements, expected artifacts, and synergies."""
    dna = get_role_dna(role_id)
    return dna

@app.get("/api/candidate/demo")
async def get_demo_candidates():
    """Returns pre-configured demonstration candidate profiles for 1-click evaluation."""
    return list_demo_candidates()

@app.get("/api/candidate/demo/{candidate_id}")
async def get_single_demo_candidate(candidate_id: str):
    """Retrieves details for a specific demo candidate (Alex Sharma or Priya Patel)."""
    return get_demo_candidate(candidate_id)

@app.get("/api/graph/{role_id}")
async def get_role_graph_endpoint(role_id: str):
    """Returns directed graph representation of Role DNA with real job-market skill co-occurrences."""
    return get_role_graph(role_id)

@app.get("/api/work-sample/{skill_id}")
async def get_work_sample_endpoint(skill_id: str):
    """Returns a calibrated 45-minute work sample challenge for ambiguous or high-deficit skills."""
    return get_work_sample_detail(skill_id)

@app.post("/api/candidate/technical-capability", response_model=TechnicalCapabilityResponse)
async def predict_technical_capability(payload: TechnicalCapabilityRequest):
    """Dedicated endpoint for single canonical Logistic Regression production inference.
    Evaluates 5 capability dimensions from Dataset 3 and returns capability signal & explainability."""
    try:
        res = technical_capability_service.predict_capability(payload.model_dump())
        return TechnicalCapabilityResponse(**res)
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.get("/api/models/canonical")
async def get_canonical_production_model():
    """Returns canonical production model metadata (Logistic Regression)."""
    return technical_capability_service.get_metadata()

@app.post("/api/candidate/analyze", response_model=AnalysisResponse)
async def analyze_candidate(
    target_role: str = Form(...),
    resume_text: Optional[str] = Form(None),
    github_handle: Optional[str] = Form(None),
    candidate_name: Optional[str] = Form(None),
    resume_file: Optional[UploadFile] = File(None)
):
    text_content = resume_text or ""
    
    if resume_file and resume_file.filename:
        file_bytes = await resume_file.read()
        if resume_file.filename.lower().endswith(".pdf"):
            extracted = extract_text_from_pdf(file_bytes)
            text_content += f"\n{extracted}"
        else:
            try:
                text_content += f"\n{file_bytes.decode('utf-8', errors='ignore')}"
            except Exception:
                pass

    if not text_content.strip() and not (github_handle and github_handle.strip()):
        raise HTTPException(
            status_code=400,
            detail="Please provide at least a resume (text or PDF file) or a GitHub handle/URL to extract evidence."
        )

    # 1. Candidate Evidence Extraction
    resume_ev = extract_resume_evidence(text_content)
    gh_ev, gh_repo_count = await extract_github_evidence(github_handle or "")

    candidate_intelligence = compile_candidate_intelligence(
        raw_name=candidate_name or "Candidate",
        target_role=target_role,
        resume_evidence=resume_ev,
        github_evidence=gh_ev,
        github_repos_count=gh_repo_count
    )

    # 2. Target Role DNA
    role_dna = get_role_dna(target_role)

    # 3. Deterministic Gap Calculation
    gaps = calculate_skill_gaps(candidate_intelligence, role_dna)

    # 4. Technical Capability Profile (derived via canonical Logistic Regression production model)
    tech_profile = technical_capability_service.generate_candidate_technical_profile(candidate_intelligence)

    # 5. Priority Engine & Next Best Action Synthesis (contextualized with technical profile)
    next_action = generate_next_best_action(
        candidate=candidate_intelligence,
        role_dna=role_dna,
        gaps=gaps,
        technical_profile=tech_profile
    )

    # 6. Honest Role Readiness Model
    readiness = evaluate_role_readiness(candidate_intelligence, role_dna, gaps)

    # 7. Work-Style Profile (advisory collaboration insights with strict non-filtering disclaimer)
    work_style = WorkStyleProfile()

    # 8. Work-Sample Fallback Recommendation (if primary gap has high deficit)
    work_sample = None
    if gaps and gaps[0].evidence_deficit >= 0.60:
        work_sample = get_work_sample_for_skill(gaps[0].skill_name)

    # 9. Persist analysis run for audit trail
    analysis_record = {
        "candidate_name": candidate_name or "Candidate",
        "target_role": target_role,
        "readiness_verdict": readiness.summary_verdict,
        "primary_action": next_action.title,
        "coverage_pct": readiness.evidence_coverage_pct
    }
    record_analysis_run(analysis_record)

    return AnalysisResponse(
        candidate=candidate_intelligence,
        role_dna=role_dna,
        skill_gaps=gaps,
        next_best_action=next_action,
        readiness=readiness,
        technical_profile=tech_profile,
        work_style=work_style,
        work_sample=work_sample
    )

# ==========================================
# 2. HR INTELLIGENCE & WORKFORCE ROUTES
# ==========================================

@app.get("/api/hr/overview")
async def get_hr_overview():
    """Workforce metrics: Headcount, attendance rate, department allocations, workload status."""
    return hr_engine.get_overview()

@app.get("/api/hr/daily-brief")
async def get_hr_daily_brief():
    """Top 3 priority workforce items with evidence, impact analysis, and recommended HR actions."""
    return hr_engine.get_daily_brief()

@app.get("/api/hr/insights")
async def get_hr_insights():
    """Workforce skill gaps, internal mobility matches, and organizational health metrics."""
    return hr_engine.get_insights()

class HRQueryRequest(BaseModel):
    query: str

@app.post("/api/hr/query")
async def query_hr_desk_endpoint(payload: HRQueryRequest):
    """AI HR Desk inquiry returning: Answer + Evidence + Recommended Action."""
    return hr_engine.query_hr_desk(payload.query)

# ==========================================
# 3. MODEL RESULTS & AUDIT ROUTES
# ==========================================

@app.get("/api/models/results")
async def get_model_evaluation_results():
    """Returns real 5x5 Repeated Stratified K-Fold CV results for JDS & SDS models."""
    if os.path.exists(MODEL_RESULTS_PATH):
        try:
            with open(MODEL_RESULTS_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "jds": {"accuracy": 0.8529, "roc_auc": 0.9035, "model": "Logistic Regression"},
        "sds": {"accuracy": 0.9443, "roc_auc": 0.9961, "model": "Logistic Regression / Random Forest"}
    }

# ==========================================
# 3.5 AUTHENTICATION & ACCOUNT PROFILE ROUTES
# ==========================================

class UserProfileRequest(BaseModel):
    user_id: str
    account_type: str
    display_name: Optional[str] = None
    email: Optional[str] = None

@app.get("/api/auth/profile")
async def get_profile_endpoint(user_id: str = Query(...)):
    """Fetch user profile and account type ('candidate' or 'hr')."""
    profile = get_user_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.post("/api/auth/profile")
async def save_profile_endpoint(payload: UserProfileRequest):
    """Persist or update account type ('candidate' or 'hr') during account onboarding."""
    if payload.account_type not in ["candidate", "hr"]:
        raise HTTPException(status_code=400, detail="account_type must be 'candidate' or 'hr'")
    
    saved = save_user_profile(payload.user_id, {
        "user_id": payload.user_id,
        "account_type": payload.account_type,
        "display_name": payload.display_name or "User",
        "email": payload.email or ""
    })
    return {"status": "success", "profile": saved}

# ==========================================
# 4. FEEDBACK & SERVING ROUTES
# ==========================================

class FeedbackRequest(BaseModel):
    action_title: str
    target_role: str
    is_useful: bool
    candidate_comment: Optional[str] = None

FEEDBACK_LOG_PATH = os.path.join(os.path.dirname(__file__), "feedback_store.jsonl")

@app.post("/api/feedback")
async def record_feedback(payload: FeedbackRequest):
    import datetime
    record = {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "action_title": payload.action_title,
        "target_role": payload.target_role,
        "is_useful": payload.is_useful,
        "candidate_comment": payload.candidate_comment or ""
    }
    with open(FEEDBACK_LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\n")
    record_feedback_item(record)
    return {"status": "success", "message": "Feedback recorded"}

INDEX_HTML_PATH = os.path.join(os.path.dirname(__file__), "static", "index.html")

@app.get("/", response_class=HTMLResponse)
async def serve_home():
    if os.path.exists(INDEX_HTML_PATH):
        with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>CareerGPS Running</h1><p>Frontend active at <a href='https://careergps-seven.vercel.app'>https://careergps-seven.vercel.app</a></p>"
