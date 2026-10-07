from typing import List, Tuple, Dict, Optional
from careergps.models import (
    CandidateIntelligence,
    TargetRoleDNA,
    SkillGap,
    NextBestAction,
    RoleReadiness,
    EvidenceType,
    ImportanceLevel,
    TechnicalCapabilityProfile
)
from careergps.intelligence import EVIDENCE_RANK

# Action templates mapping targeted primary skill to project specs
ACTION_BLUEPRINTS = {
    "postgresql": {
        "title": "Build & Deploy a Production-Grade Data-Driven Service with PostgreSQL",
        "headline": "Engineer an end-to-end relational API featuring migrations, transactions, indexing, and automated tests.",
        "skills_addressed": ["postgresql", "sql", "rest_apis", "testing", "docker"],
        "what_to_build": [
            "Modular REST API (FastAPI or Django) with strict request validation and error handlers.",
            "Relational PostgreSQL schema with foreign keys, composite indexes, and Alembic migrations.",
            "Transactional business workflows (e.g., atomic transfers, reservation booking, or order processing).",
            "Pytest test suite covering repository queries, constraints, and mock integration tests.",
            "Docker compose file spinning up the API service alongside PostgreSQL."
        ],
        "artifacts": [
            "Public GitHub repository with meaningful atomic commit history.",
            "Architecture README with ER diagrams and indexing justification.",
            "Database migration scripts (Alembic) demonstrating schema lifecycle.",
            "Automated test suite passing in GitHub Actions CI.",
            "Live deployed API documentation (Swagger/OpenAPI)."
        ]
    },
    "python": {
        "title": "Engineer Core Backend Systems and Concurrency in Idiomatic Python",
        "headline": "Build modular server-side architecture featuring clean data structures, async execution, and unit tests.",
        "skills_addressed": ["python", "rest_apis", "testing", "git"],
        "what_to_build": [
            "Modular Python backend application using clean architectural patterns and strict type hints.",
            "Asynchronous processing pipeline with concurrent tasks and structured exception handling.",
            "Comprehensive test coverage using pytest with fixtures and parameterized edge cases."
        ],
        "artifacts": [
            "Public GitHub repository with clean Pythonic codebase and pyproject.toml configuration.",
            "Test suite with pytest achieving high branch coverage in CI."
        ]
    },
    "rest_apis": {
        "title": "Architect an Async Microservice with Production API Standards",
        "headline": "Build a robust HTTP service complete with JWT auth, rate limiting, pagination, and automated test coverage.",
        "skills_addressed": ["rest_apis", "python", "testing", "git"],
        "what_to_build": [
            "Structured API endpoints supporting cursor pagination, payload filtering, and status codes.",
            "JWT Authentication and permission middleware.",
            "Automated integration tests verifying auth boundaries and validation failures.",
            "API documentation with interactive Swagger UI and Postman export."
        ],
        "artifacts": [
            "Public GitHub repository with OpenAPI specification.",
            "End-to-end integration test suite.",
            "Deployment on a public cloud URL (Render/Fly.io/AWS)."
        ]
    },
    "testing": {
        "title": "Implement Comprehensive Integration & Regression Test Suite",
        "headline": "Add a resilient testing harness to an existing service with fixtures, mocks, and CI pipeline automation.",
        "skills_addressed": ["testing", "python", "git"],
        "what_to_build": [
            "Pytest/Jest integration tests covering critical path business logic.",
            "Database fixtures, factory fixtures, and external API mocking.",
            "GitHub Actions workflow running linting, type-checking, and test matrices on every push."
        ],
        "artifacts": [
            "GitHub Actions CI workflow badge with green build status.",
            "Code coverage report detailing >85% branch coverage on core logic.",
            "Comprehensive test files testing boundary errors and happy paths."
        ]
    },
    "pytorch": {
        "title": "Develop an End-to-End Model Inference Service & Benchmark Suite",
        "headline": "Package a trained PyTorch model into a containerized, low-latency REST inference engine.",
        "skills_addressed": ["pytorch", "model_serving", "evaluation", "docker"],
        "what_to_build": [
            "PyTorch neural model pipeline with validation metrics and checkpointing.",
            "FastAPI inference server accepting batched inputs with Pydantic validation.",
            "Latency and throughput benchmark test comparing cold vs. warm inferences.",
            "Containerized deployment using Docker."
        ],
        "artifacts": [
            "GitHub repository with model weights checkpoint download script.",
            "Benchmark report documenting latency percentiles (p50, p95, p99).",
            "Docker container recipe and test coverage for inference endpoint."
        ]
    },
    "react": {
        "title": "Build an Interactive High-Performance Web Application with Type-Safe State",
        "headline": "Develop a responsive React/TypeScript application featuring client caching, optimistic UI, and test suites.",
        "skills_addressed": ["react", "javascript_typescript", "state_management", "css_responsive"],
        "what_to_build": [
            "Strict TypeScript application using reusable modular components.",
            "Server state management via TanStack Query with optimistic mutations.",
            "Responsive layout supporting mobile and desktop viewports.",
            "Component tests using React Testing Library."
        ],
        "artifacts": [
            "Public GitHub repository with strict tsconfig configuration.",
            "Live production demo deployed on Vercel/Netlify.",
            "Component test suite passing in CI."
        ]
    },
    "machine_learning": {
        "title": "Train & Deploy an End-to-End Scikit-learn / XGBoost Prediction Pipeline with Explainability",
        "headline": "Build a reproducible ML pipeline with cross-validation, feature importance (SHAP), and an inference endpoint.",
        "skills_addressed": ["machine_learning", "python", "feature_engineering", "evaluation", "model_serving"],
        "what_to_build": [
            "Reproducible feature engineering pipeline with leakage-free train/validation splits.",
            "Model training pipeline comparing Scikit-learn baseline with XGBoost/Random Forest.",
            "Comprehensive evaluation report with ROC-AUC, PR curves, and SHAP feature importance.",
            "FastAPI microservice serving real-time model inferences."
        ],
        "artifacts": [
            "Public GitHub repository with end-to-end reproducible training script.",
            "Model card and evaluation report documenting validation metrics.",
            "FastAPI inference server with Dockerfile and sample test requests."
        ]
    },
    "data_visualization": {
        "title": "Engineer an Analytics Data Mart & Interactive Executive KPI Dashboard",
        "headline": "Design a relational reporting schema and build an interactive multi-page dashboard with drill-down filters.",
        "skills_addressed": ["data_visualization", "sql", "excel", "business_communication"],
        "what_to_build": [
            "SQL data mart transforming raw transactional records into aggregate dimensional tables.",
            "Interactive dashboard (Tableau, Power BI, or Streamlit) with KPI cards, cohort retention, and geographic maps.",
            "Executive summary deck translating dashboard findings into business revenue recommendations."
        ],
        "artifacts": [
            "Live published interactive dashboard or Streamlit cloud deployment.",
            "SQL repository containing dimensional modeling transformation scripts.",
            "Executive presentation deck or PDF decision brief."
        ]
    },
    "sql": {
        "title": "Build an End-to-End Analytical SQL Data Modeling & Reporting Mart",
        "headline": "Author complex analytical SQL queries using CTEs, window functions, and indexing strategies.",
        "skills_addressed": ["sql", "postgresql", "data_visualization"],
        "what_to_build": [
            "Relational schema modeling with indexing and constraint enforcement.",
            "Complex SQL analytics queries featuring window functions (NTILE, LAG/LEAD) and multi-level CTEs.",
            "Automated data quality assertions and query performance benchmark."
        ],
        "artifacts": [
            "Public SQL scripts repository with comprehensive query documentation.",
            "Query execution plan analysis (EXPLAIN ANALYZE) before and after indexing."
        ]
    },
    "docker": {
        "title": "Containerize & Deploy a Resilient Service with Multi-Stage Dockerfile & CI Pipeline",
        "headline": "Build an optimized, secure Docker container and deploy automated CI/CD checks.",
        "skills_addressed": ["docker", "rest_apis", "testing"],
        "what_to_build": [
            "Multi-stage Dockerfile optimizing image footprint and separating build from runtime.",
            "docker-compose configuration orchestrating service, database, and cache.",
            "GitHub Actions CI pipeline running automated linting, test suites, and container build."
        ],
        "artifacts": [
            "Production-ready Dockerfile and docker-compose.yml in public GitHub repo.",
            "Green CI workflow run badge and container security scan report."
        ]
    }
}

