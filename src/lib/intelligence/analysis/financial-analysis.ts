import {
  BusinessMetrics,
} from "../core/metrics";

import {
  FinancialHealth,
} from "../types";

import {
  FinancialRuleResult,
} from "../rules/financial.rules";

export interface FinancialAnalysis {
  score: number;

  summary: string;

  strengths: string[];

  weaknesses: string[];

  urgentActions: string[];

  opportunities: string[];

  rules: FinancialRuleResult[];
}

export function analyzeBusiness(
  metrics: BusinessMetrics,
  health: FinancialHealth,
  rules: FinancialRuleResult[]
): FinancialAnalysis {

  const urgentActions = rules
    .filter(
      (rule) =>
        rule.severity === "Critical" ||
        rule.severity === "High"
    )
    .map((rule) => rule.recommendation);

  return {

    score: health.overall,

    summary:
      health.overall >= 85
        ? "Business is financially healthy with strong fundamentals."
        : health.overall >= 70
        ? "Business remains stable but has areas requiring attention."
        : health.overall >= 50
        ? "Business performance is weakening and should be monitored closely."
        : "Immediate financial intervention is recommended.",

    strengths: health.strengths,

    weaknesses: health.weaknesses,

    urgentActions,

    opportunities: [],

    rules,

  };
}