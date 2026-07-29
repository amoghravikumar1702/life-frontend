import { createClient } from "@/lib/supabase/server";

import { FinancialMetrics } from "./types";

export async function getFinancialMetrics(): Promise<FinancialMetrics> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const ownerId = user.id;

  const [
    invoicesResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select("*")
      .eq("owner_id", ownerId),

    supabase
      .from("payments")
      .select("*")
      .eq("owner_id", ownerId),
  ]);

  if (invoicesResult.error) {
    throw invoicesResult.error;
  }

  if (paymentsResult.error) {
    throw paymentsResult.error;
  }

  const invoices = invoicesResult.data ?? [];

  const revenue = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total ?? 0),
    0
  );

  const outstandingReceivables = invoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.balance_due ?? 0),
    0
  );

  const collectedRevenue = invoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.amount_paid ?? 0),
    0
  );

  const expenses = 0;

  const profit = collectedRevenue - expenses;

  const grossMargin =
    revenue === 0
      ? 0
      : (profit / revenue) * 100;

  const netMargin = grossMargin;

  const cashFlow =
    collectedRevenue - expenses;

  const workingCapital =
    cashFlow - outstandingReceivables;

  const monthlyBurnRate = expenses;

  const cashRunwayDays =
    monthlyBurnRate === 0
      ? 365
      : Math.round(
          (cashFlow / monthlyBurnRate) * 30
        );

  return {
    revenue,

    expenses,

    profit,

    grossMargin,

    netMargin,

    cashFlow,

    workingCapital,

    cashRunwayDays,

    outstandingReceivables,

    outstandingPayables: 0,

    monthlyBurnRate,

    revenueGrowth: 0,

    expenseGrowth: 0,

    healthScore: 0,
  };
}