import { createClient } from "@/lib/supabase/server";

/*
 * ============================================================
 * DATABASE RECORD TYPES
 * ============================================================
 */

type CustomerRecord = {
  id: string;
};

type InvoiceRecord = {
  id: string;
  balance_due: number | null;
};

type PaymentRecord = {
  id: string;
  amount: number | null;
  paid_at: string | null;
};

type ExpenseRecord = {
  id: string;
  amount: number | null;
};

/*
 * ============================================================
 * FINANCIAL SNAPSHOT
 * ============================================================
 */

export type FinancialSnapshot = {
  revenue: number;
  expenses: number;
  profit: number;

  cashAvailable: number;

  outstandingReceivables: number;

  overdueInvoices: number;

  customerCount: number;
  invoiceCount: number;
  paymentCount: number;

  healthScore: number;

  trend: "Improving" | "Stable" | "Declining";

  /*
   * Current month revenue compared with previous month.
   *
   * Example:
   * Current month = ₹64,000
   * Previous month = ₹50,000
   * Growth = 28%
   */
  revenueGrowth: number;
};

/*
 * ============================================================
 * DATE HELPERS
 * ============================================================
 */

function getMonthBoundaries() {
  const now = new Date();

  /*
   * Current month
   */

  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  /*
   * Previous month
   */

  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const currentMonthStartISO =
    currentMonthStart.toISOString();

  const previousMonthStartISO =
    previousMonthStart.toISOString();

  return {
    currentMonthStartISO,
    previousMonthStartISO,
  };
}

/*
 * ============================================================
 * GET FINANCIAL SNAPSHOT
 *
 * SECURITY:
 *
 * - Uses the authenticated server Supabase client.
 * - Gets the authenticated user from Supabase.
 * - Every financial query is scoped to owner_id.
 * - No service-role client is used.
 * - No cross-tenant financial data is exposed.
 * ============================================================
 */

