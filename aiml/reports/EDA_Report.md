# Comprehensive Exploratory Data Analysis & Pattern Discovery Report

**Project Location:** `C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS`  
**Execution Environment:** Python 3.13 with pandas, numpy, scipy, matplotlib, seaborn, openpyxl, pypdf  
**Status:** Complete Rigorous Phase 1 – 11 Audit  

---

## 1. Executive Summary

This report delivers a rigorous, data-grounded audit, preprocessing pipeline, exploratory data analysis, and statistical validation across the four datasets provided for the hackathon challenge:
1. `DataScience Jobs.csv` (1,602 employer job postings across 10 defined role families)
2. `Analytics Jobs.csv` (15,841 job postings across the Indian analytics job market)
3. `JDS Skill Traits.xlsx` (139 Junior Data Scientists with measured technical skill proficiencies and salary hike outcomes)
4. `SDS Personality Traits.xlsx` (161 Senior Data Scientists evaluated on Big Five personality traits and customer-facing success outcomes)

Along with the supporting documentation:
- `Data Description Doc.pdf`
- `Problem Context Brief, SAS VFL Demos, Guidelines Dos and Donts.pdf`

### Central Discovery
A profound **divergence** exists between **external employer hiring demand** and **internal career advancement drivers**:
- **Market Job Postings:** Over-index on foundational coding and data manipulation tools (`SQL` #1 technical skill in 915 postings, `Python` in 840, `SAS` in 636), while big data tools (`Hadoop`, `Spark`) are heavily requested in data engineering job descriptions.
- **Internal Career Progression (Junior Level):** Technical coding and big data proficiency show **the lowest relative predictive power** for high salary hikes ($t = 1.30, p = 0.195$ for Big Data). Instead, **Dashboard & Storytelling** ($t = 7.55, p = 3.07 \times 10^{-11}, \text{Cohen's } d = 1.32$) and **Maths & Statistics** ($t = 6.96, p = 5.71 \times 10^{-10}, \text{Cohen's } d = 1.22$) are the overwhelming determiners of career acceleration.
- **Senior Role Elevation (Senior Level):** At customer-facing senior data science levels, technical aptitude gives way to personality traits: **Conscientiousness** ($d = 1.85, p = 6.87 \times 10^{-20}$) and **Openness to Experience** ($d = 1.80, p = 1.18 \times 10^{-19}$) explain success, while Neuroticism has virtually zero relationship with organizational performance ($d = -0.01, p = 0.941$).

---

## 2. Dataset Overview & Architecture

| Dataset | Format | Raw Shape | Cleaned Shape | Key Identifiers | Primary Focus |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **DataScience Jobs** | CSV | 1,602 rows × 8 cols | 1,602 rows × 14 cols | `reference_no` | Employer demand, compensation bands across 10 role titles |
| **Analytics Jobs** | CSV | 15,841 rows × 8 cols | 15,841 rows × 35 cols | `s_no` | Wide Indian analytics market, skills, experience, locations |
| **JDS Skill Traits** | Excel (.xlsx) | 139 rows × 7 cols | 139 rows × 10 cols | `id` | Entry-level technical competencies & salary hike (1/0) |
| **SDS Personality Traits** | Excel (.xlsx) | 161 rows × 7 cols | 161 rows × 9 cols | `id` | Senior customer-facing Big Five traits & success (1/0) |

---

## 3. Data Dictionary

### 3.1 DataScience Jobs (`clean_datascience_jobs.csv`)
| Column Name | Data Type | Meaning | Missing % | Unique Count | Sample Values | Notes |
| :--- | :---: | :--- | :---: | :---: | :--- | :--- |
| `reference_no` | int64 | Post reference ID | 0.0% | 1,460 | `7834, 7862, 5925` | 276 entries share reference numbers across employers |
| `company_name` | object | Hiring employer | 0.0% | 642 | `TCS, Accenture, IBM` | Cleaned and stripped |
| `job_title` | object | Formal role family title | 0.0% | 10 | `Data Scientist, Data Analyst` | Exactly 10 standardized roles |
| `min_experience` | int64 | Minimum required experience | 0.0% | 21 | `0, 2, 5, 8` | In whole years (range 0 to 21) |
| `min_salary_lakhs` | float64 | Minimum salary in INR Lakhs | 0.0% | 143 | `4.5, 5.8, 10.0` | Converted from raw string (`4.5L`) |
| `avg_salary_lakhs` | float64 | Mean offered salary in INR Lakhs | 0.0% | 247 | `7.8, 12.8, 15.9` | Converted from raw string (`7.8L`) |
| `max_salary_lakhs` | float64 | Maximum salary in INR Lakhs | 0.0% | 296 | `16.0, 23.0, 25.0` | Converted from raw string (`16.0L`) |
| `num_of_jobs_posted`| int64 | Number of postings by company | 0.0% | 145 | `841, 501, 394` | Sum represents market hiring scale |
| `is_senior_role` | int64 | Flag for Senior / Lead / Architect | 0.0% | 2 | `1, 0` | Derived feature |

### 3.2 Analytics Jobs (`clean_analytics_jobs.csv`)
| Column Name | Data Type | Meaning | Missing % | Unique Count | Sample Values | Notes |
| :--- | :---: | :--- | :---: | :---: | :--- | :--- |
| `s_no` | int64 | Unique row sequential ID | 0.0% | 15,841 | `1, 2, 3...` | Completely unique |
| `experience` | object | Raw experience interval | 0.0% | 128 | `5-10 yrs, 2-5 yrs` | Cleaned into min, max, avg |
| `job_description` | object | Unstructured job description | 22.15% | 7,859 | `Experience in credit card...`| 3,508 nulls (kept as empty text) |
| `job_desig` | object | Job designation / position | 0.0% | 10,097 | `Business Analyst, Data Analyst`| High cardinality raw text |
| `job_type_standardized`| object| Standardized job classification | 0.0% | 2 | `Analytics, Not Specified` | Standardized case variations |
| `key_skills_clean` | object | Comma-separated normalized skills| 0.01% | 10,659 | `sql, python, sas, r` | Removed trailing `...` |
| `primary_location` | object | Primary city of job | 0.0% | 382 | `Bengaluru, Mumbai, Gurgaon` | Extracted from multi-city string |
| `salary` | object | Offered salary bracket | 0.0% | 6 | `0to3, 3to6, 6to10, 10to15...` | Categorical bracket |
| `salary_midpoint_lakhs`| float64 | Numeric midpoint in Lakhs | 0.0% | 6 | `1.5, 4.5, 8.0, 12.5, 20.0, 37.5`| Mapped from bracket |

### 3.3 Junior Data Scientist Skills (`clean_jds_skill_traits.csv`)
| Column Name | Data Type | Meaning | Missing % | Unique Count | Range / Scale | Notes |
| :--- | :---: | :--- | :---: | :---: | :---: | :--- |
| `id` | int64 | Employee ID | 0.0% | 137 | `2007 - 4000` | 2 duplicate ID pairs flagged |
| `big_data_skills` | float64 | Big data competency score | 0.0% | 28 | 1.0 - 5.0 | Mean: 3.85, Std: 0.86 |
| `maths-stats_skills`| float64 | Maths & statistics competency | 0.0% | 27 | 1.0 - 5.0 | Mean: 4.29, Std: 0.77 |
| `coding_skills` | float64 | Coding in SAS, Python, SQL | 0.0% | 22 | 1.0 - 5.0 | Mean: 4.26, Std: 0.81 |
| `ai_and_ml_skills` | float64 | AI & ML competency score | 0.0% | 22 | 1.0 - 5.0 | Mean: 4.56, Std: 0.61 |
| `dashboard_and_storytelling_skills`| float64 | Visualization & Storytelling | 0.0% | 21 | 1.0 - 5.0 | Mean: 4.36, Std: 0.83 |
| `salary_hike_high_or_low` | int64 | Performance salary hike outcome | 0.0% | 2 | `0 or 1` | 52.5% High (1), 47.5% Low (0) |
| `composite_skill_score` | float64 | Mean across all 5 skill scores | 0.0% | 76 | 1.8 - 5.0 | Engineered overall metric |

### 3.4 Senior Data Scientist Personality (`clean_sds_personality_traits.csv`)
| Column Name | Data Type | Meaning | Missing % | Unique Count | Range / Scale | Notes |
| :--- | :---: | :--- | :---: | :---: | :---: | :--- |
| `id` | int64 | Employee ID | 0.0% | 152 | `8001 - 8979` | 9 duplicate ID pairs flagged |
| `neuroticism` | int64 | Tendency toward negative affect | 0.0% | 45 | 10 - 65 | Normalized score (Mean: 36.19) |
| `extraversion` | int64 | Social engagement & assertiveness| 0.0% | 47 | 10 - 68 | Normalized score (Mean: 43.20) |
| `openness_to_experience`| int64 | Intellectual curiosity & novelty | 0.0% | 46 | 11 - 67 | Normalized score (Mean: 41.33) |
| `agreeableness` | int64 | Empathy & cooperativeness | 0.0% | 47 | 12 - 68 | Normalized score (Mean: 44.60) |
| `conscientiousness` | int64 | Diligence, organization & drive | 0.0% | 46 | 14 - 68 | Normalized score (Mean: 45.22) |
| `success_classification_high_low`| int64| Success in client-facing role | 0.0% | 2 | `0 or 1` | 52.8% High (1), 47.2% Low (0) |
| `positive_trait_index`| float64 | Composite personality index | 0.0% | 85 | 40 - 230 | $C + O + E + A - N$ |

---

## 4. Data Quality Findings & Cleaning Decisions

1. **Salary Representation Discrepancy:**
   - `DataScience Jobs`: Stored as strings ending in `L` (e.g. `4.5L`). Validated that $100\%$ of entries follow `min <= avg <= max`. Converted to numerical float values in LPA.
   - `Analytics Jobs`: Stored as interval brackets (`0to3`, `3to6`, `6to10`, `10to15`, `15to25`, `25to50`). Engineered numerical min, max, and midpoint indicators.
2. **Key Skills Truncation:**
   - Raw `key_skills` in `Analytics Jobs` ended in trailing ellipses (`...`) due to scraping character limits. Cleaned by trimming trailing `...` and tokenizing comma-separated lists.
3. **Duplicate Identifier Resolution:**
   - `JDS Skill Traits` had 2 duplicate IDs (`id = 2223` and `id = 3291`). Noticeably, `id = 3291` had conflicting target outcomes (`1` vs `0`), suggesting either re-evaluation over time or distinct individuals with recycled IDs. We kept both in cleaned data while adding a binary indicator `is_duplicate_id`.
   - `SDS Personality Traits` had 9 duplicate IDs (18 rows). All were flagged with `is_duplicate_id` without silent deletion to preserve total evaluation records.
4. **Job Type Sparsity:**
   - In `Analytics Jobs`, `job_type` was $75.82\%$ missing, and non-null values had mixed casing (`Analytics`, `analytics`, `ANALYTICS`, `analytic`, `Analytic`). Standardized all variations into a clean binary classification: `Analytics` vs `Not Specified`.
5. **No Cross-Dataset ID Linkage:**
   - Checked ID overlap between `JDS` ($2007 \dots 4000$) and `SDS` ($8001 \dots 8979$). Overlap is exactly $0$. These represent **two separate organizational cohorts**: Junior entry-level data scientists evaluated on technical skills vs. Senior customer-facing data scientists evaluated on personality profiles. They should be synthesized conceptually as an **organizational career progression continuum**, not joined on row IDs.

---

## 5. Statistical Discoveries & Key Findings

### Finding 1: Storytelling and Math Drive Junior Salary Hikes (Not Coding or Big Data)
- **Dashboard & Storytelling Skills:** High Hike Mean $= 4.85$ vs Low Hike Mean $= 3.81$ ($t = 7.55, p = 3.07 \times 10^{-11}$, **Cohen's $d = 1.32$** — massive effect size).
- **Maths & Statistics Skills:** High Hike Mean $= 4.71$ vs Low Hike Mean $= 3.83$ ($t = 6.96, p = 5.71 \times 10^{-10}$, **Cohen's $d = 1.22$**).
- **Big Data Skills:** High Hike Mean $= 3.94$ vs Low Hike Mean $= 3.75$ ($t = 1.30, p = 0.195$, **Cohen's $d = 0.22$** — statistically insignificant!).
- *Interpretation:* Entry-level practitioners often obsess over Hadoop, Spark, and advanced infrastructure. In reality, organizations promote junior data scientists who can **explain their models mathematically and communicate insights to stakeholders**.

### Finding 2: Conscientiousness and Openness Predict Senior Success
- **Conscientiousness:** High Success Mean $= 53.68$ vs Low Success Mean $= 35.74$ ($t = 11.30, p = 6.87 \times 10^{-20}$, **Cohen's $d = 1.85$**).
- **Openness to Experience:** High Success Mean $= 48.49$ vs Low Success Mean $= 33.32$ ($t = 11.07, p = 1.18 \times 10^{-19}$, **Cohen's $d = 1.80$**).
- **Neuroticism:** High Success Mean $= 36.13$ vs Low Success Mean $= 36.26$ ($t = -0.07, p = 0.941$, **Cohen's $d = -0.01$**).
- *Interpretation:* Senior, customer-facing data scientists succeed when they are exceptionally reliable, disciplined, and intellectually curious enough to adapt to novel client business problems. Emotional reactivity (neuroticism) does not impair performance if conscientiousness and openness are high.

### Finding 3: Senior Role Compensation Multiplier
- In `DataScience Jobs`, Senior/Lead/Architect roles command a mean salary of **INR 16.55 LPA** compared to **INR 9.99 LPA** for Non-Senior roles ($t = 18.32, p = 4.89 \times 10^{-67}$, **Cohen's $d = 0.92$**).
- Median minimum experience required jumps from $1.0$ year for entry analysts to $4.0$ years for senior scientists and $6.0$ years for architects.

### Finding 4: Extreme Hiring Concentration
- Just **5 employers** (TCS, Accenture, Cognizant, Wipro, IBM) account for **23,348 job postings**—over $25\%$ of the total available hiring volume in `DataScience Jobs`.

### Finding 5: Geographical Clustering in Southern and Western Tech Corridors
- **Bengaluru** alone accounts for **3,333 postings ($21.0\%$)**, followed by **Mumbai (12.6%)**, **Gurgaon (8.3%)**, **Pune (6.0%)**, and **Hyderabad (5.5%)**.

---

## 6. Generated Publication-Ready Visualizations

All 12 presentation-quality figures are saved in `visualizations/`:

| File | Chart Title | Demonstrated Insight |
| :--- | :--- | :--- |
| `01_datascience_salary_distribution.png` | DS Salary Distribution (LPA) | Positively skewed compensation; Median ₹11.9L, Mean ₹13.2L, peak outliers up to ₹82L. |
| `02_analytics_experience_distribution.png` | Analytics Experience Distribution | Concentrated in early/mid-career (2–7 years); Median 4.5 years, Mean 5.3 years. |
| `03_top_in_demand_analytics_skills.png` | Top 15 In-Demand Analytics Skills | SQL, Analytics, Python, Finance, and Java lead market mentions. |
| `04_geographic_distribution_analytics_jobs.png`| Top 10 Employment Hubs | Bengaluru, Mumbai, and Gurgaon dominate $42\%$ of all market postings. |
| `05_salary_by_datascience_role.png` | Compensation Bands by DS Role | Data Architect and Senior Data Scientist top salary hierarchy. |
| `06_experience_by_salary_bracket_analytics.png` | Experience vs Salary Brackets | Linear experience progression from 0-3 LPA (2.2y) to 25-50 LPA (11.8y). |
| `07_top_datascience_employers.png` | Top 15 Employers by DS Openings | IT service giants dominate aggregate hiring volume. |
| `08_jds_skills_vs_salary_hike.png` | Junior Skills vs Salary Hike | Boxplots proving Dashboard/Storytelling & Stats create the largest separation. |
| `09_sds_traits_vs_success.png` | Senior Traits vs Success | Conscientiousness & Openness create near-complete separation between high/low success. |
| `10_market_demand_vs_career_advancement_driver.png`| Market Demand vs Career Driver | Visualizing the critical divergence between hiring frequency and internal performance. |
| `11_correlation_heatmaps_jds_sds.png`| Correlation Matrices (JDS & SDS) | Heatmaps highlighting high-impact correlations and orthogonality. |
| `12_datascience_role_salary_bands.png`| Role Hierarchy & Salary Bands | Min, median, and max compensation spread across all 10 DS role families. |

---

## 7. Discovered Patterns & Opportunity Areas

### Pattern A: The "Tool Trap" vs "Impact Translation"
- **Observed Pattern:** Employers list SQL and Python in job descriptions as screening filters, but internal organizational advancement rewards Data Storytelling ($r = 0.55$) and Mathematical Rigor ($r = 0.52$).
- **Potential Problem Statement:** *How can early-career data professionals transition from commoditized coding/tool proficiency to business impact translation and storytelling to maximize career mobility?*
- **Opportunity Direction:** An analytics talent calibration and career trajectory modeling platform linking market skill demand with actual career performance benchmarks.

### Pattern B: The Junior-to-Senior Skill-to-Personality Shift
- **Observed Pattern:** Junior success is driven by technical storytelling and quantitative foundations; Senior customer-facing success is driven by psychological traits (Conscientiousness $r = 0.68$, Openness $r = 0.67$).
- **Potential Problem Statement:** *How can organizations identify and cultivate customer-facing data science leaders by benchmarking behavioral readiness alongside technical competencies?*
- **Opportunity Direction:** A dual-engine talent diagnostic and workforce planning framework bridging technical competency assessments (JDS) with behavioral Big Five readiness (SDS) to predict customer engagement success and leadership retention.

### Pattern C: Role-Based Compensation Optimization
- **Observed Pattern:** Clear salary tiering exists across the 10 data science role titles (Data Analyst ₹6.5L median $\to$ Data Scientist ₹11.5L $\to$ Data Architect ₹21.0L).
- **Potential Problem Statement:** *How can recruitment agencies and hiring enterprises optimize compensation bands and experience thresholds to reduce talent turnover and vacancy duration?*
- **Opportunity Direction:** A dynamic salary benchmarking and experience calibration model using empirical market data to guide competitive talent acquisition.

---

## 8. Limitations & Questions for Challenge Organizers

1. **JDS and SDS Sample Sizes:** The employee datasets have 139 and 161 records respectively. While statistical significance is very high ($p < 10^{-6}$ for key drivers), confirming whether these represent a single corporate entity or an industry benchmark will guide deployment scope.
2. **Duplicate IDs:** Clarification on whether repeated IDs represent longitudinal performance tracking over multiple review cycles or data-entry artifacts.
3. **Challenge Evaluation Criteria:** Confirmation on whether Round 2 approach notes should focus on a workforce analytics/talent optimization business context or a candidate career trajectory tool.
