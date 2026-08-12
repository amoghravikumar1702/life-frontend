import { getCompanyProfile } from "./company";
import { getFinancialMetrics } from "./finance";
import { getCustomerMetrics } from "./customers";
import { generateForecast } from "./forecast";

import { ExecutiveReport } from "./types";

/*
 * ============================================================
 * ARKENONE AI CFO — EXECUTIVE REPORT ENGINE
 * ============================================================
 *
 * SECURITY / RELIABILITY PRINCIPLES
 *
 * 1. Never trust malformed database values.
 * 2. Never use `any`.
 * 3. Never expose financial data through production logs.
 * 4. Workforce recommendations must be financially conservative.
 * 5. Current employee count must not artificially inflate the
 *    recommended workforce.
 * 6. The AI CFO receives normalized financial data only.
 *
 * IMPORTANT:
 *
 * This file does NOT call OpenAI.
 *
 * It prepares the financial intelligence that the AI CFO
 * endpoint later provides to OpenAI.
 */

/*
 * ============================================================
 * SAFE NUMBER UTILITIES
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
  const number = safeNumber(
    value,
    fallback
  );

  return Math.max(
    0,
    number
  );
}

function safeInteger(
  value: unknown,
  fallback = 0
): number {
  const number = safeNumber(
    value,
    fallback
  );

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.floor(number);
}

function safeNonNegativeInteger(
  value: unknown,
  fallback = 0
): number {
  return Math.max(
    0,
    safeInteger(
      value,
      fallback
    )
  );
}

/*
 * ============================================================
 * SAFE TEXT
 * ============================================================
 */

function safeText(
  value: unknown,
  fallback = ""
): string {
  if (
    typeof value !== "string"
  ) {
    return fallback;
  }

  return value.trim();
}

/*
 * ============================================================
 * WORKFORCE INTELLIGENCE
 * ============================================================
 *
 * IMPORTANT:
 *
 * This calculation determines FINANCIAL CAPACITY.
 *
 * It is NOT a blind hiring recommendation.
 *
 * The AI CFO can use this baseline together with:
 *
 * - cash flow
 * - profit
 * - expenses
 * - receivables
 * - forecast
 * - business stage
 * - risk appetite
 *
 * before recommending an actual hire.
 */

/*
 * Maximum workforce baseline the engine can produce.
 *
 * This prevents malformed financial records from creating
 * absurd values such as millions of recommended employees.
 *
 * This is NOT a business restriction.
 *
 * It is a safety boundary for the intelligence engine.
 */
const MAX_RECOMMENDED_EMPLOYEES = 1000;

/*
 * Revenue-per-employee baseline.
 *
 * MVP financial capacity baseline:
 *
 * ₹25,000 monthly revenue ≈ capacity for one employee.
 *
 * This is deliberately conservative.
 */
const MONTHLY_REVENUE_PER_EMPLOYEE = 25_000;

function calculateRecommendedEmployees(
  revenue: number,
  expenses: number,
  profit: number
): number {
  const monthlyRevenue =
    safeNonNegativeNumber(
      revenue
    );

  const monthlyExpenses =
    safeNonNegativeNumber(
      expenses
    );

  const monthlyProfit =
    safeNumber(
      profit
    );

  /*
   * No meaningful revenue.
   *
   * Do not recommend a workforce from
   * nonexistent financial capacity.
   */
  if (
    monthlyRevenue <= 0
  ) {
    return 0;
  }

  /*
   * Base financial capacity.
   */
  let recommendedEmployees =
    Math.floor(
      monthlyRevenue /
        MONTHLY_REVENUE_PER_EMPLOYEE
    );

  /*
   * A business with revenue can support
   * at least one employee in this baseline.
   */
  recommendedEmployees =
    Math.max(
      1,
      recommendedEmployees
    );

  /*
   * Loss-making businesses receive
   * a conservative reduction.
   */
  if (
    monthlyProfit < 0
  ) {
    recommendedEmployees =
      Math.floor(
        recommendedEmployees *
          0.75
      );
  }

  /*
   * Extremely high expense ratio.
   *
   * If expenses consume 90%+ of revenue,
   * workforce expansion should be constrained.
   */
  const expenseRatio =
    monthlyRevenue > 0
      ? monthlyExpenses /
        monthlyRevenue
      : 0;

  if (
    expenseRatio >= 0.9
  ) {
    recommendedEmployees =
      Math.floor(
        recommendedEmployees *
          0.75
      );
  }

  /*
   * Never return less than one when there is
   * meaningful revenue.
   */
  recommendedEmployees =
    Math.max(
      1,
      recommendedEmployees
    );

  /*
   * Hard safety ceiling.
   */
  recommendedEmployees =
    Math.min(
      MAX_RECOMMENDED_EMPLOYEES,
      recommendedEmployees
    );

  return recommendedEmployees;
}

