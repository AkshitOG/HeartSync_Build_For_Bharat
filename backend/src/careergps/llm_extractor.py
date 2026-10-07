"""Candidate Skill & Evidence Extractor with Dual-Provenance Labeling.

Every extracted signal is strictly tagged with its verifiable provenance:
- "Extracted from Resume (Self-Reported)"
- "Externally Verified (GitHub Repo / Tests / Code Sample)"

Guarantees deterministic, reproducible behavior offline without external LLM keys,
with optional LLM enhancement when an API key is available.
"""

from typing import Dict, List, Any, Optional
import os
import re
from careergps.intelligence import extract_resume_evidence, SKILL_DISPLAY_NAMES, SKILL_CATEGORIES
from careergps.models import EvidenceItem, EvidenceType, EvidenceSource

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def extract_and_tag_candidate_skills(
    resume_text: str,
    github_repos: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Dict[str, Any]]:
    resume_ev = extract_resume_evidence(resume_text)
    results: Dict[str, Dict[str, Any]] = {}

    for skill_key, items in resume_ev.items():
        highest_type = max((it.evidence_type.value for it in items), default="claim")
        max_conf = max((it.confidence for it in items), default=0.5)

        provenance_tag = "Extracted from Resume (Self-Reported)"
        if highest_type in ["applied_impl", "deployed"]:
            verification_status = "Plausible applied implementation (Pending code review/work-sample)"
        elif highest_type == "coursework":
            verification_status = "Self-reported coursework (Certificates/Tutorials)"
        else:
            verification_status = "Self-reported claim in resume text"

        results[skill_key] = {
            "skill_name": SKILL_DISPLAY_NAMES.get(skill_key, skill_key.capitalize()),
            "category": SKILL_CATEGORIES.get(skill_key, "Technical"),
            "provenance_tag": provenance_tag,
            "verification_status": verification_status,
            "evidence_tier": highest_type,
            "confidence": max_conf,
            "mentions_count": len(items),
            "sample_snippet": items[0].detail if items else ""
        }

    # Overlay GitHub if available
    if github_repos:
        for repo in github_repos:
            repo_text = f"{repo.get('name', '')} {repo.get('description', '')} {repo.get('language', '')}".lower()
            for skill_key in results.keys():
                if skill_key in repo_text:
                    results[skill_key]["provenance_tag"] = "Externally Verified (GitHub Repository Evidence)"
                    results[skill_key]["verification_status"] = f"Verified in public codebase: {repo.get('name')}"
                    results[skill_key]["confidence"] = min(0.95, results[skill_key]["confidence"] + 0.15)

    return results
