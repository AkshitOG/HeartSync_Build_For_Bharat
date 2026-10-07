import os
import pandas as pd
import numpy as np
from scipy import stats

cleaned_dir = r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\data\cleaned"
ds_jobs = pd.read_csv(os.path.join(cleaned_dir, "clean_datascience_jobs.csv"))
an_jobs = pd.read_csv(os.path.join(cleaned_dir, "clean_analytics_jobs.csv"))
jds = pd.read_csv(os.path.join(cleaned_dir, "clean_jds_skill_traits.csv"))
sds = pd.read_csv(os.path.join(cleaned_dir, "clean_sds_personality_traits.csv"))

print("=" * 80)
print("STATISTICAL VALIDATION SUITE")
print("=" * 80)

# 1. JDS Skills vs Salary Hike Outcome: Two-Sample t-tests and Cohen's d
print("\n1. JDS SKILLS vs SALARY HIKE (High Hike vs Low Hike)")
skill_cols = ['big_data_skills', 'maths-stats_skills', 'coding_skills', 'ai_and_ml_skills', 'dashboard_and_storytelling_skills', 'composite_skill_score']
hike_high = jds[jds['salary_hike_high_or_low'] == 1]
hike_low = jds[jds['salary_hike_high_or_low'] == 0]

for sc in skill_cols:
    t_stat, p_val = stats.ttest_ind(hike_high[sc], hike_low[sc], equal_var=False)
    # Cohen's d
    n1, n2 = len(hike_high), len(hike_low)
    s1, s2 = hike_high[sc].std(), hike_low[sc].std()
    s_pooled = np.sqrt(((n1 - 1)*s1**2 + (n2 - 1)*s2**2) / (n1 + n2 - 2))
    d = (hike_high[sc].mean() - hike_low[sc].mean()) / s_pooled
    print(f"  {sc:35s}: High Mean={hike_high[sc].mean():.2f}, Low Mean={hike_low[sc].mean():.2f} | t={t_stat:6.2f}, p={p_val:.4e}, Cohen's d={d:5.2f}")

# 2. SDS Personality Traits vs Success Classification
print("\n2. SDS PERSONALITY TRAITS vs SUCCESS (High Success vs Low Success)")
trait_cols = ['conscientiousness', 'openness_to_experience', 'extraversion', 'agreeableness', 'neuroticism', 'positive_trait_index']
succ_high = sds[sds['success_classification_high_low'] == 1]
succ_low = sds[sds['success_classification_high_low'] == 0]

for tc in trait_cols:
    t_stat, p_val = stats.ttest_ind(succ_high[tc], succ_low[tc], equal_var=False)
    n1, n2 = len(succ_high), len(succ_low)
    s1, s2 = succ_high[tc].std(), succ_low[tc].std()
    s_pooled = np.sqrt(((n1 - 1)*s1**2 + (n2 - 1)*s2**2) / (n1 + n2 - 2))
    d = (succ_high[tc].mean() - succ_low[tc].mean()) / s_pooled
    print(f"  {tc:35s}: High Mean={succ_high[tc].mean():.2f}, Low Mean={succ_low[tc].mean():.2f} | t={t_stat:6.2f}, p={p_val:.4e}, Cohen's d={d:5.2f}")

# 3. Data Science: Senior vs Non-Senior Salary Premium
print("\n3. DATA SCIENCE JOBS: SENIOR VS NON-SENIOR SALARY DIFFERENTIAL")
ds_senior = ds_jobs[ds_jobs['is_senior_role'] == 1]['avg_salary_lakhs']
ds_junior = ds_jobs[ds_jobs['is_senior_role'] == 0]['avg_salary_lakhs']
t_stat, p_val = stats.ttest_ind(ds_senior, ds_junior, equal_var=False)
d = (ds_senior.mean() - ds_junior.mean()) / np.sqrt((ds_senior.var() + ds_junior.var()) / 2)
print(f"  Senior Roles Mean Salary: INR {ds_senior.mean():.2f}L | Non-Senior Roles: INR {ds_junior.mean():.2f}L")
print(f"  t={t_stat:.2f}, p={p_val:.4e}, Cohen's d={d:.2f}")

# 4. Analytics Jobs: Salary Bracket vs Skill Penetration (Chi-Square Test)
print("\n4. ANALYTICS JOBS: SALARY BRACKET vs SKILL CO-OCCURRENCE (Chi-Square)")
tech_skills = ['has_skill_python', 'has_skill_sql', 'has_skill_sas', 'has_skill_machine_learning', 'has_skill_excel']
for sk in tech_skills:
    ct = pd.crosstab(an_jobs['salary'], an_jobs[sk])
    chi2, p, dof, _ = stats.chi2_contingency(ct)
    print(f"  {sk:25s} across salary brackets: Chi2={chi2:7.2f}, p-value={p:.4e}, dof={dof}")
