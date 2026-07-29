export type CashHealth = "healthy" | "stable" | "attention";

export type TrendDirection = "up" | "down" | "neutral";

export interface FinancialMetric {
  id: string;
  label: string;
  value: string;
  trend: TrendDirection;
}

export interface FinancialInsight {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface FinancialBriefData {
  generatedAt: string;

  summary: string;

  metrics: FinancialMetric[];

  insight: FinancialInsight;
}