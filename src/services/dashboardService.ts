import { supabase } from "@/lib/supabase";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export async function getDashboardStats() {
  // Fetch invoices
  const { data: invoices, error: invoiceError } = await supabase
    .from("invoices")
    .select("total,balance_due,status");

  if (invoiceError) throw invoiceError;

  // Money still to collect
  const moneyToCollect =
    invoices?.reduce(
      (sum, invoice) =>
        sum + Number(invoice.balance_due ?? 0),
      0
    ) ?? 0;

  // Total invoice value (temporary Cash Position)
  const revenue =
    invoices?.reduce(
      (sum, invoice) =>
        sum + Number(invoice.total ?? 0),
      0
    ) ?? 0;

  // Pending + Partially Paid
  const overdueInvoices =
    invoices?.filter(
      (invoice) => invoice.status !== "Paid"
    ).length ?? 0;

  // Customers
  const { count: customerCount, error: customerError } =
    await supabase
      .from("customers")
      .select("*", {
        count: "exact",
        head: true,
      });

  if (customerError) throw customerError;

  return {
    moneyToCollect,
    revenue,
    overdueInvoices,
    customerCount: customerCount ?? 0,

    formatted: {
      moneyToCollect: formatCurrency(moneyToCollect),
      revenue: formatCurrency(revenue),
    },
  };
}