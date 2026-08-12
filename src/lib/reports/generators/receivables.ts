import { createClient } from "@/lib/supabase/server";

import {
  ReportMetadata,
  ReportResult,
} from "../types";

import { REPORT_VERSION } from "../constants";

interface GenerateReceivablesReportOptions {
  ownerId: string;
  start: Date;
  end: Date;
}

export async function generateReceivablesReport({
  ownerId,
  start,
  end,
}: GenerateReceivablesReportOptions): Promise<ReportResult> {
  const supabase = await createClient();

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select(`
      invoice_number,
      customer,
      total,
      amount_paid,
      balance_due,
      status,
      due_date
    `)
    .eq("owner_id", ownerId)
    .gte(
      "invoice_date",
      start.toISOString().split("T")[0]
    )
    .lte(
      "invoice_date",
      end.toISOString().split("T")[0]
    );

  if (error) {
    throw error;
  }

  const pendingInvoices =
    invoices?.filter(
      (invoice) =>
        invoice.status === "Pending"
    ) ?? [];

  const outstanding =
    pendingInvoices.reduce(
      (sum, invoice) =>
        sum + Number(invoice.balance_due ?? 0),
      0
    );

  const totalReceivables =
    pendingInvoices.length;

  const averageReceivable =
    totalReceivables === 0
      ? 0
      : outstanding / totalReceivables;

  const metadata: ReportMetadata = {
    generatedAt: new Date(),
    generatedBy: ownerId,
    version: REPORT_VERSION,
  };

  return {
    title: "Receivables Report",

    type: "receivables",

    period: {
      start,
      end,
    },

    metrics: [
      {
        label: "Outstanding",
        value: outstanding,
      },
      {
        label: "Pending Invoices",
        value: totalReceivables,
      },
      {
        label: "Average Receivable",
        value: averageReceivable,
      },
    ],

    metadata,

    raw: pendingInvoices,
  };
}