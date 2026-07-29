import { createClient } from "@/lib/supabase/server";
import { getCurrentBusinessConfig } from "../business/getBusinessConfig";

export interface ExecutiveBriefData {
  business: Awaited<ReturnType<typeof getCurrentBusinessConfig>>;

  revenue: number;
  expenses: number;
  outstandingReceivables: number;
  overdueInvoices: number;
  customerCount: number;
  invoiceCount: number;
  paymentCount: number;
}
export async function getExecutiveBrief() {
  const supabase = await createClient();

  const business = await getCurrentBusinessConfig();
    const { data: invoices, error: invoiceError } =
    await supabase
      .from("invoices")
      .select("*");

  if (invoiceError) {
    throw invoiceError;
  }
    const { data: customers, error: customerError } =
    await supabase
      .from("customers")
      .select("*");

  if (customerError) {
    throw customerError;
  }
    const { data: payments, error: paymentError } =
    await supabase
      .from("payments")
      .select("*");

  if (paymentError) {
    throw paymentError;
  }
    const revenue =
    payments?.reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    ) ?? 0;
      const outstandingReceivables =
    invoices?.reduce(
      (sum, invoice) =>
        sum + Number(invoice.balance_due ?? 0),
      0
    ) ?? 0;
      const overdueInvoices =
    invoices?.filter(
      (invoice) =>
        invoice.status === "OVERDUE"
    ).length ?? 0;
      return {
    business,

    revenue,

    expenses: 0,

    outstandingReceivables,

    overdueInvoices,

    customerCount:
      customers?.length ?? 0,

    invoiceCount:
      invoices?.length ?? 0,

    paymentCount:
      payments?.length ?? 0,
  };
}