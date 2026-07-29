import {
  calculateBusinessMetrics,
} from "./core/metrics";

import {
  evaluateFinancialHealth,
} from "./engines/health-engine";

interface LegacySnapshot {
  revenue: number;
  expenses: number;
  outstandingReceivables: number;
  overdueInvoices: number;
  customerCount: number;
  invoiceCount: number;
}

export function calculateHealthScore(
  snapshot: LegacySnapshot
) {
  const metrics =
    calculateBusinessMetrics({
      revenue: snapshot.revenue,
      expenses: snapshot.expenses,

      // Temporary fallback until we expose real cash
      cash: Math.max(
        snapshot.revenue - snapshot.expenses,
        0
      ),

      receivables:
        snapshot.outstandingReceivables,

      overdueInvoices:
        snapshot.overdueInvoices,

      customerCount:
        snapshot.customerCount,

      invoiceCount:
        snapshot.invoiceCount,
    });

  return evaluateFinancialHealth(metrics)
    .overall;
}