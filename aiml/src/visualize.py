import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Set styling
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.size'] = 11
plt.rcParams['figure.titlesize'] = 14
plt.rcParams['figure.titleweight'] = 'bold'
plt.rcParams['axes.titlesize'] = 12
plt.rcParams['axes.titleweight'] = 'bold'

cleaned_dir = r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\data\cleaned"
viz_dir = r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\visualizations"
os.makedirs(viz_dir, exist_ok=True)

# Load cleaned data
ds_jobs = pd.read_csv(os.path.join(cleaned_dir, "clean_datascience_jobs.csv"))
an_jobs = pd.read_csv(os.path.join(cleaned_dir, "clean_analytics_jobs.csv"))
jds = pd.read_csv(os.path.join(cleaned_dir, "clean_jds_skill_traits.csv"))
sds = pd.read_csv(os.path.join(cleaned_dir, "clean_sds_personality_traits.csv"))

print("Cleaned datasets loaded successfully. Generating visualizations...")

# -----------------------------------------------------------------------------
# 1. UNIVARIATE: Salary Distribution Across Data Science Roles
# -----------------------------------------------------------------------------
plt.figure(figsize=(10, 6))
sns.histplot(ds_jobs['avg_salary_lakhs'], kde=True, color='#2b5c8f', bins=30)
plt.axvline(ds_jobs['avg_salary_lakhs'].median(), color='#e63946', linestyle='--', linewidth=2, label=f"Median: ₹{ds_jobs['avg_salary_lakhs'].median():.1f}L")
plt.axvline(ds_jobs['avg_salary_lakhs'].mean(), color='#2a9d8f', linestyle=':', linewidth=2, label=f"Mean: ₹{ds_jobs['avg_salary_lakhs'].mean():.1f}L")
plt.title("Distribution of Average Offered Salaries in Data Science Jobs (LPA)")
plt.xlabel("Average Salary (INR Lakhs per Annum)")
plt.ylabel("Job Count / Density")
plt.legend(frameon=True)
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "01_datascience_salary_distribution.png"), dpi=300)
plt.close()
print("Saved 01_datascience_salary_distribution.png")

# -----------------------------------------------------------------------------
# 2. UNIVARIATE: Experience Requirement Distribution in Analytics Jobs
# -----------------------------------------------------------------------------
plt.figure(figsize=(10, 6))
sns.histplot(an_jobs['avg_experience_years'], kde=True, color='#457b9d', bins=25)
plt.axvline(an_jobs['avg_experience_years'].median(), color='#e63946', linestyle='--', linewidth=2, label=f"Median: {an_jobs['avg_experience_years'].median():.1f} Yrs")
plt.axvline(an_jobs['avg_experience_years'].mean(), color='#2a9d8f', linestyle=':', linewidth=2, label=f"Mean: {an_jobs['avg_experience_years'].mean():.1f} Yrs")
plt.title("Distribution of Required Experience in Analytics Jobs (Years)")
plt.xlabel("Average Required Experience (Years)")
plt.ylabel("Number of Postings")
plt.legend(frameon=True)
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "02_analytics_experience_distribution.png"), dpi=300)
plt.close()
print("Saved 02_analytics_experience_distribution.png")

# -----------------------------------------------------------------------------
# 3. UNIVARIATE: Top 15 Technical Skills in Analytics Postings
# -----------------------------------------------------------------------------
all_skills = an_jobs['key_skills_clean'].str.split(',').explode().str.strip()
all_skills = all_skills[all_skills != '']
top_skills = all_skills.value_counts().head(15)

plt.figure(figsize=(11, 6))
sns.barplot(x=top_skills.values, y=top_skills.index, palette='Blues_r', hue=top_skills.index, legend=False)
plt.title("Top 15 Most In-Demand Skills in Analytics Job Postings")
plt.xlabel("Frequency of Skill Mentions across 15,841 Job Postings")
plt.ylabel("Skill Name")
for i, v in enumerate(top_skills.values):
    plt.text(v + 10, i, f"{v:,} ({v/len(an_jobs)*100:.1f}%)", va='center', fontsize=9, color='#1d3557', fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "03_top_in_demand_analytics_skills.png"), dpi=300)
