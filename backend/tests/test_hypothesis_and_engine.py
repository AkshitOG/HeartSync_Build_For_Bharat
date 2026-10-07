import pytest
from careergps.role_dna import get_role_dna
from careergps.intelligence import extract_resume_evidence, compile_candidate_intelligence
from careergps.gap_analyzer import calculate_skill_gaps
from careergps.action_engine import generate_next_best_action, evaluate_role_readiness
from careergps.models import EvidenceType
from careergps.parser import extract_text_from_pdf
from fastapi import HTTPException

# 1. CORE HYPOTHESIS TEST: Different candidates with different evidence MUST yield different Next Best Actions
def test_hypothesis_different_candidates_produce_different_next_best_actions():
    role = get_role_dna("backend-engineer")

    # Candidate 1: Strong Python & APIs, but zero PostgreSQL/relational DB evidence
    resume_candidate_1 = """
    EXPERIENCE
    Backend Developer Intern
    - Designed and implemented FastAPI microservices and REST APIs with JWT authentication.
    - Automated unit tests with pytest and mock dependencies.
    - Managed Git workflows and pull request code reviews.
    SKILLS
    Python, FastAPI, REST APIs, Git, Pytest
    """

    # Candidate 2: Strong Frontend and React, but zero Backend & API fundamentals
    resume_candidate_2 = """
    EXPERIENCE
    Frontend Engineer Intern
    - Built responsive web applications using React, TypeScript, and Tailwind CSS.
    - Implemented client state management with Zustand and TanStack Query.
    - Wrote component tests using Vitest and React Testing Library.
    SKILLS
    React, TypeScript, JavaScript, Tailwind CSS, Zustand
    """

    ev_1 = extract_resume_evidence(resume_candidate_1)
    cand_1 = compile_candidate_intelligence(
        raw_name="Backend Specialist with SQL gap",
        target_role="backend-engineer",
        resume_evidence=ev_1,
        github_evidence={},
        github_repos_count=0
    )
    gaps_1 = calculate_skill_gaps(cand_1, role)
    action_1 = generate_next_best_action(cand_1, role, gaps_1)

    ev_2 = extract_resume_evidence(resume_candidate_2)
    cand_2 = compile_candidate_intelligence(
        raw_name="Frontend Transitioner",
        target_role="backend-engineer",
        resume_evidence=ev_2,
        github_evidence={},
        github_repos_count=0
    )
    gaps_2 = calculate_skill_gaps(cand_2, role)
    action_2 = generate_next_best_action(cand_2, role, gaps_2)

    assert gaps_1[0].skill_name != gaps_2[0].skill_name or action_1.primary_gap_targeted != action_2.primary_gap_targeted
    assert "PostgreSQL" in gaps_1[0].skill_name or "SQL" in gaps_1[0].skill_name
    assert gaps_2[0].skill_name in ["Python", "REST APIs"]
    assert action_1.title != action_2.title


# 2. EVIDENCE REDUCTION TEST: Stronger evidence must deterministically reduce skill gap
def test_stronger_evidence_reduces_skill_gap():
    role = get_role_dna("backend-engineer")

    cand_without_pg = compile_candidate_intelligence(
        raw_name="No PG",
        target_role="backend-engineer",
        resume_evidence=extract_resume_evidence("Built Python service"),
        github_evidence={},
        github_repos_count=0
    )
    gaps_without = calculate_skill_gaps(cand_without_pg, role)
    pg_gap_without = next(g for g in gaps_without if "PostgreSQL" in g.skill_name)

    cand_with_pg = compile_candidate_intelligence(
        raw_name="With PG",
        target_role="backend-engineer",
        resume_evidence=extract_resume_evidence(
            "PROJECTS\n- Deployed production PostgreSQL database with relational schema, foreign keys, and Alembic migrations"
        ),
        github_evidence={},
        github_repos_count=0
    )
    gaps_with = calculate_skill_gaps(cand_with_pg, role)
    pg_gap_with = next(g for g in gaps_with if "PostgreSQL" in g.skill_name)

    assert pg_gap_with.evidence_deficit < pg_gap_without.evidence_deficit
    assert pg_gap_with.raw_priority_score < pg_gap_without.raw_priority_score


