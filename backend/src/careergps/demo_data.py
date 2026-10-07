"""Pre-seeded demo candidates for 1-click evaluation in CareerGPS.

Contains realistic, high-fidelity candidate evidence profiles matching the
competition hypothesis:
1. Alex Sharma: Fullstack / Backend developer with strong Python, FastAPI, and Git,
   but zero verifiable PostgreSQL migration/transaction evidence.
2. Priya Patel: Analytics / BI practitioner with strong SQL, Tableau, and Pandas,
   transitioning to Data Science with critical PyTorch & Model Serving gaps.
"""

from typing import Dict, Any, List

DEMO_CANDIDATES: Dict[str, Dict[str, Any]] = {
    "alex-sharma": {
        "candidate_id": "alex-sharma",
        "name": "Alex Sharma",
        "current_title": "Junior Backend / Full-Stack Developer",
        "target_role": "backend-engineer",
        "github_handle": "alexsharma-dev",
        "summary": "2 years building Python APIs, asynchronous background tasks, and web services. Seeking senior-level backend readiness with strong relational database depth.",
        "resume_text": """ALEX SHARMA
Backend & Distributed Systems Developer | github.com/alexsharma-dev

PROFESSIONAL EXPERIENCE
Junior Backend Developer | CloudScale Solutions (2024 - Present)
- Architected and deployed 14 asynchronous REST API microservices using FastAPI and Python.
- Designed JWT authentication middleware and role-based access control protecting internal routes.
- Implemented comprehensive automated testing suites with pytest, achieving 88% branch coverage.
- Optimized API endpoint latency by 35% through Redis caching strategies for high-frequency queries.
- Maintained Docker containerization recipes and collaborated via Git trunk-based development.

Software Engineering Intern | DataStream Systems (2023 - 2024)
- Developed automated data ingestion scripts in Python connecting third-party webhooks.
- Containerized local development environments using Docker and docker-compose.
- Wrote end-to-end integration tests using pytest and mock HTTP response fixtures.

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, Bash, SQL
Frameworks & Libraries: FastAPI, Flask, Pydantic, Pytest, Celery
Databases & Cache: Redis, SQLite, Basic SQL
Tools & DevOps: Git, Docker, GitHub Actions, Linux, Postman

EDUCATION
B.Tech in Computer Science & Engineering | State Institute of Technology (2020 - 2024)
- Coursework: Object-Oriented Programming, Data Structures, Operating Systems, Computer Networks
""",
        "expected_primary_gap": "PostgreSQL",
        "expected_action": "Build & Deploy a Production-Grade Data-Driven Service with PostgreSQL"
    },
    "priya-patel": {
        "candidate_id": "priya-patel",
        "name": "Priya Patel",
        "current_title": "Analytics Specialist / BI Analyst",
        "target_role": "data-scientist",
        "github_handle": "priyapatel-data",
        "summary": "3 years performing descriptive analytics, complex SQL joins, and exploratory data analysis. Transitioning to predictive modeling and production machine learning pipelines.",
        "resume_text": """PRIYA PATEL
Data Analyst & Applied Statistics Specialist | github.com/priyapatel-data

PROFESSIONAL EXPERIENCE
Senior Data Analyst | RetailMetrics Analytics (2023 - Present)
- Engineered complex SQL queries and relational data transformations across multi-table customer databases.
- Built interactive executive dashboards using Tableau and Power BI tracking customer lifetime value and churn.
- Conducted hypothesis testing and A/B test statistical analysis for marketing campaign experiments.
- Cleaned and prepared large tabular datasets using Python (Pandas, NumPy) for executive reporting.

Business Intelligence Analyst | GrowthX Media (2022 - 2023)
- Authored daily SQL extraction scripts aggregating clickstream and conversion metrics.
- Developed automated reporting pipelines in Python, saving 12 manual hours weekly.
- Completed coursework and self-study in Machine Learning algorithms and Scikit-learn.

TECHNICAL SKILLS
Languages: SQL, Python, R
Libraries & Tools: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Tableau, Power BI, Excel
Concepts: Exploratory Data Analysis, Hypothesis Testing, Feature Extraction, Relational Data Modeling

EDUCATION
B.S. in Statistics & Data Analytics | Metro University (2018 - 2022)
- Coursework: Applied Statistics, Multivariate Analysis, Probability Theory, Relational Databases
""",
        "expected_primary_gap": "PyTorch / Deep Learning",
        "expected_action": "Develop an End-to-End Model Inference Service & Benchmark Suite"
    }
}

def list_demo_candidates() -> List[Dict[str, Any]]:
    return [
        {
            "candidate_id": c["candidate_id"],
            "name": c["name"],
            "current_title": c["current_title"],
            "target_role": c["target_role"],
            "summary": c["summary"],
            "expected_primary_gap": c["expected_primary_gap"]
        }
        for c in DEMO_CANDIDATES.values()
    ]

def get_demo_candidate(candidate_id: str) -> Dict[str, Any]:
    return DEMO_CANDIDATES.get(candidate_id, DEMO_CANDIDATES["alex-sharma"])
