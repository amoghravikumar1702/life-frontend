import { createClient } from "@/lib/supabase/server";

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
};

type ExpenseRecord = {
  id: string;
  amount: number | null;
};

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
};

export async function getFinancialSnapshot(): Promise<FinancialSnapshot> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const ownerId = user.id;

  const [
    customersResult,
    invoicesResult,
    paymentsResult,
    expensesResult,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("id")
      .eq("owner_id", ownerId),

    supabase
      .from("invoices")
      .select("id, balance_due")
      .eq("owner_id", ownerId),

    supabase
      .from("payments")
      .select("id, amount")
      .eq("owner_id", ownerId),

    supabase
      .from("expenses")
      .select("id, amount")
      .eq("owner_id", ownerId),
  ]);

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

  const customers =
    (customersResult.data ?? []) as CustomerRecord[];

  const invoices =
    (invoicesResult.data ?? []) as InvoiceRecord[];

  const payments =
    (paymentsResult.data ?? []) as PaymentRecord[];

  const expenses =
    (expensesResult.data ?? []) as ExpenseRecord[];

  /*
   * ==========================================================
   * REVENUE
   * ==========================================================
   */

  const revenue = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount ?? 0),
    0
  );

  /*
   * ==========================================================
   * EXPENSES
   * ==========================================================
   */

  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount ?? 0),
    0
  );

  /*
   * ==========================================================
   * OUTSTANDING RECEIVABLES
   * ==========================================================
   */

  const outstandingReceivables = invoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.balance_due ?? 0),
    0
  );

  /*
   * ==========================================================
   * PROFIT
   * ==========================================================
   */

  const profit = revenue - totalExpenses;

  /*
   * ==========================================================
   * CASH
   * ==========================================================
   *
   * Temporary calculation until bank/wallet balances
   * become the source of truth.
   */

  const cashAvailable = profit;

  /*
   * ==========================================================
   * HEALTH SCORE
   * ==========================================================
   */

  const healthScore =
    revenue === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              100 -
                (outstandingReceivables /
                  Math.max(revenue, 1)) *
                  40 -
                (totalExpenses /
                  Math.max(revenue, 1)) *
                  30
            )
          )
        );

  /*
   * ==========================================================
   * TREND
   * ==========================================================
   */

  const trend: FinancialSnapshot["trend"] =
    profit > 0 &&
    revenue > outstandingReceivables
      ? "Improving"
      : profit < 0 ||
        outstandingReceivables > revenue
      ? "Declining"
      : "Stable";

  /*
   * ==========================================================
   * FINAL SNAPSHOT
   * ==========================================================
   */

  return {
    revenue,
    expenses: totalExpenses,
    profit,
    cashAvailable,
    outstandingReceivables,

    overdueInvoices: 0,

    customerCount: customers.length,
    invoiceCount: invoices.length,
    paymentCount: payments.length,

    healthScore,
    trend,
  };
}