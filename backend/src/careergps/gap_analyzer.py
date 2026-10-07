from typing import List, Dict
from careergps.models import (
    CandidateIntelligence,
    TargetRoleDNA,
    SkillGap,
    EvidenceType
)
from careergps.intelligence import EVIDENCE_RANK

def determine_required_level(req) -> str:
    # High/Critical roles requiring APPLIED_IMPL or DEPLOYED demand Advanced level
    if req.expected_evidence.minimum_evidence_type in (EvidenceType.APPLIED_IMPL, EvidenceType.DEPLOYED):
        return "Advanced"
    elif req.expected_evidence.minimum_evidence_type == EvidenceType.PROJECT_USAGE:
        return "Intermediate"
    else:
        return "Beginner"

LEVEL_SCORE = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3
}

def calculate_skill_gaps(
    candidate: CandidateIntelligence,
    role_dna: TargetRoleDNA
) -> List[SkillGap]:
    gaps: List[SkillGap] = []

    for skill_key, req in role_dna.skills.items():
        candidate_skill = candidate.skills.get(skill_key)
        target_rank = EVIDENCE_RANK[req.expected_evidence.minimum_evidence_type]
        req_level = determine_required_level(req)

        if candidate_skill is None:
            # Complete absence of detected evidence
            current_ev_type = None
            current_conf = 0.0
            evidence_deficit = 1.0
            current_rank = 0
            cur_summary = "Zero detected evidence across resume and GitHub."
            curr_level = "Beginner"
            gap_lvl = "High"
            reason = f"No verified resume claims or GitHub code found for {req.skill_name}."
            missing_text = f"Build and document an end-to-end implementation ({', '.join(req.expected_evidence.sample_artifacts[:2])})."
            proj_ev = []
        else:
            current_ev_type = candidate_skill.highest_evidence_type
            current_conf = candidate_skill.aggregated_confidence
            current_rank = EVIDENCE_RANK[current_ev_type]
            curr_level = candidate_skill.current_level
            proj_ev = candidate_skill.verified_projects
            
            # Deficit: difference between expected tier and current tier, normalized
            if current_rank >= target_rank:
                evidence_deficit = max(0.05, 0.20 - (current_conf * 0.15)) # Small residual gap if confidence isn't absolute
            else:
                rank_diff = target_rank - current_rank
                evidence_deficit = min(1.0, 0.40 + (rank_diff * 0.20))
            
            cur_summary = f"Detected {current_ev_type.value} evidence ({candidate_skill.evidence_summary})."

            # Level-based Gap Reasoning (Intermediate vs Advanced partial gap)
            curr_val = LEVEL_SCORE.get(curr_level, 1)
            req_val = LEVEL_SCORE.get(req_level, 3)

            if curr_val >= req_val:
                gap_lvl = "None"
                reason = f"Candidate demonstrates {curr_level} competence matching or exceeding {role_dna.title} requirements."
                missing_text = "No critical gap. Maintain depth and stay updated with current ecosystem practices."
            elif curr_val == req_val - 1:
                gap_lvl = "Moderate" # Partial Gap
                if proj_ev:
                    reason = (
                        f"Candidate demonstrates practical {req.skill_name} development at {curr_level} level via "
                        f"{', '.join(proj_ev)}, but available evidence does not yet demonstrate advanced production "
                        f"architecture, testing, deployment or scalability required for {role_dna.title}."
                    )
                else:
                    reason = (
                        f"Candidate has {curr_level} exposure (self-reported/coursework), but lacks verified project "
                        f"code or production implementation required for {role_dna.title}."
                    )
                missing_text = (
                    f"Advancing from {curr_level.lower()} project development to production engineering: "
                    f"needs {req.expected_evidence.description}"
                )
            else:
                gap_lvl = "High"
                reason = (
                    f"Candidate is at {curr_level} level while {role_dna.title} requires {req_level}. "
                    f"Missing core implementation artifacts."
                )
                missing_text = f"Substantial gap: {req.expected_evidence.description}."

        # Actionability: skills like databases, API building, testing are high actionability (can be built into a project)
        # Highly theoretical or infra-heavy skills (like production kubernetes at scale) might have lower single-project actionability
        actionability = 0.90
        if skill_key in ["system_design"]:
            actionability = 0.70  # Harder to prove alone without larger system context

        # Explainable Priority Score = Importance Weight × Evidence Deficit × Actionability × 100
        raw_score = round(req.weight * evidence_deficit * actionability * 100, 1)

        why_matters = (
            f"{req.skill_name} is marked as {req.importance.value.upper()} importance ({int(req.weight * 100)}% weight) "
            f"for {role_dna.title}. Expected standard: {req.expected_evidence.minimum_evidence_type.value}."
        )

        missing_criteria = (
            f"Expected: {req.expected_evidence.description} "
            f"Artifacts: {', '.join(req.expected_evidence.sample_artifacts)}."
        )

        gaps.append(SkillGap(
            skill_name=req.skill_name,
            category=req.category,
            importance=req.importance,
            importance_weight=req.weight,
            current_evidence_type=current_ev_type,
            current_confidence=current_conf,
            evidence_deficit=round(evidence_deficit, 2),
            actionability=actionability,
            raw_priority_score=raw_score,
            explanation_why_matters=why_matters,
            explanation_current_evidence=cur_summary,
            missing_evidence_criteria=missing_criteria,
            current_level=curr_level,
            required_level=req_level,
            gap_level=gap_lvl,
            reason=reason,
            what_is_missing=missing_text,
            project_evidence=proj_ev
        ))

    # Sort deterministically by priority score descending
    gaps.sort(key=lambda g: g.raw_priority_score, reverse=True)
    return gaps
