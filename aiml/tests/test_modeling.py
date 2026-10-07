"""
tests/test_modeling.py
Comprehensive Unit & Integration Test Suite for CareerGPS Modeling.

Validates:
1. Dataset loading, schema, and column integrity.
2. Leakage prevention (features do not include composite scores or identifiers).
3. Pipeline encapsulation (StandardScaler inside Pipeline).
4. Evaluation metric mathematical bounds (0 <= acc, prec, rec, f1, auc <= 1).
5. Output artifacts existence and structure (CSV, JSON, Markdown, PNG figures).
"""

import os
import sys
import json
import pytest
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# Ensure root directory is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.modeling import (
    load_jds_data,
    load_sds_data,
    get_models,
    evaluate_models_repeated_cv,
    compute_out_of_fold_predictions
)
from src.market_intelligence import compute_skill_adjacency, compute_role_market_context


class TestDataLoadingAndLeakage:
    """Validate raw feature extraction and anti-leakage guards."""

    def test_jds_data_schema(self):
        X, y, feature_cols = load_jds_data()
        assert len(X) == 139, f"Expected 139 rows in JDS, got {len(X)}"
        assert len(y) == 139
        assert len(feature_cols) == 5
        
        # Verify prohibited leakage columns are NOT present
        prohibited = ['id', 'is_duplicate_id', 'composite_skill_score', 'technical_core_score']
        for col in prohibited:
            assert col not in feature_cols, f"Leakage violation: {col} found in JDS features"
            assert col not in X.columns

        # Verify class balance
        class_counts = y.value_counts().to_dict()
        assert class_counts[1] == 73
        assert class_counts[0] == 66

    def test_sds_data_schema(self):
        X, y, feature_cols = load_sds_data()
        assert len(X) == 161, f"Expected 161 rows in SDS, got {len(X)}"
        assert len(y) == 161
        assert len(feature_cols) == 5

        # Verify prohibited leakage columns
        prohibited = ['id', 'is_duplicate_id', 'positive_trait_index']
        for col in prohibited:
            assert col not in feature_cols, f"Leakage violation: {col} found in SDS features"
            assert col not in X.columns

        # Verify class balance
        class_counts = y.value_counts().to_dict()
        assert class_counts[1] == 85
        assert class_counts[0] == 76


class TestModelConfigurationAndPipelines:
    """Validate model setups and strict pipeline encapsulation."""

    def test_get_models_structure(self):
        models = get_models()
        assert 'Dummy (most_frequent)' in models
        assert 'Logistic Regression' in models
        assert 'Decision Tree' in models
        assert 'Random Forest' in models

        # Logistic Regression MUST be a Pipeline with StandardScaler inside
        lr_model = models['Logistic Regression']
        assert isinstance(lr_model, Pipeline), "Logistic Regression must be wrapped in a Pipeline"
        assert 'scaler' in lr_model.named_steps, "Pipeline must contain a scaler step"
        assert isinstance(lr_model.named_steps['scaler'], StandardScaler)

    def test_quick_cv_execution_and_metric_bounds(self):
        """Run a minimal 2-fold 1-repeat check to verify metric math and bounds."""
        X, y, _ = load_jds_data()
        # Take subset for quick test
        X_sub, y_sub = X.iloc[:40], y.iloc[:40]
        models = get_models()
        
        fold_df, summary = evaluate_models_repeated_cv(X_sub, y_sub, models, n_splits=2, n_repeats=1)
        
        for model_name, s in summary.items():
            for metric in ['accuracy_mean', 'balanced_accuracy_mean', 'precision_mean', 'recall_mean', 'f1_mean', 'roc_auc_mean']:
                val = s[metric]
                assert 0.0 <= val <= 1.0, f"Metric {metric} for {model_name} out of bounds: {val}"


class TestMarketIntelligence:
    """Validate skill adjacency and role intelligence extraction."""

    def test_skill_adjacency_computation(self):
        adj = compute_skill_adjacency()
        assert 'jaccard_df' in adj
        assert 'top_pairs' in adj
        top_pairs = adj['top_pairs']
        assert len(top_pairs) > 0
        
        # Jaccard index must be between 0 and 1
        assert (top_pairs['jaccard_similarity'] >= 0.0).all()
        assert (top_pairs['jaccard_similarity'] <= 1.0).all()

        # Check that known pairs exist
        pair_names = set(top_pairs['pair'])
        assert any("Spark <-> Hadoop" in p for p in pair_names)
        assert any("Python <-> Machine Learning" in p for p in pair_names)

    def test_role_benchmarks_computation(self):
        role_ctx = compute_role_market_context()
        assert 'role_summary' in role_ctx
        assert 'seniority_differential' in role_ctx
        assert len(role_ctx['role_summary']) == 10  # 10 standardized roles


class TestArtifactsAndOutputs:
    """Ensure all required artifact files exist and are non-empty."""

    def test_csv_results_exist(self):
        csv_path = "reports/model_results.csv"
        assert os.path.exists(csv_path), f"Missing {csv_path}"
        df = pd.read_csv(csv_path)
        assert len(df) == 8  # 4 models x 2 datasets
        assert set(df['dataset']) == {'JDS', 'SDS'}

    def test_json_results_exist(self):
        json_path = "reports/model_results.json"
        assert os.path.exists(json_path), f"Missing {json_path}"
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        assert 'jds' in data
        assert 'sds' in data
        assert 'Dummy (most_frequent)' in data['jds']['summary_metrics']
        assert 'Logistic Regression' in data['jds']['summary_metrics']

    def test_market_intelligence_json_exists(self):
        path = "reports/market_intelligence.json"
        assert os.path.exists(path), f"Missing {path}"
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        assert 'top_15_skill_adjacencies' in data
        assert 'role_benchmarks' in data

    def test_all_figures_exist(self):
        required_figures = [
            'reports/figures/jds_confusion_matrix.png',
            'reports/figures/jds_roc_curve.png',
            'reports/figures/jds_feature_importance.png',
            'reports/figures/sds_confusion_matrix.png',
            'reports/figures/sds_roc_curve.png',
            'reports/figures/sds_feature_importance.png',
            'reports/figures/market_skill_adjacency.png'
        ]
        for fig in required_figures:
            assert os.path.exists(fig), f"Missing figure artifact: {fig}"
            assert os.path.getsize(fig) > 1000, f"Figure file suspiciously small: {fig}"

    def test_modeling_report_exists(self):
        report_path = "reports/Modeling_Report.md"
        assert os.path.exists(report_path), f"Missing {report_path}"
        with open(report_path, 'r', encoding='utf-8') as f:
            content = f.read()
        assert len(content) > 2000
        assert "JDS Skill Traits" in content
        assert "SDS Personality Traits" in content
        assert "Market-Derived Skill Adjacency" in content
