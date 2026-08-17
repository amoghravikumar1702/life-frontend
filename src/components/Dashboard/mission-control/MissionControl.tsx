// src/components/Dashboard/mission-control/MissionControl.tsx

import BusinessPulse from "./BusinessPulse";
import { getFinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

export default async function MissionControl() {
  const financialSnapshot = await getFinancialSnapshot();

  const revenue = financialSnapshot.revenue;
  const expenses = financialSnapshot.expenses;
  const profit = financialSnapshot.profit;

  const snapshot = {
    revenue,
    expenses,
    profit,

    // MVP cash proxy.
    // This is NOT actual bank cash.
    cashAvailable: revenue - expenses,

    outstandingReceivables:
      financialSnapshot.outstandingReceivables,

    customerCount:
      financialSnapshot.customerCount,

    healthScore:
      financialSnapshot.healthScore,

    trend:
      financialSnapshot.trend,
  };

  return <BusinessPulse snapshot={snapshot} />;
}