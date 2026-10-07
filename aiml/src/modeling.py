"""
src/modeling.py
Rigorous Supervised Modeling Suite for JDS and SDS Datasets.

Features:
- Strict leakage prevention: all scaling inside cross-validation pipelines.
- RepeatedStratifiedKFold validation (5 folds x 5 repeats = 25 evaluations).
- Models evaluated: Dummy (most_frequent), Logistic Regression, Decision Tree, Random Forest.
- Complete metric reporting: Accuracy, Balanced Accuracy, Precision, Recall, F1, ROC-AUC (mean ± std).
- Out-of-fold confusion matrices, ROC curves, and feature interpretations.
- Machine-readable outputs: reports/model_results.csv, reports/model_results.json.
- Visual outputs: reports/figures/
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import RepeatedStratifiedKFold, StratifiedKFold
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve,
    classification_report
)

# Set plotting style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['axes.edgecolor'] = '#cccccc'
plt.rcParams['axes.linewidth'] = 0.8


class NumpyJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder to handle numpy data types."""
    def default(self, obj):
        if isinstance(obj, (np.integer, np.int64, np.int32)):
            return int(obj)
        elif isinstance(obj, (np.floating, np.float64, np.float32)):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)


def load_jds_data(filepath="data/cleaned/clean_jds_skill_traits.csv"):
    """
    Load cleaned JDS dataset and extract valid technical features and target.
    Excludes synthetic composites, IDs, and artifacts to prevent leakage.
    """
    df = pd.read_csv(filepath)
    feature_cols = [
        'big_data_skills',
        'maths-stats_skills',
        'coding_skills',
        'ai_and_ml_skills',
        'dashboard_and_storytelling_skills'
    ]
    target_col = 'salary_hike_high_or_low'
    
    X = df[feature_cols].copy()
    y = df[target_col].copy()
    return X, y, feature_cols


def load_sds_data(filepath="data/cleaned/clean_sds_personality_traits.csv"):
    """
    Load cleaned SDS dataset and extract valid OCEAN personality features and target.
    Excludes synthetic composites, IDs, and artifacts to prevent leakage.
    """
    df = pd.read_csv(filepath)
    feature_cols = [
        'neuroticism',
        'extraversion',
        'openness_to_experience',
        'agreeableness',
        'conscientiousness'
    ]
    target_col = 'success_classification_high_low'
    
    X = df[feature_cols].copy()
    y = df[target_col].copy()
    return X, y, feature_cols


def get_models(random_state=42):
    """
    Return dictionary of models to evaluate.
    Scaling is encapsulated inside Pipeline for Logistic Regression.
    Trees and Forests are conservatively regularized to prevent overfitting on small N.
    """
    models = {
        'Dummy (most_frequent)': DummyClassifier(strategy='most_frequent'),
        'Logistic Regression': Pipeline([
            ('scaler', StandardScaler()),
            ('clf', LogisticRegression(C=1.0, solver='lbfgs', max_iter=1000, random_state=random_state))
        ]),
        'Decision Tree': DecisionTreeClassifier(
            max_depth=3,
            min_samples_leaf=5,
            min_samples_split=10,
            random_state=random_state
        ),
        'Random Forest': RandomForestClassifier(
            n_estimators=100,
            max_depth=4,
            min_samples_leaf=3,
            min_samples_split=6,
            max_features='sqrt',
            random_state=random_state
        )
    }
    return models


