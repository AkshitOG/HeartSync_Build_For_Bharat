import pytest
from httpx import AsyncClient, ASGITransport
from careergps.main import app

@pytest.mark.anyio
async def test_end_to_end_api_analyze_and_feedback():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Inspect Role DNA Endpoint
        roles_res = await client.get("/api/roles")
        assert roles_res.status_code == 200
        roles_list = roles_res.json()
        assert len(roles_list) >= 3

        # 2. Analyze Real Candidate Input
        resume_payload = {
            "target_role": "backend-engineer",
            "resume_text": "EXPERIENCE\nBackend Intern\n- Built REST APIs in Python using FastAPI.\n- Wrote unit tests in pytest.",
            "github_handle": ""
        }
        analyze_res = await client.post("/api/candidate/analyze", data=resume_payload)
        assert analyze_res.status_code == 200
        data = analyze_res.json()

        assert "candidate" in data
        assert "skill_gaps" in data
        assert "next_best_action" in data
        assert "readiness" in data

        action = data["next_best_action"]
        assert len(action["title"]) > 10
        assert len(action["what_to_build"]) >= 3
        assert len(action["expected_evidence_artifacts"]) >= 3
        assert len(action["counterfactual_comparison"]) > 20

        # 3. Post Feedback to Outcome Moat
        feedback_payload = {
            "action_title": action["title"],
            "target_role": "backend-engineer",
            "is_useful": True,
            "candidate_comment": "Clear prioritization and concrete deliverables."
        }
        fb_res = await client.post("/api/feedback", json=feedback_payload)
        assert fb_res.status_code == 200
        assert fb_res.json()["status"] == "success"

@pytest.mark.anyio
async def test_empty_or_whitespace_input_rejected():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/candidate/analyze", data={"target_role": "backend-engineer", "resume_text": "   "})
        assert res.status_code == 400
        assert "Please provide at least a resume" in res.json()["detail"]
