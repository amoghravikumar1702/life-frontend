import { getFinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

export async function getDashboardData() {
  const snapshot = await getFinancialSnapshot();

  return {
    snapshot,
  };
}