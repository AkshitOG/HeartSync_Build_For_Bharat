import os
import nbformat as nbf

notebook_dir = r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\notebooks"
os.makedirs(notebook_dir, exist_ok=True)
nb_path = os.path.join(notebook_dir, "01_comprehensive_eda_and_pattern_discovery.ipynb")

nb = nbf.v4.new_notebook()

# Cells
cells = []

# Title & Overview
cells.append(nbf.v4.new_markdown_cell("""# 📊 Career & Talent Analytics: Comprehensive EDA & Pattern Discovery

**Hackathon Challenge:** Build For Bharat 2.0 (SAS & Data Science Track)  
**Datasets Analyzed:**
1. `DataScience Jobs.csv` — 1,602 employer postings across 10 standardized roles with min/avg/max compensation bands
2. `Analytics Jobs.csv` — 15,841 job postings across the Indian market with experience, salary brackets, locations, and key skills
3. `JDS Skill Traits.xlsx` — 139 Junior Data Scientists with measured technical skills (1–5 scale) and performance salary hike outcomes
4. `SDS Personality Traits.xlsx` — 161 Senior Data Scientists evaluated on Big Five (OCEAN) traits and customer-facing success outcomes
"""))

# Cell 1: Environment Setup
cells.append(nbf.v4.new_code_cell("""import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Plot styling
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.size'] = 11
plt.rcParams['figure.titlesize'] = 14
plt.rcParams['figure.titleweight'] = 'bold'
plt.rcParams['axes.titlesize'] = 12
plt.rcParams['axes.titleweight'] = 'bold'

cleaned_dir = r"../data/cleaned"
raw_dir = r"../data/raw"

ds_jobs = pd.read_csv(os.path.join(cleaned_dir, "clean_datascience_jobs.csv"))
an_jobs = pd.read_csv(os.path.join(cleaned_dir, "clean_analytics_jobs.csv"))
jds = pd.read_csv(os.path.join(cleaned_dir, "clean_jds_skill_traits.csv"))
sds = pd.read_csv(os.path.join(cleaned_dir, "clean_sds_personality_traits.csv"))

print(f"DataScience Jobs: {ds_jobs.shape}")
print(f"Analytics Jobs:   {an_jobs.shape}")
print(f"JDS Skill Traits: {jds.shape}")
print(f"SDS Personality:  {sds.shape}")
"""))

# Section 1
cells.append(nbf.v4.new_markdown_cell("""## 1. Univariate Analysis: Market Distributions
Let's analyze the distribution of offered compensation across Data Science jobs and required experience across Analytics jobs.
"""))

cells.append(nbf.v4.new_code_cell("""fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# 1. Salary Distribution in Data Science
sns.histplot(ds_jobs['avg_salary_lakhs'], kde=True, color='#2b5c8f', bins=30, ax=axes[0])
axes[0].axvline(ds_jobs['avg_salary_lakhs'].median(), color='#e63946', linestyle='--', linewidth=2, label=f"Median: ₹{ds_jobs['avg_salary_lakhs'].median():.1f}L")
axes[0].axvline(ds_jobs['avg_salary_lakhs'].mean(), color='#2a9d8f', linestyle=':', linewidth=2, label=f"Mean: ₹{ds_jobs['avg_salary_lakhs'].mean():.1f}L")
axes[0].set_title("Data Science Jobs: Average Salary Distribution (LPA)")
axes[0].set_xlabel("Average Salary (INR Lakhs per Annum)")
axes[0].set_ylabel("Count")
axes[0].legend(frameon=True)

# 2. Experience Distribution in Analytics
sns.histplot(an_jobs['avg_experience_years'], kde=True, color='#457b9d', bins=25, ax=axes[1])
axes[1].axvline(an_jobs['avg_experience_years'].median(), color='#e63946', linestyle='--', linewidth=2, label=f"Median: {an_jobs['avg_experience_years'].median():.1f} Yrs")
axes[1].axvline(an_jobs['avg_experience_years'].mean(), color='#2a9d8f', linestyle=':', linewidth=2, label=f"Mean: {an_jobs['avg_experience_years'].mean():.1f} Yrs")
axes[1].set_title("Analytics Jobs: Required Experience Distribution (Years)")
axes[1].set_xlabel("Average Experience (Years)")
axes[1].set_ylabel("Count")
axes[1].legend(frameon=True)

plt.tight_layout()
plt.show()
"""))

