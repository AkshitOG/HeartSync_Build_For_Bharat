"""Role DNA Registry for CareerGPS.

Defines target role requirements, skill importance tiers, expected evidence standards,
and integrates real market benchmarks derived from 15,841 job postings.
"""

from typing import Dict, List, Optional, Any
import os
import json
from careergps.models import (
    TargetRoleDNA,
    RoleSkillRequirement,
    ImportanceLevel,
    ExpectedEvidence,
    EvidenceType,
)

ROLE_REGISTRY: Dict[str, TargetRoleDNA] = {
    "backend-engineer": TargetRoleDNA(
        role_id="backend-engineer",
        title="Backend Engineer",
        description="Designs, builds, and maintains server-side architecture, APIs, data stores, and integration pipelines.",
        core_competencies=["Server-side Development", "Relational Databases", "API Design", "Reliability & Testing"],
        market_benchmarks={
            "job_title": "Backend Engineer",
            "market_demand": "High (Core Infrastructure)",
            "median_salary_lakhs": 14.5,
            "senior_salary_lakhs": 22.5,
            "min_experience_years": 1.5,
            "senior_experience_years": 4.5,
            "sample_size_jobs": 15841,
            "source": "Aggregated Analytics & Tech Job Postings Dataset"
        },
        skills={
            "python": RoleSkillRequirement(
                skill_name="Python",
                category="Programming",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Idiomatic Python backend services, asynchronous concurrency, or clean modular architecture.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["FastAPI/Django service", "Async background tasks", "Clean modular structure"]
                ),
                synergies=["rest_apis", "postgresql", "testing", "docker"]
            ),
            "rest_apis": RoleSkillRequirement(
                skill_name="REST APIs",
                category="Backend Architecture",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Structured HTTP endpoints with status codes, payload validation, pagination, and auth.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["OpenAPI/Swagger docs", "CRUD with pagination/filtering", "JWT Auth endpoints"]
                ),
                synergies=["python", "postgresql", "testing"]
            ),
            "postgresql": RoleSkillRequirement(
                skill_name="PostgreSQL",
                category="Databases",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Relational database schema modeling, foreign keys, indexing, and non-trivial SQL joins/transactions.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Migration files (Alembic)", "Complex join/aggregate queries", "Foreign key constraints"]
                ),
                prerequisites=["python"],
                synergies=["rest_apis", "docker", "testing"]
            ),
            "sql": RoleSkillRequirement(
                skill_name="SQL Fundamentals",
                category="Databases",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Writing raw or ORM queries with joins, grouping, and transactional awareness.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Repository queries", "Schema DDL scripts"]
                ),
                synergies=["postgresql"]
            ),
            "testing": RoleSkillRequirement(
                skill_name="Automated Testing",
                category="Engineering Discipline",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Integration and unit test suites covering edge cases, happy paths, and mocks.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Pytest/Jest test suite", "Fixtures and mock database setup", "CI test run history"]
                ),
                synergies=["python", "rest_apis", "postgresql"]
            ),
            "docker": RoleSkillRequirement(
                skill_name="Docker",
                category="Deployment & Infrastructure",
                importance=ImportanceLevel.MEDIUM,
                weight=0.6,
                expected_evidence=ExpectedEvidence(
                    description="Multi-stage Dockerfile, containerized service running locally or compose configuration.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Dockerfile", "docker-compose.yml running app + database"]
                ),
                synergies=["postgresql", "rest_apis"]
            ),
            "git": RoleSkillRequirement(
                skill_name="Git",
                category="Engineering Discipline",
                importance=ImportanceLevel.HIGH,
                weight=0.7,
                expected_evidence=ExpectedEvidence(
                    description="Sensible commit history, branch workflows, and descriptive commit messages.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Clean Git log with modular atomic commits"]
                ),
                synergies=["python", "testing"]
            ),
            "system_design": RoleSkillRequirement(
                skill_name="System Design Fundamentals",
                category="Architecture",
                importance=ImportanceLevel.MEDIUM,
                weight=0.5,
                expected_evidence=ExpectedEvidence(
                    description="Caching strategies, queue workers, database indexing choices, and data flow diagrams.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Architecture README section", "C4 diagram / Dataflow markdown"]
                ),
                synergies=["postgresql", "docker"]
            )
        }
    ),
    "software-engineer": TargetRoleDNA(
        role_id="software-engineer",
        title="Software Engineer",
        description="Generalist engineer developing full-lifecycle software applications, backend services, and clean interfaces.",
        core_competencies=["Core Programming", "API Engineering", "Data Persistence", "Version Control & Testing"],
        market_benchmarks={
            "job_title": "Software Engineer",
            "market_demand": "High (Broad Multi-Domain)",
            "median_salary_lakhs": 11.5,
            "senior_salary_lakhs": 19.8,
            "min_experience_years": 1.5,
            "senior_experience_years": 4.0,
            "sample_size_jobs": 15841,
            "source": "Aggregated Analytics & Tech Job Postings Dataset"
        },
        skills={
            "python": RoleSkillRequirement(
                skill_name="Python",
                category="Programming",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Modular code, clean functions, algorithms, and application architecture.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Modular Python application", "Object-oriented designs"]
                ),
                synergies=["rest_apis", "sql", "testing"]
            ),
            "rest_apis": RoleSkillRequirement(
                skill_name="REST APIs",
                category="Backend Architecture",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Building and consuming REST web services.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["FastAPI/Flask API routes", "HTTP client consumption"]
                ),
                synergies=["python", "testing"]
            ),
            "sql": RoleSkillRequirement(
                skill_name="SQL Fundamentals",
                category="Databases",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Querying relational databases, understanding table schemas and indexes.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["SQL queries with joins", "Relational schema scripts"]
                ),
                synergies=["python"]
            ),
            "testing": RoleSkillRequirement(
                skill_name="Automated Testing",
                category="Engineering Discipline",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Writing automated unit and integration tests.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Pytest test suite", "Mocks and fixtures"]
                ),
                synergies=["python", "rest_apis"]
            ),
            "git": RoleSkillRequirement(
                skill_name="Git",
                category="Engineering Discipline",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Collaborative Git workflow with branches, commits, and pull requests.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Git commit log", "Merged pull requests"]
                ),
                synergies=["testing"]
            ),
            "docker": RoleSkillRequirement(
                skill_name="Docker",
                category="Deployment & Infrastructure",
                importance=ImportanceLevel.MEDIUM,
                weight=0.6,
                expected_evidence=ExpectedEvidence(
                    description="Containerizing application code and running services locally.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Dockerfile", "Docker compose file"]
                ),
                synergies=["python"]
            )
        }
    ),
    "data-scientist": TargetRoleDNA(
        role_id="data-scientist",
        title="Data Scientist",
        description="Applies statistical learning, machine learning algorithms, and deep neural models to extract predictive signals from complex data.",
        core_competencies=["Machine Learning Modeling", "Statistical Analysis", "Deep Learning", "Data Pipelines & Serving"],
        market_benchmarks={
            "job_title": "Data Scientist",
            "market_demand": "Very High (9,051 Postings in Benchmark)",
            "median_salary_lakhs": 12.8,
            "senior_salary_lakhs": 21.2,
            "min_experience_years": 1.54,
            "senior_experience_years": 3.96,
            "sample_size_jobs": 9051,
            "source": "Analytics Jobs Dataset (15,841 Postings, 9,051 DS Records)"
        },
        skills={
            "python": RoleSkillRequirement(
                skill_name="Python",
                category="Programming",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Scientific Python programming with Pandas, NumPy, and Scikit-learn.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Data transformation scripts", "Modular model training pipelines"]
                ),
                synergies=["machine_learning", "statistics", "pytorch"]
            ),
            "machine_learning": RoleSkillRequirement(
                skill_name="Machine Learning Algorithms",
                category="Machine Learning",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Supervised learning (classification/regression), cross-validation, hyperparameter tuning, and tree-based models.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Scikit-learn/XGBoost training pipeline", "Model cross-validation analysis", "Ablation comparison report"]
                ),
                prerequisites=["python", "statistics"],
                synergies=["feature_engineering", "evaluation", "pytorch"]
            ),
            "sql": RoleSkillRequirement(
                skill_name="SQL Fundamentals",
                category="Databases",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Relational data extraction, complex joins, subqueries, and window functions.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Analytical SQL queries", "Data warehouse aggregations"]
                ),
                synergies=["python", "feature_engineering"]
            ),
            "pytorch": RoleSkillRequirement(
                skill_name="PyTorch / Deep Learning",
                category="Modeling",
                importance=ImportanceLevel.CRITICAL,
                weight=0.9,
                expected_evidence=ExpectedEvidence(
                    description="Neural network architectures in PyTorch or TensorFlow, custom loss functions, training loops.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["PyTorch train/eval loops", "Saved model checkpoints", "TensorBoard logging"]
                ),
                prerequisites=["python", "machine_learning"],
                synergies=["model_serving", "evaluation"]
            ),
            "statistics": RoleSkillRequirement(
                skill_name="Statistical Analysis & Experimentation",
                category="Mathematical Foundations",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Hypothesis testing, probability distributions, A/B experiment design, and p-value interpretation.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Statistical test notebook", "Power analysis calculation"]
                ),
                synergies=["machine_learning"]
            ),
            "feature_engineering": RoleSkillRequirement(
                skill_name="Data Pipelines & Feature Prep",
                category="Data Engineering",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Data cleaning, imputation, categorical encoding, and leakage prevention.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Reusable feature pipeline", "Train/test split integrity check"]
                ),
                synergies=["python", "machine_learning"]
            ),
            "evaluation": RoleSkillRequirement(
                skill_name="Model Evaluation & Metrics",
                category="Modeling",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Rigorous metric calculation: ROC-AUC, Precision-Recall, F1-Score, and confusion matrix interpretation.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Model evaluation report", "Confusion matrix & ROC curve plots"]
                ),
                synergies=["machine_learning", "pytorch"]
            ),
            "model_serving": RoleSkillRequirement(
                skill_name="Model Serving & Inference APIs",
                category="Engineering & Deployment",
                importance=ImportanceLevel.MEDIUM,
                weight=0.7,
                expected_evidence=ExpectedEvidence(
                    description="Exposing trained models via REST APIs with input schema validation.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["FastAPI model endpoint", "Inference latency test"]
                ),
                synergies=["python", "docker"]
            )
        }
    ),
    "data-analyst": TargetRoleDNA(
        role_id="data-analyst",
        title="Data Analyst",
        description="Transforms structured enterprise data into actionable business intelligence, interactive dashboards, and executive insights.",
        core_competencies=["Relational SQL Aggregation", "Interactive Dashboards", "Statistical Exploration", "Executive Storytelling"],
        market_benchmarks={
            "job_title": "Data Analyst",
            "market_demand": "High (18,095 Postings in Benchmark)",
            "median_salary_lakhs": 5.0,
            "senior_salary_lakhs": 8.6,
            "min_experience_years": 0.82,
            "senior_experience_years": 2.86,
            "sample_size_jobs": 18095,
            "source": "Analytics Jobs Dataset (18,095 Postings)"
        },
        skills={
            "sql": RoleSkillRequirement(
                skill_name="SQL Fundamentals",
                category="Databases",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Multi-table joins, GROUP BY aggregations, CTEs, window functions (ROW_NUMBER, RANK).",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Complex analytical queries", "CTE and window function scripts"]
                ),
                synergies=["data_visualization", "excel"]
            ),
            "data_visualization": RoleSkillRequirement(
                skill_name="Data Visualization & Dashboards",
                category="Business Intelligence & Reporting",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Interactive executive dashboards in Tableau or Power BI with drill-down filters and KPI cards.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Published Tableau/Power BI dashboard", "Dashboard wireframe & KPI summary"]
                ),
                synergies=["sql", "business_communication"]
            ),
            "excel": RoleSkillRequirement(
                skill_name="Advanced Excel & Modeling",
                category="Business Analytics Tools",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Pivot tables, INDEX-MATCH / XLOOKUP, conditional formulas, and financial summary models.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Dynamic spreadsheet model", "Pivot table analysis workbook"]
                ),
                synergies=["data_visualization"]
            ),
            "python": RoleSkillRequirement(
                skill_name="Python",
                category="Programming",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Tabular data analysis and cleaning with Pandas and NumPy.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Pandas EDA notebook", "Data cleaning script"]
                ),
                synergies=["sql", "statistics"]
            ),
            "statistics": RoleSkillRequirement(
                skill_name="Statistical Analysis & Experimentation",
                category="Mathematical Foundations",
                importance=ImportanceLevel.HIGH,
                weight=0.7,
                expected_evidence=ExpectedEvidence(
                    description="Descriptive statistics, variance analysis, correlation, and basic hypothesis testing.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Summary statistics report", "Correlation matrix analysis"]
                ),
                synergies=["python"]
            ),
            "business_communication": RoleSkillRequirement(
                skill_name="Stakeholder Storytelling & Presentation",
                category="Storytelling & Collaboration",
                importance=ImportanceLevel.MEDIUM,
                weight=0.6,
                expected_evidence=ExpectedEvidence(
                    description="Translating technical metrics into actionable business recommendations for non-technical stakeholders.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Executive deck / presentation", "Written decision brief"]
                ),
                synergies=["data_visualization"]
            )
        }
    ),
    "machine-learning-engineer": TargetRoleDNA(
        role_id="machine-learning-engineer",
        title="Machine Learning Engineer",
        description="Builds, evaluates, packages, and deploys production machine learning models and inference pipelines.",
        core_competencies=["Model Training & Evaluation", "Feature Pipelines", "Model Serving", "MLOps"],
        market_benchmarks={
            "job_title": "Machine Learning Engineer",
            "market_demand": "High Specialized Demand (964 Postings in Benchmark)",
            "median_salary_lakhs": 9.1,
            "senior_salary_lakhs": 22.3,
            "min_experience_years": 1.44,
            "senior_experience_years": 4.2,
            "sample_size_jobs": 964,
            "source": "Analytics Jobs Dataset (964 MLE Records)"
        },
        skills={
            "python": RoleSkillRequirement(
                skill_name="Python",
                category="Programming",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Production-grade scientific Python (NumPy, Pandas, PyTorch/Scikit-learn).",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Data preprocessing scripts", "Modular model training pipelines"]
                ),
                synergies=["pytorch", "model_serving", "feature_engineering"]
            ),
            "pytorch": RoleSkillRequirement(
                skill_name="PyTorch / Deep Learning",
                category="Modeling",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Custom neural network architectures, custom loss functions, or fine-tuning existing foundation models.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["PyTorch train/eval loops", "Checkpoint saving & inference script"]
                ),
                synergies=["python", "model_serving", "evaluation"]
            ),
            "feature_engineering": RoleSkillRequirement(
                skill_name="Data Pipelines & Feature Prep",
                category="Data Engineering",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Reproducible data preprocessing, handling class imbalance, and feature transformation.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Pandas/Polars cleaning pipeline", "Data split scripts without leakage"]
                ),
                synergies=["python", "pytorch"]
            ),
            "model_serving": RoleSkillRequirement(
                skill_name="Model Serving & Inference APIs",
                category="Engineering & Deployment",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Exposing trained models via low-latency REST/gRPC endpoints with input validation and batching.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["FastAPI inference endpoint", "ONNX/TorchScript export", "Latency benchmark"]
                ),
                prerequisites=["python"],
                synergies=["pytorch", "docker", "testing"]
            ),
            "evaluation": RoleSkillRequirement(
                skill_name="Model Evaluation & Metrics",
                category="Modeling",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Rigorous validation metrics (F1, ROC-AUC, confusion matrices, latency benchmarks).",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Validation evaluation report", "Ablation study script"]
                ),
                synergies=["pytorch", "feature_engineering"]
            ),
            "docker": RoleSkillRequirement(
                skill_name="Docker",
                category="MLOps",
                importance=ImportanceLevel.HIGH,
                weight=0.7,
                expected_evidence=ExpectedEvidence(
                    description="Containerizing inference container with pinned model weights and dependencies.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Dockerfile bundling inference service", "Container health check"]
                ),
                synergies=["model_serving"]
            )
        }
    ),
    "frontend-engineer": TargetRoleDNA(
        role_id="frontend-engineer",
        title="Frontend Engineer",
        description="Builds performant, accessible, and resilient client-side web interfaces and applications.",
        core_competencies=["Component Architecture", "State Management", "Performance & Responsive Design", "API Integration"],
        market_benchmarks={
            "job_title": "Frontend Engineer",
            "market_demand": "High",
            "median_salary_lakhs": 10.5,
            "senior_salary_lakhs": 18.0,
            "min_experience_years": 1.2,
            "senior_experience_years": 4.0,
            "sample_size_jobs": 15841,
            "source": "Tech Market Benchmark"
        },
        skills={
            "javascript_typescript": RoleSkillRequirement(
                skill_name="TypeScript / JavaScript",
                category="Programming",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Strict TypeScript types, modern ESNext patterns, async data fetching.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Type-safe component props", "Generic utility types", "Strict tsconfig"]
                ),
                synergies=["react", "state_management", "testing"]
            ),
            "react": RoleSkillRequirement(
                skill_name="React / Modern Frameworks",
                category="Frontend Architecture",
                importance=ImportanceLevel.CRITICAL,
                weight=1.0,
                expected_evidence=ExpectedEvidence(
                    description="Custom hooks, reusable composable components, performance memoization.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Custom hook library", "Complex interactive dashboard component"]
                ),
                synergies=["javascript_typescript", "state_management", "css_responsive"]
            ),
            "state_management": RoleSkillRequirement(
                skill_name="Client State & Data Fetching",
                category="Architecture",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Cache invalidation, optimistic UI updates, or global store management.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["TanStack Query / Zustand integration", "Error and loading state boundaries"]
                ),
                synergies=["react", "javascript_typescript"]
            ),
            "css_responsive": RoleSkillRequirement(
                skill_name="Responsive CSS & Design Systems",
                category="UI/UX Discipline",
                importance=ImportanceLevel.HIGH,
                weight=0.8,
                expected_evidence=ExpectedEvidence(
                    description="Mobile-first layout, Tailwind/CSS variables, accessible color contrasts.",
                    minimum_evidence_type=EvidenceType.APPLIED_IMPL,
                    sample_artifacts=["Responsive layout component", "Accessible modal/dropdown"]
                ),
                synergies=["react"]
            ),
            "testing": RoleSkillRequirement(
                skill_name="Automated Testing",
                category="Engineering Discipline",
                importance=ImportanceLevel.MEDIUM,
                weight=0.6,
                expected_evidence=ExpectedEvidence(
                    description="Component interaction testing or end-to-end user journey tests.",
                    minimum_evidence_type=EvidenceType.PROJECT_USAGE,
                    sample_artifacts=["Vitest / React Testing Library tests", "Playwright test script"]
                ),
                synergies=["react", "javascript_typescript"]
            )
        }
    )
}