def evaluate_models_repeated_cv(X, y, models, n_splits=5, n_repeats=5, random_state=42):
    """
    Evaluate models with RepeatedStratifiedKFold.
    Computes Accuracy, Balanced Accuracy, Precision, Recall, F1, and ROC-AUC per fold.
    Returns per-fold metrics dataframe and aggregated summary dictionary.
    """
    rskf = RepeatedStratifiedKFold(n_splits=n_splits, n_repeats=n_repeats, random_state=random_state)
    
    all_fold_records = []
    summary_results = {}
    
    for model_name, model in models.items():
        accuracies = []
        balanced_accuracies = []
        precisions = []
        recalls = []
        f1_scores = []
        roc_aucs = []
        
        for fold_idx, (train_idx, val_idx) in enumerate(rskf.split(X, y)):
            X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
            y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]
            
            # Clone/fit model strictly on training fold
            # Reset pipeline/model state
            model.fit(X_train, y_train)
            
            # Predictions
            y_pred = model.predict(X_val)
            
            # Probability predictions for ROC-AUC
            if hasattr(model, "predict_proba"):
                y_prob = model.predict_proba(X_val)[:, 1]
            elif hasattr(model, "decision_function"):
                y_prob = model.decision_function(X_val)
            else:
                # Dummy classifier constant probabilities
                y_prob = np.full(len(y_val), 0.5)
                
            acc = accuracy_score(y_val, y_pred)
            bal_acc = balanced_accuracy_score(y_val, y_pred)
            prec = precision_score(y_val, y_pred, zero_division=0)
            rec = recall_score(y_val, y_pred, zero_division=0)
            f1 = f1_score(y_val, y_pred, zero_division=0)
            
            try:
                auc = roc_auc_score(y_val, y_prob)
            except Exception:
                auc = 0.500
                
            accuracies.append(acc)
            balanced_accuracies.append(bal_acc)
            precisions.append(prec)
            recalls.append(rec)
            f1_scores.append(f1)
            roc_aucs.append(auc)
            
            all_fold_records.append({
                'model': model_name,
                'fold': fold_idx + 1,
                'accuracy': acc,
                'balanced_accuracy': bal_acc,
                'precision': prec,
                'recall': rec,
                'f1': f1,
                'roc_auc': auc
            })
            
        summary_results[model_name] = {
            'accuracy_mean': float(np.mean(accuracies)),
            'accuracy_std': float(np.std(accuracies)),
            'balanced_accuracy_mean': float(np.mean(balanced_accuracies)),
            'balanced_accuracy_std': float(np.std(balanced_accuracies)),
            'precision_mean': float(np.mean(precisions)),
            'precision_std': float(np.std(precisions)),
            'recall_mean': float(np.mean(recalls)),
            'recall_std': float(np.std(recalls)),
            'f1_mean': float(np.mean(f1_scores)),
            'f1_std': float(np.std(f1_scores)),
            'roc_auc_mean': float(np.mean(roc_aucs)),
            'roc_auc_std': float(np.std(roc_aucs))
        }
        
    return pd.DataFrame(all_fold_records), summary_results


def compute_out_of_fold_predictions(X, y, models, n_splits=5, random_state=42):
    """
    Generate clean, unbiased out-of-fold predictions and probabilities using StratifiedKFold.
    Each sample receives an unbiased prediction generated by a model trained without that sample.
    """
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=random_state)
    oof_predictions = {}
    
    for model_name, model in models.items():
        oof_pred = np.zeros(len(y), dtype=int)
        oof_prob = np.zeros(len(y), dtype=float)
        
        for train_idx, val_idx in skf.split(X, y):
            X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
            y_train = y.iloc[train_idx]
            
            model.fit(X_train, y_train)
            oof_pred[val_idx] = model.predict(X_val)
            
            if hasattr(model, "predict_proba"):
                oof_prob[val_idx] = model.predict_proba(X_val)[:, 1]
            elif hasattr(model, "decision_function"):
                oof_prob[val_idx] = model.decision_function(X_val)
            else:
                oof_prob[val_idx] = 0.5
                
        oof_predictions[model_name] = {
            'y_pred': oof_pred,
            'y_prob': oof_prob
        }
        
    return oof_predictions


