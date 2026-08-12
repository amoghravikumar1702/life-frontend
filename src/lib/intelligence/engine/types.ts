export interface BusinessSnapshot {
  revenue: number;
  expenses: number;
  cash: number;
  receivables: number;
  overdueInvoices: number;
  customerCount: number;
  invoiceCount: number;
  healthScore: number;
}

export type BusinessState =
  | "excellent"
  | "healthy"
  | "stable"
  | "critical";

export interface BusinessAnalysis {
  snapshot: BusinessSnapshot;

  state: BusinessState;

  confidence: number;

  biggestProblem: string;

  strongestArea: string;

  weakestArea: string;

  cashFlow: "excellent" | "healthy" | "weak";

  collections: "excellent" | "good" | "poor";

  growth: "fast" | "steady" | "slow";

  priority:
    | "collections"
    | "growth"
    | "cashflow"
    | "healthy";
}

export interface Mission {
  title: string;
  description: string;
  amount: number;
  impact: string;
}

export interface Milestone {
  title: string;
  current: number;
  target: number;
  remaining: number;
  progress: number;
}