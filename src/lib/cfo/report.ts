import { getCompanyProfile } from "./company";
import { getFinancialMetrics } from "./finance";
import { getCustomerMetrics } from "./customers";

import { analyzeBusinessRisks } from "./risks";
import { generateForecast } from "./forecast";

import { ExecutiveReport } from "./types";

export async function buildExecutiveReport(): Promise<ExecutiveReport> {
  const [
    company,
    finance,
    customers,
  ] = await Promise.all([
    getCompanyProfile(),
    getFinancialMetrics(),
    getCustomerMetrics(),
  ]);

  const risks = analyzeBusinessRisks(
    finance,
    customers
  );

  const forecast =
    generateForecast(finance);

  return {
    generatedAt:
      new Date().toISOString(),

    company,

    finance,

    customers,

    risks,

    forecast,

    investmentSuggestions: [],

    priorities: [],

    executiveSummary: "",

    finalRecommendation: "",
  };
}