def extract_feature_interpretations(X, y, feature_cols, models):
    """
    Fit models on full dataset to extract coefficients and feature importances.
    Returns structured dictionaries of model interpretations.
    """
    interpretations = {}
    
    # 1. Logistic Regression
    lr_pipe = models['Logistic Regression']
    lr_pipe.fit(X, y)
    clf = lr_pipe.named_steps['clf']
    scaler = lr_pipe.named_steps['scaler']
    
    coefs = clf.coef_[0]
    odds_ratios = np.exp(coefs)
    
    lr_interp = []
    for feat, coef, odds in zip(feature_cols, coefs, odds_ratios):
        lr_interp.append({
            'feature': feat,
            'coefficient': float(coef),
            'odds_ratio': float(odds),
            'abs_magnitude': float(abs(coef)),
            'direction': 'Positive' if coef > 0 else 'Negative'
        })
    lr_interp.sort(key=lambda x: x['abs_magnitude'], reverse=True)
    interpretations['Logistic Regression'] = {
        'intercept': float(clf.intercept_[0]),
        'features': lr_interp
    }
    
    # 2. Decision Tree
    dt = models['Decision Tree']
    dt.fit(X, y)
    dt_interp = []
    for feat, imp in zip(feature_cols, dt.feature_importances_):
        dt_interp.append({
            'feature': feat,
            'importance': float(imp)
        })
    dt_interp.sort(key=lambda x: x['importance'], reverse=True)
    interpretations['Decision Tree'] = {
        'max_depth': dt.get_depth(),
        'n_leaves': dt.get_n_leaves(),
        'features': dt_interp
    }
    
    # 3. Random Forest
    rf = models['Random Forest']
    rf.fit(X, y)
    rf_interp = []
    for feat, imp in zip(feature_cols, rf.feature_importances_):
        rf_interp.append({
            'feature': feat,
            'importance': float(imp)
        })
    rf_interp.sort(key=lambda x: x['importance'], reverse=True)
    interpretations['Random Forest'] = {
        'n_estimators': rf.n_estimators,
        'features': rf_interp
    }
    
    return interpretations


def plot_confusion_matrices(oof_dict, y, dataset_name, save_path):
    """
    Generate professional multi-panel confusion matrix plot.
    """
    models_to_plot = [m for m in oof_dict.keys() if m != 'Dummy (most_frequent)']
    fig, axes = plt.subplots(1, len(models_to_plot), figsize=(5 * len(models_to_plot), 4.5))
    if len(models_to_plot) == 1:
        axes = [axes]
        
    class_labels = ['Low (0)', 'High (1)']
    
    for ax, model_name in zip(axes, models_to_plot):
        cm = confusion_matrix(y, oof_dict[model_name]['y_pred'])
        sns.heatmap(
            cm, annot=True, fmt='d', cmap='Blues', cbar=False,
            xticklabels=class_labels, yticklabels=class_labels, ax=ax,
            annot_kws={'size': 14, 'weight': 'bold'}
        )
        ax.set_title(f"{model_name}\n(Out-of-Fold Matrix)", fontsize=12, fontweight='bold', pad=10)
        ax.set_xlabel('Predicted Label', fontsize=11, labelpad=8)
        ax.set_ylabel('True Label', fontsize=11, labelpad=8)
        
    plt.suptitle(f"Confusion Matrices — {dataset_name}", fontsize=14, fontweight='bold', y=1.05)
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()


