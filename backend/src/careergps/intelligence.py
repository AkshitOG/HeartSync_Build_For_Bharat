import re
from typing import Dict, List, Optional
import httpx
from careergps.models import (
    CandidateIntelligence,
    SkillEvidence,
    EvidenceItem,
    EvidenceSource,
    EvidenceType
)

SKILL_PATTERNS = {
    "python": [r"\bpython\b", r"\bfastapi\b", r"\bdjango\b", r"\bflask\b", r"\bpandas\b", r"\bnumpy\b"],
    "rest_apis": [r"\brest\s*api[s]?\b", r"\brestful\b", r"\bapi\s*endpoints?\b", r"\bgraphql\b", r"\bswagger\b", r"\bopenapi\b"],
    "postgresql": [r"\bpostgres\b", r"\bpostgresql\b", r"\bpsql\b", r"\balembic\b"],
    "sql": [r"\bsql\b", r"\bsqlite\b", r"\bmysql\b", r"\brelational\s*database\b"],
    "testing": [r"\bpytest\b", r"\bunit\s*test[s]?\b", r"\btest\s*suite\b", r"\bjdm\b", r"\bmock\b", r"\bcoverage\b", r"\bvitest\b"],
    "docker": [r"\bdocker\b", r"\bcontainer[s]?\b", r"\bdockerfile\b", r"\bdocker-compose\b"],
    "git": [r"\bgit\b", r"\bgithub\b", r"\bversion\s*control\b"],
    "system_design": [r"\bsystem\s*design\b", r"\barchitecture\b", r"\bscalab(le|ility)\b", r"\bcaching\b", r"\bredis\b"],
    "pytorch": [r"\bpytorch\b", r"\btorch\b", r"\btensorflow\b", r"\bkeras\b", r"\bdeep\s*learning\b"],
    "feature_engineering": [r"\bfeature\s*prep\b", r"\bdata\s*pipeline[s]?\b", r"\bdata\s*cleaning\b", r"\bpolars\b"],
    "model_serving": [r"\bmodel\s*serving\b", r"\binference\s*api\b", r"\bonnx\b", r"\btorchscript\b", r"\btriton\b"],
    "evaluation": [r"\bevaluation\b", r"\bf1-score\b", r"\broc-auc\b", r"\bconfusion\s*matrix\b", r"\bmetrics\b"],
    "javascript_typescript": [r"\btypescript\b", r"\bjavascript\b", r"\bts\b", r"\bjs\b", r"\bes6\b", r"\bnode(\.js)?\b"],
    "react": [r"\breact(\.js)?\b", r"\bnext(\.js)?\b", r"\bhooks\b", r"\bjsx\b", r"\btsx\b"],
    "state_management": [r"\bzustand\b", r"\bredux\b", r"\btanstack\s*query\b", r"\bcontext\s*api\b"],
    "css_responsive": [r"\btailwind\b", r"\bcss\b", r"\bresponsive\b", r"\bsass\b", r"\bflexbox\b", r"\bgrid\b"],
    "machine_learning": [r"\bmachine\s*learning\b", r"\bscikit-learn\b", r"\bsklearn\b", r"\bxgboost\b", r"\brandom\s*forest\b", r"\bclassification\b", r"\bsupervised\b"],
    "statistics": [r"\bstatistic[s]?\b", r"\bhypothesis\s*test\b", r"\ba/b\s*test\b", r"\bregression\b", r"\bprobability\b", r"\bmultivariate\b"],
    "data_visualization": [r"\btableau\b", r"\bpower\s*bi\b", r"\bmatplotlib\b", r"\bseaborn\b", r"\bdashboard[s]?\b", r"\bvisualization\b"],
    "excel": [r"\bexcel\b", r"\bspreadsheet[s]?\b", r"\bpivot\s*table[s]?\b", r"\bvlookup\b"],
    "business_communication": [r"\bstakeholder[s]?\b", r"\bexecutive\s*brief\b", r"\bpresentation\b", r"\bdata\s*storytelling\b"]
}

SKILL_CATEGORIES = {
    "python": "Programming",
    "rest_apis": "Backend Architecture",
    "postgresql": "Databases",
    "sql": "Databases",
    "testing": "Engineering Discipline",
    "docker": "Deployment & Infrastructure",
    "git": "Engineering Discipline",
    "system_design": "Architecture",
    "pytorch": "Modeling",
    "feature_engineering": "Data Engineering",
    "model_serving": "Engineering & Deployment",
    "evaluation": "Modeling",
    "javascript_typescript": "Programming",
    "react": "Frontend Architecture",
    "state_management": "Architecture",
    "css_responsive": "UI/UX Discipline",
    "machine_learning": "Machine Learning",
    "statistics": "Mathematical Foundations",
    "data_visualization": "Business Intelligence & Reporting",
    "excel": "Business Analytics Tools",
    "business_communication": "Storytelling & Collaboration"
}

