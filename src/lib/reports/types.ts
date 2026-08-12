export type ReportType =
  | "revenue"
  | "receivables"
  | "invoice_summary"
  | "customer_ledger"
  | "payment"
  | "profit_loss"
  | "cash_flow"
  | "gst_summary";

export type ReportStatus =
  | "pending"
  | "generating"
  | "completed"
  | "failed";

export interface ReportPeriod {
  start: Date;
  end: Date;
}

export interface ReportMetric {
  label: string;
  value: number;
  change?: number;
}

export interface ReportChart {
  title: string;
  type: "bar" | "line" | "pie";
  data: unknown;
}

export interface ReportTable {
  title: string;
  columns: string[];
  rows: unknown[];
}

export interface ReportInsight {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface ReportMetadata {
  generatedAt: Date;
  generatedBy: string;
  version: number;
}

export interface ReportResult {
  title: string;

  type: ReportType;

  period: ReportPeriod;

  summary?: string;

  metrics: ReportMetric[];

  charts?: ReportChart[];

  tables?: ReportTable[];

  insights?: ReportInsight[];

  recommendations?: string[];

  metadata: ReportMetadata;

  raw: unknown;
}