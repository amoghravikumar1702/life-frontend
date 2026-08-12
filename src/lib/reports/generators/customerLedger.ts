import { createClient } from "@/lib/supabase/server";

import {
  ReportMetadata,
  ReportResult,
} from "../types";

import { REPORT_VERSION } from "../constants";

interface GenerateCustomerLedgerOptions {
  ownerId: string;
  start: Date;
  end: Date;
}

export async function generateCustomerLedger({
  ownerId,
}: GenerateCustomerLedgerOptions): Promise<ReportResult> {
  const supabase = await createClient();

  const { data: customers, error } =
    await supabase
      .from("customers")
      .select("*")
      .eq("owner_id", ownerId);

  if (error) {
    throw error;
  }

  const metadata: ReportMetadata = {
    generatedAt: new Date(),
    generatedBy: ownerId,
    version: REPORT_VERSION,
  };

  return {
    title: "Customer Ledger",

    type: "customer_ledger",

    period: {
      start: new Date(),
      end: new Date(),
    },

    summary: `${customers?.length ?? 0} customers.`,

    metrics: [
      {
        label: "Customers",
        value: customers?.length ?? 0,
      },
    ],

    tables: [
      {
        title: "Customers",

        columns: [
          "Customer",
          "Email",
          "Phone",
        ],

        rows: customers ?? [],
      },
    ],

    metadata,

    raw: customers ?? [],
  };
}