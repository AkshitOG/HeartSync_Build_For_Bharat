export interface HROverviewMetrics {
  total_employees: number;
  active_departments: number;
  overall_attendance_pct: number;
  tasks_assigned_this_cycle: number;
  tasks_completed_this_cycle: number;
  pending_critical_tasks: number;
  average_workforce_tenure_months: number;
  health_index: string;
}

export interface DepartmentSummary {
  name: string;
  headcount: number;
  attendance_pct: number;
  workload_status: "Optimal" | "Moderate" | "Overloaded";
  pending_tasks: number;
  key_focus_area: string;
}

export interface HROverviewResponse {
  overview: HROverviewMetrics;
  departments: DepartmentSummary[];
}

export interface DailyBriefItem {
  id: string;
  category: string;
  department: string;
  severity: "High" | "Medium" | "Low";
  title: string;
  evidence: string;
  recommended_action: string;
}

export interface DailyBriefResponse {
  date: string;
  attention_items_count: number;
  items: DailyBriefItem[];
}

export interface HRInsightItem {
  category: string;
  observation: string;
  evidence_trail: string;
  strategic_recommendation: string;
}

export interface HRDeskQAResponse {
  query: string;
  answer: string;
  evidence: string | string[];
  recommended_action: string | string[];
  confidence: string;
  dataSource?: string;
}

