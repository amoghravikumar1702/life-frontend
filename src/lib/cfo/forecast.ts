import { Forecast, FinancialMetrics } from "./types";

export function generateForecast(
  finance: FinancialMetrics
): Forecast {
  const revenueGrowthMultiplier =
    1 + finance.revenueGrowth / 100;

  const expenseGrowthMultiplier =
    1 + finance.expenseGrowth / 100;

  const next30Revenue =
    finance.revenue * revenueGrowthMultiplier;

  const next30Expenses =
    finance.expenses * expenseGrowthMultiplier;

  const next30Profit =
    next30Revenue - next30Expenses;

  const expectedCashPosition =
    finance.cashFlow + next30Profit;

  const expectedGrowth =
    finance.revenueGrowth;

  let confidence = 90;

  if (finance.healthScore < 80) {
    confidence = 82;
  }

  if (finance.healthScore < 60) {
    confidence = 74;
  }

  if (finance.healthScore < 40) {
    confidence = 65;
  }

  return {
    next30Revenue,

    next30Expenses,

    next30Profit,

    expectedCashPosition,

    expectedGrowth,

    confidence,
  };
}