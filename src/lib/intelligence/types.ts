export type HealthStatus =
  | "Excellent"
  | "Healthy"
  | "Needs Attention"
  | "Critical";

export interface HealthCategory {
  score: number;
  status: HealthStatus;
  reasons: string[];
}

export interface FinancialHealth {
  overall: number;

  liquidity: HealthCategory;

  profitability: HealthCategory;

  collections: HealthCategory;

  growth: HealthCategory;

  efficiency: HealthCategory;

  strengths: string[];

  weaknesses: string[];

  recommendations: string[];
}