import os
import pandas as pd
import numpy as np

raw_dir = r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\data\raw"

def audit_file(filename):
    filepath = os.path.join(raw_dir, filename)
    print("=" * 80)
    print(f"FILE: {filename}")
    print("=" * 80)
    
    if filename.endswith(".csv"):
        # try utf-8 then latin1
        try:
            df = pd.read_csv(filepath)
        except Exception:
            df = pd.read_csv(filepath, encoding="latin1")
        dfs = {filename: df}
    elif filename.endswith(".xlsx"):
        xl = pd.ExcelFile(filepath)
        print(f"Sheet names: {xl.sheet_names}")
        dfs = {sheet: xl.parse(sheet) for sheet in xl.sheet_names}
    
    for name, df in dfs.items():
        print(f"\n--- Dataset/Sheet: {name} ---")
        print(f"Shape: {df.shape[0]} rows, {df.shape[1]} columns")
        print(f"Exact column names: {list(df.columns)}")
        print("\nData Types & Non-Null Counts:")
        info_df = pd.DataFrame({
            "dtype": df.dtypes,
            "non_null": df.notnull().sum(),
            "null_count": df.isnull().sum(),
            "null_pct": (df.isnull().sum() / len(df) * 100).round(2),
            "unique_count": df.nunique()
        })
        print(info_df)
        
        print("\nDuplicates:")
        print(f"Exact duplicate rows (all columns): {df.duplicated().sum()}")
        id_cols = [c for c in df.columns if any(k in c.lower() for k in ["id", "ref", "s_no", "sno"])]
        if id_cols:
            for ic in id_cols:
                print(f"Duplicates on identifier '{ic}': {df.duplicated(subset=[ic]).sum()} (Unique IDs: {df[ic].nunique()})")
                
        print("\nHead (First 3 rows):")
        print(df.head(3).to_dict(orient="records"))
        
        # summary stats
        num_cols = df.select_dtypes(include=[np.number]).columns
        if len(num_cols) > 0:
            print("\nNumerical Summary Statistics:")
            print(df[num_cols].describe().round(3))
            
        cat_cols = df.select_dtypes(include=['object', 'category']).columns
        if len(cat_cols) > 0:
            print("\nCategorical Top Values (preview):")
            for cc in cat_cols[:6]:
                top_vals = df[cc].value_counts(dropna=False).head(4).to_dict()
                print(f"  {cc}: {top_vals}")

if __name__ == "__main__":
    for fn in ["DataScience Jobs.csv", "Analytics Jobs.csv", "JDS Skill Traits.xlsx", "SDS Personality Traits.xlsx"]:
        audit_file(fn)
