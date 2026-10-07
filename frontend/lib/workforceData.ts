/**
 * Workforce Data Intelligence Layer
 * Centralized dataset of all 48 employees across the 5 departments:
 * - Engineering (18)
 * - Data & Analytics (12)
 * - Operations (8)
 * - Product & Design (6)
 * - Client Solutions (4)
 */

import {
  DepartmentSummary,
  HROverviewMetrics,
  DailyBriefItem,
  HRInsightItem
} from "@/types/hr";

export type RiskLevel = "Low" | "Medium" | "High";

export interface Employee {
  id: string;
  name: string;
  department: "Engineering" | "Data & Analytics" | "Operations" | "Product & Design" | "Client Solutions";
  role: string;
  attendance: number; // percentage (e.g. 92.5)
  workload: number;   // percentage (e.g. 88)
  tasks: number;      // pending tasks count
  riskLevel: RiskLevel;
  lateDays: number;
  absenceDays: number;
  notes?: string;
  tenureMonths: number;
  weeklyHours: number;
}

export interface DayAttendance {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  companyRate: number;
  operationsRate: number;
  engineeringRate: number;
  dataRate: number;
  productRate: number;
  clientRate: number;
}

export const WORKFORCE_EMPLOYEES: Employee[] = [
  // ================= ENGINEERING (18) =================
  {
    id: "EMP-ENG-001",
    name: "Aarav Sharma",
    department: "Engineering",
    role: "Tech Lead - Backend Architecture",
    attendance: 92.0,
    workload: 96,
    tasks: 5,
    riskLevel: "High",
    lateDays: 1,
    absenceDays: 1,
    notes: "52 hrs/wk sprint average. Critical bottleneck on 62% of pending backend PR reviews.",
    tenureMonths: 38,
    weeklyHours: 54
  },
  {
    id: "EMP-ENG-002",
    name: "Rohan Verma",
    department: "Engineering",
    role: "Staff Backend Engineer",
    attendance: 90.5,
    workload: 94,
    tasks: 4,
    riskLevel: "High",
    lateDays: 2,
    absenceDays: 1,
    notes: "51 hrs/wk logged. Facing concurrent microservice migration blockers.",
    tenureMonths: 34,
    weeklyHours: 52
  },
  {
    id: "EMP-ENG-003",
    name: "Vikram Malhotra",
    department: "Engineering",
    role: "Staff Backend Engineer",
    attendance: 91.0,
    workload: 92,
    tasks: 5,
    riskLevel: "High",
    lateDays: 1,
    absenceDays: 1,
    notes: "50+ hr sprints. High context-switching between database migrations and API reviews.",
    tenureMonths: 30,
    weeklyHours: 51
  },
  {
    id: "EMP-ENG-004",
    name: "Priyanka Nair",
    department: "Engineering",
    role: "Senior Distributed Systems Engineer",
    attendance: 93.0,
    workload: 88,
    tasks: 3,
    riskLevel: "High",
    lateDays: 1,
    absenceDays: 1,
    notes: "Heavy load on Redis cache partitioning.",
    tenureMonths: 26,
    weeklyHours: 48
  },
  {
    id: "EMP-ENG-005",
    name: "Aditya Kulkarni",
    department: "Engineering",
    role: "Senior Cloud Infrastructure Engineer",
    attendance: 89.5,
    workload: 89,
    tasks: 3,
    riskLevel: "High",
    lateDays: 3,
    absenceDays: 2,
    notes: "Handling Kubernetes cluster scaling alerts off-hours.",
    tenureMonths: 24,
    weeklyHours: 49
  },
  {
    id: "EMP-ENG-006",
    name: "Ishaan Mehta",
    department: "Engineering",
    role: "Senior Backend Developer",
    attendance: 92.5,
    workload: 87,
    tasks: 2,
    riskLevel: "High",
    lateDays: 1,
    absenceDays: 1,
    notes: "Assisting with high pending PR load.",
    tenureMonths: 22,
    weeklyHours: 47
  },
  {
    id: "EMP-ENG-007",
    name: "Tanvi Deshmukh",
    department: "Engineering",
    role: "Backend Engineer",
    attendance: 90.0,
    workload: 86,
    tasks: 2,
    riskLevel: "High",
    lateDays: 2,
    absenceDays: 1,
    notes: "Tasked with PostgreSQL index optimizations.",
    tenureMonths: 18,
    weeklyHours: 46
  },
  {
    id: "EMP-ENG-008",
    name: "Kabir Sen",
    department: "Engineering",
    role: "Site Reliability Engineer",
    attendance: 88.0,
    workload: 88,
    tasks: 3,
    riskLevel: "High",
    lateDays: 2,
    absenceDays: 2,
    notes: "On-call rotation strain during night deployments.",
    tenureMonths: 19,
    weeklyHours: 47
  },
  {
    id: "EMP-ENG-009",
    name: "Sneha Chatterjee",
    department: "Engineering",
    role: "Lead Frontend Engineer",
    attendance: 94.0,
    workload: 80,
    tasks: 2,
    riskLevel: "Medium",
    lateDays: 1,
    absenceDays: 1,
    notes: "UI component design system consolidation.",
    tenureMonths: 28,
    weeklyHours: 43
  },
  {
    id: "EMP-ENG-010",
    name: "Manish Reddy",
    department: "Engineering",
    role: "Senior Frontend Engineer",
    attendance: 93.5,
    workload: 78,
    tasks: 1,
    riskLevel: "Medium",
    lateDays: 1,
    absenceDays: 1,
    notes: "Next.js performance and SSR latency profiling.",
    tenureMonths: 21,
    weeklyHours: 42
  },
  {
    id: "EMP-ENG-011",
    name: "Ritika Kapoor",
    department: "Engineering",
    role: "Frontend Engineer",
    attendance: 95.0,
    workload: 74,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 1,
    notes: "Steady velocity on accessible design tokens.",
    tenureMonths: 14,
    weeklyHours: 40
  },
  {
    id: "EMP-ENG-012",
    name: "Gaurav Joshi",
    department: "Engineering",
    role: "Full Stack Engineer",
    attendance: 92.0,
    workload: 76,
    tasks: 1,
    riskLevel: "Medium",
    lateDays: 1,
    absenceDays: 1,
    notes: "Assisting with candidate onboarding dashboard.",
    tenureMonths: 16,
    weeklyHours: 41
  },
  {
    id: "EMP-ENG-013",
    name: "Divya Pillai",
    department: "Engineering",
    role: "DevOps Engineer",
    attendance: 91.5,
    workload: 81,
    tasks: 2,
    riskLevel: "Medium",
    lateDays: 2,
    absenceDays: 1,
    notes: "CI/CD pipeline test runner acceleration.",
    tenureMonths: 20,
    weeklyHours: 43
  },
  {
    id: "EMP-ENG-014",
    name: "Varun Bhat",
    department: "Engineering",
    role: "QA Automation Lead",
    attendance: 93.0,
    workload: 75,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 1,
    notes: "Playwright regression suite integration.",
    tenureMonths: 24,
    weeklyHours: 40
  },
  {
    id: "EMP-ENG-015",
    name: "Meera Iyer",
    department: "Engineering",
    role: "QA Automation Engineer",
    attendance: 94.0,
    workload: 72,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 1,
    absenceDays: 0,
    notes: "API integration contracts verification.",
    tenureMonths: 12,
    weeklyHours: 39
  },
  {
    id: "EMP-ENG-016",
    name: "Arjun Singhania",
    department: "Engineering",
    role: "Security Engineer",
    attendance: 92.5,
    workload: 77,
    tasks: 1,
    riskLevel: "Medium",
    lateDays: 1,
    absenceDays: 1,
    notes: "Quarterly vulnerability audit completion.",
    tenureMonths: 27,
    weeklyHours: 41
  },
  {
    id: "EMP-ENG-017",
    name: "Zoya Farooqui",
    department: "Engineering",
    role: "Junior Backend Developer",
    attendance: 95.0,
    workload: 68,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Pairing on PR triage and unit testing.",
    tenureMonths: 8,
    weeklyHours: 38
  },
  {
    id: "EMP-ENG-018",
    name: "Karan Saxena",
    department: "Engineering",
    role: "Junior Frontend Developer",
    attendance: 96.0,
    workload: 65,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Developing reusable UI navigation primitives.",
    tenureMonths: 6,
    weeklyHours: 38
  },

  // ================= DATA & ANALYTICS (12) =================
  {
    id: "EMP-DAT-001",
    name: "Dr. Sandeep Rao",
    department: "Data & Analytics",
    role: "Lead Data Scientist",
    attendance: 97.0,
    workload: 72,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Mentoring team on LLM evaluation metrics.",
    tenureMonths: 36,
    weeklyHours: 40
  },
  {
    id: "EMP-DAT-002",
    name: "Pooja Mehta",
    department: "Data & Analytics",
    role: "Senior Data Analyst",
    attendance: 96.0,
    workload: 70,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 1,
    notes: "Awaiting PySpark certification subsidy approval (12 days pending).",
    tenureMonths: 22,
    weeklyHours: 40
  },
  {
    id: "EMP-DAT-003",
    name: "Ananya Sen",
    department: "Data & Analytics",
    role: "Analytics Engineer",
    attendance: 96.5,
    workload: 69,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Awaiting AWS Big Data certification subsidy approval.",
    tenureMonths: 18,
    weeklyHours: 39
  },
  {
    id: "EMP-DAT-004",
    name: "Rahul Nair",
    department: "Data & Analytics",
    role: "BI Specialist",
    attendance: 95.5,
    workload: 68,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 1,
    absenceDays: 0,
    notes: "Awaiting Databricks Lakehouse certification subsidy approval.",
    tenureMonths: 19,
    weeklyHours: 39
  },
  {
    id: "EMP-DAT-005",
    name: "Neha Gupta",
    department: "Data & Analytics",
    role: "Data Engineer",
    attendance: 97.0,
    workload: 71,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Awaiting Cloud Data Engineer certification subsidy approval.",
    tenureMonths: 15,
    weeklyHours: 40
  },
  {
    id: "EMP-DAT-006",
    name: "Vikrant Chauhan",
    department: "Data & Analytics",
    role: "Senior Machine Learning Engineer",
    attendance: 96.0,
    workload: 75,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 1,
    notes: "Ready for model registry deployment pipeline.",
    tenureMonths: 25,
    weeklyHours: 41
  },
  {
    id: "EMP-DAT-007",
    name: "Shreya Ghoshal",
    department: "Data & Analytics",
    role: "Machine Learning Engineer",
    attendance: 97.5,
    workload: 67,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "JDS feature extraction validation completed.",
    tenureMonths: 14,
    weeklyHours: 39
  },
  {
    id: "EMP-DAT-008",
    name: "Amitabh Banerjee",
    department: "Data & Analytics",
    role: "Staff Data Platform Architect",
    attendance: 96.5,
    workload: 70,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Designing unified Iceberg metadata catalog.",
    tenureMonths: 32,
    weeklyHours: 40
  },
  {
    id: "EMP-DAT-009",
    name: "Nidhi Agarwal",
    department: "Data & Analytics",
    role: "Data Governance Analyst",
    attendance: 98.0,
    workload: 64,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Workforce privacy and masking protocol audit.",
    tenureMonths: 20,
    weeklyHours: 38
  },
  {
    id: "EMP-DAT-010",
    name: "Prateek Yadav",
    department: "Data & Analytics",
    role: "Data Pipeline Engineer",
    attendance: 95.0,
    workload: 73,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 1,
    absenceDays: 1,
    notes: "Kafka streaming consumer performance tuning.",
    tenureMonths: 17,
    weeklyHours: 40
  },
  {
    id: "EMP-DAT-011",
    name: "Sanjana Roy",
    department: "Data & Analytics",
    role: "Junior Quantitative Analyst",
    attendance: 97.0,
    workload: 62,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Market telemetry trend line regression.",
    tenureMonths: 9,
    weeklyHours: 38
  },
  {
    id: "EMP-DAT-012",
    name: "Tarun Bajaj",
    department: "Data & Analytics",
    role: "Junior Data Engineer",
    attendance: 96.0,
    workload: 61,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Automated dbt documentation builds.",
    tenureMonths: 7,
    weeklyHours: 37
  },

  // ================= OPERATIONS (8) =================
  {
    id: "EMP-OPS-001",
    name: "Harish Pillai",
    department: "Operations",
    role: "Operations Lead",
    attendance: 92.0,
    workload: 76,
    tasks: 1,
    riskLevel: "Medium",
    lateDays: 1,
    absenceDays: 1,
    notes: "Managing multi-location workforce shift schedules.",
    tenureMonths: 35,
    weeklyHours: 42
  },
  {
    id: "EMP-OPS-002",
    name: "Kavita Rao",
    department: "Operations",
    role: "Senior Operations Specialist",
    attendance: 83.5,
    workload: 78,
    tasks: 1,
    riskLevel: "High",
    lateDays: 5,
    absenceDays: 4,
    notes: "Monday attendance drop to 78.0%. Long commute issues reported.",
    tenureMonths: 21,
    weeklyHours: 41
  },
  {
    id: "EMP-OPS-003",
    name: "Deepak Joshi",
    department: "Operations",
    role: "Shift Operations Supervisor",
    attendance: 84.0,
    workload: 77,
    tasks: 1,
    riskLevel: "High",
    lateDays: 5,
    absenceDays: 3,
    notes: "Monday attendance drop to 79.2%. Weekend on-call handover fatigue.",
    tenureMonths: 19,
    weeklyHours: 42
  },
  {
    id: "EMP-OPS-004",
    name: "Suresh Kumar",
    department: "Operations",
    role: "Logistics & Facilities Coordinator",
    attendance: 84.5,
    workload: 75,
    tasks: 1,
    riskLevel: "High",
    lateDays: 4,
    absenceDays: 3,
    notes: "Monday attendance drop to 80.5%. Key contributor to Monday anomaly.",
    tenureMonths: 17,
    weeklyHours: 40
  },
  {
    id: "EMP-OPS-005",
    name: "Bhavna Trivedi",
    department: "Operations",
    role: "Process Compliance Analyst",
    attendance: 94.0,
    workload: 72,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 1,
    absenceDays: 1,
    notes: "Standardizing weekly shift transition checklist.",
    tenureMonths: 23,
    weeklyHours: 39
  },
  {
    id: "EMP-OPS-006",
    name: "Anand Murthy",
    department: "Operations",
    role: "Workforce Resource Planner",
    attendance: 93.5,
    workload: 73,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 1,
    absenceDays: 1,
    notes: "Drafting proposed rotational hybrid schedule.",
    tenureMonths: 16,
    weeklyHours: 40
  },
  {
    id: "EMP-OPS-007",
    name: "Lata Menon",
    department: "Operations",
    role: "Facilities Operations Specialist",
    attendance: 91.0,
    workload: 70,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 2,
    absenceDays: 1,
    notes: "Vendor agreement renewal on schedule.",
    tenureMonths: 29,
    weeklyHours: 38
  },
  {
    id: "EMP-OPS-008",
    name: "Kishore Bhatt",
    department: "Operations",
    role: "Junior Operations Coordinator",
    attendance: 91.0,
    workload: 68,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 1,
    absenceDays: 1,
    notes: "Supporting ticketing dispatch desk.",
    tenureMonths: 10,
    weeklyHours: 38
  },

  // ================= PRODUCT & DESIGN (6) =================
  {
    id: "EMP-PRD-001",
    name: "Pallavi Krishnan",
    department: "Product & Design",
    role: "VP of Product Strategy",
    attendance: 98.0,
    workload: 68,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Roadmap prioritization aligned with quarterly benchmarks.",
    tenureMonths: 35,
    weeklyHours: 40
  },
  {
    id: "EMP-PRD-002",
    name: "Devendra Patel",
    department: "Product & Design",
    role: "Principal Product Designer",
    attendance: 97.5,
    workload: 66,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Enterprise design system token spec completed ahead of schedule.",
    tenureMonths: 28,
    weeklyHours: 39
  },
  {
    id: "EMP-PRD-003",
    name: "Simran Kaur",
    department: "Product & Design",
    role: "Senior Product Manager",
    attendance: 98.0,
    workload: 65,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Q4 feature specs delivered on time.",
    tenureMonths: 24,
    weeklyHours: 40
  },
  {
    id: "EMP-PRD-004",
    name: "Yashwant Singhal",
    department: "Product & Design",
    role: "Senior UX Researcher",
    attendance: 97.0,
    workload: 62,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 1,
    notes: "User testing interviews concluded with 94% CSAT.",
    tenureMonths: 21,
    weeklyHours: 38
  },
  {
    id: "EMP-PRD-005",
    name: "Radhika Sen",
    department: "Product & Design",
    role: "UI Designer",
    attendance: 98.5,
    workload: 61,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Responsive micro-interactions delivered for HR Desk.",
    tenureMonths: 15,
    weeklyHours: 38
  },
  {
    id: "EMP-PRD-006",
    name: "Abhinav Goswami",
    department: "Product & Design",
    role: "Associate Product Specialist",
    attendance: 98.0,
    workload: 60,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Assisting with release documentation and user stories.",
    tenureMonths: 11,
    weeklyHours: 37
  },

  // ================= CLIENT SOLUTIONS (4) =================
  {
    id: "EMP-CLS-001",
    name: "Naveen Sundaram",
    department: "Client Solutions",
    role: "Director of Client Solutions",
    attendance: 96.5,
    workload: 65,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Quarterly target achievement at 104%. Client retention optimal.",
    tenureMonths: 36,
    weeklyHours: 40
  },
  {
    id: "EMP-CLS-002",
    name: "Swati Deshpande",
    department: "Client Solutions",
    role: "Technical Solutions Architect",
    attendance: 96.0,
    workload: 64,
    tasks: 1,
    riskLevel: "Low",
    lateDays: 1,
    absenceDays: 0,
    notes: "Leading enterprise client pilot onboarding integration.",
    tenureMonths: 26,
    weeklyHours: 39
  },
  {
    id: "EMP-CLS-003",
    name: "Manpreet Dhillon",
    department: "Client Solutions",
    role: "Enterprise Implementation Manager",
    attendance: 95.5,
    workload: 62,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 1,
    notes: "Solution sign-offs completed for two strategic enterprise accounts.",
    tenureMonths: 19,
    weeklyHours: 38
  },
  {
    id: "EMP-CLS-004",
    name: "Geetika Chadha",
    department: "Client Solutions",
    role: "Customer Success Lead",
    attendance: 96.0,
    workload: 58,
    tasks: 0,
    riskLevel: "Low",
    lateDays: 0,
    absenceDays: 0,
    notes: "Zero customer escalations this quarter.",
    tenureMonths: 14,
    weeklyHours: 37
  }
];