def generate_next_best_action(
    candidate: CandidateIntelligence,
    role_dna: TargetRoleDNA,
    gaps: List[SkillGap],
    technical_profile: Optional[TechnicalCapabilityProfile] = None
) -> NextBestAction:
    # 1. Handle Sparse / Insufficient Evidence explicitly (No fake certainty)
    # If candidate total evidence signals is zero or completely vague
    if candidate.total_evidence_signals == 0:
        return NextBestAction(
            title="Establish Baseline Evidence Portfolio",
            headline="Current resume and GitHub profile do not contain enough detected technical evidence to reliably determine highest-leverage gap.",
            primary_gap_targeted="Baseline Assessment",
            secondary_gaps_closed=[],
            leverage_score=0.0,
            what_to_build=[
                f"Detailed resume detailing specific programming projects, internships, or academic coursework related to {role_dna.title}.",
                "Public GitHub profile with active code repositories showcasing applied work.",
                "Explicit documentation of technologies, schemas, or APIs built."
            ],
            expected_evidence_artifacts=[
                "Resume with specific project bullet points (technologies used, architectural responsibilities).",
                "Public GitHub repositories containing commit history and README files."
            ],
            why_this_action="CareerGPS avoids manufacturing fake certainty: without detectable signals, picking a specialized gap would be an arbitrary guess rather than evidence-backed decision making.",
            counterfactual_comparison="Prioritizing a specific deep technical project (like PostgreSQL transactions or PyTorch inference) without knowing candidate fundamentals risks recommending the wrong prerequisite level.",
            readiness_impact_preview="Enables baseline evaluation across Target Role DNA standards.",
            is_insufficient_evidence=True
        )

    if not gaps:
        return NextBestAction(
            title="Maintain and Document Existing Portfolios",
            headline="All expected role requirements are currently met with detected evidence.",
            primary_gap_targeted="General",
            secondary_gaps_closed=[],
            leverage_score=10.0,
            what_to_build=["Open-source contribution or technical article detailing architecture."],
            expected_evidence_artifacts=["Published blog or merged PR in relevant repository."],
            why_this_action="Candidate already possesses high-tier evidence across primary competencies.",
            counterfactual_comparison="No high-deficit skills remaining.",
            readiness_impact_preview="Maintains current strong evidence tier."
        )

    # 2. Evaluate Candidate Action Candidates & Leverage
    # Match gaps against blueprints and evaluate Net Action Leverage:
    # Net Leverage = Primary Gap Score + Sum(Secondary Gap Scores * 0.45)
    gap_by_name = {g.skill_name.lower(): g for g in gaps}
    
    def _matches_skill(k_str: str, n_str: str) -> bool:
        k_clean = k_str.lower().replace("_", " ").replace("-", " ").strip()
        n_clean = n_str.lower().replace("_", " ").replace("-", " ").strip()
        return k_clean in n_clean or n_clean in k_clean

    # Check top gaps
    candidate_actions = []
    for g in gaps[:5]:
        g_key = None
        for bp_key in ACTION_BLUEPRINTS.keys():
            if _matches_skill(bp_key, g.skill_name):
                g_key = bp_key
                break
        
        if g_key and g_key in ACTION_BLUEPRINTS:
            bp = ACTION_BLUEPRINTS[g_key]
            # Check prerequisites: e.g. PostgreSQL requires basic SQL, UNLESS blueprint itself covers it
            req_item = next((r for r in role_dna.skills.values() if _matches_skill(r.skill_name, g.skill_name)), None)
            if req_item and req_item.prerequisites:
                has_prereq_deficit = any(
                    (candidate.skills.get(p) is None or candidate.skills[p].aggregated_confidence < 0.3)
                    and p not in bp["skills_addressed"]
                    for p in req_item.prerequisites
                )
                # If candidate lacks foundational prerequisite not covered by project, deprioritize
                if has_prereq_deficit:
                    continue

            # Calculate secondary gaps closed
            closed_secondary = []
            sec_leverage = 0.0
            for sec_key in bp["skills_addressed"]:
                for existing_gap in gaps:
                    if _matches_skill(sec_key, existing_gap.skill_name) and not _matches_skill(existing_gap.skill_name, g.skill_name):
                        if existing_gap.evidence_deficit > 0.25 and existing_gap.skill_name not in closed_secondary:
                            closed_secondary.append(existing_gap.skill_name)
                            sec_leverage += existing_gap.raw_priority_score * 0.45
            
            total_lev = round(g.raw_priority_score + sec_leverage, 1)
            candidate_actions.append({
                "primary_gap": g,
                "blueprint": bp,
                "secondary_closed": closed_secondary[:3],
                "total_leverage": total_lev
            })

    # If blueprints matched, pick highest total leverage action; otherwise fallback to top gap
    if candidate_actions:
        candidate_actions.sort(key=lambda x: x["total_leverage"], reverse=True)
        winner = candidate_actions[0]
        runner_up = candidate_actions[1] if len(candidate_actions) > 1 else None
        
        p_gap = winner["primary_gap"]
        bp = winner["blueprint"]
        secondary_closed = winner["secondary_closed"]
        leverage = winner["total_leverage"]
        title = bp["title"]
        headline = bp["headline"]
        what_to_build = bp["what_to_build"]
        artifacts = bp["artifacts"]
    else:
        p_gap = gaps[0]
        runner_up = None
        secondary_closed = []
        leverage = p_gap.raw_priority_score
        title = f"Design and Ship a Focused Project for {p_gap.skill_name}"
        headline = f"Deliver a portfolio project demonstrating applied implementation and real-world usage of {p_gap.skill_name}."
        what_to_build = [
            f"Core application logic implementing {p_gap.skill_name}.",
            "Automated tests validating system behavior.",
            "Clear documentation and setup instructions."
        ]
        artifacts = [
            "Public GitHub repository with atomic commit history.",
            "Detailed README with architecture overview and usage examples."
        ]

    # 3. Dynamic Evidence-Backed Counterfactual Comparison
    if runner_up:
        r_gap = runner_up["primary_gap"]
        counterfactual = (
            f"Why this action beats focusing on '{r_gap.skill_name}': "
            f"Targeting '{p_gap.skill_name}' offers a higher Net Action Leverage ({leverage} vs {runner_up['total_leverage']}). "
            f"While '{r_gap.skill_name}' has an evidence deficit of {int(r_gap.evidence_deficit * 100)}%, "
            f"this project addresses '{p_gap.skill_name}' ({int(p_gap.evidence_deficit * 100)}% deficit) and simultaneously "
            f"closes evidence gaps in {', '.join(secondary_closed) if secondary_closed else 'supporting areas'}, "
            f"yielding greater progress per unit of candidate effort."
        )
    elif len(gaps) > 1:
        alt_gap = gaps[1]
        counterfactual = (
            f"Why this action beats focusing on '{alt_gap.skill_name}': "
            f"'{p_gap.skill_name}' represents higher role importance ({p_gap.importance.value.upper()}) with an evidence deficit of {int(p_gap.evidence_deficit * 100)}% "
            f"(compared to {int(alt_gap.evidence_deficit * 100)}% for '{alt_gap.skill_name}')."
        )
    else:
        counterfactual = "This action directly targets the only remaining high-importance skill deficit."

    tech_note = ""
    if technical_profile and getattr(technical_profile, "signal", None):
        tech_note = (
            f" Contextual Note: While your Technical Capability Model indicates a {technical_profile.signal.lower()} "
            f"(confidence {int(technical_profile.model_confidence * 100)}%), strong general capability does not eliminate "
            f"the role-specific evidence requirement in {p_gap.skill_name}."
        )

    why_this = (
        f"CareerGPS detected that for {role_dna.title}, your profile has an evidence deficit of "
        f"{int(p_gap.evidence_deficit * 100)}% in {p_gap.skill_name} (Current tier: {p_gap.current_evidence_type.value if p_gap.current_evidence_type else 'Zero evidence'}). "
        f"Executing this single project produces verifiable proof that elevates {p_gap.skill_name} "
        f"and {len(secondary_closed)} complementary skill(s) into the Strong Evidence tier.{tech_note}"
    )

    readiness_impact = (
        f"Elevates '{p_gap.skill_name}' from {p_gap.current_evidence_type.value if p_gap.current_evidence_type else 'Zero evidence'} "
        f"to 'Applied Implementation / Deployed' tier. "
        f"Transfers {1 + len(secondary_closed)} skill(s) into the 'Strong Evidence' category."
    )

    return NextBestAction(
        title=title,
        headline=headline,
        primary_gap_targeted=p_gap.skill_name,
        secondary_gaps_closed=secondary_closed,
        leverage_score=leverage,
        what_to_build=what_to_build,
        expected_evidence_artifacts=artifacts,
        why_this_action=why_this,
        counterfactual_comparison=counterfactual,
        readiness_impact_preview=readiness_impact,
        is_insufficient_evidence=False
    )

