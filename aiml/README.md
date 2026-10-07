# CareerGPS — AI/ML Data Science & Modeling Engine

This directory contains the complete end-to-end Machine Learning, Data Cleaning, Exploratory Data Analysis (EDA), Statistical Validation, and Model Training pipelines for CareerGPS (Build For Bharat 2.0).

---

## 📊 Pipeline Architecture

```text
RAW DATASETS (15,841 jobs + JDS + SDS)
          │
          ▼
DATA CLEANING & STANDARDIZATION (`src/cleaning.py`)
  ├── Deduplication & Missing Value Imputation
  ├── Salary Normalization & Outlier Bounds
  └── Feature Engineering (Skill Density, Experience Bracket)
          │
          ▼
EXPLORATORY DATA ANALYSIS (`notebooks/`, `visualizations/`)
  ├── 12 High-Resolution Visualizations (`visualizations/`)
  ├── Statistical Tests & Correlation Matrices (`src/statistical_validation.py`)
  └── EDA Findings Report (`reports/EDA_Report.md`)
          │
          ▼
MACHINE LEARNING MODELING (`src/modeling.py`, `notebooks/`)
  ├── Logistic Regression (Priority Model & Technical Capability)
  ├── 5-Fold Stratified Cross-Validation
  ├── Feature Importance & ROC-AUC Analysis
  └── Modeling Evaluation Report (`reports/Modeling_Report.md`)
          │
          ▼
PRODUCTION INTEGRATION (`backend/models/priority_model.joblib`)
  └── Powers CareerGPS Gap Analyzer & Decision Engine
```

---

## 🗂️ Directory Structure

- **`notebooks/`**:
  - `00_master_end_to_end_pipeline.ipynb`: Complete master pipeline from raw CSVs to serialized models.
  - `01_comprehensive_eda_and_pattern_discovery.ipynb`: Deep exploratory data analysis across market demands.
  - `01_preprocessing_pipeline.ipynb`: Cleaning, imputation, and feature transformation.
  - `02_visualization_pipeline.ipynb`: Automated generation of all 12 publication-grade charts.
  - `03_model_training_pipeline.ipynb`: Training, tuning, evaluation metrics, and joblib serialization.

- **`src/`**:
  - `cleaning.py`: Deterministic data cleaning and schema validation.
  - `modeling.py`: Training routines, stratified CV, classification reports, and artifact export.
  - `visualize.py`: Publication-ready visualization generator (Seaborn + Matplotlib).
  - `market_intelligence.py`: Market demand calculations and skill adjacency matrices.
  - `statistical_validation.py`: Statistical hypothesis tests (Chi-Square, ANOVA, Pearson).
  - `audit_datasets.py` & `deep_audit.py`: Schema validation and null audits.
  - `generate_modeling_report.py`: Programmatic generation of `reports/Modeling_Report.md`.

- **`visualizations/`**:
  - `01_datascience_salary_distribution.png`
  - `02_analytics_experience_distribution.png`
  - `03_top_in_demand_analytics_skills.png`
  - `04_geographic_distribution_analytics_jobs.png`
  - `05_salary_by_datascience_role.png`
  - `06_experience_by_salary_bracket_analytics.png`
  - `07_top_datascience_employers.png`
  - `08_jds_skills_vs_salary_hike.png`
  - `09_sds_traits_vs_success.png`
  - `10_market_demand_vs_career_advancement_driver.png`
  - `11_correlation_heatmaps_jds_sds.png`
  - `12_datascience_role_salary_bands.png`

- **`reports/`**:
  - `EDA_Report.md`: Full exploratory data analysis findings and distributions.
  - `Modeling_Report.md`: Model benchmark comparison, ROC-AUC, F1-scores, and hyperparameters.
  - `model_results.json` & `model_results.csv`: Serialized performance metrics across all models.
  - `figures/`: Confusion matrices, ROC curves, and feature importance bar plots.

- **`data/`**:
  - `raw/`: Original competition datasets (`Analytics Jobs.csv`, `DataScience Jobs.csv`, `JDS Skill Traits.xlsx`, `SDS Personality Traits.xlsx`).
  - `cleaned/`: Cleaned, validated CSVs with engineered features.

---

## 🚀 How to Run the Pipeline

```bash
# 1. Install dependencies
pip install -e .

# 2. Run data cleaning and validation
python src/cleaning.py

# 3. Generate visualizations
python src/visualize.py

# 4. Train models and generate reports
python src/run_modeling_pipeline.py

# 5. Run test suite
pytest tests/
```