SKILL_DISPLAY_NAMES = {
    "python": "Python",
    "rest_apis": "REST APIs",
    "postgresql": "PostgreSQL",
    "sql": "SQL Fundamentals",
    "testing": "Automated Testing",
    "docker": "Docker",
    "git": "Git",
    "system_design": "System Design Fundamentals",
    "pytorch": "PyTorch / Deep Learning",
    "feature_engineering": "Data Pipelines & Feature Prep",
    "model_serving": "Model Serving & Inference APIs",
    "evaluation": "Model Evaluation & Metrics",
    "javascript_typescript": "TypeScript / JavaScript",
    "react": "React / Modern Frameworks",
    "state_management": "Client State & Data Fetching",
    "css_responsive": "Responsive CSS & Design Systems",
    "machine_learning": "Machine Learning Algorithms",
    "statistics": "Statistical Analysis & Experimentation",
    "data_visualization": "Data Visualization & Dashboards",
    "excel": "Advanced Excel & Modeling",
    "business_communication": "Stakeholder Storytelling & Presentation"
}

def determine_evidence_type_from_context(text: str) -> EvidenceType:
    lower = text.lower()
    # 1. First check for explicit coursework / tutorial indicators (prevent false promotion to project usage)
    if any(k in lower for k in ["course", "certification", "tutorial", "learned", "studied", "bootcamp", "udemy", "coursera", "class"]):
        return EvidenceType.COURSEWORK
    
    # 2. Check for live deployment / production indicators
    if any(k in lower for k in ["deployed", "production", "live url", "ci/cd", "docker-compose", "aws", "gcp", "vercel", "kubernetes", "render.com"]):
        return EvidenceType.DEPLOYED
    
    # 3. Check for applied architecture / deep implementation
    if any(k in lower for k in ["implemented", "architected", "relational schema", "migrations", "indexes", "transactions", "endpoints", "test suite", "optimistic updates"]):
        return EvidenceType.APPLIED_IMPL
    
    # 4. Check for project usage
    if any(k in lower for k in ["built", "designed", "created", "project", "repository", "worked with", "integrated", "developed"]):
        return EvidenceType.PROJECT_USAGE

    # 5. Fallback to simple claim
    return EvidenceType.CLAIM

def extract_resume_evidence(resume_text: str) -> Dict[str, List[EvidenceItem]]:
    detected: Dict[str, List[EvidenceItem]] = {}
    lines = resume_text.splitlines()
    
    current_section = "general"
    for line in lines:
        cleaned = line.strip()
        if not cleaned:
            continue
        
        lower_line = cleaned.lower()
        if any(h in lower_line for h in ["experience", "work history", "employment", "professional background"]):
            current_section = "experience"
            continue
        elif any(h in lower_line for h in ["project", "portfolio", "personal projects", "open source"]):
            current_section = "project"
            continue
        elif any(h in lower_line for h in ["education", "academic", "coursework", "certifications"]):
            current_section = "education"
            continue
        elif any(h in lower_line for h in ["skills", "technologies", "technical proficiencies", "languages"]):
            current_section = "skills"
            continue

        for skill_key, patterns in SKILL_PATTERNS.items():
            for pat in patterns:
                if re.search(pat, lower_line):
                    ev_type = determine_evidence_type_from_context(cleaned)
                    
                    if current_section == "experience":
                        src = EvidenceSource.RESUME_EXP
                        if ev_type in (EvidenceType.APPLIED_IMPL, EvidenceType.DEPLOYED):
                            conf = 0.85
                        elif ev_type == EvidenceType.PROJECT_USAGE:
                            conf = 0.72
                        elif ev_type == EvidenceType.COURSEWORK:
                            conf = 0.55
                        else:
                            conf = 0.50
                    elif current_section == "project":
                        src = EvidenceSource.RESUME_PROJECT
                        if ev_type in (EvidenceType.APPLIED_IMPL, EvidenceType.DEPLOYED):
                            conf = 0.80
                        elif ev_type == EvidenceType.PROJECT_USAGE:
                            conf = 0.68
                        elif ev_type == EvidenceType.COURSEWORK:
                            conf = 0.55
                        else:
                            conf = 0.45
                    elif current_section == "education":
                        src = EvidenceSource.RESUME_PROJECT
                        ev_type = EvidenceType.COURSEWORK
                        conf = 0.50
                    elif current_section == "skills":
                        src = EvidenceSource.RESUME_SKILL_LIST
                        ev_type = EvidenceType.CLAIM
                        conf = 0.35  # Mere bullet point claim has conservative confidence
                    else:
                        src = EvidenceSource.RESUME_PROJECT
                        conf = 0.45

                    item = EvidenceItem(
                        source=src,
                        source_title=f"Resume: {current_section.capitalize()} Section",
                        evidence_type=ev_type,
                        detail=cleaned[:240],
                        confidence=conf
                    )
                    detected.setdefault(skill_key, []).append(item)
                    break
    return detected

