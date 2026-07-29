import { FinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

export function generateRecommendations(
  snapshot: FinancialSnapshot
) {
  const recommendations: string[] = [];

  if (
    snapshot.outstandingReceivables >
    snapshot.revenue * 0.20
  ) {
    recommendations.push(
      "Outstanding receivables are becoming significant. Prioritize customer collections."
    );
  }

  if (snapshot.overdueInvoices > 0) {
    recommendations.push(
      "Follow up on overdue invoices to protect cash flow."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Financial performance remains stable. Continue monitoring collections."
    );
  }

  return recommendations;
}