def plot_roc_curves(oof_dict, y, dataset_name, save_path):
    """
    Plot ROC Curves for models with probability predictions.
    """
    plt.figure(figsize=(7, 6))
    
    colors = {
        'Logistic Regression': '#1f77b4',
        'Decision Tree': '#2ca02c',
        'Random Forest': '#ff7f0e'
    }
    
    for model_name, col in colors.items():
        if model_name in oof_dict:
            y_prob = oof_dict[model_name]['y_prob']
            fpr, tpr, _ = roc_curve(y, y_prob)
            auc_val = roc_auc_score(y, y_prob)
            plt.plot(fpr, tpr, label=f"{model_name} (OOF AUC = {auc_val:.3f})", color=col, lw=2.2)
            
    plt.plot([0, 1], [0, 1], 'k--', lw=1.5, alpha=0.7, label='Chance Baseline (AUC = 0.500)')
    plt.xlim([-0.02, 1.02])
    plt.ylim([-0.02, 1.02])
    plt.xlabel('False Positive Rate (1 - Specificity)', fontsize=11, labelpad=8)
    plt.ylabel('True Positive Rate (Sensitivity / Recall)', fontsize=11, labelpad=8)
    plt.title(f"ROC Curves (Out-of-Fold) — {dataset_name}", fontsize=13, fontweight='bold', pad=12)
    plt.legend(loc='lower right', frameon=True, fontsize=10)
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()


