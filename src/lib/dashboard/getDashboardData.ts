import { getFinancialSnapshot } from "@/lib/finance";
import { generateExecutiveSummary } from "@/lib/ai/generateExecutiveSummary";

export async function getDashboardData() {
  const snapshot = await getFinancialSnapshot();

  const executiveSummary =
    generateExecutiveSummary(snapshot);

  return {
    snapshot,
    executiveSummary,
  };
}