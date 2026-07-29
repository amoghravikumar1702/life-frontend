import { FinancialAnalysis } from "../analysis/financial-analysis";
import { RiskAssessment } from "../engines/risk-engine";

import { ExecutiveDecision } from "./types";

export function buildExecutiveDecisions(
  analysis: FinancialAnalysis,
  risk: RiskAssessment
): ExecutiveDecision[] {
  const decisions: ExecutiveDecision[] = [];

  // Urgent actions from the financial analysis
  for (const action of analysis.urgentActions) {
    decisions.push({
      title: "Immediate Attention Required",
      description: action,
      action: "Review Financials",
      urgency: "Critical",
      financialImpact: 100,
      confidence: 95,
      score: 100,
    });
  }

  // Business risk recommendations
  for (const recommendation of risk.recommendations) {
    decisions.push({
      title: "Reduce Business Risk",
      description: recommendation,
      action: "Review Risks",
      urgency:
        risk.level === "Critical"
          ? "Critical"
          : risk.level === "High"
          ? "High"
          : risk.level === "Medium"
          ? "Medium"
          : "Low",
      financialImpact: risk.score,
      confidence: 90,
      score: risk.score,
    });
  }

  // Healthy business fallback
  if (decisions.length === 0) {
    decisions.push({
      title: "Business Performing Well",
      description:
        "No immediate executive action is required today.",
      action: "Continue Monitoring",
      urgency: "Low",
      financialImpact: 0,
      confidence: 100,
      score: 50,
    });
  }

  return decisions.sort((a, b) => b.score - a.score);
}