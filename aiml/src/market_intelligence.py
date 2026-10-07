"""
src/market_intelligence.py
Market-Derived Skill Adjacency and Role Intelligence Layer for CareerGPS.

Extracts:
1. Skill co-occurrence, Jaccard similarity, and conditional probabilities from 15,841 job postings in clean_analytics_jobs.csv.
2. Market-Derived Skill Adjacency network (e.g. Python <-> SQL, Spark <-> Hadoop, Power BI <-> Tableau).
3. Role-level salary and experience benchmarks from 1,602 postings in clean_datascience_jobs.csv.
4. Generates visual artifact: reports/figures/market_skill_adjacency.png.
5. Exports structured JSON: reports/market_intelligence.json.
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Set plotting style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Arial'


def compute_skill_adjacency(filepath="data/cleaned/clean_analytics_jobs.csv"):
    """
    Compute co-occurrence matrix, Jaccard similarity, and pairwise association
    across core technical skills in the analytics market.
    """
    df = pd.read_csv(filepath)
    
    # Filter to specific actionable technical skills
    skill_mapping = {
        'has_skill_sql': 'SQL',
        'has_skill_python': 'Python',
        'has_skill_machine_learning': 'Machine Learning',
        'has_skill_r': 'R',
        'has_skill_sas': 'SAS',
        'has_skill_excel': 'Excel',
        'has_skill_spark': 'Spark',
        'has_skill_hadoop': 'Hadoop',
        'has_skill_tableau': 'Tableau',
        'has_skill_deep_learning': 'Deep Learning',
        'has_skill_power_bi': 'Power BI',
        'has_skill_aws': 'AWS'
    }
    
    skill_cols = list(skill_mapping.keys())
    skill_names = [skill_mapping[c] for c in skill_cols]
    
    skill_sub = df[skill_cols].copy()
    skill_sub.columns = skill_names
    
    # Total counts
    single_counts = skill_sub.sum()
    
    # Co-occurrence matrix (C = X.T @ X)
    cooccurrence = skill_sub.T.dot(skill_sub)
    
    # Jaccard similarity matrix J_ij = C_ij / (C_ii + C_jj - C_ij)
    n_skills = len(skill_names)
    jaccard_matrix = np.zeros((n_skills, n_skills))
    conditional_prob = np.zeros((n_skills, n_skills))  # P(Col | Row)
    
    for i in range(n_skills):
        for j in range(n_skills):
            c_ij = cooccurrence.iloc[i, j]
            c_ii = cooccurrence.iloc[i, i]
            c_jj = cooccurrence.iloc[j, j]
            denom = c_ii + c_jj - c_ij
            jaccard_matrix[i, j] = c_ij / denom if denom > 0 else 0
            conditional_prob[i, j] = c_ij / c_ii if c_ii > 0 else 0
            
    jaccard_df = pd.DataFrame(jaccard_matrix, index=skill_names, columns=skill_names)
    cond_df = pd.DataFrame(conditional_prob, index=skill_names, columns=skill_names)
    
    # Extract top pairwise adjacencies (excluding self-pairs)
    pairs = []
    for i in range(n_skills):
        for j in range(i + 1, n_skills):
            s1 = skill_names[i]
            s2 = skill_names[j]
            c_ij = int(cooccurrence.iloc[i, j])
            j_ij = float(jaccard_df.iloc[i, j])
            p_s2_given_s1 = float(cond_df.iloc[i, j])
            p_s1_given_s2 = float(cond_df.iloc[j, i])
            
            pairs.append({
                'skill_1': s1,
                'skill_2': s2,
                'pair': f"{s1} <-> {s2}",
                'cooccurrence_count': c_ij,
                'jaccard_similarity': j_ij,
                'prob_s2_given_s1': p_s2_given_s1,
                'prob_s1_given_s2': p_s1_given_s2
            })
            
    pairs_df = pd.DataFrame(pairs).sort_values('jaccard_similarity', ascending=False)
    
    return {
        'single_counts': single_counts.to_dict(),
        'cooccurrence_df': cooccurrence,
        'jaccard_df': jaccard_df,
        'conditional_prob_df': cond_df,
        'top_pairs': pairs_df
    }


def compute_role_market_context(filepath="data/cleaned/clean_datascience_jobs.csv"):
    """
    Summarize salary benchmarks and experience distributions across standardized roles.
    """
    df = pd.read_csv(filepath)
    
    role_summary = df.groupby('job_title').agg(
        total_postings=('num_of_jobs_posted', 'sum'),
        records=('reference_no', 'count'),
        mean_salary_lakhs=('avg_salary_lakhs', 'mean'),
        median_salary_lakhs=('avg_salary_lakhs', 'median'),
        mean_min_exp=('min_experience_years', 'mean'),
        senior_roles_count=('is_senior_role', 'sum')
    ).reset_index().sort_values('mean_salary_lakhs', ascending=False)
    
    senior_vs_nonsenior = df.groupby('is_senior_role').agg(
        mean_salary=('avg_salary_lakhs', 'mean'),
        median_salary=('avg_salary_lakhs', 'median'),
        mean_exp=('min_experience_years', 'mean'),
        total_postings=('num_of_jobs_posted', 'sum')
    ).to_dict(orient='index')
    
    return {
        'role_summary': role_summary.to_dict(orient='records'),
        'seniority_differential': senior_vs_nonsenior
    }


def plot_market_skill_adjacency(jaccard_df, cooccurrence_df, top_pairs_df, save_path):
    """
    Plot dual-panel figure:
    1. Jaccard Similarity Heatmap across key skills.
    2. Top 10 Market-Derived Skill Adjacencies by Jaccard coefficient.
    """
    fig, axes = plt.subplots(1, 2, figsize=(16, 7))
    
    # Panel 1: Jaccard Heatmap
    mask = np.triu(np.ones_like(jaccard_df, dtype=bool))
    sns.heatmap(
        jaccard_df, mask=mask, annot=True, fmt='.2f', cmap='YlGnBu',
        cbar_kws={'label': 'Jaccard Co-Occurrence Index'}, ax=axes[0],
        annot_kws={'size': 9}
    )
    axes[0].set_title("Market Skill Co-Occurrence Matrix (Jaccard Index)\n(N = 15,841 Job Postings)", fontsize=12, fontweight='bold', pad=12)
    axes[0].set_xticklabels(axes[0].get_xticklabels(), rotation=45, ha='right')
    axes[0].set_yticklabels(axes[0].get_yticklabels(), rotation=0)
    
    # Panel 2: Top 10 Skill Adjacencies
    top10 = top_pairs_df.head(10).sort_values('jaccard_similarity', ascending=True)
    bars = axes[1].barh(top10['pair'], top10['jaccard_similarity'], color='#2b5c8f', alpha=0.85, edgecolor='black', linewidth=0.5)
    axes[1].set_title("Top 10 Market-Derived Skill Adjacencies\n(Ranked by Co-Occurrence Affinity)", fontsize=12, fontweight='bold', pad=12)
    axes[1].set_xlabel("Jaccard Similarity Index (Co-occurrence Affinity)", fontsize=11, labelpad=8)
    axes[1].grid(True, linestyle='--', alpha=0.4, axis='x')
    
    for bar, count in zip(bars, top10['cooccurrence_count']):
        axes[1].text(bar.get_width() + 0.005, bar.get_y() + bar.get_height()/2, f"J={bar.get_width():.2f} (n={count:,})", va='center', ha='left', fontsize=9, fontweight='semibold')
        
    plt.suptitle("Market Intelligence: Empirical Skill Clusters & Role Adjacency", fontsize=14, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()


def run_market_intelligence_pipeline():
    """
    Executes skill adjacency and role intelligence extraction.
    """
    os.makedirs('reports/figures', exist_ok=True)
    print("\n>>> Computing Market-Derived Skill Adjacency from Analytics Jobs (N=15,841)...")
    skill_adj = compute_skill_adjacency()
    
    print(">>> Computing Role DNA Market Benchmarks from Data Science Jobs (N=1,602)...")
    role_ctx = compute_role_market_context()
    
    plot_path = "reports/figures/market_skill_adjacency.png"
    plot_market_skill_adjacency(skill_adj['jaccard_df'], skill_adj['cooccurrence_df'], skill_adj['top_pairs'], plot_path)
    print(f"    Saved market adjacency plot to {plot_path}")
    
    # Export JSON
    market_payload = {
        'metadata': {
            'analytics_jobs_sample_size': 15841,
            'datascience_jobs_sample_size': 1602,
            'purpose': 'Market Intelligence & Role DNA (Not Supervised Hiring Labels)'
        },
        'skill_frequency': skill_adj['single_counts'],
        'top_15_skill_adjacencies': skill_adj['top_pairs'].head(15).to_dict(orient='records'),
        'role_benchmarks': role_ctx['role_summary'],
        'seniority_salary_differential': role_ctx['seniority_differential']
    }
    
    with open('reports/market_intelligence.json', 'w') as f:
        json.dump(market_payload, f, indent=2)
    print(">>> Saved market intelligence to reports/market_intelligence.json")
    
    return market_payload


if __name__ == '__main__':
    run_market_intelligence_pipeline()
