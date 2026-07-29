import { getFinancialSnapshot } from "@/lib/finance";

export interface FinancialAnalysis {
  revenue: number;
  expenses: number;
  profit: number;

  profitMargin: number;
  expenseRatio: number;
  cashRatio: number;
  receivableRatio: number;

  revenueGrowth: number;
  efficiencyScore: number;

  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export async function buildFinancialAnalysis(): Promise<FinancialAnalysis> {
  const snapshot = await getFinancialSnapshot();

  const revenue = snapshot.revenue;
  const expenses = snapshot.expenses;
  const profit = snapshot.profit;

  const profitMargin =
    revenue > 0
      ? (profit / revenue) * 100
      : 0;

  const expenseRatio =
    revenue > 0
      ? (expenses / revenue) * 100
      : 0;

  const cashRatio =
    revenue > 0
      ? (snapshot.cashAvailable / revenue) * 100
      : 0;

  const receivableRatio =
    revenue > 0
      ? (snapshot.outstandingReceivables / revenue) * 100
      : 0;

  const revenueGrowth = 0;

  let efficiencyScore = 100;

  efficiencyScore -= expenseRatio * 0.4;
  efficiencyScore -= receivableRatio * 0.3;

  efficiencyScore = Math.max(
    0,
    Math.min(100, Math.round(efficiencyScore))
  );

  const strengths: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];

  if (profitMargin >= 30) {
    strengths.push(
      "Profit margins are performing strongly."
    );
  } else if (profitMargin >= 15) {
    strengths.push(
      "Profitability remains healthy."
    );
  } else {
    risks.push(
      "Profit margins are below the desired level."
    );

    recommendations.push(
      "Review operational costs to improve margins."
    );
  }

  if (expenseRatio > 70) {
    risks.push(
      "Operating expenses are consuming a large portion of revenue."
    );

    recommendations.push(
      "Reduce discretionary spending and improve cost efficiency."
    );
  }

  if (receivableRatio > 25) {
    risks.push(
      "Outstanding receivables are limiting available cash."
    );

    recommendations.push(
      "Prioritize invoice collections to improve liquidity."
    );
  }

  if (cashRatio >= 50) {
    strengths.push(
      "Cash reserves remain healthy."
    );
  }

  return {
    revenue,
    expenses,
    profit,

    profitMargin,
    expenseRatio,
    cashRatio,
    receivableRatio,

    revenueGrowth,
    efficiencyScore,

    strengths,
    risks,
    recommendations,
  };
}