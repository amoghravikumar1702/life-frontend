import { createClient } from "@/lib/supabase/server";

import {
  ReportMetadata,
  ReportResult,
} from "../types";

import { REPORT_VERSION } from "../constants";

interface GeneratePaymentReportOptions {
  ownerId: string;
  start: Date;
  end: Date;
}

export async function generatePaymentReport({
  ownerId,
  start,
  end,
}: GeneratePaymentReportOptions): Promise<ReportResult> {
  const supabase = await createClient();

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .eq("owner_id", ownerId)
    .gte(
      "created_at",
      start.toISOString()
    )
    .lte(
      "created_at",
      end.toISOString()
    );

  if (error) {
    throw error;
  }

  const totalPayments = payments?.length ?? 0;

  const totalCollected =
    payments?.reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    ) ?? 0;

  const averagePayment =
    totalPayments === 0
      ? 0
      : totalCollected / totalPayments;

  const metadata: ReportMetadata = {
    generatedAt: new Date(),
    generatedBy: ownerId,
    version: REPORT_VERSION,
  };

  return {
    title: "Payment Report",

    type: "payment",

    period: {
      start,
      end,
    },

    summary: `${totalPayments} payments received.`,

    metrics: [
      {
        label: "Payments",
        value: totalPayments,
      },
      {
        label: "Collected",
        value: totalCollected,
      },
      {
        label: "Average Payment",
        value: averagePayment,
      },
    ],

    tables: [
      {
        title: "Payments",

        columns: [
          "Date",
          "Amount",
          "Method",
          "Status",
        ],

        rows: payments ?? [],
      },
    ],

    metadata,

    raw: payments ?? [],
  };
}