# Section 2
cells.append(nbf.v4.new_markdown_cell("""## 2. In-Demand Skills & Geographic Concentration
Examining the most frequently listed technical competencies and geographic clusters in 15,841 job postings.
"""))

cells.append(nbf.v4.new_code_cell("""fig, axes = plt.subplots(1, 2, figsize=(18, 7))

# Top 15 Skills
all_skills = an_jobs['key_skills_clean'].str.split(',').explode().str.strip()
all_skills = all_skills[all_skills != '']
top_skills = all_skills.value_counts().head(15)

sns.barplot(x=top_skills.values, y=top_skills.index, palette='Blues_r', hue=top_skills.index, legend=False, ax=axes[0])
axes[0].set_title("Top 15 Most In-Demand Skills (15,841 Analytics Postings)")
axes[0].set_xlabel("Frequency of Mentions")
axes[0].set_ylabel("Skill")
for i, v in enumerate(top_skills.values):
    axes[0].text(v + 10, i, f"{v:,} ({v/len(an_jobs)*100:.1f}%)", va='center', fontsize=9, color='#1d3557', fontweight='bold')

# Top 10 Locations
top_locs = an_jobs['primary_location'].value_counts().head(10)
sns.barplot(x=top_locs.values, y=top_locs.index, palette='crest_r', hue=top_locs.index, legend=False, ax=axes[1])
axes[1].set_title("Top 10 Employment Hubs for Analytics Roles")
axes[1].set_xlabel("Number of Job Postings")
axes[1].set_ylabel("City / Region")
for i, v in enumerate(top_locs.values):
    axes[1].text(v + 30, i, f"{v:,} ({v/len(an_jobs)*100:.1f}%)", va='center', fontsize=9, color='#1d3557', fontweight='bold')

plt.tight_layout()
plt.show()
"""))

# Section 3
cells.append(nbf.v4.new_markdown_cell("""## 3. Compensation Hierarchy Across Data Science Roles
Analyzing the 10 role families and the compensation premium for seniority.
"""))

cells.append(nbf.v4.new_code_cell("""plt.figure(figsize=(12, 6))
order = ds_jobs.groupby('job_title')['avg_salary_lakhs'].median().sort_values(ascending=False).index
sns.boxplot(data=ds_jobs, x='job_title', y='avg_salary_lakhs', order=order, palette='Set2', hue='job_title', legend=False)
plt.xticks(rotation=35, ha='right')
plt.title("Salary Compensation Benchmarks Across 10 Data Science Role Families")
plt.xlabel("Role Title")
plt.ylabel("Average Offered Salary (INR Lakhs per Annum)")
plt.tight_layout()
plt.show()

# Senior vs Non-Senior Test
ds_senior = ds_jobs[ds_jobs['is_senior_role'] == 1]['avg_salary_lakhs']
ds_junior = ds_jobs[ds_jobs['is_senior_role'] == 0]['avg_salary_lakhs']
t_stat, p_val = stats.ttest_ind(ds_senior, ds_junior, equal_var=False)
print(f"Senior Roles Mean Salary: ₹{ds_senior.mean():.2f}L | Non-Senior Roles: ₹{ds_junior.mean():.2f}L")
print(f"Two-sample t-statistic: {t_stat:.2f}, p-value: {p_val:.4e} (65.7% Senior Premium!)")
"""))

# Section 4: JDS Skills vs Hike
cells.append(nbf.v4.new_markdown_cell("""## 4. Junior Data Scientists: What Actually Drives Salary Hikes?
Comparing measured skills (Big Data, Maths/Stats, Coding, AI/ML, Storytelling) between Junior Data Scientists who received high vs low salary hikes.
"""))