def get_role_dna(role_query: str) -> TargetRoleDNA:
    normalized = role_query.lower().strip().replace(" ", "-").replace("_", "-")
    # Exact match
    if normalized in ROLE_REGISTRY:
        return ROLE_REGISTRY[normalized]

    # Substring / keyword match
    if "data-sci" in normalized:
        return ROLE_REGISTRY["data-scientist"]
    if "data-ana" in normalized:
        return ROLE_REGISTRY["data-analyst"]
    if "ml" in normalized or "machine" in normalized or "ai" in normalized:
        return ROLE_REGISTRY["machine-learning-engineer"]
    if "software" in normalized:
        return ROLE_REGISTRY["software-engineer"]
    if "backend" in normalized or "back-end" in normalized:
        return ROLE_REGISTRY["backend-engineer"]
    if "frontend" in normalized or "front-end" in normalized or "react" in normalized or "web" in normalized:
        return ROLE_REGISTRY["frontend-engineer"]

    # Fallback default
    return ROLE_REGISTRY["backend-engineer"]

def list_all_roles() -> List[Dict[str, Any]]:
    return [
        {
            "role_id": r.role_id,
            "title": r.title,
            "description": r.description,
            "market_benchmarks": r.market_benchmarks
        }
        for r in ROLE_REGISTRY.values()
    ]
