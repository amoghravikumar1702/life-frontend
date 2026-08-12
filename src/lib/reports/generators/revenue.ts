import { createClient } from "@/lib/supabase/server";

import {
  ReportMetadata,
  ReportResult,
} from "../types";

import { REPORT_VERSION } from "../constants";

interface GenerateRevenueReportOptions {
  ownerId: string;
  start: Date;
  end: Date;
}

export async function generateRevenueReport({
  ownerId,
  start,
  end,
}: GenerateRevenueReportOptions): Promise<ReportResult> {
  const supabase = await createClient();

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(`
  invoice_number,
  customer,
  invoice_date,
  due_date,
  total,
  amount_paid,
  balance_due,
  status
`)
    .eq("owner_id", ownerId)
    .gte("invoice_date", start.toISOString().split("T")[0])
    .lte("invoice_date", end.toISOString().split("T")[0]);

  if (error) {
    throw error;
  }

  const revenue =
    invoices?.reduce(
      (sum, invoice) => sum + Number(invoice.total),
      0
    ) ?? 0;

  const collected =
    invoices?.reduce(
      (sum, invoice) => sum + Number(invoice.amount_paid ?? 0),
      0
    ) ?? 0;

  const outstanding =
    invoices?.reduce(
      (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
      0
    ) ?? 0;

  const invoiceCount = invoices?.length ?? 0;

  const paidInvoices =
    invoices?.filter(
      (invoice) => invoice.status === "Paid"
    ).length ?? 0;

  const pendingInvoices =
    invoices?.filter(
      (invoice) => invoice.status === "Pending"
    ).length ?? 0;

  const averageInvoice =
    invoiceCount === 0
      ? 0
      : revenue / invoiceCount;

  const collectionRate =
    revenue === 0
      ? 0
      : Number(
          ((collected / revenue) * 100).toFixed(2)
        );

  const revenueTrend = [...(invoices ?? [])]
    .sort(
      (a, b) =>
        new Date(a.invoice_date).getTime() -
        new Date(b.invoice_date).getTime()
    )
    .map((invoice) => ({
      date: invoice.invoice_date,
      revenue: Number(invoice.total),
    }));
const customerMap = new Map<
  string,
  {
    customer: string;
    revenue: number;
    invoices: number;
  }
>();

for (const invoice of invoices ?? []) {
  const existing = customerMap.get(
    invoice.customer
  );

  if (existing) {
    existing.revenue += Number(invoice.total);
    existing.invoices += 1;
  } else {
    customerMap.set(invoice.customer, {
      customer: invoice.customer,
      revenue: Number(invoice.total),
      invoices: 1,
    });
  }
}

const topCustomers = [...customerMap.values()]
  .sort(
    (a, b) => b.revenue - a.revenue
  )
  .slice(0, 5);
  const metadata: ReportMetadata = {
    generatedAt: new Date(),
    generatedBy: ownerId,
    version: REPORT_VERSION,
  };
const summary =
  `Revenue for the selected period was ₹${new Intl.NumberFormat(
    "en-IN",
    {
      notation: "compact",
      maximumFractionDigits: 2,
    }
  ).format(revenue)} across ${invoiceCount} invoices. ` +
  `${paidInvoices} invoices have been paid while ${pendingInvoices} remain pending. ` +
  `Collection efficiency is ${collectionRate}%.`;
  const healthScore = Math.max(
  0,
  Math.min(
    10,
    Number(
      (
        (collectionRate * 0.45 +
          (paidInvoices /
            Math.max(invoiceCount, 1)) *
            100 *
            0.35 +
          (outstanding === 0
            ? 100
            : Math.max(
                0,
                100 -
                  (outstanding / revenue) * 100
              )) *
            0.20) /
        10
      ).toFixed(1)
    )
  )
);

const narrative =
  `During the selected reporting period, the business generated ${new Intl.NumberFormat(
    "en-IN",
    {
      notation: "compact",
      maximumFractionDigits: 2,
    }
  ).format(revenue)} in revenue across ${invoiceCount} invoices.

Collections reached ${collectionRate.toFixed(
    1
  )}% of billed revenue, indicating ${
    collectionRate >= 90
      ? "excellent"
      : collectionRate >= 75
      ? "healthy"
      : "below-target"
  } cash conversion.

Outstanding receivables currently total ${new Intl.NumberFormat(
    "en-IN",
    {
      notation: "compact",
      maximumFractionDigits: 2,
    }
  ).format(outstanding)}, requiring ${
    outstanding > revenue * 0.20
      ? "immediate management attention."
      : "routine follow-up."
  }`;

const risks: string[] = [];

if (pendingInvoices > 0) {
  risks.push(
    `${pendingInvoices} pending invoice${
      pendingInvoices > 1 ? "s remain" : " remains"
    } unpaid.`
  );
}

if (outstanding > revenue * 0.15) {
  risks.push(
    `Outstanding receivables exceed 15% of revenue.`
  );
}

if (collectionRate < 80) {
  risks.push(
    "Collection efficiency is below the desired threshold."
  );
}

const opportunities: string[] = [];

if (collectionRate < 95) {
  opportunities.push(
    "Improve invoice collection efficiency."
  );
}

opportunities.push(
  "Increase recurring revenue from existing customers."
);

opportunities.push(
  "Review payment terms to improve cash flow."
);
  return {
    title: "Revenue Report",

    type: "revenue",

    period: {
      start,
      end,
    },

    metrics: [
      {
        label: "Revenue",
        value: revenue,
      },
      {
        label: "Collected",
        value: collected,
      },
      {
        label: "Outstanding",
        value: outstanding,
      },
      {
        label: "Invoices",
        value: invoiceCount,
      },
      {
        label: "Paid Invoices",
        value: paidInvoices,
      },
      {
        label: "Pending Invoices",
        value: pendingInvoices,
      },
      {
        label: "Average Invoice",
        value: averageInvoice,
      },
      {
        label: "Collection Rate",
        value: collectionRate,
      },
    ],

    summary,
    metadata,

tables: [
  {
    title: "Invoices",

    columns: [
      "Invoice",
      "Customer",
      "Date",
      "Amount",
      "Status",
    ],

    rows: invoices ?? [],
  },
],

recommendations: [
  pendingInvoices > 0
    ? "Follow up on pending invoices to improve cash flow."
    : "All invoices have been collected successfully.",
],

raw: {
  revenue,
  collected,
  outstanding,

  invoiceCount,

  paidInvoices,

  pendingInvoices,

  averageInvoice,

  collectionRate,

  revenueTrend,

  topCustomers,

  invoices,
},
  };
}