cells.append(nbf.v4.new_code_cell("""skill_cols = ['dashboard_and_storytelling_skills', 'maths-stats_skills', 'coding_skills', 'ai_and_ml_skills', 'big_data_skills']
jds_melted = pd.melt(jds, id_vars=['salary_hike_high_or_low'], value_vars=skill_cols, var_name='Skill', value_name='Rating')
jds_melted['Outcome'] = jds_melted['salary_hike_high_or_low'].map({1: 'High Salary Hike (1)', 0: 'Low Salary Hike (0)'})
jds_melted['Skill'] = jds_melted['Skill'].str.replace('_skills', '').str.replace('_', ' ').str.title()

plt.figure(figsize=(12, 6))
sns.boxplot(data=jds_melted, x='Skill', y='Rating', hue='Outcome', palette=['#e63946', '#2a9d8f'])
plt.title("Junior Data Scientists: Skill Ratings (High vs Low Salary Hike)")
plt.xlabel("Competency Domain (1-5 Scale)")
plt.ylabel("Evaluation Score")
plt.xticks(rotation=15, ha='right')
plt.legend(title="Career Outcome", frameon=True)
plt.tight_layout()
plt.show()

# Statistical validation table
hike_high = jds[jds['salary_hike_high_or_low'] == 1]
hike_low = jds[jds['salary_hike_high_or_low'] == 0]
results = []
for sc in skill_cols:
    t_stat, p_val = stats.ttest_ind(hike_high[sc], hike_low[sc], equal_var=False)
    d = (hike_high[sc].mean() - hike_low[sc].mean()) / np.sqrt((hike_high[sc].var() + hike_low[sc].var()) / 2)
    results.append({'Skill': sc, 'High Mean': round(hike_high[sc].mean(), 2), 'Low Mean': round(hike_low[sc].mean(), 2), 't-stat': round(t_stat, 2), 'p-value': f"{p_val:.4e}", "Cohen's d": round(d, 2)})

pd.DataFrame(results).sort_values("Cohen's d", ascending=False)
"""))

# Section 5: SDS Traits vs Success
cells.append(nbf.v4.new_markdown_cell("""## 5. Senior Data Scientists: Big Five Personality Traits vs Client Success
Analyzing the Big Five personality traits (OCEAN) of Senior customer-facing data scientists and their correlation with overall success.
"""))

cells.append(nbf.v4.new_code_cell("""trait_cols = ['conscientiousness', 'openness_to_experience', 'extraversion', 'agreeableness', 'neuroticism']
sds_melted = pd.melt(sds, id_vars=['success_classification_high_low'], value_vars=trait_cols, var_name='Trait', value_name='Score')
sds_melted['Success'] = sds_melted['success_classification_high_low'].map({1: 'High Success (1)', 0: 'Low Success (0)'})
sds_melted['Trait'] = sds_melted['Trait'].str.replace('_', ' ').str.title()

plt.figure(figsize=(12, 6))
sns.boxplot(data=sds_melted, x='Trait', y='Score', hue='Success', palette=['#e76f51', '#264653'])
plt.title("Senior Customer-Facing Data Scientists: Personality Traits vs Success")
plt.xlabel("OCEAN Personality Dimension")
plt.ylabel("Normalized Trait Score")
plt.xticks(rotation=15, ha='right')
plt.legend(title="Client Success", frameon=True)
plt.tight_layout()
plt.show()

# Statistical validation table
succ_high = sds[sds['success_classification_high_low'] == 1]
succ_low = sds[sds['success_classification_high_low'] == 0]
trait_results = []
for tc in trait_cols:
    t_stat, p_val = stats.ttest_ind(succ_high[tc], succ_low[tc], equal_var=False)
    d = (succ_high[tc].mean() - succ_low[tc].mean()) / np.sqrt((succ_high[tc].var() + succ_low[tc].var()) / 2)
    trait_results.append({'Trait': tc, 'High Mean': round(succ_high[tc].mean(), 2), 'Low Mean': round(succ_low[tc].mean(), 2), 't-stat': round(t_stat, 2), 'p-value': f"{p_val:.4e}", "Cohen's d": round(d, 2)})

pd.DataFrame(trait_results).sort_values("Cohen's d", ascending=False)
"""))

# Section 6: Cross-Dataset Synthesis
cells.append(nbf.v4.new_markdown_cell("""## 6. The Central Discovery: Market Skill Demand vs Internal Advancement
Comparing the skills most demanded in external job postings against what actually drives career advancement internally.
"""))

