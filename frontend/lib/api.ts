import {
  AnalysisResponse,
  RoleInfo,
  DemoCandidate,
  RoleGraphData,
  WorkSampleRecommendation,
  TargetRoleDNA
} from "@/types/career";
import {
  HROverviewResponse,
  DailyBriefResponse,
  HRInsightItem,
  HRDeskQAResponse
} from "@/types/hr";

// Determine API Base URL safely across development, local testing, and production (Vercel)
function resolveApiBaseUrl(): string {
  // If in browser, check the hostname
  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";

    // If deployed on Vercel or any live host, ALWAYS use relative path ""
    // This allows Vercel service rewrites to route /api to the backend without CORS or localhost issues
    if (!isLocal) {
      return "";
    }

    // In local dev browser, use NEXT_PUBLIC_API_URL if configured, otherwise fallback to "" (proxy)
    if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost:8000") && !process.env.NEXT_PUBLIC_API_URL.includes("127.0.0.1:8000")) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return ""; // uses Next.js rewrite proxy on local dev
  }

  // Server-side execution (Node / SSR)
  if (process.env.BACKEND_URL && process.env.BACKEND_URL !== "") {
    return process.env.BACKEND_URL;
  }
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== "") {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://127.0.0.1:8000";
}

const API_BASE_URL = resolveApiBaseUrl();

// Resilient API fetcher with automatic fallback
async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const fullUrl = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  try {
    const res = await fetch(fullUrl, init);
    return res;
  } catch (err) {
    // If direct cross-origin fetch fails, retry via relative path
    if (API_BASE_URL && typeof window !== "undefined" && fullUrl !== path) {
      try {
        return await fetch(path, init);
      } catch {
        // Fall through to throw original
      }
    }
    throw err;
  }
}

export async function fetchRoles(): Promise<RoleInfo[]> {
  try {
    const res = await apiFetch(`/api/roles`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load roles: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn("fetchRoles fallback:", err);
    return [
      { role_id: "backend-engineer", title: "Backend Engineer", description: "Designs and maintains server-side architecture, APIs, and databases." },
      { role_id: "software-engineer", title: "Software Engineer", description: "Develops full-lifecycle software applications and APIs." },
      { role_id: "data-scientist", title: "Data Scientist", description: "Applies machine learning, statistical modeling, and deep learning." },
      { role_id: "data-analyst", title: "Data Analyst", description: "Builds dashboards, relational SQL marts, and executive insights." },
      { role_id: "machine-learning-engineer", title: "Machine Learning Engineer", description: "Builds, tests, and serves ML models in production." }
    ];
  }
}

export async function fetchRoleDna(roleId: string): Promise<TargetRoleDNA> {
  const res = await apiFetch(`/api/roles/${roleId}/dna`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load Role DNA");
  return res.json();
}

export async function fetchDemoCandidates(): Promise<DemoCandidate[]> {
  try {
    const res = await apiFetch(`/api/candidate/demo`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load demo candidates");
    return await res.json();
  } catch (err) {
    return [
      {
        candidate_id: "alex-sharma",
        name: "Alex Sharma",
        current_title: "Junior Backend Developer",
        target_role: "backend-engineer",
        summary: "2 years building FastAPI services. Lacks production PostgreSQL schema & migration evidence.",
        expected_primary_gap: "PostgreSQL & Database Migrations",
        resume_text: "EXPERIENCE\nJunior Backend Developer — TechCorp (2024-Present)\n- Built REST APIs in Python using FastAPI.\n- Created basic SQLAlchemy data models.\n- Wrote unit tests in pytest.",
        github_handle: "alex-sharma-dev"
      },
      {
        candidate_id: "priya-patel",
        name: "Priya Patel",
        current_title: "Aspiring Data Scientist",
        target_role: "data-scientist",
        summary: "Master's graduate with strong coursework in ML. Lacks production model serving & drift monitoring.",
        expected_primary_gap: "Model Serving & Monitoring",
        resume_text: "EDUCATION\nM.S. Data Science (2024)\nPROJECTS\nCustomer Churn Model\n- Trained XGBoost on Kaggle dataset.\n- Visualized ROC curve in Jupyter notebook.",
        github_handle: "priya-patel-ds"
      }
    ];
  }
}

export async function fetchRoleGraph(roleId: string): Promise<RoleGraphData> {
  const res = await apiFetch(`/api/roles/${roleId}/graph`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load Role Graph");
  return res.json();
}

export async function fetchWorkSample(skillId: string): Promise<WorkSampleRecommendation> {
  const res = await apiFetch(`/api/work-samples/${skillId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load work sample");
  return res.json();
}

export async function analyzeCandidate(formData: FormData): Promise<AnalysisResponse> {
  const res = await apiFetch(`/api/candidate/analyze`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let detail = "";
    try {
      const err = JSON.parse(text);
      detail = err.detail || err.error || err.message;
    } catch {
      detail = text.slice(0, 300);
    }
    throw new Error(detail || `Server responded with status ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function submitFeedback(
  arg1: string | { action_title: string; target_role: string; is_useful: boolean; candidate_comment?: string },
  arg2?: string,
  arg3?: boolean,
  arg4?: string
): Promise<{ status: string }> {
  const payload = typeof arg1 === "object"
    ? arg1
    : {
        action_title: arg1,
        target_role: arg2 || "unknown",
        is_useful: Boolean(arg3),
        candidate_comment: arg4
      };

  const res = await apiFetch(`/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to submit feedback");
  return res.json();
}

// HR Intelligence APIs
export async function fetchHROverview(): Promise<HROverviewResponse> {
  const res = await apiFetch(`/api/hr/overview`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load HR overview");
  return res.json();
}

export async function fetchDailyBrief(): Promise<DailyBriefResponse> {
  const res = await apiFetch(`/api/hr/daily-brief`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load daily brief");
  return res.json();
}

export async function fetchHRInsights(): Promise<HRInsightItem[]> {
  try {
    const res = await apiFetch(`/api/hr/insights`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load HR insights");
    return await res.json();
  } catch (err) {
    console.warn("fetchHRInsights fallback:", err);
    return [];
  }
}

export const submitActionFeedback = submitFeedback;

export async function queryHRDesk(query: string): Promise<HRDeskQAResponse> {
  const res = await apiFetch(`/api/hr/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to query AI HR Desk");
  return res.json();
}

export async function fetchModelResults(): Promise<any> {
  const res = await apiFetch(`/api/models/results`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load model results");
  return res.json();
}

// User Profile & Account Role API
export interface UserProfile {
  user_id: string;
  account_type: "candidate" | "hr";
  display_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const res = await apiFetch(`/api/auth/profile?user_id=${encodeURIComponent(userId)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("fetchUserProfile error:", err);
    return null;
  }
}

export async function saveUserProfile(profile: {
  user_id: string;
  account_type: "candidate" | "hr";
  display_name?: string;
  email?: string;
}): Promise<UserProfile> {
  const res = await apiFetch(`/api/auth/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to save profile");
  }
  const data = await res.json();
  return data.profile;
}