# 3. STABILITY TEST: Irrelevant noise must NOT arbitrarily change the primary recommendation
def test_recommendation_stability_against_noise():
    role = get_role_dna("backend-engineer")
    base_text = """
    EXPERIENCE
    Backend Developer
    - Implemented REST APIs in Python using FastAPI.
    - Unit tests with pytest.
    """

    noisy_text = base_text + """
    INTERESTS
    - Avid chess player, marathon runner, and amateur coffee roaster.
    """

    cand_base = compile_candidate_intelligence(None, "backend-engineer", extract_resume_evidence(base_text), {}, 0)
    cand_noisy = compile_candidate_intelligence(None, "backend-engineer", extract_resume_evidence(noisy_text), {}, 0)

    gaps_base = calculate_skill_gaps(cand_base, role)
    gaps_noisy = calculate_skill_gaps(cand_noisy, role)

    action_base = generate_next_best_action(cand_base, role, gaps_base)
    action_noisy = generate_next_best_action(cand_noisy, role, gaps_noisy)

    assert action_base.primary_gap_targeted == action_noisy.primary_gap_targeted
    assert action_base.title == action_noisy.title


# 4. EXPLAINABILITY & COUNTERFACTUAL TEST
def test_action_engine_provides_counterfactual_explanation():
    role = get_role_dna("backend-engineer")
    resume = "EXPERIENCE\n- Built Python REST API with FastAPI."
    cand = compile_candidate_intelligence(None, "backend-engineer", extract_resume_evidence(resume), {}, 0)
    gaps = calculate_skill_gaps(cand, role)
    action = generate_next_best_action(cand, role, gaps)

    assert len(action.counterfactual_comparison) > 20
    assert "Why this action beats" in action.counterfactual_comparison or "targets" in action.counterfactual_comparison
    assert len(action.expected_evidence_artifacts) >= 3


# 5. INSUFFICIENT EVIDENCE TEST: Completely empty or generic input must NOT manufacture false certainty
def test_insufficient_evidence_handling():
    role = get_role_dna("backend-engineer")
    vague_text = "Looking for opportunities as a software engineer. Highly motivated and hardworking team player."
    
    cand = compile_candidate_intelligence(None, "backend-engineer", extract_resume_evidence(vague_text), {}, 0)
    assert cand.total_evidence_signals == 0
    
    gaps = calculate_skill_gaps(cand, role)
    action = generate_next_best_action(cand, role, gaps)
    readiness = evaluate_role_readiness(cand, role, gaps)

    assert action.is_insufficient_evidence is True
    assert "Baseline" in action.title or "Portfolio" in action.title
    assert "Insufficient demonstrable evidence" in readiness.summary_verdict


# 6. COURSEWORK VS APPLIED DISTINCTION TEST: Tutorial mentions should not be ranked as applied code
def test_coursework_is_not_ranked_as_applied_implementation():
    text = "EDUCATION\n- Completed Udemy course and tutorial on PostgreSQL database concepts."
    ev = extract_resume_evidence(text)
    assert "postgresql" in ev
    assert ev["postgresql"][0].evidence_type == EvidenceType.COURSEWORK
    assert ev["postgresql"][0].evidence_type != EvidenceType.APPLIED_IMPL
    assert ev["postgresql"][0].evidence_type != EvidenceType.DEPLOYED


# 7. PARSER ROBUSTNESS TEST: Handles empty bytes and oversized files safely
def test_pdf_parser_edge_cases():
    # Empty bytes returns empty string without crashing
    assert extract_text_from_pdf(b"") == ""

    # Oversized payload raises clean 400 HTTPException
    oversized_payload = b"%PDF-1.4 " + b"0" * (6 * 1024 * 1024)
    with pytest.raises(HTTPException) as excinfo:
        extract_text_from_pdf(oversized_payload)
    assert excinfo.value.status_code == 400
