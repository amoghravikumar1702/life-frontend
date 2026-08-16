// src/components/Dashboard/mission-control/MissionControl.tsx

import BusinessPulse from "./BusinessPulse";
import { getFinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

export default async function MissionControl() {
  const financialSnapshot = await getFinancialSnapshot();

  const snapshot = {
    revenue: financialSnapshot.revenue,
    expenses: financialSnapshot.expenses,
    profit: financialSnapshot.profit,

    // These are not part of the current FinancialSnapshot.
    // Keep them at safe MVP defaults until their real data
    // source is connected.
    cashAvailable: financialSnapshot.revenue - financialSnapshot.expenses,

    outstandingReceivables:
      financialSnapshot.outstandingReceivables,

    customerCount: 0,

    healthScore:
      financialSnapshot.revenue > 0
        ? Math.max(
            0,
            Math.min(
              100,
              Math.round(
                (financialSnapshot.profit /
                  financialSnapshot.revenue) *
                  100
              )
            )
          )
        : 0,

    trend:
      financialSnapshot.profit > 0
        ? ("Improving" as const)
        : financialSnapshot.profit < 0
          ? ("Declining" as const)
          : ("Stable" as const),
  };

  return <BusinessPulse snapshot={snapshot} />;
}