export const DEPARTMENT_SUMMARIES: DepartmentSummary[] = [
  {
    name: "Engineering",
    headcount: 18,
    attendance_pct: 91.5,
    workload_status: "Overloaded",
    pending_tasks: 14,
    key_focus_area: "Sprint velocity bottleneck & backend PR turnaround delays"
  },
  {
    name: "Data & Analytics",
    headcount: 12,
    attendance_pct: 96.4,
    workload_status: "Optimal",
    pending_tasks: 3,
    key_focus_area: "BI migration on track; requested distributed computing training"
  },
  {
    name: "Operations",
    headcount: 8,
    attendance_pct: 89.2,
    workload_status: "Moderate",
    pending_tasks: 4,
    key_focus_area: "Monday shift absenteeism anomaly detected"
  },
  {
    name: "Product & Design",
    headcount: 6,
    attendance_pct: 97.8,
    workload_status: "Optimal",
    pending_tasks: 2,
    key_focus_area: "Q4 roadmap specs completed ahead of schedule"
  },
  {
    name: "Client Solutions",
    headcount: 4,
    attendance_pct: 96.0,
    workload_status: "Optimal",
    pending_tasks: 1,
    key_focus_area: "Quarterly target achievement at 104%"
  }
];

export const WORKFORCE_OVERVIEW_METRICS: HROverviewMetrics = {
  total_employees: 48,
  active_departments: 5,
  overall_attendance_pct: 94.2,
  tasks_assigned_this_cycle: 142,
  tasks_completed_this_cycle: 118,
  pending_critical_tasks: 24,
  average_workforce_tenure_months: 22.4,
  health_index: "Stable (Attention Needed in Engineering)"
};