/*
 * ============================================================
 * EXECUTIVE REPORT
 * ============================================================
 */

export async function buildExecutiveReport(): Promise<ExecutiveReport> {
  /*
   * Load independent data concurrently.
   */
  const [
    company,
    finance,
    customers,
  ] = await Promise.all([
    getCompanyProfile(),
    getFinancialMetrics(),
    getCustomerMetrics(),
  ]);

  /*
   * ==========================================================
   * FINANCIAL NORMALIZATION
   * ==========================================================
   */

  const financeReport: ExecutiveReport["finance"] = {
    ...finance,

    cash:
      safeNonNegativeNumber(
        finance.cash
      ),

    outstanding:
      safeNonNegativeNumber(
        finance.outstanding ??
          finance.outstandingReceivables
      ),

    healthScore:
      Math.min(
        100,
        Math.max(
          0,
          safeNumber(
            finance.healthScore
          )
        )
      ),

    cashFlow:
      safeNumber(
        finance.cashFlow
      ),

    outstandingReceivables:
      safeNonNegativeNumber(
        finance.outstandingReceivables
      ),
  };

  /*
   * ==========================================================
   * CUSTOMER NORMALIZATION
   * ==========================================================
   */

  const customerReport:
    ExecutiveReport["customers"] = {
    total:
      safeNonNegativeInteger(
        customers.totalCustomers
      ),

    active:
      safeNonNegativeInteger(
        customers.activeCustomers
      ),

    totalCustomers:
      safeNonNegativeInteger(
        customers.totalCustomers
      ),

    repeatCustomers:
      safeNonNegativeInteger(
        customers.repeatCustomers
      ),

    averageInvoiceValue:
      safeNonNegativeNumber(
        customers.averageInvoiceValue
      ),

    averagePaymentTime:
      safeNonNegativeNumber(
        customers.averagePaymentTime
      ),

    customerConcentration:
      Math.min(
        100,
        Math.max(
          0,
          safeNumber(
            customers.customerConcentration
          )
        )
      ),

    topCustomer:
      safeText(
        customers.topCustomer
      ),

    topCustomerRevenue:
      safeNonNegativeNumber(
        customers.topCustomerRevenue
      ),

    highestOutstandingCustomer:
      safeText(
        customers.highestOutstandingCustomer
      ),

    highestOutstandingAmount:
      safeNonNegativeNumber(
        customers.highestOutstandingAmount
      ),
  };

  /*
   * ==========================================================
   * CURRENT WORKFORCE
   * ==========================================================
   *
   * Current employees are used ONLY for comparison.
   *
   * They do NOT determine the financially sustainable
   * workforce baseline.
   */

  const currentEmployees =
    Math.min(
      MAX_RECOMMENDED_EMPLOYEES,
      safeNonNegativeInteger(
        company.employees
      )
    );

  /*
   * ==========================================================
   * FINANCIAL WORKFORCE CAPACITY
   * ==========================================================
   */

  const recommendedEmployees =
    calculateRecommendedEmployees(
      financeReport.revenue,
      financeReport.expenses,
      financeReport.profit
    );

  /*
   * Difference between current workforce
   * and financial capacity.
   */

  const employeeDifference =
    recommendedEmployees -
    currentEmployees;

  /*
   * This is explicitly named as financial capacity
   * so the AI does not confuse it with an automatic
   * hiring instruction.
   */

  const financiallySustainableEmployees =
    recommendedEmployees;

  /*
   * ==========================================================
   * FORECAST
   * ==========================================================
   */

  const forecast =
    generateForecast(
      financeReport
    );

  /*
   * ==========================================================
   * WORKFORCE RATIONALE
   * ==========================================================
   */

  const formattedRevenue =
    Number(
      financeReport.revenue
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    );

  const formattedExpenses =
    Number(
      financeReport.expenses
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    );

  const formattedProfit =
    Number(
      financeReport.profit
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    );

  const rationale =
    financeReport.revenue <= 0
      ? "There is currently insufficient revenue data to establish a financially sustainable workforce."
      : `Based on current monthly revenue of ₹${formattedRevenue}, expenses of ₹${formattedExpenses}, and profit of ₹${formattedProfit}, ArkenOne estimates a financial workforce capacity of ${recommendedEmployees} employee${
          recommendedEmployees === 1
            ? ""
            : "s"
        }. This is a financial capacity baseline, not an automatic hiring recommendation. Actual hiring decisions should also consider cash flow, receivables, runway, role cost and business objectives.`;

  /*
   * ==========================================================
   * RETURN EXECUTIVE REPORT
   * ==========================================================
   */

  return {
    company,

    finance:
      financeReport,

    customers:
      customerReport,

    forecast,

    risks: [],

    financiallySustainableEmployees,

    workforce: {
      currentEmployees,

      recommendedEmployees,

      difference:
        employeeDifference,

      rationale,
    },
  };
}