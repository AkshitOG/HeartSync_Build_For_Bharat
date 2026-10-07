import os
import pandas as pd
import numpy as np

raw_dir = r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\data\raw"
cleaned_dir = r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\data\cleaned"

os.makedirs(cleaned_dir, exist_ok=True)

def clean_data_science_jobs():
    print("--- Cleaning DataScience Jobs ---")
    df = pd.read_csv(os.path.join(raw_dir, "DataScience Jobs.csv"))
    initial_shape = df.shape
    
    # Strip column names
    df.columns = [c.strip() for c in df.columns]
    
    # Strip string fields
    for col in ['company_name', 'job_title']:
        df[col] = df[col].astype(str).str.strip()
        
    # Convert salaries from '4.5L' to float in Lakhs (INR Lakhs per Annum)
    for col in ['min_salary', 'avg_salary', 'max_salary']:
        clean_col = f"{col}_lakhs"
        df[clean_col] = df[col].astype(str).str.replace('L', '', regex=False).str.strip().astype(float)
        
    # Experience column: rename / ensure float/int
    df['min_experience_years'] = df['min_experience'].astype(int)
    df['num_of_jobs_posted'] = df['num_of_jobs'].astype(int)
    
    # Add flag for senior roles
    df['is_senior_role'] = df['job_title'].str.lower().str.contains('senior|lead|architect', regex=True).astype(int)
    
    # Check salary logic integrity: min <= avg <= max
    salary_logic_issue = ((df['min_salary_lakhs'] > df['avg_salary_lakhs']) | (df['avg_salary_lakhs'] > df['max_salary_lakhs'])).sum()
    print(f"Salary logic violations (min > avg or avg > max): {salary_logic_issue}")
    
    out_path = os.path.join(cleaned_dir, "clean_datascience_jobs.csv")
    df.to_csv(out_path, index=False)
    print(f"Saved: {out_path} ({df.shape[0]} rows, {df.shape[1]} cols)")
    return df

def clean_analytics_jobs():
    print("\n--- Cleaning Analytics Jobs ---")
    df = pd.read_csv(os.path.join(raw_dir, "Analytics Jobs.csv"))
    initial_shape = df.shape
    
    # Strip column names
    df.columns = [c.strip() for c in df.columns]
    
    # Clean job_type: standardize 'Analytics', 'analytics', 'ANALYTICS' -> 'Analytics'
    df['job_type_clean'] = df['job_type'].fillna('Not Specified').astype(str).str.strip()
    df['job_type_standardized'] = df['job_type_clean'].replace({
        'analytics': 'Analytics',
        'ANALYTICS': 'Analytics',
        'analytic': 'Analytics',
        'Analytic': 'Analytics'
    })
    
    # Clean experience: format 'X-Y yrs'
    exp_split = df['experience'].astype(str).str.replace(' yrs', '', regex=False).str.split('-', expand=True)
    df['min_experience_years'] = exp_split[0].str.strip().astype(int)
    df['max_experience_years'] = exp_split[1].str.strip().astype(int)
    df['avg_experience_years'] = (df['min_experience_years'] + df['max_experience_years']) / 2.0
    
    # Clean salary bracket: '0to3', '3to6', '6to10', '10to15', '15to25', '25to50'
    salary_bracket_map = {
        '0to3': (0.0, 3.0, 1.5),
        '3to6': (3.0, 6.0, 4.5),
        '6to10': (6.0, 10.0, 8.0),
        '10to15': (10.0, 15.0, 12.5),
        '15to25': (15.0, 25.0, 20.0),
        '25to50': (25.0, 50.0, 37.5)
    }
    df['salary_min_lakhs'] = df['salary'].map(lambda x: salary_bracket_map.get(str(x).strip(), (np.nan, np.nan, np.nan))[0])
    df['salary_max_lakhs'] = df['salary'].map(lambda x: salary_bracket_map.get(str(x).strip(), (np.nan, np.nan, np.nan))[1])
    df['salary_midpoint_lakhs'] = df['salary'].map(lambda x: salary_bracket_map.get(str(x).strip(), (np.nan, np.nan, np.nan))[2])
    
    # Clean string text fields
    df['job_desig_clean'] = df['job_desig'].fillna('').astype(str).str.strip()
    df['location_clean'] = df['location'].fillna('').astype(str).str.strip()
    
    # Primary location (first city if multiple)
    df['primary_location'] = df['location_clean'].apply(lambda x: x.split(',')[0].strip() if x else 'Not Specified')
    
    # Clean key skills: remove trailing '...' and normalize
    def clean_skill_string(s):
        if pd.isna(s):
            return ""
        s = str(s).replace('...', '').strip()
        tokens = [t.strip().lower() for t in s.split(',') if t.strip() and t.strip() != '...']
        return ", ".join(tokens)
        
    df['key_skills_clean'] = df['key_skills'].apply(clean_skill_string)
    df['skill_count'] = df['key_skills_clean'].apply(lambda x: len(x.split(',')) if x else 0)
    
    # Technical skills flags
    tech_keywords = ['python', 'sql', 'r', 'sas', 'machine learning', 'analytics', 'data analysis', 'excel', 'tableau', 'power bi', 'hadoop', 'spark', 'aws', 'deep learning']
    for kw in tech_keywords:
        col_name = f"has_skill_{kw.replace(' ', '_')}"
        df[col_name] = df['key_skills_clean'].str.contains(r'\b' + kw + r'\b', regex=True).astype(int)
        
    out_path = os.path.join(cleaned_dir, "clean_analytics_jobs.csv")
    df.to_csv(out_path, index=False)
    print(f"Saved: {out_path} ({df.shape[0]} rows, {df.shape[1]} cols)")
    return df

