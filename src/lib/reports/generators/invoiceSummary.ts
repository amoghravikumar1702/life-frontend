import { createClient } from "@/lib/supabase/server";

import {
  ReportMetadata,
  ReportResult,
} from "../types";

import { REPORT_VERSION } from "../constants";

interface GenerateInvoiceSummaryReportOptions {
  ownerId: string;
  start: Date;
  end: Date;
}

export async function generateInvoiceSummaryReport({
  ownerId,
  start,
  end,
}: GenerateInvoiceSummaryReportOptions): Promise<ReportResult> {
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
    .gte(
      "invoice_date",
      start.toISOString().split("T")[0]
    )
    .lte(
      "invoice_date",
      end.toISOString().split("T")[0]);

  if (error) throw error;

  const paid =
    invoices?.filter(
      (invoice) => invoice.status === "Paid"
    ).length ?? 0;

  const pending =
    invoices?.filter(
      (invoice) => invoice.status === "Pending"
    ).length ?? 0;

  const metadata: ReportMetadata = {
    generatedAt: new Date(),
    generatedBy: ownerId,
    version: REPORT_VERSION,
  };

  return {
    title: "Invoice Summary",

    type: "invoice_summary",

    period: {
      start,
      end,
    },

    summary: `${invoices?.length ?? 0} invoices generated.`,

    metrics: [
      {
        label: "Invoices",
        value: invoices?.length ?? 0,
      },
      {
        label: "Paid",
        value: paid,
      },
      {
        label: "Pending",
        value: pending,
      },
    ],

    tables: [
      {
        title: "Invoices",

        columns: [
          "Invoice",
          "Customer",
          "Date",
          "Due",
          "Amount",
          "Status",
        ],

        rows: invoices ?? [],
      },
    ],

    metadata,

    raw: invoices ?? [],
  };
}