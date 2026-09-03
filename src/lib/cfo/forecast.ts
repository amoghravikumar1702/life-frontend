import {
  ExecutiveForecast,
  ExecutiveFinance,
} from "./types";

/*
 * ============================================================
 * DhanarkOS AI CFO — 30-DAY FORECAST ENGINE
 * ============================================================
 *
 * Conservative MVP financial projection.
 *
 * IMPORTANT:
 *
 * 1. This function performs local calculations only.
 * 2. It does NOT call OpenAI.
 * 3. It does NOT invent external financial assumptions.
 * 4. It uses financial metrics already calculated by
 *    DhanarkOS.
 * 5. expectedCashPosition is a MODEL ESTIMATE, not a
 *    verified bank balance.
 *
 * ============================================================
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

/*
 * ============================================================
 * GENERATE FORECAST
 * ============================================================
 */

export function generateForecast(
  finance: ExecutiveFinance
): ExecutiveForecast {
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
   */

  const next30Profit =
    next30Revenue -
    next30Expenses;

  /*
   * ==========================================================
   * EXPECTED CASH POSITION
   * ==========================================================
   *
   * This is NOT a verified bank balance.
   *
   * It is:
   *
   * current modeled cash
   * + projected 30-day profit
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
   */

  let confidence = 90;

  if (revenue <= 0) {
    confidence = 55;
  } else if (expenses <= 0) {
    confidence = 65;
  } else if (
    boundedRevenueGrowth === 0 &&
    boundedExpenseGrowth === 0
  ) {
    confidence = 72;
  }

  /*
   * ==========================================================
   * HEALTH-BASED CONFIDENCE ADJUSTMENT
   * ==========================================================
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
    confidence =
      Math.min(
        confidence,
        82
      );
  }

  if (healthScore < 60) {
    confidence =
      Math.min(
        confidence,
        74
      );
  }

  if (healthScore < 40) {
    confidence =
      Math.min(
        confidence,
        65
      );
  }

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