"""Tests for the Single Canonical Production ML Model:
Logistic Regression — Technical Capability Model (Dataset 3).

Verifies:
1. Artifact integrity and pipeline architecture (StandardScaler + LogisticRegression).
2. Strict runtime invariants: ONLY Logistic Regression in production inference,
   NO Random Forest / Decision Tree / Dummy / Personality model used at runtime.
3. Feature schema, ordering, and rigorous boundary validation.
4. Explanations, log-odds contributions, and ethical non-hiring disclaimers.
5. Dedicated and integrated FastAPI endpoints.
"""

import os
import json
import pytest
import joblib
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from httpx import AsyncClient, ASGITransport

from careergps.main import app
from careergps.technical_capability_service import (
    TechnicalCapabilityService,
    CANONICAL_FEATURE_ORDER,
    MODEL_DIR_CANDIDATES,
    technical_capability_service
)


def test_production_model_artifact_exists_and_loads():
    """Verify the serialized pipeline and metadata artifacts exist and load correctly."""
    artifact_found = False
    for d in MODEL_DIR_CANDIDATES:
        joblib_path = os.path.join(d, "model.joblib")
        meta_path = os.path.join(d, "metadata.json")
        if os.path.exists(joblib_path) and os.path.exists(meta_path):
            artifact_found = True
            pipeline = joblib.load(joblib_path)
            assert isinstance(pipeline, Pipeline), "Model artifact must be a scikit-learn Pipeline"
            assert "scaler" in pipeline.named_steps, "Pipeline must contain 'scaler' step"
            assert "clf" in pipeline.named_steps, "Pipeline must contain 'clf' step"
            assert isinstance(pipeline.named_steps["scaler"], StandardScaler)
            assert isinstance(pipeline.named_steps["clf"], LogisticRegression)

            with open(meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
            assert meta["model_type"] == "LogisticRegression"
            assert meta["dataset"] == "technical_capability"
            assert abs(meta["accuracy"] - 0.8529) < 0.001
            assert abs(meta["balanced_accuracy"] - 0.8505) < 0.001
            assert abs(meta["precision"] - 0.8417) < 0.001
            assert abs(meta["recall"] - 0.8952) < 0.001
            assert abs(meta["f1"] - 0.8651) < 0.001
            assert abs(meta["roc_auc"] - 0.9035) < 0.001
            break

    assert artifact_found, f"Could not find valid production model artifacts in {MODEL_DIR_CANDIDATES}"


def test_strict_production_model_invariants():
    """Verify runtime invariants: ONLY Logistic Regression is in the production service."""
    service = technical_capability_service
    assert service.pipeline is not None
    clf = service.pipeline.named_steps.get("clf")
    assert isinstance(clf, LogisticRegression), "Production model must be strictly LogisticRegression"

    # Verify disallowed models are not present
    clf_class_name = type(clf).__name__
    disallowed = [
        "RandomForestClassifier",
        "DecisionTreeClassifier",
        "DummyClassifier",
        "GradientBoostingClassifier",
        "SVC",
        "KNeighborsClassifier"
    ]
    for non_prod in disallowed:
        assert clf_class_name != non_prod, f"Disallowed model {non_prod} found in production service!"


def test_feature_schema_and_ordering():
    """Verify the 5 canonical features and strict column ordering."""
    expected_order = [
        "big_data_skills",
        "maths-stats_skills",
        "coding_skills",
        "ai_and_ml_skills",
        "dashboard_and_storytelling_skills"
    ]
    assert CANONICAL_FEATURE_ORDER == expected_order

    service = technical_capability_service
    scaler: StandardScaler = service.pipeline.named_steps["scaler"]
    assert scaler.n_features_in_ == 5
    assert len(service.pipeline.named_steps["clf"].coef_[0]) == 5


def test_input_validation_and_bounds():
    """Verify input validation enforces feature presence, types, and [0.0, 5.0] bounds."""
    service = technical_capability_service

    # Valid inputs
    valid = {
        "coding_skills": 4.0,
        "ai_and_ml_skills": 3.5,
        "maths-stats_skills": 4.2,
        "big_data_skills": 3.0,
        "dashboard_and_storytelling_skills": 4.5
    }
    validated = service.validate_features(valid)
    assert len(validated) == 5

    # Valid with aliases
    valid_aliases = {
        "coding_skills": 4.0,
        "ai_ml_skills": 3.5,
        "maths_stats_skills": 4.2,
        "big_data_skills": 3.0,
        "dashboard_storytelling_skills": 4.5
    }
    validated_aliases = service.validate_features(valid_aliases)
    assert "maths-stats_skills" in validated_aliases
    assert "ai_and_ml_skills" in validated_aliases

    # Missing feature
    missing = valid.copy()
    del missing["coding_skills"]
    with pytest.raises(ValueError, match="Missing required technical capability features"):
        service.validate_features(missing)

    # Out of bounds (> 5.0)
    out_of_bounds_high = valid.copy()
    out_of_bounds_high["coding_skills"] = 5.5
    with pytest.raises(ValueError, match="out of bounds"):
        service.validate_features(out_of_bounds_high)

    # Out of bounds (< 0.0)
    out_of_bounds_low = valid.copy()
    out_of_bounds_low["maths-stats_skills"] = -1.0
    with pytest.raises(ValueError, match="out of bounds"):
        service.validate_features(out_of_bounds_low)

    # Non-numeric
    non_numeric = valid.copy()
    non_numeric["ai_and_ml_skills"] = "excellent"
    with pytest.raises(ValueError, match="must be a numeric value"):
        service.validate_features(non_numeric)


def test_inference_output_contract_and_explanations():
    """Verify inference output structure, log-odds explainability, and ethical disclaimer."""
    service = technical_capability_service
    features = {
        "coding_skills": 4.5,
        "ai_and_ml_skills": 4.0,
        "maths-stats_skills": 4.5,
        "big_data_skills": 3.5,
        "dashboard_and_storytelling_skills": 4.0
    }
    result = service.predict_capability(features)

    assert "signal" in result
    assert "confidence" in result
    assert "probability_high_capability" in result
    assert "probability_low_capability" in result
    assert "model" in result
    assert "model_version" in result
    assert "features_evaluated" in result
    assert "explanations" in result
    assert "positive_drivers" in result
    assert "growth_areas" in result
    assert "interpretation" in result
    assert "disclaimer" in result

    # Probabilities sum to 1.0
    total_prob = result["probability_high_capability"] + result["probability_low_capability"]
    assert abs(total_prob - 1.0) < 0.01

    # Explanations detail
    assert len(result["explanations"]) == 5
    for exp in result["explanations"]:
        assert "feature" in exp
        assert "display_name" in exp
        assert "value" in exp
        assert "coefficient" in exp
        assert "z_score" in exp
        assert "log_odds_contribution" in exp
        assert "impact_direction" in exp

    # Ethical disclaimer check: No hiring probability claims
    assert "NOT a hiring probability" in result["disclaimer"]
    assert "strictly" in result["disclaimer"]


def test_capability_signals_sensitivity():
    """Verify model discriminates between high-strength and developing profiles."""
    service = technical_capability_service

    # High capability profile (well above sample means)
    high_feats = {
        "coding_skills": 4.8,
        "ai_and_ml_skills": 4.8,
        "maths-stats_skills": 4.8,
        "big_data_skills": 4.8,
        "dashboard_and_storytelling_skills": 4.8
    }
    high_res = service.predict_capability(high_feats)
    assert high_res["signal"] == "Strong Technical Foundation"
    assert high_res["confidence"] >= 0.70
    assert len(high_res["positive_drivers"]) > 0

    # Foundational / developing capability profile
    low_feats = {
        "coding_skills": 1.5,
        "ai_and_ml_skills": 1.5,
        "maths-stats_skills": 1.5,
        "big_data_skills": 1.5,
        "dashboard_and_storytelling_skills": 1.5
    }
    low_res = service.predict_capability(low_feats)
    assert low_res["signal"] == "Developing Technical Foundation"
    assert low_res["confidence"] < 0.45
    assert len(low_res["growth_areas"]) > 0


@pytest.mark.anyio
async def test_api_canonical_model_endpoint():
    """Verify GET /api/models/canonical returns metadata of the single production model."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/models/canonical")
        assert res.status_code == 200
        data = res.json()
        assert data["model_type"] == "LogisticRegression"
        assert data["dataset"] == "technical_capability"
        assert abs(data["accuracy"] - 0.8529) < 0.001
        assert abs(data["roc_auc"] - 0.9035) < 0.001


@pytest.mark.anyio
async def test_api_predict_technical_capability_endpoint():
    """Verify POST /api/candidate/technical-capability handles valid and invalid requests."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Valid payload
        valid_payload = {
            "coding_skills": 4.6,
            "ai_and_ml_skills": 4.7,
            "maths_stats_skills": 4.6,
            "big_data_skills": 4.2,
            "dashboard_and_storytelling_skills": 4.5
        }
        res = await client.post("/api/candidate/technical-capability", json=valid_payload)
        assert res.status_code == 200
        data = res.json()
        assert data["signal"] == "Strong Technical Foundation"
        assert 0.70 <= data["confidence"] <= 1.0
        assert len(data["explanations"]) == 5

        # Invalid payload (out of range > 5.0)
        invalid_payload = valid_payload.copy()
        invalid_payload["coding_skills"] = 9.9
        res_invalid = await client.post("/api/candidate/technical-capability", json=invalid_payload)
        assert res_invalid.status_code == 422


@pytest.mark.anyio
async def test_api_analyze_populates_technical_profile():
    """Verify POST /api/candidate/analyze automatically populates technical_profile via ML model."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "target_role": "machine-learning-engineer",
            "resume_text": "EXPERIENCE\nML Engineer\n- Trained PyTorch deep learning models.\n- Built feature engineering pipelines and model serving endpoints.\n- Applied statistics and mathematical evaluation.",
            "github_handle": ""
        }
        res = await client.post("/api/candidate/analyze", data=payload)
        assert res.status_code == 200
        data = res.json()

        assert "technical_profile" in data
        tech = data["technical_profile"]
        assert tech is not None
        assert tech["model_name"] == "technical_capability_logistic_regression"
        assert tech["signal"] in ["Strong Technical Foundation", "Moderate Technical Foundation", "Developing Technical Foundation"]
        assert 0.0 <= tech["model_confidence"] <= 1.0
        assert len(tech["ethical_disclaimer"]) > 20
        assert "NOT a hiring" in tech["ethical_disclaimer"]
