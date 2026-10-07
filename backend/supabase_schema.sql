-- ============================================================================
-- CareerGPS — Supabase PostgreSQL Schema & Migrations
-- Covers: Roles, Skills, Candidate Evidence, Actions, and HR Workforce Intelligence
-- ============================================================================

-- 1. Roles Definition Table
CREATE TABLE IF NOT EXISTS roles (
    role_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    market_salary_lakhs NUMERIC(5,2),
    min_experience_years NUMERIC(4,2),
    senior_salary_lakhs NUMERIC(5,2),
    market_demand_postings INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skills Dimension Table
CREATE TABLE IF NOT EXISTS skills (
    skill_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Role Skills Requirements (Role DNA)
CREATE TABLE IF NOT EXISTS role_skills (
    id BIGSERIAL PRIMARY KEY,
    role_id TEXT REFERENCES roles(role_id) ON DELETE CASCADE,
    skill_id TEXT REFERENCES skills(skill_id) ON DELETE CASCADE,
    importance TEXT NOT NULL CHECK (importance IN ('critical', 'high', 'medium', 'low')),
    weight NUMERIC(3,2) NOT NULL,
    minimum_evidence_tier TEXT NOT NULL CHECK (minimum_evidence_tier IN ('claim', 'coursework', 'project_usage', 'applied_impl', 'deployed')),
    expected_evidence_desc TEXT NOT NULL,
    UNIQUE(role_id, skill_id)
);

-- 4. Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    candidate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    target_role_id TEXT REFERENCES roles(role_id),
    github_handle TEXT,
    resume_raw_text TEXT,
    total_signals_detected INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Candidate Extracted Evidence Items
CREATE TABLE IF NOT EXISTS candidate_evidence (
    evidence_id BIGSERIAL PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    skill_id TEXT REFERENCES skills(skill_id) ON DELETE CASCADE,
    evidence_source TEXT NOT NULL,
    evidence_type TEXT NOT NULL,
    source_title TEXT NOT NULL,
    detail TEXT NOT NULL,
    confidence NUMERIC(3,2) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    is_externally_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Recommended Next Best Actions (History & Audit)
CREATE TABLE IF NOT EXISTS candidate_actions (
    action_id BIGSERIAL PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    target_role_id TEXT REFERENCES roles(role_id),
    action_title TEXT NOT NULL,
    headline TEXT NOT NULL,
    primary_gap_targeted TEXT NOT NULL,
    net_leverage_score NUMERIC(5,2) NOT NULL,
    what_to_build JSONB NOT NULL,
    expected_evidence_artifacts JSONB NOT NULL,
    readiness_verdict TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HR Workforce Employees Table
CREATE TABLE IF NOT EXISTS workforce_employees (
    employee_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    role_title TEXT NOT NULL,
    tenure_months INTEGER NOT NULL,
    attendance_rate NUMERIC(4,3) NOT NULL,
    tasks_assigned INTEGER NOT NULL,
    tasks_completed INTEGER NOT NULL,
    pending_tickets INTEGER NOT NULL,
    workload_status TEXT NOT NULL CHECK (workload_status IN ('Optimal', 'Moderate', 'Overloaded', 'Underutilized')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. HR Workforce Events & Issues
CREATE TABLE IF NOT EXISTS workforce_events (
    event_id BIGSERIAL PRIMARY KEY,
    department TEXT NOT NULL,
    category TEXT NOT NULL, -- Workload, Attendance, Request, Anomaly
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. User Profiles Table (Auth Identity & Role Mapping)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL, -- references auth.users(id)
    account_type TEXT NOT NULL CHECK (account_type IN ('candidate', 'hr')),
    display_name TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_role_skills_role ON role_skills(role_id);
CREATE INDEX IF NOT EXISTS idx_candidate_evidence_candidate ON candidate_evidence(candidate_id);
CREATE INDEX IF NOT EXISTS idx_workforce_dept ON workforce_employees(department);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