export async function getFinancialSnapshot(): Promise<FinancialSnapshot> {
  const supabase = await createClient();

  /*
   * ----------------------------------------------------------
   * AUTHENTICATION
   * ----------------------------------------------------------
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const ownerId = user.id;

  /*
   * ----------------------------------------------------------
   * MONTH BOUNDARIES
   * ----------------------------------------------------------
   */

  const {
    currentMonthStartISO,
    previousMonthStartISO,
  } = getMonthBoundaries();

  /*
   * ----------------------------------------------------------
   * LOAD BUSINESS DATA
   * ----------------------------------------------------------
   *
   * All queries remain restricted to the authenticated owner.
   */

  const [
    customersResult,
    invoicesResult,
    paymentsResult,
    expensesResult,
    previousMonthPaymentsResult,
  ] = await Promise.all([
    /*
     * CUSTOMERS
     */

    supabase
      .from("customers")
      .select("id")
      .eq("owner_id", ownerId),

    /*
     * INVOICES
     */

    supabase
      .from("invoices")
      .select("id, balance_due")
      .eq("owner_id", ownerId),

    /*
     * PAYMENTS
     *
     * paid_at is required for revenue-growth analysis.
     */

    supabase
      .from("payments")
      .select("id, amount, paid_at")
      .eq("owner_id", ownerId),

    /*
     * EXPENSES
     */

    supabase
      .from("expenses")
      .select("id, amount")
      .eq("owner_id", ownerId),

    /*
     * PREVIOUS MONTH PAYMENTS
     *
     * We deliberately use paid_at rather than created_at because
     * revenue should represent when the payment was actually made.
     */

    supabase
      .from("payments")
      .select("id, amount, paid_at")
      .eq("owner_id", ownerId)
      .gte("paid_at", previousMonthStartISO)
      .lt("paid_at", currentMonthStartISO),
  ]);

  /*
   * ----------------------------------------------------------
   * ERROR HANDLING
   * ----------------------------------------------------------
   */

  if (customersResult.error) {
    throw customersResult.error;
  }

  if (invoicesResult.error) {
    throw invoicesResult.error;
  }

  if (paymentsResult.error) {
    throw paymentsResult.error;
  }

  if (expensesResult.error) {
    throw expensesResult.error;
  }

  if (previousMonthPaymentsResult.error) {
    throw previousMonthPaymentsResult.error;
  }

  /*
   * ----------------------------------------------------------
   * NORMALIZE DATA
   * ----------------------------------------------------------
   */

  const payments =
    (paymentsResult.data ?? []) as PaymentRecord[];

  const invoices =
    (invoicesResult.data ?? []) as InvoiceRecord[];

  const expenses =
    (expensesResult.data ?? []) as ExpenseRecord[];

  const previousMonthPayments =
    (previousMonthPaymentsResult.data ??
      []) as PaymentRecord[];

  /*
   * ----------------------------------------------------------
   * TOTAL REVENUE
   * ----------------------------------------------------------
   *
   * Current revenue remains based on all recorded payments,
   * preserving the existing Financial Analysis behavior.
   */

  const revenue = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount ?? 0),
    0
  );

  /*
   * ----------------------------------------------------------
   * TOTAL EXPENSES
   * ----------------------------------------------------------
   */

  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount ?? 0),
    0
  );

  /*
   * ----------------------------------------------------------
   * PROFIT
   * ----------------------------------------------------------
   */

  const profit =
    revenue - totalExpenses;

  /*
   * ----------------------------------------------------------
   * RECEIVABLES
   * ----------------------------------------------------------
   */

  const outstandingReceivables =
    invoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.balance_due ?? 0),
      0
    );

  /*
   * ----------------------------------------------------------
   * CASH AVAILABLE
   * ----------------------------------------------------------
   *
   * This remains an operational estimate until ArkenOne has
   * a dedicated bank-account / wallet ledger.
   */

  const cashAvailable =
    revenue - totalExpenses;

  /*
   * ----------------------------------------------------------
   * PREVIOUS MONTH REVENUE
   * ----------------------------------------------------------
   */

  const previousMonthRevenue =
    previousMonthPayments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    );

  /*
   * ----------------------------------------------------------
   * REVENUE GROWTH
   * ----------------------------------------------------------
   *
   * Current month vs previous month.
   *
   * If there was no previous-month revenue:
   *
   * - 0% when there is also no current revenue.
   * - 100% when the business generated revenue for the
   *   first time this month.
   *
   * This avoids Infinity / NaN values entering the UI.
   */

  let revenueGrowth = 0;

  /*
   * Current month revenue
   */

  const currentMonthPayments =
    payments.filter((payment) => {
      if (!payment.paid_at) {
        return false;
      }

      const paidAt =
        new Date(payment.paid_at);

      const currentMonthStart =
        new Date(currentMonthStartISO);

      return paidAt >= currentMonthStart;
    });

  const currentMonthRevenue =
    currentMonthPayments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    );

  if (previousMonthRevenue > 0) {
    revenueGrowth =
      ((currentMonthRevenue -
        previousMonthRevenue) /
        previousMonthRevenue) *
      100;
  } else if (currentMonthRevenue > 0) {
    revenueGrowth = 100;
  }

  /*
   * Keep the value finite and rounded.
   */

  revenueGrowth = Number.isFinite(
    revenueGrowth
  )
    ? Math.round(revenueGrowth * 10) / 10
    : 0;

  /*
   * ----------------------------------------------------------
   * HEALTH SCORE
   * ----------------------------------------------------------
   */

  let healthScore = 0;

  if (revenue > 0) {
    const receivablePressure =
      (outstandingReceivables /
        Math.max(revenue, 1)) *
      40;

    const expensePressure =
      (totalExpenses /
        Math.max(revenue, 1)) *
      40;

    healthScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          100 -
            receivablePressure -
            expensePressure
        )
      )
    );
  }

  /*
   * ----------------------------------------------------------
   * TREND
   * ----------------------------------------------------------
   */

  let trend: FinancialSnapshot["trend"];

  if (
    revenue === 0 &&
    totalExpenses === 0
  ) {
    trend = "Stable";
  } else if (
    revenueGrowth > 5 &&
    profit >= 0
  ) {
    trend = "Improving";
  } else if (
    profit < 0 ||
    revenueGrowth < -5
  ) {
    trend = "Declining";
  } else {
    trend = "Stable";
  }

  /*
   * ----------------------------------------------------------
   * RETURN
   * ----------------------------------------------------------
   */

  return {
    revenue,

    expenses: totalExpenses,

    profit,

    cashAvailable,

    outstandingReceivables,

    /*
     * Existing overdue-invoice calculation remains untouched
     * because the current invoice snapshot does not include a
     * due-date field.
     */

    overdueInvoices: 0,

    customerCount:
      customersResult.data?.length ?? 0,

    invoiceCount:
      invoicesResult.data?.length ?? 0,

    paymentCount:
      paymentsResult.data?.length ?? 0,

    healthScore,

    trend,

    revenueGrowth,
  };
}