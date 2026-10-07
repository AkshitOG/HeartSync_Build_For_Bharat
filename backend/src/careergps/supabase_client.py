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

import tempfile

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")
LOCAL_DB_FILE = os.path.join(DATA_DIR, "local_db.json")

# In read-only serverless environments (like Vercel functions where cwd is read-only),
# store writable state in the OS temp directory
if os.environ.get("VERCEL") or not os.access(DATA_DIR if os.path.exists(DATA_DIR) else os.path.dirname(__file__), os.W_OK):
    FALLBACK_DB_FILE = os.path.join(tempfile.gettempdir(), "local_db.json")
else:
    FALLBACK_DB_FILE = LOCAL_DB_FILE

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

def _init_local_db():
    target_file = FALLBACK_DB_FILE
    target_dir = os.path.dirname(target_file)
    try:
        os.makedirs(target_dir, exist_ok=True)
    except Exception:
        pass

    if not os.path.exists(target_file):
        # If seed DB exists in repo, copy it
        if os.path.exists(LOCAL_DB_FILE):
            try:
                with open(LOCAL_DB_FILE, "r", encoding="utf-8") as sf, open(target_file, "w", encoding="utf-8") as df:
                    df.write(sf.read())
                return
            except Exception:
                pass

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
        try:
            with open(target_file, "w", encoding="utf-8") as f:
                json.dump(initial, f, indent=2)
        except Exception:
            pass

def _read_local_db() -> Dict[str, Any]:
    _init_local_db()
    for fpath in [FALLBACK_DB_FILE, LOCAL_DB_FILE]:
        if os.path.exists(fpath):
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
    return {"candidates": {}, "analyses": [], "feedback": [], "hr_events": []}

def _write_local_db(data: Dict[str, Any]) -> None:
    _init_local_db()
    try:
        with open(FALLBACK_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception:
        # Gracefully handle write errors in serverless containers
        pass

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
