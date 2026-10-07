import pandas as pd
import numpy as np

raw_dir = r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\data\raw"

def deep_audit():
    ds_jobs = pd.read_csv(f"{raw_dir}/DataScience Jobs.csv")
    an_jobs = pd.read_csv(f"{raw_dir}/Analytics Jobs.csv")
    jds = pd.read_excel(f"{raw_dir}/JDS Skill Traits.xlsx")
    sds = pd.read_excel(f"{raw_dir}/SDS Personality Traits.xlsx")

    print("=" * 80)
    print("1. DEEP AUDIT: DataScience Jobs.csv")
    print("=" * 80)
    print(f"Total rows: {len(ds_jobs)}, Unique reference_no: {ds_jobs['reference_no'].nunique()}")
    print("Duplicate reference_no rows:")
    dup_refs = ds_jobs[ds_jobs.duplicated(subset=['reference_no'], keep=False)].sort_values('reference_no')
    print(f"Count of rows with duplicate reference_no: {len(dup_refs)}")
    if len(dup_refs) > 0:
        print(dup_refs.head(6))
    
    print("\nUnique job_titles in DataScience Jobs:")
    print(ds_jobs['job_title'].value_counts())
    print("\nTop 10 companies by job postings sum vs row count:")
    comp_grp = ds_jobs.groupby('company_name').agg(
        record_count=('job_title', 'count'),
        total_postings=('num_of_jobs', 'sum')
    ).sort_values('total_postings', ascending=False)
    print(comp_grp.head(10))

    print("\nSalary strings inspection in DataScience Jobs:")
    for col in ['avg_salary', 'min_salary', 'max_salary']:
        sample_vals = ds_jobs[col].dropna().unique()[:10]
        print(f"  {col} sample: {sample_vals}")

    print("\n=" * 80)
    print("2. DEEP AUDIT: Analytics Jobs.csv")
    print("=" * 80)
    print(f"Total rows: {len(an_jobs)}, Unique s_no: {an_jobs['s_no'].nunique()}")
    print("\nSalary unique values:")
    print(an_jobs['salary'].value_counts(dropna=False))
    print("\njob_type unique values:")
    print(an_jobs['job_type'].value_counts(dropna=False))
    print("\nexperience format sample:")
    print(an_jobs['experience'].value_counts().head(10))
    print("\nTop 10 Job Designations (job_desig):")
    print(an_jobs['job_desig'].value_counts().head(10))
    print("\nTop locations:")
    print(an_jobs['location'].value_counts().head(10))

    print("\n=" * 80)
    print("3. DEEP AUDIT: JDS Skill Traits.xlsx")
    print("=" * 80)
    print(f"Total rows: {len(jds)}, Unique ID: {jds['id'].nunique()}")
    dup_jds = jds[jds.duplicated(subset=['id'], keep=False)].sort_values('id')
    print("Duplicate IDs in JDS:")
    print(dup_jds)
    print("\nTarget 'salary_hike_high_or_low' distribution:")
    print(jds['salary_hike_high_or_low'].value_counts(normalize=True))
    print("\nCorrelation with target:")
    print(jds.corr()['salary_hike_high_or_low'].sort_values(ascending=False))

    print("\n=" * 80)
    print("4. DEEP AUDIT: SDS Personality Traits.xlsx")
    print("=" * 80)
    print(f"Total rows: {len(sds)}, Unique ID: {sds['id'].nunique()}")
    dup_sds = sds[sds.duplicated(subset=['id'], keep=False)].sort_values('id')
    print("Duplicate IDs in SDS:")
    print(dup_sds)
    print("\nClean column names (strip spaces):")
    sds.columns = [c.strip() for c in sds.columns]
    print(sds.columns.tolist())
    target_col = [c for c in sds.columns if 'success' in c][0]
    print(f"\nTarget '{target_col}' distribution:")
    print(sds[target_col].value_counts(normalize=True))
    print("\nCorrelation with target:")
    print(sds.corr()[target_col].sort_values(ascending=False))

    print("\n=" * 80)
    print("5. ID CROSS-OVER CHECK BETWEEN DATASETS")
    print("=" * 80)
    print(f"JDS id range: [{jds['id'].min()}, {jds['id'].max()}]")
    print(f"SDS id range: [{sds['id'].min()}, {sds['id'].max()}]")
    print(f"DS Jobs reference_no range: [{ds_jobs['reference_no'].min()}, {ds_jobs['reference_no'].max()}]")
    print(f"Analytics Jobs s_no range: [{an_jobs['s_no'].min()}, {an_jobs['s_no'].max()}]")
    
    print(f"Overlap between JDS id and SDS id: {len(set(jds['id']).intersection(set(sds['id'])))}")
    print(f"Overlap between JDS id and DS Jobs reference_no: {len(set(jds['id']).intersection(set(ds_jobs['reference_no'])))}")
    print(f"Overlap between SDS id and DS Jobs reference_no: {len(set(sds['id']).intersection(set(ds_jobs['reference_no'])))}")

if __name__ == "__main__":
    deep_audit()
