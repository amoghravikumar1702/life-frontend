export interface ForecastResult {
  next30Revenue: number;

  next30Expenses: number;

  next30Profit: number;

  projectedCash: number;

  runwayMonths: number;

  trend: "Growing" | "Stable" | "Declining";

  confidence: number;
}

interface ForecastInput {
  revenue: number;
  expenses: number;
  cash: number;
}

export function generateForecast(
  input: ForecastInput
): ForecastResult {

  const next30Revenue =
    Math.round(input.revenue * 1.03);

  const next30Expenses =
    Math.round(input.expenses * 1.02);

  const next30Profit =
    next30Revenue - next30Expenses;

  const projectedCash =
    input.cash + next30Profit;

  const runwayMonths =
    input.expenses > 0
      ? Number(
          (
            projectedCash /
            input.expenses
          ).toFixed(1)
        )
      : 0;

  let trend: ForecastResult["trend"];

  if (next30Profit > 0) {
    trend = "Growing";
  } else if (next30Profit === 0) {
    trend = "Stable";
  } else {
    trend = "Declining";
  }

  return {

    next30Revenue,

    next30Expenses,

    next30Profit,

    projectedCash,

    runwayMonths,

    trend,

    confidence: 92,

  };
}