import { getFinancialSnapshot } from "@/lib/finance";

import {
  calculateBusinessMetrics,
} from "../core/metrics";

import {
  evaluateFinancialHealth,
} from "../engines/health-engine";

export async function buildBusinessHealth() {
  const snapshot =
    await getFinancialSnapshot();

  const metrics =
    calculateBusinessMetrics({
      revenue: snapshot.revenue,
      expenses: snapshot.expenses,
      cash: snapshot.cashAvailable,
      receivables:
        snapshot.outstandingReceivables,
      overdueInvoices:
        snapshot.overdueInvoices,
      customerCount:
        snapshot.customerCount,
      invoiceCount:
        snapshot.invoiceCount,
    });

  const health =
    evaluateFinancialHealth(metrics);

  return {
    snapshot,
    metrics,
    health,
  };
}