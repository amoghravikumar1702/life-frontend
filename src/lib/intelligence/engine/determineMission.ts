import {
  BusinessAnalysis,
  Mission,
} from "./types";

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function determineMission(
  analysis: BusinessAnalysis
): Mission {
  const s = analysis.snapshot;

  // Collections are the priority
  if (analysis.priority === "collections") {
    return {
      title: "Recover Outstanding Receivables",

      description: `Collect ${money(
        s.receivables
      )} in unpaid invoices. Improving collections today will immediately strengthen cash flow and increase available working capital.`,

      amount: s.receivables,

      impact: `Recover ${money(
        s.receivables
      )} and improve your cash position today.`,
    };
  }

  // Growth is the priority
  if (analysis.priority === "growth") {
    return {
      title: "Acquire New Customers",

      description:
        "Your finances are stable. The biggest opportunity now is expanding your customer base and generating additional revenue.",

      amount: s.customerCount,

      impact:
        "Increase recurring revenue and reduce dependency on existing customers.",
    };
  }

  // Cash flow is weak
  if (analysis.priority === "cashflow") {
    return {
      title: "Strengthen Cash Flow",

      description:
        "Available cash is lower than expected. Focus on controlling spending while improving collections over the coming days.",

      amount: s.cash,

      impact:
        "Build stronger liquidity and improve day-to-day financial stability.",
    };
  }

  // Business is healthy
  return {
    title: "Maintain Growth Momentum",

    description:
      "Your business is financially healthy. Continue growing revenue while maintaining excellent collection discipline.",

    amount: s.revenue,

    impact:
      "Maintain a strong financial position while scaling the business.",
  };
}