import { getFinancialSnapshot } from "@/lib/finance";
import {
  getRevenueHistory,
  RevenueHistoryPoint,
} from "@/lib/finance/revenue-history";

export interface ForecastChartPoint {
  month: string;
  actual?: number;
  projected?: number;
}

export interface ForecastAnalysis {
  projectedRevenue: number;
  projectedProfit: number;
  projectedCash: number;

  cashRunway: number;
  growthConfidence: number;

  trend: "Growing" | "Stable" | "Declining";

  summary: string;

  recommendations: string[];

  chartData: ForecastChartPoint[];
}

export async function buildForecast(): Promise<ForecastAnalysis> {
  const snapshot = await getFinancialSnapshot();

  const history: RevenueHistoryPoint[] =
    await getRevenueHistory();

  const revenue = snapshot.revenue;
  const expenses = snapshot.expenses;
  const cash = snapshot.cashAvailable;
  const receivables =
    snapshot.outstandingReceivables;

  const projectedRevenue = revenue * 1.08;

  const projectedProfit =
    projectedRevenue - expenses;

  const projectedCash =
    cash + projectedRevenue * 0.35;

  const burn =
    Math.max(expenses - revenue, 1);

  const cashRunway =
    burn <= 1 ? 24 : cash / burn;

  let growthConfidence = 90;

  if (receivables > revenue * 0.30)
    growthConfidence -= 20;

  if (expenses > revenue * 0.75)
    growthConfidence -= 15;

  growthConfidence = Math.max(
    40,
    Math.min(98, Math.round(growthConfidence))
  );

  let trend: ForecastAnalysis["trend"] =
    "Stable";

  if (projectedRevenue > revenue * 1.05)
    trend = "Growing";

  if (projectedProfit < 0)
    trend = "Declining";

  const recommendations: string[] = [];

  if (receivables > revenue * 0.25) {
    recommendations.push(
      "Accelerate invoice collections to improve projected cash flow."
    );
  }

  if (expenses > revenue * 0.70) {
    recommendations.push(
      "Monitor operating expenses to protect future profitability."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Current financial performance supports steady business growth."
    );
  }

  let summary =
    "Business performance indicates stable financial momentum.";

  if (trend === "Growing") {
    summary =
      "Current trends indicate continued revenue growth.";
  }

  if (trend === "Declining") {
    summary =
      "Current trends indicate slowing financial performance.";
  }

  const chartData: ForecastChartPoint[] =
    history.map((item) => ({
      month: item.month,
      actual: item.revenue,
    }));

  if (chartData.length > 0) {
    chartData.push({
      month: "Forecast",
      projected: projectedRevenue,
    });
  }

  return {
    projectedRevenue,

    projectedProfit,

    projectedCash,

    cashRunway,

    growthConfidence,

    trend,

    summary,

    recommendations,

    chartData,
  };
}