export const DAILY_BRIEF_ITEMS: DailyBriefItem[] = [
  {
    id: "brief-01",
    category: "Workload Concentration",
    department: "Engineering",
    severity: "High",
    title: "High Pending Workload & PR Review Bottleneck",
    evidence: "14 critical tasks are currently stalled; 62% of pending code reviews are queued on only 3 senior backend engineers.",
    recommended_action: "Distribute architectural review duties to mid-level engineers and schedule a focus-block day with no meetings."
  },
  {
    id: "brief-02",
    category: "Attendance Pattern",
    department: "Operations",
    severity: "Medium",
    title: "Recurring Monday Shift Absenteeism",
    evidence: "Operations attendance drops to 84.1% on Mondays vs 94.6% on Wednesdays across the last 4 consecutive payroll cycles.",
    recommended_action: "Initiate a 1-on-1 shift adjustment review with Operations Lead to test hybrid rotational coverage."
  },
  {
    id: "brief-03",
    category: "Employee Request",
    department: "Data & Analytics",
    severity: "Low",
    title: "Pending Technical Certification Subsidies",
    evidence: "4 analytics specialists submitted requests for PySpark & AWS certification reimbursements pending approval for 12 days.",
    recommended_action: "Approve quarterly skill upskilling allocation to prevent turnover in high-demand analytics competencies."
  }
];

