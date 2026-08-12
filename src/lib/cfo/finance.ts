import { createClient } from "@/lib/supabase/server";

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

  outstanding: number;
  outstandingReceivables: number;
  outstandingPayables: number;

  revenueGrowth: number;
  expenseGrowth: number;

  healthScore: number;
}

function getMonthRange(offset = 0) {
  const now = new Date();

  const start = new Date(
    now.getFullYear(),
    now.getMonth() + offset,
    1
  );

  const end = new Date(
    now.getFullYear(),
    now.getMonth() + offset + 1,
    1
  );

  return {
    start,
    end,
  };
}

function isWithinRange(
  dateValue: unknown,
  start: Date,
  end: Date
): boolean {
  if (!dateValue) {
    return false;
  }

  const date = new Date(
    String(dateValue)
  );

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date >= start && date < end;
}

function safeNumber(
  value: unknown
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

export async function getFinancialMetrics(): Promise<FinancialMetrics> {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  const ownerId = user.id;

  const [
    invoicesResult,
    paymentsResult,
    expensesResult,
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select("*")
      .eq("owner_id", ownerId),

    supabase
      .from("payments")
      .select("*")
      .eq("owner_id", ownerId),

    supabase
      .from("expenses")
      .select("*")
      .eq("owner_id", ownerId),
  ]);

  if (invoicesResult.error) {
    throw invoicesResult.error;
  }

  if (paymentsResult.error) {
    throw paymentsResult.error;
  }

  if (expensesResult.error) {
    throw expensesResult.error;
  }

  const invoices =
    invoicesResult.data ?? [];

  const payments =
    paymentsResult.data ?? [];

  const expensesData =
    expensesResult.data ?? [];

  const currentMonth =
    getMonthRange(0);

  const previousMonth =
    getMonthRange(-1);

  /*
   * ============================================================
   * CURRENT MONTH REVENUE
   * ============================================================
   *
   * Revenue means invoiced revenue.
   *
   * This is intentionally different from collected cash.
   */

  const currentMonthRevenue =
    invoices
      .filter((invoice) =>
        isWithinRange(
          invoice.created_at ??
            invoice.invoice_date ??
            invoice.date,
          currentMonth.start,
          currentMonth.end
        )
      )
      .reduce(
        (sum, invoice) =>
          sum +
          safeNumber(
            invoice.total
          ),
        0
      );

  /*
   * ============================================================
   * PREVIOUS MONTH REVENUE
   * ============================================================
   */

  const previousMonthRevenue =
    invoices
      .filter((invoice) =>
        isWithinRange(
          invoice.created_at ??
            invoice.invoice_date ??
            invoice.date,
          previousMonth.start,
          previousMonth.end
        )
      )
      .reduce(
        (sum, invoice) =>
          sum +
          safeNumber(
            invoice.total
          ),
        0
      );

  /*
   * ============================================================
   * CURRENT MONTH COLLECTED REVENUE
   * ============================================================
   *
   * Prefer actual payment records.
   *
   * If payment records contain no usable amount, fall back to
   * invoice amount_paid values.
   */

  const currentMonthPayments =
    payments
      .filter((payment) =>
        isWithinRange(
          payment.created_at ??
            payment.payment_date ??
            payment.date,
          currentMonth.start,
          currentMonth.end
        )
      )
      .reduce(
        (sum, payment) =>
          sum +
          safeNumber(
            payment.amount
          ),
        0
      );

  const currentMonthInvoicePayments =
    invoices
      .filter((invoice) =>
        isWithinRange(
          invoice.created_at ??
            invoice.invoice_date ??
            invoice.date,
          currentMonth.start,
          currentMonth.end
        )
      )
      .reduce(
        (sum, invoice) =>
          sum +
          safeNumber(
            invoice.amount_paid
          ),
        0
      );

  const currentMonthCollectedRevenue =
    currentMonthPayments > 0
      ? currentMonthPayments
      : currentMonthInvoicePayments;

  /*
   * ============================================================
   * CURRENT MONTH EXPENSES
   * ============================================================
   */

  const currentMonthExpenses =
    expensesData
      .filter((expense) =>
        isWithinRange(
          expense.created_at ??
            expense.expense_date ??
            expense.date,
          currentMonth.start,
          currentMonth.end
        )
      )
      .reduce(
        (sum, expense) =>
          sum +
          safeNumber(
            expense.amount
          ),
        0
      );

  /*
   * ============================================================
   * PREVIOUS MONTH EXPENSES
   * ============================================================
   */

  const previousMonthExpenses =
    expensesData
      .filter((expense) =>
        isWithinRange(
          expense.created_at ??
            expense.expense_date ??
            expense.date,
          previousMonth.start,
          previousMonth.end
        )
      )
      .reduce(
        (sum, expense) =>
          sum +
          safeNumber(
            expense.amount
          ),
        0
      );

  /*
   * ============================================================
   * CORE OPERATING METRICS
   * ============================================================
   */

  const revenue =
    currentMonthRevenue;

  const expenses =
    currentMonthExpenses;

  /*
   * Cash-based profit.
   *
   * Unpaid invoices are not treated as cash.
   */

  const profit =
    currentMonthCollectedRevenue -
    expenses;

  const cashFlow =
    currentMonthCollectedRevenue -
    expenses;

  /*
   * IMPORTANT:
   *
   * ArkenOne does not currently have a connected bank balance.
   *
   * Therefore this is an estimated net financial position,
   * NOT an actual bank balance.
   */

  const cash =
    cashFlow;

  /*
   * ============================================================
   * RECEIVABLES
   * ============================================================
   */

  const outstandingReceivables =
    invoices.reduce(
      (sum, invoice) =>
        sum +
        Math.max(
          0,
          safeNumber(
            invoice.balance_due
          )
        ),
      0
    );

  /*
   * ============================================================
   * MARGINS
   * ============================================================
   *
   * This is a conservative operating indicator.
   *
   * It is not formal accounting gross margin because profit is
   * currently calculated on a cash basis.
   */

  const grossMargin =
    revenue <= 0
      ? 0
      : (profit / revenue) * 100;

  const netMargin =
    grossMargin;

  /*
   * ============================================================
   * WORKING CAPITAL INDICATOR
   * ============================================================
   *
   * ArkenOne does not yet have a complete balance sheet.
   */

  const workingCapital =
    cash +
    outstandingReceivables;

  /*
   * ============================================================
   * MONTHLY BURN RATE
   * ============================================================
   */

  const monthlyBurnRate =
    expenses;

  /*
   * ============================================================
   * CASH RUNWAY
   * ============================================================
   *
   * This is an estimate because actual bank cash is not yet
   * connected.
   */

  const cashRunwayDays =
    cash <= 0 ||
    monthlyBurnRate <= 0
      ? 0
      : Math.round(
          (cash /
            monthlyBurnRate) *
            30
        );

  /*
   * ============================================================
   * GROWTH
   * ============================================================
   */

  const revenueGrowth =
    previousMonthRevenue <= 0
      ? 0
      : (
          (currentMonthRevenue -
            previousMonthRevenue) /
          previousMonthRevenue
        ) * 100;

  const expenseGrowth =
    previousMonthExpenses <= 0
      ? 0
      : (
          (currentMonthExpenses -
            previousMonthExpenses) /
          previousMonthExpenses
        ) * 100;

  /*
   * ============================================================
   * PAYABLES
   * ============================================================
   *
   * ArkenOne does not currently have a reliable payable model.
   *
   * We intentionally do not pretend that payables are zero
   * because of an accounting assumption.
   */

  const outstandingPayables = 0;

  /*
   * ============================================================
   * FINANCIAL HEALTH
   * ============================================================
   */

  let healthScore = 50;

  if (revenue > 0) {
    healthScore += 10;
  }

  if (profit > 0) {
    healthScore += 15;
  } else if (profit < 0) {
    healthScore -= 15;
  }

  if (cashFlow > 0) {
    healthScore += 10;
  } else if (cashFlow < 0) {
    healthScore -= 10;
  }

  /*
   * Receivables risk.
   */

  if (
    revenue > 0 &&
    outstandingReceivables >
      revenue * 0.5
  ) {
    healthScore -= 10;
  }

  /*
   * Expense pressure.
   */

  if (
    currentMonthCollectedRevenue >
    0
  ) {
    const expenseRatio =
      expenses /
      currentMonthCollectedRevenue;

    if (
      expenseRatio >= 0.9
    ) {
      healthScore -= 15;
    } else if (
      expenseRatio >= 0.75
    ) {
      healthScore -= 8;
    }
  }

  /*
   * Growth signal.
   */

  if (revenueGrowth > 10) {
    healthScore += 5;
  } else if (
    revenueGrowth < -10
  ) {
    healthScore -= 5;
  }

  healthScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        healthScore
      )
    )
  );

  /*
   * ============================================================
   * RETURN NORMALIZED FINANCIAL METRICS
   * ============================================================
   */

  return {
    revenue,

    expenses,

    profit,

    cash,

    cashFlow,

    grossMargin,

    netMargin,

    workingCapital,

    cashRunwayDays,

    monthlyBurnRate,

    outstanding:
      outstandingReceivables,

    outstandingReceivables,

    outstandingPayables,

    revenueGrowth,

    expenseGrowth,

    healthScore,
  };
}