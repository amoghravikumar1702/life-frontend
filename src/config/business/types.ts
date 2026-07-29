export type BusinessIndustry =
  | "retail"
  | "services"
  | "education"
  | "healthcare"
  | "hospitality"
  | "manufacturing"
  | "fitness"
  | "nonprofit";

export interface BusinessConfig {
  industry: BusinessIndustry;

  dashboardTitle: string;
  dashboardSubtitle: string;

  customerLabel: string;
  customerPlural: string;

  invoiceLabel: string;
  invoicePlural: string;

  paymentLabel: string;
  paymentPlural: string;

  revenueLabel: string;
  expenseLabel: string;

  aiContext: string;
}