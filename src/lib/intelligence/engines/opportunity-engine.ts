export interface GrowthOpportunity {
  title: string;
  description: string;
  expectedImpact: string;
  confidence: number;
}

interface OpportunityInput {
  revenue: number;
  expenses: number;
  receivables: number;
  customerCount: number;
  profitMargin: number;
}

export function identifyGrowthOpportunities(
  input: OpportunityInput
): GrowthOpportunity[] {
  const opportunities: GrowthOpportunity[] = [];

  if (input.receivables > 0) {
    opportunities.push({
      title: "Accelerate Collections",
      description:
        "Reduce outstanding receivables using payment reminders and faster follow-ups.",
      expectedImpact:
        "Improves cash flow and working capital.",
      confidence: 97,
    });
  }

  if (input.profitMargin < 20) {
    opportunities.push({
      title: "Improve Profit Margins",
      description:
        "Review pricing strategy and identify unnecessary operating expenses.",
      expectedImpact:
        "Higher profitability without increasing sales volume.",
      confidence: 94,
    });
  }

  if (input.customerCount > 10) {
    opportunities.push({
      title: "Increase Customer Lifetime Value",
      description:
        "Upsell existing customers and encourage repeat purchases.",
      expectedImpact:
        "Higher recurring revenue with lower acquisition cost.",
      confidence: 92,
    });
  }

  if (opportunities.length === 0) {
    opportunities.push({
      title: "Maintain Current Performance",
      description:
        "Financial indicators are healthy. Continue monitoring key metrics.",
      expectedImpact:
        "Sustained financial stability.",
      confidence: 90,
    });
  }

  return opportunities;
}