import { ReportType } from "./types";

export const REPORT_TYPES: Record<
  ReportType | "expenses",
  string
> = {
  profit_loss: "Profit & Loss",

  cash_flow: "Cash Flow",

  revenue: "Revenue",

  expenses: "Expenses",

  receivables: "Outstanding Receivables",

  gst_summary: "GST Summary",

  customer_ledger: "Customer Ledger",

  invoice_summary: "Invoice Summary",
  payment: "Payment",
};

export const REPORT_VERSION = 1;