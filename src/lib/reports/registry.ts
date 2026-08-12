import { generateRevenueReport } from "./generators/revenue";
import { generateReceivablesReport } from "./generators/receivables";
import { generateInvoiceSummaryReport } from "./generators/invoiceSummary";
import { generatePaymentReport } from "./generators/payment";
import { generateCustomerLedger } from "./generators/customerLedger";
import {
  ReportResult,
  ReportType,
} from "./types";

export interface ReportGeneratorOptions {
  ownerId: string;
  start: Date;
  end: Date;
}

export type ReportGenerator = (
  options: ReportGeneratorOptions
) => Promise<ReportResult>;

export const REPORT_GENERATORS: Partial<
  Record<ReportType, ReportGenerator>
> = {
  revenue: generateRevenueReport,
  receivables: generateReceivablesReport,
  invoice_summary: generateInvoiceSummaryReport,
  payment: generatePaymentReport,
  customer_ledger: generateCustomerLedger,
};