export const WORKFORCE_INSIGHTS_DATA: HRInsightItem[] = [
  {
    category: "Workforce Retention",
    observation: "High Correlation Between Storytelling Training and Promotion Velocity",
    evidence_trail: "JDS capability data indicates employees with dashboarding & storytelling skills had 3.06x higher probability of upward compensation hikes.",
    strategic_recommendation: "Incorporate business storytelling workshops into technical engineering onboarding tracks."
  },
  {
    category: "Capacity Allocation",
    observation: "Backend Team Operating at 118% Normal Velocity Baseline",
    evidence_trail: "Average weekly commit count increased by 34% over the past 3 weeks without corresponding headcount addition.",
    strategic_recommendation: "Protect senior developer time by filtering ad-hoc support tickets through L1 triage."
  },
  {
    category: "Skill Adjacency Bridge",
    observation: "Analytics Team Readily Pivotable to Machine Learning Workstreams",
    evidence_trail: "Market intelligence shows 54.5% skill co-occurrence between Python and ML; analytics team already demonstrates strong Python baseline.",
    strategic_recommendation: "Transition 2 senior analysts into junior ML modeling tasks rather than external contractor hiring."
  }
];

export const WEEKLY_ATTENDANCE_HISTORY: DayAttendance[] = [
  {
    day: "Monday",
    companyRate: 91.8,
    operationsRate: 84.1, // Key drop in Operations
    engineeringRate: 90.2,
    dataRate: 96.1,
    productRate: 97.4,
    clientRate: 95.8
  },
  {
    day: "Tuesday",
    companyRate: 94.6,
    operationsRate: 89.4,
    engineeringRate: 91.8,
    dataRate: 96.8,
    productRate: 97.9,
    clientRate: 96.2
  },
  {
    day: "Wednesday",
    companyRate: 95.4,
    operationsRate: 94.6, // Mid-week peak in Operations
    engineeringRate: 92.5,
    dataRate: 97.2,
    productRate: 98.2,
    clientRate: 96.5
  },
  {
    day: "Thursday",
    companyRate: 94.8,
    operationsRate: 90.1,
    engineeringRate: 91.9,
    dataRate: 96.5,
    productRate: 97.8,
    clientRate: 96.0
  },
  {
    day: "Friday",
    companyRate: 93.8,
    operationsRate: 87.8,
    engineeringRate: 91.1,
    dataRate: 95.4,
    productRate: 97.5,
    clientRate: 95.5
  }
];

