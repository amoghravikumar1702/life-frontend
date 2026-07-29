import { BusinessMetrics } from "../core/metrics";

export interface FinancialRuleResult {
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  reason: string;
  recommendation: string;
  confidence: number;
}

export function evaluateFinancialRules(
  metrics: BusinessMetrics
): FinancialRuleResult[] {
  const results: FinancialRuleResult[] = [];

  // Cash Flow

  if (metrics.cashCoverage < 1) {
    results.push({
      title: "Critical Cash Flow",
      severity: "Critical",
      reason:
        "Current cash reserves cover less than one month of operating expenses.",
      recommendation:
        "Reduce expenses immediately and prioritize collections.",
      confidence: 98,
    });
  }

  // Profitability

  if (metrics.profitMargin < 10) {
    results.push({
      title: "Low Profit Margin",
      severity: "High",
      reason:
        "Profit margins are below healthy operating levels.",
      recommendation:
        "Review pricing strategy and reduce operating costs.",
      confidence: 95,
    });
  }

  // Collections

  if (metrics.receivableRatio > 30) {
    results.push({
      title: "High Outstanding Receivables",
      severity: "High",
      reason:
        "A significant portion of revenue is locked in unpaid invoices.",
      recommendation:
        "Focus on collecting overdue invoices before expanding spending.",
      confidence: 97,
    });
  }

  // Expense Control

  if (metrics.expenseRatio > 75) {
    results.push({
      title: "Expense Growth",
      severity: "Medium",
      reason:
        "Operating expenses consume a large share of revenue.",
      recommendation:
        "Review discretionary spending and supplier costs.",
      confidence: 92,
    });
  }

  return results;
}