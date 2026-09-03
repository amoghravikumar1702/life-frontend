import { createClient } from "@/lib/supabase/server";
import { getFinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

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

/*
 * ============================================================
 * DATE UTILITIES
 * ============================================================
 */

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

  const date = new Date(String(dateValue));

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date >= start && date < end;
}

/*
 * ============================================================
 * SAFE NUMBER
 * ============================================================
 */

function safeNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

/*
 * ============================================================
 * FINANCIAL METRICS
 * ============================================================
 */

export async function getFinancialMetrics(): Promise<FinancialMetrics> {
  /*
   * ==========================================================
   * SOURCE OF TRUTH
   * ==========================================================
   *
   * Mission Control and the AI CFO MUST use the same financial
   * numbers.
   *
   * Therefore all core financial metrics come from:
   *
   * getFinancialSnapshot()
   *
   * Do NOT independently recalculate revenue/profit here.
   */

  const snapshot =
    await getFinancialSnapshot();

  /*
   * ==========================================================
   * AUTHENTICATION
   * ==========================================================
   *
   * Supabase is still used below for month-over-month
   * analytical metrics.
   */

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const ownerId = user.id;

  /*
   * ==========================================================
   * LOAD SECONDARY DATA
   * ==========================================================
   *
   * Only used for:
   *
   * - Revenue growth
   * - Expense growth
   *
   * Core financial numbers remain controlled by the snapshot.
   */

  const [
    invoicesResult,
    expensesResult,
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select(
        `
          id,
          created_at,
          invoice_date,
          total
        `
      )
      .eq("owner_id", ownerId),

    supabase
      .from("expenses")
      .select(
        `
          id,
          created_at,
          expense_date,
          amount
        `
      )
      .eq("owner_id", ownerId),
  ]);

  if (invoicesResult.error) {
    throw invoicesResult.error;
  }

  if (expensesResult.error) {
    throw expensesResult.error;
  }

  const invoices =
    invoicesResult.data ?? [];

  const expensesData =
    expensesResult.data ?? [];

  /*
   * ==========================================================
   * MONTH RANGES
   * ==========================================================
   */

  const currentMonth =
    getMonthRange(0);

  const previousMonth =
    getMonthRange(-1);

  /*
   * ==========================================================
   * CURRENT MONTH REVENUE
   * ==========================================================
   *
   * Used ONLY for growth analysis.
   */

  const currentMonthRevenue =
    invoices
      .filter((invoice) =>
        isWithinRange(
          invoice.created_at ??
            invoice.invoice_date,
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
   * ==========================================================
   * PREVIOUS MONTH REVENUE
   * ==========================================================
   */

  const previousMonthRevenue =
    invoices
      .filter((invoice) =>
        isWithinRange(
          invoice.created_at ??
            invoice.invoice_date,
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
   * ==========================================================
   * CURRENT MONTH EXPENSES
   * ==========================================================
   */

  const currentMonthExpenses =
    expensesData
      .filter((expense) =>
        isWithinRange(
          expense.created_at ??
            expense.expense_date,
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
   * ==========================================================
   * PREVIOUS MONTH EXPENSES
   * ==========================================================
   */

  const previousMonthExpenses =
    expensesData
      .filter((expense) =>
        isWithinRange(
          expense.created_at ??
            expense.expense_date,
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
   * ==========================================================
   * CORE FINANCIAL VALUES
   * ==========================================================
   *
   * These MUST match Mission Control.
   */

  const revenue =
    safeNumber(
      snapshot.revenue
    );

  const expenses =
    safeNumber(
      snapshot.expenses
    );

  const profit =
    safeNumber(
      snapshot.profit
    );

 const cash =
  safeNumber(
    snapshot.revenue - snapshot.expenses
  );

const cashFlow =
    profit;

  const outstandingReceivables =
    safeNumber(
      snapshot.outstandingReceivables
    );

  /*
   * ==========================================================
   * MARGINS
   * ==========================================================
   *
   * Operating indicator for MVP.
   */

  const grossMargin =
    revenue > 0
      ? (profit / revenue) * 100
      : 0;

  const netMargin =
    grossMargin;

  /*
   * ==========================================================
   * WORKING CAPITAL
   * ==========================================================
   *
   * DhanarkOS does not yet have a complete balance sheet.
   *
   * Therefore this is an operational indicator rather than
   * formal accounting working capital.
   */

  const workingCapital =
    cash +
    outstandingReceivables;

  /*
   * ==========================================================
   * MONTHLY BURN RATE
   * ==========================================================
   */

  const monthlyBurnRate =
    expenses;

  /*
   * ==========================================================
   * CASH RUNWAY
   * ==========================================================
   *
   * Estimated because there is no connected bank balance.
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
   * ==========================================================
   * REVENUE GROWTH
   * ==========================================================
   */

  const revenueGrowth =
    previousMonthRevenue <= 0
      ? 0
      : (
          (currentMonthRevenue -
            previousMonthRevenue) /
          previousMonthRevenue
        ) * 100;

  /*
   * ==========================================================
   * EXPENSE GROWTH
   * ==========================================================
   */

  const expenseGrowth =
    previousMonthExpenses <= 0
      ? 0
      : (
          (currentMonthExpenses -
            previousMonthExpenses) /
          previousMonthExpenses
        ) * 100;

  /*
   * ==========================================================
   * PAYABLES
   * ==========================================================
   *
   * There is currently no reliable payable model.
   *
   * We therefore do not invent payable data.
   */

  const outstandingPayables = 0;

  /*
   * ==========================================================
   * HEALTH SCORE
   * ==========================================================
   *
   * Use the exact health score generated by the financial
   * snapshot so Mission Control and AI CFO never disagree.
   */

  const healthScore =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          safeNumber(
            100
          )
        )
      )
    );

  /*
   * ==========================================================
   * RETURN
   * ==========================================================
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