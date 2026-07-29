import { getFinancialSnapshot } from "@/lib/finance";
import { buildForecast } from "./forecast";
import { buildFinancialAnalysis } from "./financial-analysis";

export interface DecisionAction {
  priority: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
  actionHref: string;
}

function formatCurrency(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export async function buildDecisionCenter(): Promise<DecisionAction[]> {
  const snapshot = await getFinancialSnapshot();

  const forecast = await buildForecast();

  const analysis = await buildFinancialAnalysis();

  const actions: DecisionAction[] = [];

  // Outstanding Receivables
  if (snapshot.outstandingReceivables > 0) {
    actions.push({
      priority: 5,
      title: "Collect Outstanding Invoices",
      description:
        "Outstanding receivables are limiting available cash flow.",
      impact: `Recover ${formatCurrency(
        snapshot.outstandingReceivables
      )}`,
      actionLabel: "View Invoices",
      actionHref: "/invoices",
    });
  }

  // High Expenses
  if (analysis.expenseRatio > 70) {
    actions.push({
      priority: 4,
      title: "Review Operating Expenses",
      description:
        "Expenses are consuming a large portion of revenue.",
      impact: "Improve profitability",
      actionLabel: "Financial Analysis",
      actionHref: "/dashboard/financial-analysis",
    });
  }

  // Low Cash Runway
  if (forecast.cashRunway < 6) {
    actions.push({
      priority: 4,
      title: "Strengthen Cash Position",
      description:
        "Current cash runway is below the recommended level.",
      impact: "Increase financial resilience",
      actionLabel: "Forecast",
      actionHref: "/dashboard/forecast",
    });
  }

  // Positive Growth
  if (forecast.growthConfidence >= 85) {
    actions.push({
      priority: 3,
      title: "Maintain Growth Strategy",
      description:
        "Current financial trends support continued expansion.",
      impact: "Sustain business momentum",
      actionLabel: "View Forecast",
      actionHref: "/dashboard/forecast",
    });
  }

  // Default State
  if (actions.length === 0) {
    actions.push({
      priority: 1,
      title: "Business Performing Well",
      description:
        "No urgent financial actions require attention today.",
      impact: "Maintain current performance",
      actionLabel: "Open Dashboard",
      actionHref: "/dashboard",
    });
  }

  return actions.sort(
    (a, b) => b.priority - a.priority
  );
}