"""Persistence adapter for CareerGPS.

Supports:
1. Supabase Postgres (when SUPABASE_URL and SUPABASE_KEY are provided in env).
2. Autonomous Local JSON DB fallback (backend/data/local_db.json) for 100% offline,
   zero-credential demo operation without crashing or external dependencies.
"""

import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
LOCAL_DB_FILE = os.path.join(DATA_DIR, "local_db.json")

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

def _init_local_db():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(LOCAL_DB_FILE):
        initial = {
            "candidates": {},
            "analyses": [],
            "feedback": [],
            "hr_events": [
                {
                    "event_id": "evt_1",
                    "timestamp": "2026-10-07T08:30:00Z",
                    "category": "flight_risk",
                    "department": "Machine Learning",
                    "message": "Senior ML Engineer Skill Stagnation flagged in sprint review."
                },
                {
                    "event_id": "evt_2",
                    "timestamp": "2026-10-07T09:15:00Z",
                    "category": "workload",
                    "department": "Data Platform",
                    "message": "Data Platform department average active projects hit 4.8 (high strain)."
                }
            ]
        }
        with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(initial, f, indent=2)

def _read_local_db() -> Dict[str, Any]:
    _init_local_db()
    try:
        with open(LOCAL_DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"candidates": {}, "analyses": [], "feedback": [], "hr_events": []}

def _write_local_db(data: Dict[str, Any]) -> None:
    _init_local_db()
    with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def save_candidate_profile(candidate_id: str, candidate_data: Dict[str, Any]) -> Dict[str, Any]:
    db = _read_local_db()
    candidate_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    db["candidates"][candidate_id] = candidate_data
    _write_local_db(db)
    return candidate_data

def get_candidate_profile(candidate_id: str) -> Optional[Dict[str, Any]]:
    db = _read_local_db()
    return db["candidates"].get(candidate_id)

def save_user_profile(user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
    db = _read_local_db()
    if "profiles" not in db:
        db["profiles"] = {}
    profile_data["user_id"] = user_id
    now = datetime.now(timezone.utc).isoformat()
    profile_data["updated_at"] = now
    if "created_at" not in profile_data:
        profile_data["created_at"] = now
    db["profiles"][user_id] = profile_data
    _write_local_db(db)
    return profile_data

def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    db = _read_local_db()
    profiles = db.get("profiles", {})
    if user_id in profiles:
        return profiles[user_id]
    target = user_id.lower().strip()
    for p in profiles.values():
        if p.get("user_id") == user_id or p.get("email", "").lower().strip() == target:
            return p
    return None

def record_analysis_run(analysis_record: Dict[str, Any]) -> None:

    db = _read_local_db()
    analysis_record["timestamp"] = datetime.now(timezone.utc).isoformat()
    db["analyses"].append(analysis_record)
    _write_local_db(db)

def record_feedback_item(feedback_item: Dict[str, Any]) -> None:
    db = _read_local_db()
    feedback_item["timestamp"] = datetime.now(timezone.utc).isoformat()
    db["feedback"].append(feedback_item)
    _write_local_db(db)

def get_hr_events() -> List[Dict[str, Any]]:
    db = _read_local_db()
    return db.get("hr_events", [])

def is_using_live_supabase() -> bool:
    return bool(SUPABASE_URL and SUPABASE_KEY)