def clean_jds_traits():
    print("\n--- Cleaning JDS Skill Traits ---")
    df = pd.read_excel(os.path.join(raw_dir, "JDS Skill Traits.xlsx"), sheet_name="JDS")
    df.columns = [c.strip() for c in df.columns]
    
    # Note duplicates on ID: 2 duplicates identified in audit
    # We create clean_jds with duplicates flagged/resolved
    df['is_duplicate_id'] = df.duplicated(subset=['id'], keep=False).astype(int)
    
    # Compute composite overall skill score (mean of 5 measured skill traits)
    skill_cols = ['big_data_skills', 'maths-stats_skills', 'coding_skills', 'ai_and_ml_skills', 'dashboard_and_storytelling_skills']
    df['composite_skill_score'] = df[skill_cols].mean(axis=1).round(3)
    df['technical_core_score'] = df[['coding_skills', 'maths-stats_skills', 'ai_and_ml_skills']].mean(axis=1).round(3)
    
    out_path = os.path.join(cleaned_dir, "clean_jds_skill_traits.csv")
    df.to_csv(out_path, index=False)
    print(f"Saved: {out_path} ({df.shape[0]} rows, {df.shape[1]} cols)")
    return df

def clean_sds_traits():
    print("\n--- Cleaning SDS Personality Traits ---")
    df = pd.read_excel(os.path.join(raw_dir, "SDS Personality Traits.xlsx"), sheet_name="SDS")
    df.columns = [c.strip() for c in df.columns]
    
    # Standardize column names
    rename_dict = {
        'extraversion': 'extraversion',
        'openness_to_experience': 'openness_to_experience',
        'agreeableness': 'agreeableness',
        'conscientiousness': 'conscientiousness',
        'neuroticism': 'neuroticism',
        'success_ classification_ high_low': 'success_classification_high_low'
    }
    df = df.rename(columns=rename_dict)
    
    # Flag duplicate IDs
    df['is_duplicate_id'] = df.duplicated(subset=['id'], keep=False).astype(int)
    
    # OCEAN trait composite metrics
    trait_cols = ['neuroticism', 'extraversion', 'openness_to_experience', 'agreeableness', 'conscientiousness']
    # Positive personality index: High Conscientiousness + Openness + Extraversion + Agreeableness - Neuroticism
    df['positive_trait_index'] = (df['conscientiousness'] + df['openness_to_experience'] + df['extraversion'] + df['agreeableness'] - df['neuroticism']).round(2)
    
    out_path = os.path.join(cleaned_dir, "clean_sds_personality_traits.csv")
    df.to_csv(out_path, index=False)
    print(f"Saved: {out_path} ({df.shape[0]} rows, {df.shape[1]} cols)")
    return df

if __name__ == "__main__":
    clean_data_science_jobs()
    clean_analytics_jobs()
    clean_jds_traits()
    clean_sds_traits()
    print("\nAll datasets cleaned and saved successfully.")
