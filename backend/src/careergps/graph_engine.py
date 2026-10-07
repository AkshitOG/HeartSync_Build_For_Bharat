"""Graph Engine for CareerGPS Role DNA and Candidate Evidence Network.

Provides directed node-edge graph structures for:
1. Target Role DNA: Competencies, required skills, prerequisites, and synergies.
2. Market Co-occurrence: Real job-market skill adjacency edges (Jaccard similarity).
3. Candidate Evidence Overlay: Nodes colored and sized by candidate evidence tier.
"""

from typing import Dict, Any, List, Optional
import json
import os
from careergps.role_dna import get_role_dna
from careergps.models import CandidateIntelligence, TargetRoleDNA

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
MARKET_DATA_PATH = os.path.join(DATA_DIR, "market_intelligence.json")

def load_market_adjacencies() -> List[Dict[str, Any]]:
    if os.path.exists(MARKET_DATA_PATH):
        try:
            with open(MARKET_DATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("top_15_skill_adjacencies", [])
        except Exception:
            pass
    return []

def get_role_graph(
    role_id: str,
    candidate_skills: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    role_dna = get_role_dna(role_id)
    adjacencies = load_market_adjacencies()

    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []

    # 1. Root Role Node
    nodes.append({
        "id": f"role_{role_dna.role_id}",
        "label": role_dna.title,
        "type": "role",
        "category": "Target Role",
        "importance": "core",
        "weight": 1.0,
        "evidence_status": "target",
        "description": role_dna.description
    })

    # 2. Competency / Category Hub Nodes
    categories = sorted({req.category for req in role_dna.skills.values()})
    for cat in categories:
        cat_id = f"cat_{cat.lower().replace(' ', '_')}"
        nodes.append({
            "id": cat_id,
            "label": cat,
            "type": "category",
            "category": cat,
            "importance": "high",
            "weight": 0.8,
            "evidence_status": "hub"
        })
        edges.append({
            "source": f"role_{role_dna.role_id}",
            "target": cat_id,
            "relationship": "COMPETENCY_DOMAIN",
            "weight": 0.9
        })

    # 3. Skill Nodes
    for skill_key, req in role_dna.skills.items():
        skill_node_id = f"skill_{skill_key}"

        # Determine evidence status if candidate profile is supplied
        status = "unassessed"
        conf = 0.0
        tier = "none"
        if candidate_skills is not None:
            c_skill = candidate_skills.get(skill_key)
            if c_skill:
                tier = getattr(c_skill, "highest_evidence_type", None)
                if hasattr(tier, "value"):
                    tier = tier.value
                conf = getattr(c_skill, "aggregated_confidence", 0.5)

                if tier in ["applied_impl", "deployed"]:
                    status = "strong_evidence"
                elif tier in ["project_usage", "coursework"]:
                    status = "developing"
                else:
                    status = "claim_only"
            else:
                status = "critical_gap"

        nodes.append({
            "id": skill_node_id,
            "label": req.skill_name,
            "type": "skill",
            "category": req.category,
            "importance": req.importance.value,
            "weight": req.weight,
            "evidence_status": status,
            "evidence_tier": tier,
            "confidence": conf,
            "expected_tier": req.expected_evidence.minimum_evidence_type.value,
            "sample_artifacts": req.expected_evidence.sample_artifacts
        })

        # Connect category hub to skill
        cat_id = f"cat_{req.category.lower().replace(' ', '_')}"
        edges.append({
            "source": cat_id,
            "target": skill_node_id,
            "relationship": "REQUIRES",
            "weight": req.weight
        })

        # Prerequisites
        for prereq_key in req.prerequisites:
            if prereq_key in role_dna.skills:
                edges.append({
                    "source": f"skill_{prereq_key}",
                    "target": skill_node_id,
                    "relationship": "PREREQUISITE_OF",
                    "weight": 0.85
                })

        # Synergies
        for syn_key in req.synergies:
            if syn_key in role_dna.skills and syn_key > skill_key:  # avoid duplicate bidirectionals
                edges.append({
                    "source": skill_node_id,
                    "target": f"skill_{syn_key}",
                    "relationship": "SYNERGY_WITH",
                    "weight": 0.75
                })

    # 4. Inject Market Adjacencies from 15,841 jobs where applicable
    for adj in adjacencies:
        s1 = adj.get("skill_1", "").lower().replace(" ", "_")
        s2 = adj.get("skill_2", "").lower().replace(" ", "_")
        # Check if both are present in role
        id1 = f"skill_{s1}"
        id2 = f"skill_{s2}"
        node_ids = {n["id"] for n in nodes}
        if id1 in node_ids and id2 in node_ids:
            # Check if edge already exists
            existing = any(
                (e["source"] == id1 and e["target"] == id2) or (e["source"] == id2 and e["target"] == id1)
                for e in edges
            )
            if not existing:
                edges.append({
                    "source": id1,
                    "target": id2,
                    "relationship": "MARKET_COOCCURRENCE",
                    "weight": round(adj.get("jaccard_similarity", 0.2), 3),
                    "cooccurrence_count": adj.get("cooccurrence_count", 0)
                })

    return {
        "role_id": role_dna.role_id,
        "title": role_dna.title,
        "total_nodes": len(nodes),
        "total_edges": len(edges),
        "nodes": nodes,
        "edges": edges,
        "provenance": "Constructed from Target Role DNA & 15,841 Job-Market Co-occurrence Graphs"
    }