def evaluate_role_readiness(
    candidate: CandidateIntelligence,
    role_dna: TargetRoleDNA,
    gaps: List[SkillGap]
) -> RoleReadiness:
    strong: List[str] = []
    needs_stronger: List[str] = []
    major_gaps: List[str] = []

    for gap in gaps:
        if gap.current_evidence_type in [EvidenceType.APPLIED_IMPL, EvidenceType.DEPLOYED] and gap.evidence_deficit <= 0.25:
            strong.append(gap.skill_name)
        elif gap.current_evidence_type in [EvidenceType.PROJECT_USAGE, EvidenceType.COURSEWORK, EvidenceType.CLAIM] or (gap.evidence_deficit < 0.60):
            needs_stronger.append(gap.skill_name)
        else:
            major_gaps.append(gap.skill_name)

    total = len(role_dna.skills)
    strong_pct = int((len(strong) / total) * 100) if total > 0 else 0
    coverage_pct = round(((len(strong) * 1.0 + len(needs_stronger) * 0.45) / max(total, 1)) * 100, 1)

    if candidate.total_evidence_signals == 0:
        coverage_pct = 0.0
        verdict = f"Insufficient demonstrable evidence to evaluate readiness for {role_dna.title}. Baseline evidence submission required."
    elif strong_pct >= 75 and not major_gaps:
        verdict = f"High readiness for {role_dna.title}. Demonstrates applied evidence across core requirements."
    elif strong_pct >= 40:
        verdict = f"Promising foundation for {role_dna.title}, but critical practical evidence gaps must be closed before interview readiness."
    else:
        verdict = f"Substantial evidence deficits for {role_dna.title}. High-leverage portfolio projects required."

    return RoleReadiness(
        role_title=role_dna.title,
        strong_evidence_skills=strong,
        needs_stronger_evidence_skills=needs_stronger,
        major_gap_skills=major_gaps,
        evidence_coverage_pct=coverage_pct,
        summary_verdict=verdict
    )
