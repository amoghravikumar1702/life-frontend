// src/lib/cfo/report.ts

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
 * This file prepares normalized business intelligence for the
 * ArkenOne AI CFO.
 *
 * IMPORTANT:
 *
 * - No OpenAI calls
 * - No OpenAI model configuration
 * - No API keys
 * - No hiring recommendations
 * - No workforce capacity calculations
 *
 * The report contains the ACTUAL workforce count.
 *
 * The company profile is also carried through unchanged so
 * downstream AI CFO components can reliably access:
 *
 * report.company.name
 * report.company.industry
 * report.company.employees
 * etc.
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
  if (
    typeof value !== "string"
  ) {
    return fallback;
  }

  const cleaned = value.trim();

  return cleaned || fallback;
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
   * NORMALIZE COMPANY PROFILE
   * ==========================================================
   *
   * Keep the company identity deterministic.
   *
   * This is especially important for the AI CFO greeting.
   *
   * Example:
   *
   * Supabase
   *   ↓
   * company.company_name = "ARKENG"
   *   ↓
   * report.company.name = "ARKENG"
   *   ↓
   * Dashboard
   *   ↓
   * Good day, ARKENG
   *
   * The AI does not need to invent or infer the company name.
   */

  const companyReport =
    {
      ...company,

      id:
        safeText(
          company.id,
          ""
        ),

      name:
        safeText(
          company.name,
          "Your Business"
        ),

      industry:
        safeText(
          company.industry,
          "General"
        ),

      businessModel:
        safeText(
          company.businessModel,
          "Unknown"
        ),

      yearsInBusiness:
        safeNonNegativeNumber(
          company.yearsInBusiness,
          1
        ),

      employees:
        safeNonNegativeInteger(
          company.employees
        ),

      annualRevenue:
        safeNonNegativeNumber(
          company.annualRevenue
        ),

      monthlyRevenue:
        safeNonNegativeNumber(
          company.monthlyRevenue
        ),

      monthlyExpenses:
        safeNonNegativeNumber(
          company.monthlyExpenses
        ),

      businessGoal:
        safeText(
          company.businessGoal,
          "Grow Revenue"
        ),

      growthStage:
        safeText(
          company.growthStage,
          "Startup"
        ),

      riskAppetite:
        safeText(
          company.riskAppetite,
          "Medium"
        ),
    };

  /*
   * ==========================================================
   * NORMALIZE FINANCIAL DATA
   * ==========================================================
   */

  const financeReport:
    ExecutiveReport["finance"] = {
    ...finance,

    /*
     * Revenue
     */

    revenue:
      safeNonNegativeNumber(
        finance.revenue
      ),

    /*
     * Expenses
     */

    expenses:
      safeNonNegativeNumber(
        finance.expenses
      ),

    /*
     * Profit
     */

    profit:
      safeNumber(
        finance.profit
      ),

    /*
     * Cash
     */

    cash:
      safeNonNegativeNumber(
        finance.cash
      ),

    /*
     * Cash flow
     */

    cashFlow:
      safeNumber(
        finance.cashFlow
      ),

    /*
     * Margins
     */

    grossMargin:
      safeNumber(
        finance.grossMargin
      ),

    netMargin:
      safeNumber(
        finance.netMargin
      ),

    /*
     * Working capital
     */

    workingCapital:
      safeNumber(
        finance.workingCapital
      ),

    /*
     * Runway
     */

    cashRunwayDays:
      safeNonNegativeNumber(
        finance.cashRunwayDays
      ),

    /*
     * Monthly burn
     */

    monthlyBurnRate:
      safeNonNegativeNumber(
        finance.monthlyBurnRate
      ),

    /*
     * Outstanding receivables
     */

    outstanding:
      safeNonNegativeNumber(
        finance.outstanding ??
          finance.outstandingReceivables
      ),

    outstandingReceivables:
      safeNonNegativeNumber(
        finance.outstandingReceivables
      ),

    /*
     * Outstanding payables
     */

    outstandingPayables:
      safeNonNegativeNumber(
        finance.outstandingPayables
      ),

    /*
     * Growth
     */

    revenueGrowth:
      safeNumber(
        finance.revenueGrowth
      ),

    expenseGrowth:
      safeNumber(
        finance.expenseGrowth
      ),

    /*
     * Financial health
     */

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
   * ACTUAL WORKFORCE
   * ==========================================================
   */

  const currentEmployees =
    safeNonNegativeInteger(
      companyReport.employees
    );

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
   *
   * Informational only.
   *
   * No workforce recommendation is calculated here.
   */

  const workforceRationale =
    currentEmployees === 0
      ? "No employees are currently recorded in the company profile. The AI CFO can evaluate workforce requirements when the business provides sufficient financial and operational context."
      : `The company currently has ${currentEmployees} recorded employee${
          currentEmployees === 1
            ? ""
            : "s"
        }. Workforce decisions should be evaluated by the AI CFO using actual revenue, expenses, profitability, cash flow, receivables, runway, role requirements and business objectives.`;

  /*
   * ==========================================================
   * RETURN NORMALIZED EXECUTIVE REPORT
   * ==========================================================
   *
   * IMPORTANT:
   *
   * companyReport is returned as "company".
   *
   * Therefore every downstream component receives:
   *
   * report.company.name
   *
   * which should contain the actual company name from Supabase.
   */

  return {
    /*
     * Company profile
     */

    company:
      companyReport,

    /*
     * Financial intelligence
     */

    finance:
      financeReport,

    /*
     * Customer intelligence
     */

    customers:
      customerReport,

    /*
     * Forecast
     */

    forecast,

    /*
     * Risk engine
     */

    risks: [],

    /*
     * Workforce
     *
     * ONLY actual workforce data.
     *
     * No recommendation.
     */

    workforce: {
      currentEmployees,

      rationale:
        workforceRationale,
    },
  };
}