import { BusinessMetrics } from "../core/metrics";
import { FinancialRuleResult } from "../rules/financial.rules";

export interface Risk {
  title: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
}

export interface RiskAssessment {
  score: number;

  level:
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

  summary: string;

  risks: Risk[];

  recommendations: string[];
}

export function evaluateBusinessRisk(
  metrics: BusinessMetrics,
  rules: FinancialRuleResult[]
): RiskAssessment {
  let score = 100;

  const risks: Risk[] = [];
  const recommendations: string[] = [];

  for (const rule of rules) {
    switch (rule.severity) {
      case "Critical":
        score -= 30;
        break;

      case "High":
        score -= 20;
        break;

      case "Medium":
        score -= 10;
        break;

      case "Low":
        score -= 5;
        break;
    }

    if (rule.severity !== "Low") {
      risks.push({
        title: rule.title,
        description: rule.recommendation,
        severity: rule.severity,
      });

      recommendations.push(rule.recommendation);
    }
  }

  if (metrics.cashCoverage < 1) {
    risks.push({
      title: "Low Cash Reserves",
      description:
        "Cash reserves are critically low.",
      severity: "Critical",
    });

    recommendations.push(
      "Increase cash reserves or reduce operating expenses."
    );
  }

  if (metrics.receivableRatio > 30) {
    risks.push({
      title: "Outstanding Receivables",
      description:
        "Outstanding receivables are high.",
      severity: "High",
    });

    recommendations.push(
      "Accelerate invoice collections."
    );
  }

  if (metrics.expenseRatio > 80) {
    risks.push({
      title: "High Operating Expenses",
      description:
        "Operating expenses are consuming most revenue.",
      severity: "High",
    });

    recommendations.push(
      "Review discretionary expenses."
    );
  }

  score = Math.max(0, Math.min(100, score));

  let level: RiskAssessment["level"] = "Low";

  if (score < 25) {
    level = "Critical";
  } else if (score < 50) {
    level = "High";
  } else if (score < 75) {
    level = "Medium";
  }

  const summary =
    level === "Low"
      ? "Business risk is currently low."
      : level === "Medium"
      ? "Business has moderate financial risks."
      : level === "High"
      ? "Business faces elevated financial risks."
      : "Business requires immediate financial attention.";

  return {
    score,
    level,
    summary,
    risks,
    recommendations,
  };
}