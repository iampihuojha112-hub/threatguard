export type Prediction = "phishing" | "safe";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type Severity = "low" | "medium" | "high";

export interface Factor {
  type: string;
  title: string;
  severity: Severity;
  detail: string;
  evidence: string[];
}

export interface TermContribution {
  term: string;
  weight: number;
  direction: "phishing" | "legitimate";
}

export interface Explanation {
  summary: string;
  factors: Factor[];
  top_terms: TermContribution[];
}

export interface ScanResult {
  id: string;
  subject: string;
  sender: string;
  body: string;
  prediction: Prediction;
  probability: number;
  risk_score: number;
  confidence_score: number;
  risk_level: RiskLevel;
  explanation: Explanation;
  created_at: string;
}

export interface ScanSummary {
  id: string;
  subject: string;
  sender: string;
  prediction: Prediction;
  risk_score: number;
  confidence_score: number;
  created_at: string;
}

export interface HistoryResponse {
  items: ScanSummary[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface HistoryQuery {
  page: number;
  pageSize: number;
  search: string;
  prediction: "" | Prediction;
  sort: "newest" | "oldest" | "risk_desc" | "risk_asc";
}

export interface DashboardData {
  metrics: {
    total_scans: number;
    phishing_detected: number;
    safe_emails: number;
    average_risk_score: number;
  };
  weekly_trend: { week: string; phishing: number; safe: number }[];
  daily_activity: { date: string; scans: number }[];
  risk_distribution: { range: string; count: number }[];
  phishing_vs_safe: { name: string; value: number }[];
}

export interface AnalyzePayload {
  subject: string;
  sender: string;
  body: string;
}