plt.close()
print("Saved 03_top_in_demand_analytics_skills.png")

# -----------------------------------------------------------------------------
# 4. UNIVARIATE: Geographic Concentration of Analytics Opportunities
# -----------------------------------------------------------------------------
top_locs = an_jobs['primary_location'].value_counts().head(10)
plt.figure(figsize=(10, 6))
sns.barplot(x=top_locs.values, y=top_locs.index, palette='crest_r', hue=top_locs.index, legend=False)
plt.title("Top 10 Employment Hubs for Analytics Roles in India")
plt.xlabel("Number of Job Postings")
plt.ylabel("City / Region")
for i, v in enumerate(top_locs.values):
    plt.text(v + 30, i, f"{v:,} ({v/len(an_jobs)*100:.1f}%)", va='center', fontsize=9, color='#1d3557', fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "04_geographic_distribution_analytics_jobs.png"), dpi=300)
plt.close()
print("Saved 04_geographic_distribution_analytics_jobs.png")

# -----------------------------------------------------------------------------
# 5. BIVARIATE: Salary vs Experience Across Data Science Job Titles
# -----------------------------------------------------------------------------
plt.figure(figsize=(12, 7))
order = ds_jobs.groupby('job_title')['avg_salary_lakhs'].median().sort_values(ascending=False).index
sns.boxplot(data=ds_jobs, x='job_title', y='avg_salary_lakhs', order=order, palette='Set2', hue='job_title', legend=False)
plt.xticks(rotation=45, ha='right')
plt.title("Salary Compensation Benchmarks by Data Science Job Role")
plt.xlabel("Role Title")
plt.ylabel("Average Offered Salary (INR Lakhs per Annum)")
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "05_salary_by_datascience_role.png"), dpi=300)
plt.close()
print("Saved 05_salary_by_datascience_role.png")

# -----------------------------------------------------------------------------
# 6. BIVARIATE: Experience vs Salary Brackets in Analytics
# -----------------------------------------------------------------------------
plt.figure(figsize=(10, 6))
salary_order = ['0to3', '3to6', '6to10', '10to15', '15to25', '25to50']
sns.boxplot(data=an_jobs, x='salary', y='avg_experience_years', order=salary_order, palette='mako', hue='salary', legend=False)
plt.title("Experience Requirement Progression across Salary Brackets (Analytics)")
plt.xlabel("Offered Salary Bracket (INR Lakhs)")
plt.ylabel("Average Required Experience (Years)")
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "06_experience_by_salary_bracket_analytics.png"), dpi=300)
plt.close()
print("Saved 06_experience_by_salary_bracket_analytics.png")

# -----------------------------------------------------------------------------
# 7. BIVARIATE: Top Hiring Companies in Data Science by Total Openings
# -----------------------------------------------------------------------------
top_hiring_comp = ds_jobs.groupby('company_name')['num_of_jobs_posted'].sum().sort_values(ascending=False).head(15)
plt.figure(figsize=(11, 6))
sns.barplot(x=top_hiring_comp.values, y=top_hiring_comp.index, palette='flare_r', hue=top_hiring_comp.index, legend=False)
plt.title("Top 15 Employers by Total Data Science Job Volume")
plt.xlabel("Total Job Openings Posted")
plt.ylabel("Company Name")
for i, v in enumerate(top_hiring_comp.values):
    plt.text(v + 50, i, f"{v:,}", va='center', fontsize=9, color='#1d3557', fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "07_top_datascience_employers.png"), dpi=300)
plt.close()
print("Saved 07_top_datascience_employers.png")

