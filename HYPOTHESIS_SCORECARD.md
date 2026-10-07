# HYPOTHESIS SCORECARD — CareerGPS MVP

**Evaluation Date:** Post-Implementation Hardening  
**Core Hypothesis:**  
> *"CareerGPS can determine a candidate's highest-leverage next career action better than a generic roadmap or a general-purpose chatbot."*

---

## 1. Dimension Scorecard

| Dimension | Status | Notes & Verification |
| :--- | :---: | :--- |
| **Candidate Extraction** | ✓ | Extracts structured evidence across resume sections & GitHub; respects 5-tier ladder (`Claim` $\to$ `Deployed`). |
| **Evidence Quality** | ✓ | Coursework is not over-promoted to applied code; forked GitHub repos are filtered out. |
| **Role DNA Quality** | ✓ | Explicitly calibrated benchmark roles (Backend, ML, Frontend) with skill importance and expected evidence criteria. |
| **Gap Quality** | ✓ | Deterministic, explainable math: $\text{Importance} \times \text{Deficit} \times \text{Actionability}$. |
| **Priority Quality** | ✓ | Gaps rank by actionable evidence deficit rather than keyword absence. |
| **Action Leverage** | ✓ | Gated by prerequisite foundations and scores Net Action Leverage across multi-gap surface closures. |
| **Counterfactual Quality** | ✓ | Explains why Action A beats runner-up Action B using concrete deficit and leverage deltas. |
| **Personalization** | ✓ | Distinct candidate evidence profiles deterministically produce distinct Next Best Actions. |
| **Recommendation Stability** | ✓ | Resistant to irrelevant hobbies and resume formatting noise. |
| **Real-Input Robustness** | ✓ | Handles PDF uploads, file size limits (5MB guard), empty inputs, and network timeouts safely. |
| **Uncertainty Handling** | ✓ | Explicit "Insufficient Evidence" state for low-signal inputs; never manufactures fake certainty. |
| **End-to-End Reliability** | ✓ | Fully integrated API and reactive web interface with 9 passing automated tests. |
| **ChatGPT Differentiation** | ✓ | Produces a singular actionable project with verifiable artifacts and counterfactuals instead of 10-step curricula. |
| **UX Clarity** | ✓ | High-hierarchy layout answering: *Target $\to$ Evidence $\to$ Biggest Gap $\to$ ONE Action $\to$ Why $\to$ Proof*. |

---

## 2. ChatGPT Differentiation Matrix

| Evaluation Vector | Generic LLM Chatbot Prompt | CareerGPS Decision Engine |
| :--- | :--- | :--- |
| **1. Output Quantity** | Produces 8–15 sequential bullet points ("1. Learn SQL, 2. Learn Docker, 3. Learn System Design..."). | Produces **ONE NEXT BEST ACTION** with multi-gap closure. |
| **2. Prioritization Method** | Broad probabilistic consensus based on internet roadmaps. | Deterministic scoring from structured evidence deficits and role importance. |
| **3. Grounding in Evidence** | Often accepts text claims at face value ("You know Docker"). | Distinguishes claims from projects, schemas, and deployed apps. |
| **4. Counterfactual Reasoning**| Almost never justifies why alternative topics were deprioritized. | Explicitly states why Action A beats runner-up Action B right now. |
| **5. Verifiable Artifacts** | Vague suggestions ("Build a web app"). | Specific proof criteria (migrations, schemas, CI badges, tests). |
| **6. Uncertainty Handling** | Frequently flatters or invents advice on sparse inputs. | Explicitly requests baseline evidence portfolio when signal is zero. |
