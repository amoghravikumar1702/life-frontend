import { FinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

export function calculateHealthScore(
  snapshot: FinancialSnapshot
) {
  let score = 100;

  const receivableRatio =
    snapshot.revenue > 0
      ? snapshot.outstandingReceivables /
        snapshot.revenue
      : 0;

  if (receivableRatio > 0.40) score -= 30;
  else if (receivableRatio > 0.25) score -= 15;
  else if (receivableRatio > 0.15) score -= 8;

  score -= snapshot.overdueInvoices * 3;

  score = Math.max(0, Math.min(score, 100));

  return score;
}