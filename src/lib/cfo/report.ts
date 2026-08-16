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
 * This file prepares normalized financial intelligence.
 *
 * IMPORTANT:
 *
 * - No OpenAI calls
 * - No OpenAI model configuration
 * - No API keys
 * - No environment-variable requirements
 *
 * The OpenAI layer consumes this report separately.
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

  return Number.isFinite(number)
    ? number
    : fallback;
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

function safeInteger(
  value: unknown,
  fallback = 0
): number {
  const number = safeNumber(
    value,
    fallback
  );

  return Number.isFinite(number)
    ? Math.floor(number)
    : fallback;
}

function safeNonNegativeInteger(
  value: unknown,
  fallback = 0
): number {
  return Math.max(
    0,
    safeInteger(value, fallback)
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
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

/*
 * ============================================================
 * WORKFORCE INTELLIGENCE
 * ============================================================
 *
 * This calculates financial capacity.
 *
 * It is NOT an automatic hiring recommendation.
 */

/*
 * Safety ceiling for malformed financial data.
 */
const MAX_RECOMMENDED_EMPLOYEES = 1000;

/*
 * Conservative MVP baseline.
 *
 * ₹25,000 monthly revenue ~= financial capacity for
 * one employee.
 */
const MONTHLY_REVENUE_PER_EMPLOYEE = 25_000;

function calculateRecommendedEmployees(
  revenue: number,
  expenses: number,
  profit: number
): number {
  const monthlyRevenue =
    safeNonNegativeNumber(revenue);

  const monthlyExpenses =
    safeNonNegativeNumber(expenses);

  const monthlyProfit =
    safeNumber(profit);

  /*
   * No meaningful revenue.
   */
  if (monthlyRevenue <= 0) {
    return 0;
  }

  /*
   * Base capacity.
   */
  let recommendedEmployees =
    Math.floor(
      monthlyRevenue /
        MONTHLY_REVENUE_PER_EMPLOYEE
    );

  /*
   * Meaningful revenue supports at least
   * one employee in this baseline.
   */
  recommendedEmployees =
    Math.max(
      1,
      recommendedEmployees
    );

  /*
   * Loss-making business:
   * reduce financial capacity conservatively.
   */
  if (monthlyProfit < 0) {
    recommendedEmployees =
      Math.floor(
        recommendedEmployees * 0.75
      );
  }

  /*
   * Very high expense ratio:
   * constrain workforce capacity.
   */
  const expenseRatio =
    monthlyRevenue > 0
      ? monthlyExpenses / monthlyRevenue
      : 0;

  if (expenseRatio >= 0.9) {
    recommendedEmployees =
      Math.floor(
        recommendedEmployees * 0.75
      );
  }

  /*
   * Never return below one when revenue exists.
   */
  recommendedEmployees =
    Math.max(
      1,
      recommendedEmployees
    );

  /*
   * Safety ceiling.
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
   * ==========================================================
   * LOAD SOURCE DATA
   * ==========================================================
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
   * NORMALIZE FINANCIAL DATA
   * ==========================================================
   */

  const financeReport:
    ExecutiveReport["finance"] = {
    ...finance,

    revenue:
      safeNonNegativeNumber(
        finance.revenue
      ),

    expenses:
      safeNonNegativeNumber(
        finance.expenses
      ),

    profit:
      safeNumber(
        finance.profit
      ),

    cash:
      safeNonNegativeNumber(
        finance.cash
      ),

    cashFlow:
      safeNumber(
        finance.cashFlow
      ),

    grossMargin:
      safeNumber(
        finance.grossMargin
      ),

    netMargin:
      safeNumber(
        finance.netMargin
      ),

    workingCapital:
      safeNumber(
        finance.workingCapital
      ),

    cashRunwayDays:
      safeNonNegativeNumber(
        finance.cashRunwayDays
      ),

    monthlyBurnRate:
      safeNonNegativeNumber(
        finance.monthlyBurnRate
      ),

    outstanding:
      safeNonNegativeNumber(
        finance.outstanding ??
          finance.outstandingReceivables
      ),

    outstandingReceivables:
      safeNonNegativeNumber(
        finance.outstandingReceivables
      ),

    outstandingPayables:
      safeNonNegativeNumber(
        finance.outstandingPayables
      ),

    revenueGrowth:
      safeNumber(
        finance.revenueGrowth
      ),

    expenseGrowth:
      safeNumber(
        finance.expenseGrowth
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
  };

  /*
   * ==========================================================
   * NORMALIZE CUSTOMER DATA
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

  const employeeDifference =
    recommendedEmployees -
    currentEmployees;

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
    financeReport.revenue.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    );

  const formattedExpenses =
    financeReport.expenses.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    );

  const formattedProfit =
    financeReport.profit.toLocaleString(
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
   * RETURN NORMALIZED EXECUTIVE REPORT
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