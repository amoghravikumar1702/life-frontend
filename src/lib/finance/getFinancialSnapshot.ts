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
  ]);

  if (customersResult.error) throw customersResult.error;
  if (invoicesResult.error) throw invoicesResult.error;
  if (paymentsResult.error) throw paymentsResult.error;

  const payments = (paymentsResult.data ?? []) as PaymentRecord[];
  const invoices = (invoicesResult.data ?? []) as InvoiceRecord[];

  const revenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  );

  const outstandingReceivables = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
    0
  );

  // Expenses module not implemented yet
  const expenses = 0;

  const profit = revenue - expenses;

  // Temporary cash calculation.
  // Later this will come from Bank Accounts / Wallets.
  const cashAvailable = revenue;

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
                  40
            )
          )
        );

  const trend: FinancialSnapshot["trend"] =
    revenue > outstandingReceivables
      ? "Improving"
      : outstandingReceivables > revenue
      ? "Declining"
      : "Stable";

  return {
    revenue,

    expenses,

    profit,

    cashAvailable,

    outstandingReceivables,

    overdueInvoices: 0,

    customerCount:
      customersResult.data?.length ?? 0,

    invoiceCount:
      invoicesResult.data?.length ?? 0,

    paymentCount:
      paymentsResult.data?.length ?? 0,

    healthScore,

    trend,
  };
}