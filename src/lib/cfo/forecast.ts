import { Forecast, FinancialMetrics } from "./types";

/*
 * ============================================================
 * ARKENONE AI CFO — 30-DAY FORECAST ENGINE
 * ============================================================
 *
 * Conservative MVP financial projection.
 *
 * IMPORTANT:
 *
 * 1. This function performs local calculations only.
 * 2. It does NOT call OpenAI.
 * 3. It does NOT invent external financial assumptions.
 * 4. It uses the financial metrics already calculated by
 *    ArkenOne.
 * 5. Because ArkenOne does not currently have a connected
 *    bank balance, expectedCashPosition is a model estimate,
 *    NOT an actual bank balance.
 */

function safeNumber(
  value: unknown,
  fallback = 0
): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return number;
}

function safeNonNegativeNumber(
  value: unknown,
  fallback = 0
): number {
  return Math.max(
    0,
    safeNumber(value, fallback)
  );
}

function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}

export function generateForecast(
  finance: FinancialMetrics
): Forecast {
  /*
   * ==========================================================
   * NORMALIZE INPUTS
   * ==========================================================
   */

  const revenue =
    safeNonNegativeNumber(
      finance.revenue
    );

  const expenses =
    safeNonNegativeNumber(
      finance.expenses
    );

  const cash =
    safeNumber(
      finance.cash
    );

  const revenueGrowthRate =
    safeNumber(
      finance.revenueGrowth
    );

  const expenseGrowthRate =
    safeNumber(
      finance.expenseGrowth
    );

  /*
   * ==========================================================
   * GROWTH MULTIPLIERS
   * ==========================================================
   *
   * Example:
   *
   * +10% → 1.10
   *  0% → 1.00
   * -10% → 0.90
   *
   * Growth rates are bounded so malformed database values
   * cannot create absurd forecasts.
   */

  const boundedRevenueGrowth =
    clamp(
      revenueGrowthRate,
      -100,
      500
    );

  const boundedExpenseGrowth =
    clamp(
      expenseGrowthRate,
      -100,
      500
    );

  const revenueGrowthMultiplier =
    1 +
    boundedRevenueGrowth / 100;

  const expenseGrowthMultiplier =
    1 +
    boundedExpenseGrowth / 100;

  /*
   * ==========================================================
   * NEXT 30 DAYS — REVENUE
   * ==========================================================
   */

  const next30Revenue =
    Math.max(
      0,
      revenue *
        revenueGrowthMultiplier
    );

  /*
   * ==========================================================
   * NEXT 30 DAYS — EXPENSES
   * ==========================================================
   */

  const next30Expenses =
    Math.max(
      0,
      expenses *
        expenseGrowthMultiplier
    );

  /*
   * ==========================================================
   * NEXT 30 DAYS — PROFIT
   * ==========================================================
   *
   * This follows the same simplified financial basis used by
   * the MVP FinancialMetrics engine.
   */

  const next30Profit =
    next30Revenue -
    next30Expenses;

  /*
   * ==========================================================
   * EXPECTED CASH POSITION
   * ==========================================================
   *
   * ArkenOne does not currently have a connected bank balance.
   *
   * Therefore this should be interpreted as:
   *
   * current modeled cash position
   * + projected 30-day profit
   *
   * It must NOT be presented as a verified bank balance.
   */

  const expectedCashPosition =
    cash +
    next30Profit;

  /*
   * ==========================================================
   * EXPECTED GROWTH
   * ==========================================================
   */

  const expectedGrowth =
    boundedRevenueGrowth;

  /*
   * ==========================================================
   * FORECAST CONFIDENCE
   * ==========================================================
   *
   * Confidence is based on the quality of the financial data
   * available to the engine.
   *
   * It is NOT model certainty.
   */

  let confidence = 90;

  /*
   * No revenue means there is not enough historical revenue
   * information for a strong revenue forecast.
   */

  if (revenue <= 0) {
    confidence = 55;
  }

  /*
   * No expenses means the expense projection is incomplete.
   */

  else if (expenses <= 0) {
    confidence = 65;
  }

  /*
   * No observed month-over-month movement means the forecast
   * has less evidence of directional change.
   */

  else if (
    boundedRevenueGrowth === 0 &&
    boundedExpenseGrowth === 0
  ) {
    confidence = 72;
  }

  /*
   * Financial weakness reduces confidence in aggressive
   * forward projections.
   */

  const healthScore =
    clamp(
      safeNumber(
        finance.healthScore
      ),
      0,
      100
    );

  if (healthScore < 80) {
    confidence = Math.min(
      confidence,
      82
    );
  }

  if (healthScore < 60) {
    confidence = Math.min(
      confidence,
      74
    );
  }

  if (healthScore < 40) {
    confidence = Math.min(
      confidence,
      65
    );
  }

  /*
   * Final safety boundary.
   */

  confidence =
    clamp(
      confidence,
      0,
      100
    );

  /*
   * ==========================================================
   * RETURN FORECAST
   * ==========================================================
   */

  return {
    next30Revenue,

    next30Expenses,

    next30Profit,

    expectedCashPosition,

    expectedGrowth,

    confidence,
  };
}