MOCK_DEMO_REPOS = {
    "alexsharma-dev": [
        {
            "name": "fastapi-microservices-hub",
            "description": "Asynchronous microservices hub using FastAPI, Python, Redis caching, and JWT authentication.",
            "language": "Python",
            "topics": ["fastapi", "python", "redis", "asyncio", "rest-api"],
            "html_url": "https://github.com/alexsharma-dev/fastapi-microservices-hub"
        },
        {
            "name": "distributed-task-worker",
            "description": "Background task queue worker in Python using Celery and Docker containers with pytest test suites.",
            "language": "Python",
            "topics": ["python", "celery", "docker", "pytest"],
            "html_url": "https://github.com/alexsharma-dev/distributed-task-worker"
        },
        {
            "name": "devops-compose-recipes",
            "description": "Docker Compose templates and CI configurations for Python and TypeScript web applications.",
            "language": "Dockerfile",
            "topics": ["docker", "devops", "ci-cd"],
            "html_url": "https://github.com/alexsharma-dev/devops-compose-recipes"
        }
    ],
    "priyapatel-data": [
        {
            "name": "customer-churn-analytics",
            "description": "Customer lifetime value and churn exploratory analysis with SQL queries, Pandas, and interactive Tableau dashboards.",
            "language": "Python",
            "topics": ["sql", "pandas", "tableau", "analytics", "eda"],
            "html_url": "https://github.com/priyapatel-data/customer-churn-analytics"
        },
        {
            "name": "ab-testing-statistical-toolkit",
            "description": "Hypothesis testing, sample size calculation, and conversion rate statistical significance evaluation in Python.",
            "language": "Python",
            "topics": ["statistics", "ab-testing", "hypothesis-testing", "python"],
            "html_url": "https://github.com/priyapatel-data/ab-testing-statistical-toolkit"
        }
    ]
}

async def extract_github_evidence(github_username_or_url: str) -> tuple[Dict[str, List[EvidenceItem]], int]:
    cleaned = github_username_or_url.strip()
    detected: Dict[str, List[EvidenceItem]] = {}
    repos_analyzed = 0
    if not cleaned:
        return detected, repos_analyzed

    username = cleaned.split("/")[-1].replace("@", "").strip().lower()
    if not username:
        return detected, repos_analyzed

    repos_to_process = []
    headers = {"User-Agent": "CareerGPS-Intelligence-Engine/1.0"}
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(f"https://api.github.com/users/{username}/repos?sort=updated&per_page=15", headers=headers)
            if resp.status_code == 200:
                repos_to_process = resp.json()
    except Exception:
        pass

    # If live API returns no repos or fails, check known demo profiles for deterministic evaluation
    if not repos_to_process and username in MOCK_DEMO_REPOS:
        repos_to_process = MOCK_DEMO_REPOS[username]

    for repo in repos_to_process:
        # Ignore external forks to prevent over-crediting third-party work
        if repo.get("fork", False):
            continue

        repos_analyzed += 1
        name = repo.get("name", "")
        desc = repo.get("description") or ""
        lang = (repo.get("language") or "").lower()
        topics = " ".join(repo.get("topics", []))
        url = repo.get("html_url")

        combo = f"{name} {desc} {lang} {topics}".lower()
        for skill_key, patterns in SKILL_PATTERNS.items():
            for pat in patterns:
                if re.search(pat, combo):
                    ev_type = EvidenceType.PROJECT_USAGE
                    if repo.get("has_pages") or repo.get("homepage"):
                        ev_type = EvidenceType.DEPLOYED
                    elif any(w in combo for w in ["api", "service", "schema", "test", "migration", "pipeline"]):
                        ev_type = EvidenceType.APPLIED_IMPL

                    item = EvidenceItem(
                        source=EvidenceSource.GITHUB_REPO,
                        source_title=f"GitHub Repository: {name}",
                        evidence_type=ev_type,
                        detail=f"{desc or 'Original repository and codebase'} (Primary language: {lang or 'Multiple'})",
                        url=url,
                        confidence=0.82 if ev_type != EvidenceType.PROJECT_USAGE else 0.68
                    )
                    detected.setdefault(skill_key, []).append(item)
                    break

    return detected, repos_analyzed

