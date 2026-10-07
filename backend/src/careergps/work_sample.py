"""Work-Sample Engine for CareerGPS.

Provides structured, time-bounded (45-minute) work-sample challenges when candidate
evidence is ambiguous, sparse, or contested.
Instead of automated rejection or hallucinated scoring, CareerGPS offers a direct
path for candidates to produce verifiable proof.
"""

from typing import Dict, Any, List, Optional
from careergps.models import WorkSampleRecommendation

WORK_SAMPLES: Dict[str, Dict[str, Any]] = {
    "postgresql": {
        "skill_name": "PostgreSQL",
        "sample_title": "45-Minute Relational Schema & Transaction Challenge",
        "estimated_duration": "45 minutes",
        "skills_evaluated": ["PostgreSQL", "SQL", "Data Modeling", "Transactions"],
        "prompt_summary": "Design a relational schema with foreign keys, write an atomic balance-transfer transaction with row locking, and add an index benchmark.",
        "why_recommended": "Candidate profile contains high-confidence API code, but relational schema and transaction management evidence is currently unverified.",
        "tasks": [
            "Write a SQL DDL migration creating `accounts` and `transactions` tables with CHECK and FOREIGN KEY constraints.",
            "Write a repeatable SQL transaction simulating an atomic balance transfer between two accounts with row-level locking (`FOR UPDATE`).",
            "Write a benchmark EXPLAIN ANALYZE query showing index optimization on high-cardinality ledger lookups."
        ],
        "deliverables": [
            "A single `schema_and_transaction.sql` file runnable in PostgreSQL or SQLite.",
            "A 3-line comment explaining deadlock avoidance strategy."
        ],
        "rubric": {
            "ACID correctness": "Locks acquired in predictable order to prevent deadlocks.",
            "Integrity constraints": "Disallows negative account balances via database-level CHECK.",
            "Index strategy": "Composite index matches frequent query WHERE filter order."
        }
    },
    "rest_apis": {
        "skill_name": "REST APIs",
        "sample_title": "45-Minute Resilient API Endpoint Implementation",
        "estimated_duration": "45 minutes",
        "skills_evaluated": ["REST APIs", "Python", "FastAPI", "Testing"],
        "prompt_summary": "Implement a paginated search endpoint with rate limiting, input validation, and a unit test suite.",
        "why_recommended": "Candidate lists API building, but lacks demonstrable code evidence of error boundaries, schema validation, or pagination.",
        "tasks": [
            "Implement a GET `/items` endpoint accepting cursor pagination parameters (`limit`, `cursor`).",
            "Add Pydantic schema validation rejecting invalid query parameters with standard HTTP 422.",
            "Write 2 pytest tests: one validating pagination cursor advancement, one testing error response."
        ],
        "deliverables": [
            "A single `main.py` file with FastAPI app and router.",
            "A `test_api.py` file passing under `pytest`."
        ],
        "rubric": {
            "Error handling": "Clear JSON error envelopes matching OpenAPI specs.",
            "Pagination correctness": "Cursor correctly encodes boundary ID without offset degradation.",
            "Test quality": "Tests cover both boundary success and invalid input failure."
        }
    },
    "pytorch": {
        "skill_name": "PyTorch / Deep Learning",
        "sample_title": "45-Minute PyTorch Dataset & Evaluation Harness",
        "estimated_duration": "45 minutes",
        "skills_evaluated": ["PyTorch", "Python", "Evaluation Metrics", "Model Serving"],
        "prompt_summary": "Implement a custom PyTorch Dataset loader, a minimal MLP classifier, and an evaluation loop reporting precision, recall, and ROC-AUC.",
        "why_recommended": "Candidate lists statistical modeling, but has not demonstrated deep learning training loop or tensor tensor manipulation evidence.",
        "tasks": [
            "Implement a `TabularDataset` class inheriting from `torch.utils.data.Dataset`.",
            "Build a 2-layer MLP classifier with ReLU activations and Dropout.",
            "Write an evaluation function that computes ROC-AUC and F1-score on a validation DataLoader."
        ],
        "deliverables": [
            "A `model_eval.py` script containing dataset, model, and evaluation metrics.",
            "Console output showing accuracy, F1, and AUC metrics on synthetic input."
        ],
        "rubric": {
            "Tensor handling": "Correct tensor device placement and gradient zeroing.",
            "Metric calculation": "No data leakage between train and evaluation loops.",
            "Modularity": "Clear separation between dataset loader, network definition, and metric computation."
        }
    },
    "docker": {
        "skill_name": "Docker",
        "sample_title": "45-Minute Production Multi-Stage Containerization",
        "estimated_duration": "45 minutes",
        "skills_evaluated": ["Docker", "Linux", "Security & Deployment"],
        "prompt_summary": "Author an optimized multi-stage Dockerfile for a Python service, running as a non-root user with minimal final image size.",
        "why_recommended": "Candidate uses Docker locally, but production container optimization and security hygiene evidence is absent.",
        "tasks": [
            "Write a multi-stage Dockerfile separating the build/dependency-wheel stage from the final lean runtime stage.",
            "Create a non-root user and set strict file permissions.",
            "Include a HEALTHCHECK instruction testing service availability."
        ],
        "deliverables": [
            "A production `Dockerfile` under 150MB image size.",
            "A `docker-compose.yml` demonstrating local service startup."
        ],
        "rubric": {
            "Layer caching": "Requirements copied before application source to leverage Docker cache.",
            "Security": "Container does not run as root user.",
            "Size": "Final image contains no build tools (gcc, make) or cached wheels."
        }
    },
    "sql": {
        "skill_name": "SQL Fundamentals",
        "sample_title": "45-Minute Analytical SQL Aggregation & Window Functions",
        "estimated_duration": "45 minutes",
        "skills_evaluated": ["SQL", "Analytics", "Data Modeling"],
        "prompt_summary": "Write 3 analytical SQL queries computing rolling 7-day revenue, cohort retention rates, and top-percentile spenders.",
        "why_recommended": "Candidate reports SQL knowledge; this sample provides verified code evidence of window functions and aggregate queries.",
        "tasks": [
            "Write a query computing rolling 7-day active user count using `OVER (ROWS BETWEEN ...)`.",
            "Write a monthly cohort retention matrix query using CTEs.",
            "Identify top 10% customers using `NTILE()` or `PERCENT_RANK()`."
        ],
        "deliverables": [
            "A `cohort_and_window_queries.sql` file."
        ],
        "rubric": {
            "Window specification": "Correct frame clause avoiding unintended cumulative summing.",
            "Performance": "Judicious use of CTEs avoiding repeated table scans."
        }
    }
}

def get_work_sample_for_skill(skill_key: str) -> WorkSampleRecommendation:
    norm = skill_key.lower().replace("-", "_").replace(" ", "_")
    # Exact or substring match
    matched = None
    for k, v in WORK_SAMPLES.items():
        if k in norm or norm in k:
            matched = v
            break

    if not matched:
        matched = WORK_SAMPLES["postgresql"]  # Default benchmark sample

    return WorkSampleRecommendation(
        skill_name=matched["skill_name"],
        sample_title=matched["sample_title"],
        estimated_duration=matched["estimated_duration"],
        skills_evaluated=matched["skills_evaluated"],
        prompt_summary=matched["prompt_summary"],
        why_recommended=matched["why_recommended"]
    )

def get_work_sample_detail(skill_key: str) -> Dict[str, Any]:
    norm = skill_key.lower().replace("-", "_").replace(" ", "_")
    for k, v in WORK_SAMPLES.items():
        if k in norm or norm in k:
            return v
    return WORK_SAMPLES["postgresql"]
