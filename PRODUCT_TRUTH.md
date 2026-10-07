# PRODUCT TRUTH — CareerGPS MVP

**Last Updated:** Current Build  
**Status:** MVP Operational  

---

## 1. Core Hypothesis
> **CareerGPS can determine a candidate's highest-leverage next career action better than a generic roadmap or a general-purpose chatbot.**

---

## 2. What CareerGPS Currently Proves
1. **Evidence-Driven Prioritization:** The system differentiates between mere skill claims (bullet points) and applied evidence (repositories, schemas, tests, deployed applications).
2. **Deterministic & Explainable Gap Scoring:** 
   $$\text{Priority Score} = \text{Target Importance Weight} \times \text{Evidence Deficit} \times \text{Actionability} \times 100$$
   Every prioritized gap displays the exact math, current evidence tier, and the required standard.
3. **Singular "ONE NEXT BEST ACTION":** Rather than returning a generic 10-step curriculum (e.g. "1. Learn SQL, 2. Learn Docker, 3. Learn System Design..."), CareerGPS selects the single project that closes the largest gap while simultaneously covering secondary complementary gaps.
4. **Counterfactual Justification:** For the chosen action, the engine explicitly articulates *why this action beats runner-up alternatives*.
5. **Personalization Integrity:** Tested and verified that candidates with different backgrounds (e.g. backend specialist with SQL gap vs. frontend engineer transitioning to backend) receive different primary gaps and different Next Best Actions.
6. **Recommendation Stability:** Verified that adding noise/unrelated resume content does not arbitrarily perturb the highest-leverage recommendation.

---

## 3. What CareerGPS Does NOT Prove
- We do **NOT** prove that completing an action guarantees a job offer or interview.
- We do **NOT** claim verified expert proficiency without automated test harnesses or cryptographic proof.
- We do **NOT** claim universal role requirements; role definitions are calibrated models that evolve over time.
- We do **NOT** output fake precision scores like "Candidate is 73.4% proficient".

---

## 4. Current Scoring Methodology
- **Evidence Ladder:**
  1. *Claim* (mention in resume skill list) — weight 1
  2. *Coursework* (tutorials, academic courses) — weight 2
  3. *Project Usage* (general repo or project mention) — weight 3
  4. *Applied Implementation* (schema migrations, transactions, tests, async APIs) — weight 4
  5. *Deployed / Production* (live URLs, CI/CD, releases) — weight 5
- **Confidence:** Expresses certainty that the evidence signal exists, **never** candidate proficiency.
- **Readiness:** Categorized into three explainable tiers:
  - *Strong Evidence*
  - *Needs Stronger Evidence*
  - *Major Evidence Gaps*

---

## 5. Current Differentiation From Generic Chatbots
| Capability | Generic Chatbot / LLM Prompt | CareerGPS Decision Engine |
| :--- | :--- | :--- |
| **Input Analysis** | Keyword matching & broad summarization | Structured evidence extraction across resume & GitHub |
| **Output Format** | Generic 10-item sequential roadmap | **ONE NEXT BEST ACTION** designed for maximum leverage |
| **Scoring** | Opaque, hallucinated, or unexplainable | Deterministic mathematical scoring with clear evidence deficits |
| **Counterfactuals** | None ("Here are things to learn") | Explicit explanation of *why this action beats alternative #2* |
| **Evidence Output** | Vague suggestions ("Build a project") | Exact required artifacts (migrations, tests, schemas, CI) |
| **Honesty** | Often flatters or gives fake precision | Categorical evidence tiers; zero fake certainty |

---

## 6. Safe Demo Claims
- "CareerGPS extracts structured evidence rather than accepting keyword claims at face value."
- "The engine prioritizes actions that maximize gap closure per unit of candidate effort."
- "The scoring is transparent and explainable down to the exact formula."
- "Candidates with different evidence receive different recommendations."

---

## 7. Claims We Must NOT Make
- ❌ "Our AI guarantees you will get hired."
- ❌ "You are verified at 92% Python proficiency."
- ❌ "We have verified your coding expertise" (unless direct test/code proof is provided).