EVIDENCE_RANK = {
    EvidenceType.CLAIM: 1,
    EvidenceType.COURSEWORK: 2,
    EvidenceType.PROJECT_USAGE: 3,
    EvidenceType.APPLIED_IMPL: 4,
    EvidenceType.DEPLOYED: 5
}

def determine_skill_level_and_strength(
    skill_key: str,
    highest_ev: EvidenceType,
    has_resume: bool,
    has_github_project: bool,
    verified_project_names: List[str]
) -> tuple[str, str]:
    """
    Determines Current Level (Beginner / Intermediate / Advanced)
    and Evidence Strength (STRONG vs SELF-REPORTED).
    """
    # Evidence Strength:
    # If technology is supported by actual GitHub/project code, it carries STRONGER evidence.
    # If it is only mentioned in resume claims/coursework without code, it is SELF-REPORTED.
    if has_github_project:
        strength = "STRONG"
    else:
        strength = "SELF-REPORTED"

    # Current Skill Level Estimation:
    # 1. Advanced: Non-trivial production-like code, architecture/tests/deployment,
    #    or multiple verified projects with APPLIED_IMPL / DEPLOYED evidence.
    if (highest_ev in (EvidenceType.APPLIED_IMPL, EvidenceType.DEPLOYED) and has_github_project) or \
       (highest_ev == EvidenceType.DEPLOYED) or \
       (len(verified_project_names) >= 2 and highest_ev >= EvidenceType.APPLIED_IMPL):
        level = "Advanced"
    # 2. Intermediate: Real projects built (PROJECT_USAGE or applied in resume/single repo)
    elif highest_ev in (EvidenceType.PROJECT_USAGE, EvidenceType.APPLIED_IMPL) or has_github_project:
        level = "Intermediate"
    # 3. Beginner: Self-reported claims, coursework, tutorials, or foundational mentions
    else:
        level = "Beginner"

    return level, strength

def compile_candidate_intelligence(
    raw_name: Optional[str],
    target_role: str,
    resume_evidence: Dict[str, List[EvidenceItem]],
    github_evidence: Dict[str, List[EvidenceItem]],
    github_repos_count: int
) -> CandidateIntelligence:
    all_keys = set(resume_evidence.keys()).union(set(github_evidence.keys()))
    compiled_skills: Dict[str, SkillEvidence] = {}
    total_signals = 0

    for k in all_keys:
        items = resume_evidence.get(k, []) + github_evidence.get(k, [])
        total_signals += len(items)
        if not items:
            continue

        highest_ev = max(items, key=lambda x: EVIDENCE_RANK[x.evidence_type]).evidence_type
        max_c = max(it.confidence for it in items)
        sources = {it.source for it in items}
        bonus = 0.08 if len(sources) > 1 else 0.0
        agg_conf = min(round(max_c + bonus, 2), 0.95)

        summary_parts = []
        res_items = [it for it in items if "resume" in it.source.value]
        gh_items = [it for it in items if "github" in it.source.value]
        if res_items:
            summary_parts.append(f"{len(res_items)} resume mention(s) ({res_items[0].source_title})")
        if gh_items:
            summary_parts.append(f"{len(gh_items)} original GitHub repo signal(s)")

        # Collect verified project titles from GitHub repo items
        verified_projects = [
            it.source_title.replace("GitHub Repository: ", "").strip()
            for it in gh_items
            if it.source == EvidenceSource.GITHUB_REPO
        ]

        # Calculate current level and evidence strength
        current_lvl, ev_strength = determine_skill_level_and_strength(
            skill_key=k,
            highest_ev=highest_ev,
            has_resume=len(res_items) > 0,
            has_github_project=len(gh_items) > 0,
            verified_project_names=verified_projects
        )

        display = SKILL_DISPLAY_NAMES.get(k, k.capitalize())
        category = SKILL_CATEGORIES.get(k, "Technical Skill")

        compiled_skills[k] = SkillEvidence(
            skill_name=display,
            category=category,
            evidence_items=items,
            highest_evidence_type=highest_ev,
            aggregated_confidence=agg_conf,
            evidence_summary="; ".join(summary_parts) if summary_parts else "Detected from candidate profile",
            current_level=current_lvl,
            evidence_strength=ev_strength,
            verified_projects=verified_projects
        )

    return CandidateIntelligence(
        raw_name=raw_name,
        target_role=target_role,
        skills=compiled_skills,
        github_repositories_analyzed=github_repos_count,
        total_evidence_signals=total_signals
    )