# -----------------------------------------------------------------------------
# 8. JDS ANALYSIS: Junior Data Scientist Skills vs Salary Hike Outcome
# -----------------------------------------------------------------------------
skill_cols = ['dashboard_and_storytelling_skills', 'maths-stats_skills', 'coding_skills', 'ai_and_ml_skills', 'big_data_skills']
jds_melted = pd.melt(jds, id_vars=['salary_hike_high_or_low'], value_vars=skill_cols, var_name='Skill', value_name='Rating')
jds_melted['Outcome'] = jds_melted['salary_hike_high_or_low'].map({1: 'High Salary Hike (1)', 0: 'Low Salary Hike (0)'})
jds_melted['Skill'] = jds_melted['Skill'].str.replace('_skills', '').str.replace('_', ' ').str.title()

plt.figure(figsize=(12, 6))
sns.boxplot(data=jds_melted, x='Skill', y='Rating', hue='Outcome', palette=['#e63946', '#2a9d8f'])
plt.title("Skill Mastery Comparison: Junior Data Scientists with High vs Low Salary Hike")
plt.xlabel("Skill Competency Domain (1-5 Scale)")
plt.ylabel("Evaluation Score")
plt.xticks(rotation=20, ha='right')
plt.legend(title="Career Outcome", frameon=True)
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "08_jds_skills_vs_salary_hike.png"), dpi=300)
plt.close()
print("Saved 08_jds_skills_vs_salary_hike.png")

# -----------------------------------------------------------------------------
# 9. SDS ANALYSIS: Senior Data Scientist Big Five Traits vs Success
# -----------------------------------------------------------------------------
trait_cols = ['conscientiousness', 'openness_to_experience', 'extraversion', 'agreeableness', 'neuroticism']
sds_melted = pd.melt(sds, id_vars=['success_classification_high_low'], value_vars=trait_cols, var_name='Trait', value_name='Score')
sds_melted['Success'] = sds_melted['success_classification_high_low'].map({1: 'High Success (1)', 0: 'Low Success (0)'})
sds_melted['Trait'] = sds_melted['Trait'].str.replace('_', ' ').str.title()

plt.figure(figsize=(12, 6))
sns.boxplot(data=sds_melted, x='Trait', y='Score', hue='Success', palette=['#e76f51', '#264653'])
plt.title("Big Five Personality Traits: High vs Low Success Senior Data Scientists")
plt.xlabel("OCEAN Personality Dimension (Normalized Score)")
plt.ylabel("Trait Score")
plt.xticks(rotation=20, ha='right')
plt.legend(title="Organizational Success", frameon=True)
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "09_sds_traits_vs_success.png"), dpi=300)
plt.close()
print("Saved 09_sds_traits_vs_success.png")

# -----------------------------------------------------------------------------
# 10. CROSS-DATASET: Market Skill Demand vs Internal Performance Valuation
# -----------------------------------------------------------------------------
# Correlate market skill frequency in Analytics Jobs with feature importance for salary hike in JDS
corr_dict = {
    'Dashboard & Storytelling': jds.corr()['salary_hike_high_or_low']['dashboard_and_storytelling_skills'],
    'Maths & Statistics': jds.corr()['salary_hike_high_or_low']['maths-stats_skills'],
    'Coding (Python/SQL)': jds.corr()['salary_hike_high_or_low']['coding_skills'],
    'AI & Machine Learning': jds.corr()['salary_hike_high_or_low']['ai_and_ml_skills'],
    'Big Data Technologies': jds.corr()['salary_hike_high_or_low']['big_data_skills'],
}

# Market frequency proxy from analytics jobs
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
color = '#1d3557'
ax1.set_xlabel('Skill Domain', fontweight='bold')
ax1.set_ylabel('Market Job Demand (% of Postings)', color=color, fontweight='bold')
bars = ax1.bar(np.arange(len(comparison_df)) - 0.2, comparison_df['Market Job Posting Frequency (%)'], 0.4, color='#457b9d', label='Market Demand (% Postings)')
ax1.tick_params(axis='y', labelcolor=color)
ax1.set_xticks(np.arange(len(comparison_df)))
ax1.set_xticklabels(comparison_df.index, rotation=25, ha='right')

