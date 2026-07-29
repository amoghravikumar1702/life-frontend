import { FinancialHealth } from "../types";

import { RiskAssessment } from "../engines/risk-engine";

import { ForecastResult } from "../engines/forecast-engine";

export interface ExecutiveReasoning {

  overall: string;

  liquidity: string;

  profitability: string;

  collections: string;

  forecast: string;

  risk: string;

}

export function generateExecutiveReasoning(

  health: FinancialHealth,

  risk: RiskAssessment,

  forecast: ForecastResult

): ExecutiveReasoning {

  const liquidity =
    health.liquidity.score >= 80
      ? "Liquidity remains healthy and current cash reserves comfortably support operations."
      : "Liquidity is below the recommended benchmark. Improving collections should be the immediate priority.";

  const profitability =
    health.profitability.score >= 80
      ? "Profitability exceeds the healthy benchmark."
      : "Profit margins are below target and operating costs should be reviewed.";

  const collections =
    health.collections.score >= 80
      ? "Customer collections remain healthy."
      : "Outstanding receivables are delaying cash inflows and reducing available working capital.";

  const forecastReason =
    forecast.trend === "Growing"
      ? "Current projections indicate positive financial momentum over the next 30 days."
      : forecast.trend === "Stable"
      ? "Business performance is expected to remain relatively stable."
      : "Current trends suggest financial performance may weaken unless corrective action is taken.";

  const riskReason =
    risk.level === "Low"
      ? "Overall financial risk remains low."
      : risk.level === "Medium"
      ? "Several moderate financial risks should be monitored closely."
      : risk.level === "High"
      ? "Financial risks require management attention."
      : "Critical financial risks require immediate executive action.";

  return {

    overall:
      `${liquidity} ${profitability} ${forecastReason}`,

    liquidity,

    profitability,

    collections,

    forecast:
      forecastReason,

    risk:
      riskReason,

  };

}