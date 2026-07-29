import {
  BusinessRisk,
  CustomerMetrics,
  FinancialMetrics,
} from "./types";

export function analyzeBusinessRisks(
  finance: FinancialMetrics,
  customers: CustomerMetrics
): BusinessRisk[] {
  const risks: BusinessRisk[] = [];

  // Outstanding Receivables
  if (
    finance.outstandingReceivables >
    finance.revenue * 0.30
  ) {
    risks.push({
      id: crypto.randomUUID(),

      title: "High Outstanding Receivables",

      description:
        "More than 30% of total revenue is still unpaid.",

      severity: "High",

      recommendation:
        "Prioritize collecting overdue invoices before increasing spending.",
    });
  }

  // Cash Flow
  if (finance.cashFlow < 0) {
    risks.push({
      id: crypto.randomUUID(),

      title: "Negative Cash Flow",

      description:
        "Cash outflow currently exceeds inflow.",

      severity: "Critical",

      recommendation:
        "Reduce discretionary spending and improve collections immediately.",
    });
  }

  // Cash Runway
  if (finance.cashRunwayDays < 30) {
    risks.push({
      id: crypto.randomUUID(),

      title: "Low Cash Runway",

      description:
        "Current liquidity covers less than one month of operations.",

      severity: "Critical",

      recommendation:
        "Increase cash reserves and delay non-essential investments.",
    });
  }

  // Customer Concentration
  if (
    customers.customerConcentration > 50
  ) {
    risks.push({
      id: crypto.randomUUID(),

      title: "Revenue Concentration",

      description:
        "A large share of revenue depends on a single customer.",

      severity: "Medium",

      recommendation:
        "Acquire additional customers to reduce dependency.",
    });
  }

  // Profitability
  if (finance.netMargin < 10) {
    risks.push({
      id: crypto.randomUUID(),

      title: "Low Profit Margin",

      description:
        "Profit margins are below the recommended level.",

      severity: "Medium",

      recommendation:
        "Review pricing strategy and operating costs.",
    });
  }

  return risks;
}