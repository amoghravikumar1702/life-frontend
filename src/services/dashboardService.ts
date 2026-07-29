import { createClient } from "@/lib/supabase/client";
import type { FinancialBriefData } from "@/components/Dashboard/financial-brief/types";
import type { AttentionItem } from "@/components/Dashboard/attention/types";

const supabase = createClient();

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function getDashboardStats() {
  const [
    customersResult,
    invoicesResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false }),

    supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  if (customersResult.error) throw customersResult.error;
  if (invoicesResult.error) throw invoicesResult.error;
  if (paymentsResult.error) throw paymentsResult.error;

  const customers = customersResult.data ?? [];
  const invoices = invoicesResult.data ?? [];
  const payments = paymentsResult.data ?? [];

  /* ---------------- KPI ---------------- */

  const outstanding = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
    0
  );

  const revenue = payments.reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  );

  /* ---------------- Activity ---------------- */

  const activities = [
    ...customers.map((customer) => ({
      id: `customer-${customer.id}`,
      type: "customer" as const,
      title: "New Customer Added",
      description:
        customer.business_name ||
        customer.customer_name ||
        "Customer added",
      timestamp: customer.created_at,
    })),

    ...invoices.map((invoice) => ({
      id: `invoice-${invoice.id}`,
      type: "invoice" as const,
      title: `Invoice ${invoice.invoice_number}`,
      description: `${invoice.customer} • ${formatCurrency(
        Number(invoice.total ?? 0)
      )}`,
      timestamp: invoice.created_at,
    })),

    ...payments.map((payment) => ({
      id: `payment-${payment.id}`,
      type: "payment" as const,
      title: "Payment Received",
      description: `${formatCurrency(
        Number(payment.amount ?? 0)
      )} received`,
      timestamp: payment.paid_at ?? payment.created_at,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 10);

  /* ---------------- Financial Brief ---------------- */

  const now = new Date();

  const financialBrief: FinancialBriefData = {
    generatedAt: now.toLocaleString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
    }),

    summary: `You currently have ${customers.length} customers, ${invoices.length} invoices and ${formatCurrency(
      outstanding
    )} awaiting collection. Revenue recorded so far is ${formatCurrency(
      revenue
    )}.`,

    metrics: [
      {
        id: "revenue",
        label: "Revenue",
        value: formatCurrency(revenue),
        trend: "up",
      },
      {
        id: "outstanding",
        label: "Outstanding",
        value: formatCurrency(outstanding),
        trend:
          outstanding > revenue ? "down" : "neutral",
      },
      {
        id: "customers",
        label: "Customers",
        value: customers.length.toString(),
        trend: "up",
      },
      {
        id: "invoices",
        label: "Invoices",
        value: invoices.length.toString(),
        trend: "neutral",
      },
    ],

    insight: {
      title: "AI CFO Recommendation",

      description:
        outstanding > 0
          ? "Prioritize collecting outstanding invoices to improve cash flow."
          : "Collections are healthy. Keep maintaining timely customer payments.",

      priority:
        outstanding > revenue
          ? "high"
          : outstanding > 0
          ? "medium"
          : "low",
    },
  };

  /* ---------------- Need Your Attention ---------------- */

  const overdueInvoices = invoices.filter(
    (invoice) => Number(invoice.balance_due ?? 0) > 0
  );

  const overdueAmount = overdueInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
    0
  );

  const today = new Date().toDateString();

  const todaysPayments = payments.filter((payment) => {
    const paymentDate =
      payment.paid_at ?? payment.created_at;

    if (!paymentDate) return false;

    return (
      new Date(paymentDate).toDateString() === today
    );
  });

  const todaysCollections = todaysPayments.reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  );

  const attentionItems: AttentionItem[] = [
    {
      title: "Overdue Invoices",

      description:
        overdueInvoices.length > 0
          ? `${overdueInvoices.length} invoice${
              overdueInvoices.length > 1 ? "s" : ""
            } worth ${formatCurrency(
              overdueAmount
            )} require immediate collection.`
          : "No overdue invoices. Great work.",

      status:
        overdueInvoices.length > 0
          ? "critical"
          : "success",

      href: "/invoices",
    },

    {
      title: "Payment Follow-ups",

      description:
        overdueInvoices.length > 0
          ? `${overdueInvoices.length} customer${
              overdueInvoices.length > 1 ? "s are" : " is"
            } awaiting payment follow-up.`
          : "No payment follow-ups pending.",

      status:
        overdueInvoices.length > 0
          ? "warning"
          : "success",

      href: "/invoices",
    },

    {
      title: "Today's Collections",

      description:
        todaysCollections > 0
          ? `${formatCurrency(
              todaysCollections
            )} collected today.`
          : "No payments received today.",

      status: "success",

      href: "/invoices",
    },
  ];

  return {
    customers: customers.length,
    invoices: invoices.length,
    revenue,
    outstanding,
    activities,
    financialBrief,
    attentionItems,
  };
}