ax2 = ax1.twinx()
color = '#e63946'
ax2.set_ylabel('Correlation with Career Hike (Pearson r)', color=color, fontweight='bold')
lines = ax2.bar(np.arange(len(comparison_df)) + 0.2, comparison_df['Internal Salary Hike Correlation (r)'], 0.4, color='#e63946', label='Correlation with Salary Hike')
ax2.tick_params(axis='y', labelcolor=color)

plt.title("Cross-Dataset Insight: Market Job Skill Demand vs Internal Performance Driver", pad=20)
fig.tight_layout()
plt.savefig(os.path.join(viz_dir, "10_market_demand_vs_career_advancement_driver.png"), dpi=300)
plt.close()
print("Saved 10_market_demand_vs_career_advancement_driver.png")

# -----------------------------------------------------------------------------
# 11. MULTIVARIATE: Correlation Heatmaps (JDS & SDS)
# -----------------------------------------------------------------------------
fig, axes = plt.subplots(1, 2, figsize=(15, 6))

sns.heatmap(jds[['big_data_skills', 'maths-stats_skills', 'coding_skills', 'ai_and_ml_skills', 'dashboard_and_storytelling_skills', 'salary_hike_high_or_low']].corr(),
            annot=True, cmap='coolwarm', fmt=".2f", vmin=-0.2, vmax=1.0, ax=axes[0], cbar_kws={'shrink': 0.8})
axes[0].set_title("Junior Data Scientist: Skill Correlations & Hike Outcome")

sns.heatmap(sds[['neuroticism', 'extraversion', 'openness_to_experience', 'agreeableness', 'conscientiousness', 'success_classification_high_low']].corr(),
            annot=True, cmap='coolwarm', fmt=".2f", vmin=-0.2, vmax=1.0, ax=axes[1], cbar_kws={'shrink': 0.8})
axes[1].set_title("Senior Data Scientist: Personality Traits & Success Outcome")

plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "11_correlation_heatmaps_jds_sds.png"), dpi=300)
plt.close()
print("Saved 11_correlation_heatmaps_jds_sds.png")

# -----------------------------------------------------------------------------
# 12. CROSS-DATASET: Role Hierarchy & Salary Premium (Data Science Roles)
# -----------------------------------------------------------------------------
role_stats = ds_jobs.groupby('job_title').agg(
    median_min=('min_salary_lakhs', 'median'),
    median_avg=('avg_salary_lakhs', 'median'),
    median_max=('max_salary_lakhs', 'median'),
    median_exp=('min_experience_years', 'median'),
    total_openings=('num_of_jobs_posted', 'sum')
).sort_values('median_avg', ascending=True)

plt.figure(figsize=(11, 7))
y_pos = np.arange(len(role_stats))
plt.barh(y_pos, role_stats['median_max'] - role_stats['median_min'], left=role_stats['median_min'], color='#a8dadc', label='Salary Band Range (Min to Max)')
plt.scatter(role_stats['median_avg'], y_pos, color='#1d3557', s=100, zorder=5, label='Median Average Salary')
plt.yticks(y_pos, role_stats.index)
plt.xlabel("Salary in INR Lakhs per Annum (LPA)")
plt.ylabel("Data Science Job Role")
plt.title("Compensation Bands Across 10 Data Science Role Families")
plt.legend(loc='lower right', frameon=True)
for i, v in enumerate(role_stats['median_avg']):
    plt.text(role_stats['median_max'].iloc[i] + 0.8, i, f"Avg: ₹{v:.1f}L (Min Exp: {int(role_stats['median_exp'].iloc[i])}y)", va='center', fontsize=9, color='#1d3557')
plt.tight_layout()
plt.savefig(os.path.join(viz_dir, "12_datascience_role_salary_bands.png"), dpi=300)
plt.close()
print("Saved 12_datascience_role_salary_bands.png")

print("\nAll 12 presentation-quality charts generated successfully!")