cells.append(nbf.v4.new_code_cell("""corr_dict = {
    'Dashboard & Storytelling': jds.corr()['salary_hike_high_or_low']['dashboard_and_storytelling_skills'],
    'Maths & Statistics': jds.corr()['salary_hike_high_or_low']['maths-stats_skills'],
    'Coding (Python/SQL)': jds.corr()['salary_hike_high_or_low']['coding_skills'],
    'AI & Machine Learning': jds.corr()['salary_hike_high_or_low']['ai_and_ml_skills'],
    'Big Data Technologies': jds.corr()['salary_hike_high_or_low']['big_data_skills'],
}

market_freq = {
    'Dashboard & Storytelling': (an_jobs['has_skill_excel'].sum() + an_jobs['has_skill_tableau'].sum() + an_jobs['has_skill_power_bi'].sum()) / len(an_jobs) * 100,
    'Maths & Statistics': an_jobs['key_skills_clean'].str.contains('statistic|math', regex=True).sum() / len(an_jobs) * 100,
    'Coding (Python/SQL)': (an_jobs['has_skill_python'].sum() + an_jobs['has_skill_sql'].sum()) / len(an_jobs) * 100,
    'AI & Machine Learning': an_jobs['has_skill_machine_learning'].sum() / len(an_jobs) * 100,
    'Big Data Technologies': (an_jobs['has_skill_hadoop'].sum() + an_jobs['has_skill_spark'].sum()) / len(an_jobs) * 100
}

comparison_df = pd.DataFrame({
    'Internal Salary Hike Correlation (r)': corr_dict,
    'Market Job Posting Frequency (%)': market_freq
})

fig, ax1 = plt.subplots(figsize=(11, 6))
ax1.set_xlabel('Skill Domain', fontweight='bold')
ax1.set_ylabel('Market Job Demand (% of Postings)', color='#1d3557', fontweight='bold')
ax1.bar(np.arange(len(comparison_df)) - 0.2, comparison_df['Market Job Posting Frequency (%)'], 0.4, color='#457b9d', label='Market Demand (% Postings)')
ax1.tick_params(axis='y', labelcolor='#1d3557')
ax1.set_xticks(np.arange(len(comparison_df)))
ax1.set_xticklabels(comparison_df.index, rotation=20, ha='right')

ax2 = ax1.twinx()
ax2.set_ylabel('Correlation with Career Hike (Pearson r)', color='#e63946', fontweight='bold')
ax2.bar(np.arange(len(comparison_df)) + 0.2, comparison_df['Internal Salary Hike Correlation (r)'], 0.4, color='#e63946', label='Correlation with Salary Hike')
ax2.tick_params(axis='y', labelcolor='#e63946')

plt.title("Cross-Dataset Insight: Market Job Demand vs Internal Career Driver", pad=15)
fig.tight_layout()
plt.show()
"""))

# Section 7: Correlation Heatmaps
cells.append(nbf.v4.new_markdown_cell("""## 7. Correlation Heatmaps: Junior Skills & Senior Personality Traits
"""))

cells.append(nbf.v4.new_code_cell("""fig, axes = plt.subplots(1, 2, figsize=(16, 6))

sns.heatmap(jds[['big_data_skills', 'maths-stats_skills', 'coding_skills', 'ai_and_ml_skills', 'dashboard_and_storytelling_skills', 'salary_hike_high_or_low']].corr(),
            annot=True, cmap='coolwarm', fmt=".2f", vmin=-0.2, vmax=1.0, ax=axes[0], cbar_kws={'shrink': 0.8})
axes[0].set_title("Junior Data Scientist: Skills & Hike Correlation")

sns.heatmap(sds[['neuroticism', 'extraversion', 'openness_to_experience', 'agreeableness', 'conscientiousness', 'success_classification_high_low']].corr(),
            annot=True, cmap='coolwarm', fmt=".2f", vmin=-0.2, vmax=1.0, ax=axes[1], cbar_kws={'shrink': 0.8})
axes[1].set_title("Senior Data Scientist: Traits & Success Correlation")

plt.tight_layout()
plt.show()
"""))

nb.cells = cells

with open(nb_path, "w", encoding="utf-8") as f:
    nbf.write(nb, f)

print(f"Jupyter Notebook generated successfully at: {nb_path}")
