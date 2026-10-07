import pytest
from fastapi.testclient import TestClient
from careergps.main import app

client = TestClient(app)

def test_hr_overview_endpoint():
    res = client.get("/api/hr/overview")
    assert res.status_code == 200
    data = res.json()
    assert "overview" in data
    assert data["overview"]["total_employees"] == 48
    assert len(data["departments"]) >= 5

def test_hr_daily_brief_endpoint():
    res = client.get("/api/hr/daily-brief")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert len(data["items"]) == 3
    # Check that each brief item has evidence and recommended action
    for item in data["items"]:
        assert "title" in item
        assert "evidence" in item
        assert "recommended_action" in item

def test_hr_insights_endpoint():
    res = client.get("/api/hr/insights")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 3

def test_hr_query_endpoint():
    # Test matching flight risk / burnout query
    res = client.post("/api/hr/query", json={"query": "Who is at risk of burnout?"})
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "evidence" in data
    assert "recommended_action" in data
    assert "burnout" in data["answer"].lower() or "risk" in data["answer"].lower()

def test_candidate_demo_endpoints():
    res = client.get("/api/candidate/demo")
    assert res.status_code == 200
    demos = res.json()
    assert len(demos) >= 2
    ids = [d["candidate_id"] for d in demos]
    assert "alex-sharma" in ids
    assert "priya-patel" in ids

    single = client.get("/api/candidate/demo/alex-sharma")
    assert single.status_code == 200
    assert "resume_text" in single.json()

def test_role_graph_endpoint():
    res = client.get("/api/graph/backend-engineer")
    assert res.status_code == 200
    graph = res.json()
    assert "nodes" in graph
    assert "edges" in graph
    assert graph["total_nodes"] > 5
    assert graph["total_edges"] > 5

def test_work_sample_endpoint():
    res = client.get("/api/work-sample/postgresql")
    assert res.status_code == 200
    sample = res.json()
    assert "PostgreSQL" in sample["skill_name"]
    assert "45 minutes" in sample["estimated_duration"]
    assert len(sample["tasks"]) >= 3

def test_model_results_endpoint():
    res = client.get("/api/models/results")
    assert res.status_code == 200
    results = res.json()
    assert "jds" in results
    assert "sds" in results