def plot_feature_importance(interpretations, dataset_name, save_path):
    """
    Plot Logistic Regression coefficients and Random Forest feature importances.
    """
    fig, axes = plt.subplots(1, 2, figsize=(14, 5.5))
    
    # 1. Logistic Regression Coefficients
    lr_data = interpretations['Logistic Regression']['features']
    lr_df = pd.DataFrame(lr_data).sort_values('coefficient', ascending=True)
    
    bar_colors = ['#2ca02c' if c > 0 else '#d62728' for c in lr_df['coefficient']]
    axes[0].barh(lr_df['feature'], lr_df['coefficient'], color=bar_colors, alpha=0.85, edgecolor='black', linewidth=0.5)
    axes[0].axvline(0, color='black', linestyle='--', linewidth=0.8)
    axes[0].set_title("Logistic Regression Standardized Coefficients (β)", fontsize=12, fontweight='bold', pad=10)
    axes[0].set_xlabel("Standardized Coefficient (Positive = Drives High Class)", fontsize=10, labelpad=8)
    axes[0].grid(True, linestyle='--', alpha=0.4, axis='x')
    
    # Annotate odds ratios
    for idx, row in enumerate(lr_df.itertuples()):
        text_pos = row.coefficient + (0.05 if row.coefficient >= 0 else -0.05)
        align = 'left' if row.coefficient >= 0 else 'right'
        axes[0].text(text_pos, idx, f"OR={row.odds_ratio:.2f}", va='center', ha=align, fontsize=9, fontweight='semibold')
        
    # 2. Random Forest Importance
    rf_data = interpretations['Random Forest']['features']
    rf_df = pd.DataFrame(rf_data).sort_values('importance', ascending=True)
    axes[1].barh(rf_df['feature'], rf_df['importance'], color='#1f77b4', alpha=0.85, edgecolor='black', linewidth=0.5)
    axes[1].set_title("Random Forest Feature Importance (MDI)", fontsize=12, fontweight='bold', pad=10)
    axes[1].set_xlabel("Mean Decrease in Impurity (Gini Importance)", fontsize=10, labelpad=8)
    axes[1].grid(True, linestyle='--', alpha=0.4, axis='x')
    
    for idx, row in enumerate(rf_df.itertuples()):
        axes[1].text(row.importance + 0.005, idx, f"{row.importance*100:.1f}%", va='center', ha='left', fontsize=9, fontweight='semibold')
        
    plt.suptitle(f"Model Feature Interpretations — {dataset_name}", fontsize=14, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()


def run_full_modeling_pipeline():
    """
    Main pipeline execution:
    1. Runs JDS modeling
    2. Runs SDS modeling
    3. Exports CSV and JSON summaries
    4. Generates visual figures
    Returns complete structured results.
    """
    os.makedirs('reports/figures', exist_ok=True)
    
    print("\n" + "=" * 80)
    print("CAREERGPS RIGOROUS SUPERVISED MODELING PIPELINE")
    print("=" * 80)
    
    # -----------------------------
    # 1. JDS DATASET EVALUATION
    # -----------------------------
    print("\n>>> [1/2] Evaluating JDS Technical Skills Dataset...")
    X_jds, y_jds, jds_features = load_jds_data()
    print(f"    Loaded {len(X_jds)} rows with {len(jds_features)} features: {jds_features}")
    print(f"    Target 'salary_hike_high_or_low' distribution: Class 1 = {int((y_jds == 1).sum())} ({float((y_jds == 1).mean()*100):.1f}%), Class 0 = {int((y_jds == 0).sum())} ({float((y_jds == 0).mean()*100):.1f}%)")
    
    jds_models = get_models(random_state=42)
    jds_fold_df, jds_summary = evaluate_models_repeated_cv(X_jds, y_jds, jds_models, n_splits=5, n_repeats=5, random_state=42)
    jds_oof = compute_out_of_fold_predictions(X_jds, y_jds, jds_models, n_splits=5, random_state=42)
    jds_interp = extract_feature_interpretations(X_jds, y_jds, jds_features, jds_models)
    
    # Visualizations
    plot_confusion_matrices(jds_oof, y_jds, "JDS Skill Traits (Salary Hike)", "reports/figures/jds_confusion_matrix.png")
    plot_roc_curves(jds_oof, y_jds, "JDS Skill Traits (Salary Hike)", "reports/figures/jds_roc_curve.png")
    plot_feature_importance(jds_interp, "JDS Technical Skills", "reports/figures/jds_feature_importance.png")
    print("    JDS plots saved to reports/figures/")
    
    # -----------------------------
    # 2. SDS DATASET EVALUATION
    # -----------------------------
    print("\n>>> [2/2] Evaluating SDS Personality Traits Dataset...")
    X_sds, y_sds, sds_features = load_sds_data()
    print(f"    Loaded {len(X_sds)} rows with {len(sds_features)} features: {sds_features}")
    print(f"    Target 'success_classification_high_low' distribution: Class 1 = {int((y_sds == 1).sum())} ({float((y_sds == 1).mean()*100):.1f}%), Class 0 = {int((y_sds == 0).sum())} ({float((y_sds == 0).mean()*100):.1f}%)")
    
    sds_models = get_models(random_state=42)
    sds_fold_df, sds_summary = evaluate_models_repeated_cv(X_sds, y_sds, sds_models, n_splits=5, n_repeats=5, random_state=42)
    sds_oof = compute_out_of_fold_predictions(X_sds, y_sds, sds_models, n_splits=5, random_state=42)
    sds_interp = extract_feature_interpretations(X_sds, y_sds, sds_features, sds_models)
    
    # Visualizations
    plot_confusion_matrices(sds_oof, y_sds, "SDS Personality Traits (Success Classification)", "reports/figures/sds_confusion_matrix.png")
    plot_roc_curves(sds_oof, y_sds, "SDS Personality Traits (Success Classification)", "reports/figures/sds_roc_curve.png")
    plot_feature_importance(sds_interp, "SDS OCEAN Personality Traits", "reports/figures/sds_feature_importance.png")
    print("    SDS plots saved to reports/figures/")
    
    # -----------------------------
    # 3. CONSOLIDATE RESULTS TABLE
    # -----------------------------
    results_rows = []
    for model_name, s in jds_summary.items():
        results_rows.append({
            'dataset': 'JDS',
            'target': 'salary_hike_high_or_low',
            'model': model_name,
            'accuracy_mean': s['accuracy_mean'],
            'accuracy_std': s['accuracy_std'],
            'balanced_accuracy_mean': s['balanced_accuracy_mean'],
            'balanced_accuracy_std': s['balanced_accuracy_std'],
            'precision_mean': s['precision_mean'],
            'precision_std': s['precision_std'],
            'recall_mean': s['recall_mean'],
            'recall_std': s['recall_std'],
            'f1_mean': s['f1_mean'],
            'f1_std': s['f1_std'],
            'roc_auc_mean': s['roc_auc_mean'],
            'roc_auc_std': s['roc_auc_std'],
            'accuracy_display': f"{s['accuracy_mean']:.3f} ± {s['accuracy_std']:.3f}",
            'balanced_accuracy_display': f"{s['balanced_accuracy_mean']:.3f} ± {s['balanced_accuracy_std']:.3f}",
            'precision_display': f"{s['precision_mean']:.3f} ± {s['precision_std']:.3f}",
            'recall_display': f"{s['recall_mean']:.3f} ± {s['recall_std']:.3f}",
            'f1_display': f"{s['f1_mean']:.3f} ± {s['f1_std']:.3f}",
            'roc_auc_display': f"{s['roc_auc_mean']:.3f} ± {s['roc_auc_std']:.3f}"
        })
        
    for model_name, s in sds_summary.items():
        results_rows.append({
            'dataset': 'SDS',
            'target': 'success_classification_high_low',
            'model': model_name,
            'accuracy_mean': s['accuracy_mean'],
            'accuracy_std': s['accuracy_std'],
            'balanced_accuracy_mean': s['balanced_accuracy_mean'],
            'balanced_accuracy_std': s['balanced_accuracy_std'],
            'precision_mean': s['precision_mean'],
            'precision_std': s['precision_std'],
            'recall_mean': s['recall_mean'],
            'recall_std': s['recall_std'],
            'f1_mean': s['f1_mean'],
            'f1_std': s['f1_std'],
            'roc_auc_mean': s['roc_auc_mean'],
            'roc_auc_std': s['roc_auc_std'],
            'accuracy_display': f"{s['accuracy_mean']:.3f} ± {s['accuracy_std']:.3f}",
            'balanced_accuracy_display': f"{s['balanced_accuracy_mean']:.3f} ± {s['balanced_accuracy_std']:.3f}",
            'precision_display': f"{s['precision_mean']:.3f} ± {s['precision_std']:.3f}",
            'recall_display': f"{s['recall_mean']:.3f} ± {s['recall_std']:.3f}",
            'f1_display': f"{s['f1_mean']:.3f} ± {s['f1_std']:.3f}",
            'roc_auc_display': f"{s['roc_auc_mean']:.3f} ± {s['roc_auc_std']:.3f}"
        })
        
    results_df = pd.DataFrame(results_rows)
    results_df.to_csv('reports/model_results.csv', index=False)
    print("\n>>> Saved results table to reports/model_results.csv")
    
    # JSON Export
    json_payload = {
        'metadata': {
            'n_splits': 5,
            'n_repeats': 5,
            'total_cv_evaluations': 25,
            'random_state': 42
        },
        'jds': {
            'dataset': 'JDS Skill Traits',
            'rows': len(X_jds),
            'features': jds_features,
            'target': 'salary_hike_high_or_low',
            'class_distribution': {
                'class_1_high_hike': int((y_jds == 1).sum()),
                'class_0_low_hike': int((y_jds == 0).sum()),
                'class_1_pct': float((y_jds == 1).mean()),
                'class_0_pct': float((y_jds == 0).mean())
            },
            'summary_metrics': jds_summary,
            'interpretations': jds_interp
        },
        'sds': {
            'dataset': 'SDS Personality Traits',
            'rows': len(X_sds),
            'features': sds_features,
            'target': 'success_classification_high_low',
            'class_distribution': {
                'class_1_high_success': int((y_sds == 1).sum()),
                'class_0_low_success': int((y_sds == 0).sum()),
                'class_1_pct': float((y_sds == 1).mean()),
                'class_0_pct': float((y_sds == 0).mean())
            },
            'summary_metrics': sds_summary,
            'interpretations': sds_interp
        }
    }
    
    with open('reports/model_results.json', 'w') as f:
        json.dump(json_payload, f, indent=2, cls=NumpyJSONEncoder)
    print(">>> Saved JSON payload to reports/model_results.json")
    
    return json_payload, results_df


if __name__ == '__main__':
    run_full_modeling_pipeline()
