import { FinancialAnalysis } from "../analysis/financial-analysis";
import { ExecutiveDecision } from "../decision/types";
import { GrowthOpportunity } from "../engines/opportunity-engine";
import { FinancialHealth } from "../types";
import { RiskAssessment } from "../engines/risk-engine";
import { ForecastResult } from "../engines/forecast-engine";

export interface ExecutiveReport {
  generatedAt: string;

  overallScore: number;

  executiveSummary: string;

  health: FinancialHealth;

  risk: RiskAssessment;

  forecast: ForecastResult;

  priorities: ExecutiveDecision[];

  opportunities: GrowthOpportunity[];

  finalRecommendation: string;
}

export function buildExecutiveReport(
  analysis: FinancialAnalysis,
  health: FinancialHealth,
  risk: RiskAssessment,
  forecast: ForecastResult,
  decisions: ExecutiveDecision[],
  opportunities: GrowthOpportunity[]
): ExecutiveReport {

  const recommendation =
    decisions.length > 0
      ? decisions[0].action
      : "Continue monitoring financial performance.";

  return {

    generatedAt:
      new Date().toISOString(),

    overallScore:
      health.overall,

    executiveSummary:
      analysis.summary,

    health,

    risk,

    forecast,

    priorities:
      decisions,

    opportunities,

    finalRecommendation:
      recommendation,

  };
}