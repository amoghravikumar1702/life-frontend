import { ExecutiveReport } from "@/lib/cfo/types";

export function buildFallbackExecutiveAnalysis(
  report: ExecutiveReport
) {
  const {
    finance,
    customers,
  } = report;

  const priorities: {
    title: string;
    description: string;
    urgency: string;
  }[] = [];

  const growthOpportunities: {
    title: string;
    description: string;
    expectedImpact: string;
  }[] = [];

  const businessRisks: {
    title: string;
    severity: string;
    description: string;
    recommendation: string;
  }[] = [];

  if (finance.outstandingReceivables > 0) {
    priorities.push({
      title: "Reduce Outstanding Receivables",
      urgency: "High",
      description:
        "Outstanding customer payments are reducing available cash flow. Prioritise collections and follow-ups.",
    });

    businessRisks.push({
      title: "Cash Flow Pressure",
      severity: "High",
      description:
        "Large outstanding receivables could affect short-term liquidity.",
      recommendation:
        "Focus on invoice collections before increasing expenses.",
    });
  }

  if (finance.expenses > finance.revenue) {
    priorities.push({
      title: "Control Expenses",
      urgency: "High",
      description:
        "Business expenses currently exceed revenue.",
    });

    businessRisks.push({
      title: "Negative Cash Position",
      severity: "Critical",
      description:
        "Current spending is higher than incoming revenue.",
      recommendation:
        "Reduce discretionary spending and improve revenue generation.",
    });
  }

  if (customers.totalCustomers > 0) {
    growthOpportunities.push({
      title: "Increase Customer Lifetime Value",
      description:
        "Existing customers provide an opportunity for upselling and repeat business.",
      expectedImpact:
        "Higher recurring revenue with minimal acquisition cost.",
    });

    growthOpportunities.push({
      title: "Strengthen Customer Collections",
      description:
        "Improve payment follow-ups and automate reminders to reduce collection delays.",
      expectedImpact:
        "Improved liquidity and faster cash conversion.",
    });
  }

  return {
    data: {
      executiveSummary:
        "AI analysis is temporarily unavailable. This report has been generated using DhanarkOS's built-in financial intelligence engine.",

      financialAnalysis: `Current revenue is ₹${finance.revenue.toLocaleString(
        "en-IN"
      )} with expenses of ₹${finance.expenses.toLocaleString(
        "en-IN"
      )}. Outstanding receivables total ₹${finance.outstandingReceivables.toLocaleString(
        "en-IN"
      )}. Continue monitoring collections and maintain healthy operating cash flow.`,

      topPriorities: priorities,

      growthOpportunities,

      businessRisks,

      finalRecommendation:
        "Improve liquidity by reducing outstanding receivables, maintain expense discipline and continue monitoring financial performance until AI analysis becomes available.",
    },
  };
}