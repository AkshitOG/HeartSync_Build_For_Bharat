# CareerGPS — AI Workforce & Career Intelligence Platform

> **Turn real job-market data and candidate evidence into the next best career action.**
> 
> 🌐 **Live Production Deployment**: [https://careergps-seven.vercel.app](https://careergps-seven.vercel.app)

CareerGPS is a hackathon/competition-grade SaaS platform built for **Build For Bharat 2.0**.
It unifies two connected products powered by empirical job-market data (15,841 jobs) and cross-validated machine learning models:

1. **Candidate CareerGPS Dashboard** (Core Product Hypothesis)
2. **HR Intelligence Dashboard** (Enterprise Workforce Analytics & AI HR Desk)
3. **AIML Data Science & Modeling Engine** (`/aiml`: Data cleaning, EDA notebooks, 12 charts, and models)

---

## 🌟 The Core Product Hypothesis

Traditional career platforms fail in two ways:
- **Resume screeners** assign arbitrary percentage scores ("You are 82% qualified") or silently reject candidates based on keyword matching.
- **Generic AI chat tools** provide overwhelming 15-step generic checklists ("Learn Docker, Kubernetes, AWS, Go, Kafka, and LeetCode") without prioritization.

**CareerGPS solves this deterministically:**
> CareerGPS analyzes a candidate's verifiable evidence against calibrated **Target Role DNA**, computes their personal evidence deficit, and recommends the **ONE NEXT BEST ACTION** that yields the highest leverage per unit of effort.

```text
REAL JOB-MARKET DATA (15,841 Jobs)
         +
CANDIDATE EVIDENCE (Resume + GitHub)
         +
TECHNICAL CAPABILITY (JDS Model • 85.3% Acc)
         +
WORK-STYLE GUIDANCE (SDS Model • 94.4% Acc)
         ↓
CANDIDATE INTELLIGENCE & ROLE DNA
         ↓
SKILL GAP & PRIORITY ENGINE
(Importance × Deficit × Actionability)
         ↓
HERO: ONE NEXT BEST ACTION
(What to Build • Verifiable Artifacts • Counterfactual Rationale)
```

---

## 🚀 Key Modules & Capabilities

### Product 1: Candidate CareerGPS
- **Evidence-Grounded Intake**: Upload PDF resume, paste text, or link GitHub. Includes **1-Click Demo Profiles** (`Alex Sharma` - Backend, `Priya Patel` - Data Scientist).
- **Fast Deterministic Analysis Sequence**: Real-time extraction, gap computation, and action synthesis.
- **Hero ONE Next Best Action**:
  - Clear title, headline, and primary gap targeted.
  - **What You Must Build**: Concrete architectural project scope.
  - **Expected Verifiable Artifacts**: Exact code deliverables (e.g. Alembic migrations, CI badges, OpenAPI specs).
  - **Counterfactual Rationale**: Rigorous explanation of *"Why this action beats working on alternative gaps"*.
  - **Readiness Impact Preview**: Simulated progression across evidence tiers.
  - **Feedback Loop**: Integrated candidate utility ratings.
- **Role Readiness Gauge**: Emphatic **"Evidence Coverage: XX% • NOT Hiring Probability"** badge, with strong, developing, and major gap breakdowns.
- **Ranked Skill Gaps**: Filterable between All Gaps, Critical Gaps, and Strengths. Includes a 1-click **"Prove via Work Sample ⚡"** action.
- **Candidate Intelligence — Evidence Chain**: Dual-provenance labeling (**"Extracted from Resume (Self-Reported)"** vs **"Externally Verified (GitHub)"**).
- **Technical Capability Profile**: 5-dimension radar (Coding, AI/ML, Math/Stats, Big Data, Dashboarding) mapped from Dataset 3 JDS model.
- **Work-Style Profile**: Big Five OCEAN personality insights from Dataset 4 SDS model, strictly for collaboration & onboarding.
- **Uncertainty Fallback to Work Samples**: Standardized 45-minute timed challenges (PostgreSQL transactions, FastAPI endpoints, PyTorch loaders) to eliminate guesswork.
- **Responsible AI Guardrails**: Strict non-filtering rules, no automated rejection, no protected demographic attributes.

### Product 2: HR Intelligence Dashboard
- **Workforce Health Overview**: 48 active employees across 5 departments, 94.2% attendance baseline, tasks assigned vs completed, and department workload status (`Optimal`, `Moderate`, `Overloaded`).
- **Daily HR Brief**: Top 3 actionable executive alerts with severity tags, concrete evidence trails, and recommended interventions.
- **AI HR Desk**: Natural-language query console with pre-seeded executive prompts (*"Which department is overloaded?"*, *"Who is at risk of burnout?"*, *"What is the Monday attendance pattern?"*), returning **Answer + Evidence + Recommended Action**.
- **Strategic Workforce Insights**: Linking internal technical capability data to organizational design, internal mobility, and retention.
- **Model Evaluation Audit Modal**: Full 5x5 Repeated Stratified K-Fold CV metrics directly accessible from the UI.

---

## 📊 Canonical Production ML Model & Empirical Data

### The Single Final Production ML Model
CareerGPS operates with **exactly ONE production machine-learning model** in its runtime inference pipeline:

> **Logistic Regression — Technical Capability Model (Dataset 3 • JDS Skill Traits)**

- **Pipeline Architecture**: `Pipeline([('scaler', StandardScaler()), ('clf', LogisticRegression(C=1.0, solver='lbfgs', max_iter=1000))])`
- **Validated Cross-Validation Results (5x5 Repeated Stratified K-Fold / 25 Folds)**:
  - Accuracy: **85.29%**
  - Balanced Accuracy: **85.05%**
  - Precision: **84.17%**
  - Recall: **89.52%**
  - F1 Score: **86.51%**
  - ROC-AUC: **90.35%**
- **Canonical Feature Schema (Strict Enforced Order)**:
  1. `big_data_skills` (Weight: +0.6831, OR: 1.98)
  2. `maths-stats_skills` (Weight: +1.2842, OR: 3.61 — Highest Driver)
  3. `coding_skills` (Weight: +0.5332, OR: 1.70)
  4. `ai_and_ml_skills` (Weight: +0.7624, OR: 2.14)
  5. `dashboard_and_storytelling_skills` (Weight: +1.1174, OR: 3.06)
- **Persisted Artifacts**:
  - `backend/models/technical_capability/model.joblib`
  - `backend/models/technical_capability/metadata.json`
- **Runtime Service**: `backend/src/careergps/technical_capability_service.py` (`TechnicalCapabilityService`)
- **Dedicated Endpoints**:
  - `POST /api/candidate/technical-capability`: Returns capability signal, calibrated confidence, z-scores, and log-odds contributions.
  - `GET /api/models/canonical`: Returns production model metadata and CV evaluation metrics.
- **Experimental Models Notice**: All alternative models (Random Forest, Decision Tree, Dummy Classifier, and SDS Personality Classifier) remain strictly in research/evaluation reports and are **never loaded or invoked** in the production candidate intelligence pipeline.

| Component | Dataset Source | Model & Key Metric | Purpose | Runtime Status |
| :--- | :--- | :--- | :--- | :--- |
| **Technical Capability Model** | JDS Skill Traits (`139` records) | **Logistic Regression**: 85.3% Acc, 90.4% ROC-AUC, 86.5% F1 | Evaluates technical capability signal & log-odds drivers | **CANONICAL PRODUCTION MODEL** |
| **Market Benchmarks & Adjacencies** | Analytics Jobs (`15,841` records) | Statistical aggregations (12.8L DS, 5.0L DA, 9.1L MLE) | Market benchmarks, skill co-occurrences | Production Reference Data |
| **Work-Style Insights** | SDS Personality Traits (`135` records) | Descriptive Big Five indicators (OCEAN) | Advisory collaboration & onboarding tips | Static Advisory (Non-Filtering) |
| **Alternative Models (RF/DT/Dummy)** | JDS & SDS Datasets | Random Forest, Decision Tree, Dummy | Offline comparative evaluation | Offline Research Only |

---

## 🛠️ Architecture & Tech Stack

```text
prototype/
├── backend/
│   ├── data/
│   │   ├── hr_workforce_data.json       # 48 employees, departments, briefs, QA
│   │   ├── market_intelligence.json     # 15,841 jobs, adjacencies, benchmarks
│   │   ├── model_results.json           # 25-fold CV evaluation metrics
│   │   ├── clean_jds_skill_traits.csv   # Model training data
│   │   └── local_db.json                # Zero-credential autonomous JSON storage
│   ├── models/
│   │   └── technical_capability/        # Canonical serialized model artifacts
│   │       ├── model.joblib             # StandardScaler + LogisticRegression Pipeline
│   │       └── metadata.json            # Model coefficients, CV metrics & schema
│   ├── src/careergps/
│   │   ├── main.py                      # FastAPI app & REST endpoints
│   │   ├── models.py                    # Pydantic v2 domain schemas
│   │   ├── technical_capability_service.py # Production Logistic Regression service
│   │   ├── intelligence.py              # Resume & GitHub evidence extractor
│   │   ├── role_dna.py                  # 5 Target Role DNAs & market benchmarks
│   │   ├── gap_analyzer.py              # Priority score engine
│   │   ├── action_engine.py             # ONE Next Best Action & counterfactuals
│   │   ├── hr_engine.py                 # Workforce overview, briefs, AI HR Desk
│   │   ├── graph_engine.py              # Role DNA & market co-occurrence graph
│   │   ├── work_sample.py               # 45-min uncertainty challenge engine
│   │   ├── demo_data.py                 # Seeded candidates (Alex & Priya)
│   │   ├── supabase_client.py           # Persistence adapter with local fallback
│   │   └── parser.py                    # PDF & text stream parser
│   └── tests/
│       ├── test_production_model.py     # Rigorous production ML model tests
│       ├── test_api_integration.py      # FastAPI endpoints tests
│       ├── test_hypothesis_and_engine.py# Core hypothesis & stability tests
│       └── test_hr_and_extensions.py    # HR & graph endpoint tests
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                   # Dark-first SaaS shell
│   │   ├── page.tsx                     # Unified tab navigation container
│   │   └── globals.css                  # Tailwind styles
│   ├── components/
│   │   ├── CandidateInput.tsx           # Intake with 1-Click Demo Profiles
│   │   ├── NextBestAction.tsx           # Hero action with counterfactuals
│   │   ├── Readiness.tsx                # Coverage gauge & non-hiring banner
│   │   ├── SkillGaps.tsx                # Filterable gaps & work-sample button
│   │   ├── CandidateIntelligence.tsx    # Dual-provenance evidence list
│   │   ├── TargetRoleDNAView.tsx        # Role DNA & salary benchmarks
│   │   ├── EvidenceGraphView.tsx        # Directed node-edge graph visualizer
│   │   ├── TechnicalProfileView.tsx     # 5-dimension capability radar & ML explainability
│   │   ├── WorkStyleProfileView.tsx     # Big Five traits & ethical guardrail
│   │   ├── WorkSampleModal.tsx          # 45-min challenge specification modal
│   │   ├── ResponsibleAIView.tsx        # Algorithmic fairness & transparency
│   │   ├── HRDashboard.tsx              # Workforce metrics, brief, AI desk
│   │   └── AnalysisProgress.tsx         # Fast analysis progress sequence
│   ├── lib/
│   │   └── api.ts                       # Resilient API client with fallback
│   └── types/
│       ├── career.ts                    # Candidate and Role TypeScript contracts
│       └── hr.ts                        # Workforce and HR TypeScript contracts
├── run_backend.bat                      # 1-Click backend launcher
├── run_frontend.bat                     # 1-Click frontend launcher
├── run_all.bat                          # 1-Click full-stack launcher
└── README.md
```

---

## ⚡ Quickstart

### Option A: 1-Click Launch (Windows)
Double-click:
```bat
run_all.bat
```
This automatically starts:
- FastAPI Backend on `http://127.0.0.1:8000`
- Next.js Frontend on `http://localhost:3000`

### Option B: Manual Terminal Execution

#### 1. Start Backend
```powershell
cd prototype/backend
python -m uvicorn careergps.main:app --app-dir src --host 127.0.0.1 --port 8000 --reload
```

#### 2. Start Frontend
```powershell
cd prototype/frontend
npm run dev
```

#### 3. Run Backend Verification Tests
```powershell
cd prototype/backend
python -m pytest tests/
# Output: 26 passed (100% passing)
```

#### 4. Run Frontend Production Build Check
```powershell
cd prototype/frontend
npm run build
# Output: Compiled successfully with 0 errors
```

---

## ⚖️ Responsible AI Guardrails
- **No Automated Screening / Disqualification**: Candidate profiles cannot be auto-rejected.
- **Evidence Over Pedigree**: Ranks verifiable applied artifacts rather than university brand or keywords.
- **Zero Hallucinated Confidence**: Sparse resumes explicitly trigger an "Insufficient Evidence" baseline alert.
- **Personality Boundary**: Big Five personality traits are strictly advisory for onboarding, collaboration, and learning; never used for candidate filtering.
