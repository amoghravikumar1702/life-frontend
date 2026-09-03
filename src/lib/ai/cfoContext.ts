import { ExecutiveReport } from "@/lib/cfo/types";

/*
 * ============================================================
 * DhanarkOS AI CFO — COMPACT CFO CONTEXT
 * ============================================================
 *
 * Converts the complete ExecutiveReport into a smaller,
 * normalized financial context for the AI CFO.
 *
 * Goals:
 *
 * 1. Reduce OpenAI token usage.
 * 2. Avoid exposing unnecessary application data.
 * 3. Keep the CFO context predictable.
 * 4. Normalize malformed/null database values.
 * 5. Give the CFO enough information to make financial
 *    decisions without sending the entire report.
 *
 * IMPORTANT:
 *
 * This file does NOT call OpenAI.
 */

export interface CFOContext {
  company: {
    name: string;
    industry: string;
    businessModel: string;
    employees: number;
    businessGoal: string;
    growthStage: string;
    riskAppetite: string;
  };

  finance: {
    revenue: number;
    expenses: number;
    profit: number;

    cash: number;
    cashFlow: number;

    grossMargin: number;
    netMargin: number;

    workingCapital: number;
    cashRunwayDays: number;
    monthlyBurnRate: number;

    outstandingReceivables: number;
    outstandingPayables: number;

    revenueGrowth: number;
    expenseGrowth: number;

    healthScore: number;
  };

  customers: {
    total: number;
    active: number;
    repeatCustomers: number;

    averageInvoiceValue: number;
    averagePaymentTime: number;

    customerConcentration: number;

    topCustomer: string;
    topCustomerRevenue: number;

    highestOutstandingCustomer: string;
    highestOutstandingAmount: number;
  };

  forecast: {
    next30Revenue: number;
    next30Expenses: number;
    next30Profit: number;

    expectedCashPosition: number;
    expectedGrowth: number;
    confidence: number;
  };

  workforce: {
    currentEmployees: number;
    financiallySustainableEmployees: number;
    difference: number;
  };
}

/*
 * ============================================================
 * SAFE NUMBER
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

/*
 * ============================================================
 * SAFE NON-NEGATIVE NUMBER
 * ============================================================
 */

function safeNonNegativeNumber(
  value: unknown,
  fallback = 0
): number {
  return Math.max(
    0,
    safeNumber(value, fallback)
  );
}

/*
 * ============================================================
 * SAFE INTEGER
 * ============================================================
 */

function safeNonNegativeInteger(
  value: unknown,
  fallback = 0
): number {
  const number = safeNumber(
    value,
    fallback
  );

  return Math.max(
    0,
    Math.floor(number)
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
 * BUILD CFO CONTEXT
 * ============================================================
 *
 * The ExecutiveReport contains more information than the AI
 * CFO needs for every question.
 *
 * This function creates the normalized baseline context.
 */

export function buildCFOContext(
  report: ExecutiveReport
): CFOContext {
  return {
    /*
     * ========================================================
     * COMPANY
     * ========================================================
     */

    company: {
      name: safeText(
        report.company?.name,
        "My Company"
      ),

      industry: safeText(
        report.company?.industry,
        "General"
      ),

      businessModel: safeText(
        report.company?.businessModel,
        "Unknown"
      ),

      employees:
        safeNonNegativeInteger(
          report.company?.employees
        ),

      businessGoal: safeText(
        report.company?.businessGoal,
        "Grow Revenue"
      ),

      growthStage: safeText(
        report.company?.growthStage,
        "Startup"
      ),

      riskAppetite: safeText(
        report.company?.riskAppetite,
        "Medium"
      ),
    },

    /*
     * ========================================================
     * FINANCE
     * ========================================================
     */

    finance: {
      revenue:
        safeNonNegativeNumber(
          report.finance?.revenue
        ),

      expenses:
        safeNonNegativeNumber(
          report.finance?.expenses
        ),

      profit:
        safeNumber(
          report.finance?.profit
        ),

      cash:
        safeNumber(
          report.finance?.cash
        ),

      cashFlow:
        safeNumber(
          report.finance?.cashFlow
        ),

      grossMargin:
        safeNumber(
          report.finance?.grossMargin
        ),

      netMargin:
        safeNumber(
          report.finance?.netMargin
        ),

      workingCapital:
        safeNumber(
          report.finance?.workingCapital
        ),

      cashRunwayDays:
        safeNonNegativeNumber(
          report.finance?.cashRunwayDays
        ),

      monthlyBurnRate:
        safeNonNegativeNumber(
          report.finance?.monthlyBurnRate
        ),

      outstandingReceivables:
        safeNonNegativeNumber(
          report.finance
            ?.outstandingReceivables
        ),

      outstandingPayables:
        safeNonNegativeNumber(
          report.finance
            ?.outstandingPayables
        ),

      revenueGrowth:
        safeNumber(
          report.finance?.revenueGrowth
        ),

      expenseGrowth:
        safeNumber(
          report.finance?.expenseGrowth
        ),

      healthScore: Math.min(
        100,
        Math.max(
          0,
          safeNumber(
            report.finance?.healthScore
          )
        )
      ),
    },

    /*
     * ========================================================
     * CUSTOMERS
     * ========================================================
     */

    customers: {
      total:
        safeNonNegativeInteger(
          report.customers?.totalCustomers ??
            report.customers?.total
        ),

      active:
        safeNonNegativeInteger(
          report.customers?.active
        ),

      repeatCustomers:
        safeNonNegativeInteger(
          report.customers
            ?.repeatCustomers
        ),

      averageInvoiceValue:
        safeNonNegativeNumber(
          report.customers
            ?.averageInvoiceValue
        ),

      averagePaymentTime:
        safeNonNegativeNumber(
          report.customers
            ?.averagePaymentTime
        ),

      customerConcentration:
        Math.min(
          100,
          Math.max(
            0,
            safeNumber(
              report.customers
                ?.customerConcentration
            )
          )
        ),

      topCustomer: safeText(
        report.customers?.topCustomer
      ),

      topCustomerRevenue:
        safeNonNegativeNumber(
          report.customers
            ?.topCustomerRevenue
        ),

      highestOutstandingCustomer:
        safeText(
          report.customers
            ?.highestOutstandingCustomer
        ),

      highestOutstandingAmount:
        safeNonNegativeNumber(
          report.customers
            ?.highestOutstandingAmount
        ),
    },

    /*
     * ========================================================
     * FORECAST
     * ========================================================
     */

    forecast: {
      next30Revenue:
        safeNonNegativeNumber(
          report.forecast
            ?.next30Revenue
        ),

      next30Expenses:
        safeNonNegativeNumber(
          report.forecast
            ?.next30Expenses
        ),

      next30Profit:
        safeNumber(
          report.forecast
            ?.next30Profit
        ),

      expectedCashPosition:
        safeNumber(
          report.forecast
            ?.expectedCashPosition
        ),

      expectedGrowth:
        safeNumber(
          report.forecast
            ?.expectedGrowth
        ),

      confidence: Math.min(
        100,
        Math.max(
          0,
          safeNumber(
            report.forecast?.confidence
          )
        )
      ),
    },

    /*
     * ========================================================
     * WORKFORCE
     * ========================================================
     */

    workforce: {
      currentEmployees:
        safeNonNegativeInteger(
          report.workforce
            ?.currentEmployees ??
            report.company?.employees
        ),

      financiallySustainableEmployees:
        safeNonNegativeInteger(
          report
            ?.financiallySustainableEmployees
        ),

      difference:
        safeNumber(
          report.workforce
            ?.difference
        ),
    },
  };
}