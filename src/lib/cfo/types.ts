/*
 * ============================================================
 * DhanarkOS AI CFO — EXECUTIVE TYPES
 * ============================================================
 */

export interface CompanyProfile {
  id?: string;
  companyId?: string;
  name?: string;
  industry?: string;
  employees?: number;
  startingRevenue?: number;
  [key: string]: unknown;
}

/*
 * ============================================================
 * FINANCIAL DATA
 * ============================================================
 */

export interface ExecutiveFinance {
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

  outstanding: number;
  outstandingReceivables: number;
  outstandingPayables: number;

  revenueGrowth: number;
  expenseGrowth: number;

  healthScore: number;

  [key: string]: unknown;
}

/*
 * ============================================================
 * CUSTOMER DATA
 * ============================================================
 */

export interface ExecutiveCustomers {
  total: number;
  active: number;
  totalCustomers: number;

  repeatCustomers: number;

  averageInvoiceValue: number;
  averagePaymentTime: number;

  customerConcentration: number;

  topCustomer: string;
  topCustomerRevenue: number;

  highestOutstandingCustomer: string;
  highestOutstandingAmount: number;

  [key: string]: unknown;
}

/*
 * ============================================================
 * FORECAST
 * ============================================================
 */

export interface ExecutiveForecast {
  [key: string]: unknown;
}

/*
 * ============================================================
 * WORKFORCE
 * ============================================================
 *
 * IMPORTANT:
 *
 * Workforce Management owns the actual employee count.
 *
 * AI CFO does NOT create a hardcoded recommended employee
 * count inside the Executive Report.
 *
 * AI CFO receives the actual workforce data and makes
 * recommendations dynamically based on:
 *
 * - revenue
 * - expenses
 * - profit
 * - cash flow
 * - runway
 * - receivables
 * - business context
 *
 * ============================================================
 */

export interface ExecutiveWorkforce {
  currentEmployees: number;

  rationale: string;

  [key: string]: unknown;
}

/*
 * ============================================================
 * EXECUTIVE REPORT
 * ============================================================
 */

export interface ExecutiveReport {
  company: CompanyProfile;

  finance: ExecutiveFinance;

  customers: ExecutiveCustomers;

  forecast: ExecutiveForecast;

  risks: string[];

  workforce: ExecutiveWorkforce;

  /*
   * Kept optional for backward compatibility with any
   * existing code that may still reference it.
   *
   * New code should NOT use this field for workforce
   * recommendations.
   */
  financiallySustainableEmployees?: number;

  [key: string]: unknown;
}