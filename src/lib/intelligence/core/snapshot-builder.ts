import { BusinessSnapshot } from "./business-snapshot";

import { BusinessMetrics } from "./metrics";

import { FinancialHealth } from "../types";

import { RiskAssessment } from "../engines/risk-engine";

import { ForecastResult } from "../engines/forecast-engine";

import { GrowthOpportunity } from "../engines/opportunity-engine";

import { ExecutiveDecision } from "../decision/types";

import { ExecutiveReasoning } from "../reasoning";

export function buildBusinessSnapshot(
  metrics: BusinessMetrics,
  health: FinancialHealth,
  risk: RiskAssessment,
  forecast: ForecastResult,
  opportunities: GrowthOpportunity[],
  decisions: ExecutiveDecision[],
  reasoning: ExecutiveReasoning
): BusinessSnapshot {

  return {

    metrics,

    health,

    risk,

    forecast,

    opportunities,

    decisions,

    reasoning,

  };

}