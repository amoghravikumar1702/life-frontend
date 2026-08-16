// src/lib/intelligence/calculateHealthScore.ts

import type { FinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

function safeNumber(value: unknown): number {
  const number = Number(value ?? 0);

  return Number.isFinite(number) ? number : 0;
}

export function calculateHealthScore(
  snapshot: FinancialSnapshot
): number {
  let score = 100;

  const revenue = safeNumber(snapshot.revenue);
  const expenses = safeNumber(snapshot.expenses);
  const profit = safeNumber(snapshot.profit);
  const receivables = safeNumber(
    snapshot.outstandingReceivables
  );

  /*
   * ============================================================
   * PROFITABILITY
   * ============================================================
   */

  if (revenue <= 0) {
    score -= 20;
  } else {
    const profitMargin =
      (profit / revenue) * 100;

    if (profitMargin < 0) {
      score -= 35;
    } else if (profitMargin < 10) {
      score -= 20;
    } else if (profitMargin < 20) {
      score -= 10;
    }
  }

  /*
   * ============================================================
   * EXPENSE PRESSURE
   * ============================================================
   */

  if (revenue > 0) {
    const expenseRatio =
      expenses / revenue;

    if (expenseRatio > 0.9) {
      score -= 20;
    } else if (expenseRatio > 0.75) {
      score -= 12;
    } else if (expenseRatio > 0.6) {
      score -= 6;
    }
  }

  /*
   * ============================================================
   * RECEIVABLE PRESSURE
   * ============================================================
   */

  if (revenue > 0) {
    const receivableRatio =
      receivables / revenue;

    if (receivableRatio > 0.3) {
      score -= 15;
    } else if (receivableRatio > 0.15) {
      score -= 8;
    }
  }

  /*
   * ============================================================
   * OVERDUE INVOICES
   * ============================================================
   *
   * FinancialSnapshot currently does not expose an
   * overdueInvoices field.
   *
   * We therefore do not penalize the score using a field
   * that does not exist.
   *
   * Outstanding receivables are already accounted for above.
   */

  /*
   * ============================================================
   * FINAL SCORE
   * ============================================================
   */

  return Math.max(
    0,
    Math.min(
      Math.round(score),
      100
    )
  );
}