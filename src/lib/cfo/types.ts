/*
 * ============================================================
 * ARKENONE AI CFO — CORE TYPES
 * ============================================================
 *
 * Shared TypeScript contracts for the CFO intelligence layer.
 *
 * IMPORTANT:
 *
 * These types describe normalized financial intelligence.
 * They do not contain OpenAI-specific implementation details.
 */

/*
 * ============================================================
 * FINANCIAL METRICS
 * ============================================================
 */

export interface FinancialMetrics {
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

  /*
   * Legacy/general outstanding value.
   *
   * Kept for compatibility with existing ArkenOne code.
   */
  outstanding: number;

  outstandingReceivables: number;
  outstandingPayables: number;

  revenueGrowth: number;
  expenseGrowth: number;

  healthScore: number;
}

/*
 * ============================================================
 * FORECAST
 * ============================================================
 */

export interface Forecast {
  next30Revenue: number;
  next30Expenses: number;
  next30Profit: number;

  /*
   * This is a modeled position, not a verified bank balance.
   */
  expectedCashPosition: number;

  expectedGrowth: number;

  /*
   * Confidence is a 0–100 estimate based on the quality and
   * completeness of the available financial information.
   */
  confidence: number;
}

/*
 * ============================================================
 * EXECUTIVE REPORT
 * ============================================================
 */

export interface ExecutiveReport {
  company: {
    name: string;
    industry: string;
    businessModel: string;

    yearsInBusiness: number;
    employees: number;

    annualRevenue: number;

    businessGoal: string;
    growthStage: string;
    riskAppetite: string;
  };

  finance: FinancialMetrics;

  customers: {
    /*
     * `total` and `active` are retained because existing
     * dashboard/report code may use these names.
     */

    total: number;
    active: number;

    /*
     * Canonical customer count.
     */
    totalCustomers: number;

    repeatCustomers: number;

    averageInvoiceValue: number;
    averagePaymentTime: number;

    customerConcentration: number;

    topCustomer: string;
    topCustomerRevenue: number;

    highestOutstandingCustomer: string;
    highestOutstandingAmount: number;
  };

  forecast: Forecast;

  /*
   * Reserved for future deterministic risk detection.
   */
  risks: string[];

  /*
   * Financial capacity baseline.
   *
   * This is NOT automatically a hiring recommendation.
   */
  financiallySustainableEmployees: number;

  workforce: {
    currentEmployees: number;

    /*
     * Financially supported workforce estimate.
     */
    recommendedEmployees: number;

    /*
     * Positive = potential capacity for more employees.
     * Negative = current workforce exceeds the financial
     * capacity baseline.
     */
    difference: number;

    rationale: string;
  };
}

/*
 * ============================================================
 * AI CFO BRIEF
 * ============================================================
 *
 * Used by the dashboard/executive CFO experience.
 *
 * This is separate from the raw OpenAI response contract.
 */

export interface AICFOBrief {
  greeting: string;

  executiveBrief: string;

  health: {
    score: number;
    status: string;
  };

  todaysFocus: {
    title: string;
    description: string;
    amount: number;
    impact: string;
  };

  recommendation: string;

  milestone: {
    title: string;
    current: number;
    target: number;
    remaining: number;
    progress: number;
  };

  capacity: {
    title: string;
    status: string;

    currentEmployees: number;
    recommendedEmployees: number;
    difference: number;

    recommendation: string;
  };
}

/*
 * ============================================================
 * AI CFO QUESTION RESPONSE
 * ============================================================
 *
 * This is the normalized response returned to the frontend
 * after the server validates the OpenAI response.
 */

export interface AICFOQuestionResponse {
  answer: string;

  decision: string;

  action: string;

  financialImpact: {
    amount: number;
    explanation: string;
  };

  confidence: number;
}

/*
 * ============================================================
 * AI CFO RATE LIMIT INFORMATION
 * ============================================================
 */

export interface CFORateLimitInfo {
  remaining: number;
  retryAfterSeconds?: number;
}

/*
 * ============================================================
 * AI CFO API RESPONSE
 * ============================================================
 */

export interface AICFOQuestionAPIResponse {
  success: boolean;

  data?: AICFOQuestionResponse;

  rateLimit?: CFORateLimitInfo;

  error?: string;
}