// Helper functions
export function getAllEmployees(): Employee[] {
  return WORKFORCE_EMPLOYEES;
}

export function getEmployeesByDepartment(dept: string): Employee[] {
  if (!dept || dept === "All") return WORKFORCE_EMPLOYEES;
  return WORKFORCE_EMPLOYEES.filter(
    (e) => e.department.toLowerCase() === dept.toLowerCase()
  );
}

export function getEmployeesByRiskLevel(risk: RiskLevel | "All"): Employee[] {
  if (!risk || risk === "All") return WORKFORCE_EMPLOYEES;
  return WORKFORCE_EMPLOYEES.filter((e) => e.riskLevel === risk);
}

export function searchEmployees(query: string): Employee[] {
  const q = query.trim().toLowerCase();
  if (!q) return WORKFORCE_EMPLOYEES;
  return WORKFORCE_EMPLOYEES.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      (e.notes && e.notes.toLowerCase().includes(q))
  );
}

export function getDepartmentSummaries(): DepartmentSummary[] {
  return DEPARTMENT_SUMMARIES;
}

export function getWorkforceOverviewMetrics(): HROverviewMetrics {
  return WORKFORCE_OVERVIEW_METRICS;
}

export function getDailyBriefItems(): DailyBriefItem[] {
  return DAILY_BRIEF_ITEMS;
}

export function getStrategicInsights(): HRInsightItem[] {
  return WORKFORCE_INSIGHTS_DATA;
}

export function getAttendanceMetrics() {
  return {
    overallBaseline: 94.2,
    operationsMondayRate: 84.1,
    operationsWednesdayPeak: 94.6,
    weeklyHistory: WEEKLY_ATTENDANCE_HISTORY
  };
}
