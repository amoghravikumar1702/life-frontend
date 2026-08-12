export type RecommendationPriority =
  | "high"
  | "medium"
  | "low";

export interface Recommendation {
  priority: RecommendationPriority;
  title: string;
  description: string;
}

interface RecommendationInput {
  revenue: number;
  outstanding: number;
  healthScore: number;
  customerCount: number;
  invoiceCount: number;
  overdueInvoices: number;
  todaysCollections: number;
}

export function buildRecommendations({
  revenue,
  outstanding,
  healthScore,
  customerCount,
  invoiceCount,
  overdueInvoices,
  todaysCollections,
}: RecommendationInput): Recommendation[] {
  const recommendations: Recommendation[] = [];

  /* ---------------- Collections ---------------- */

  if (outstanding > revenue && outstanding > 0) {
    recommendations.push({
      priority: "high",
      title: "Collections Require Immediate Attention",
      description:
        "Outstanding receivables exceed recorded revenue. Prioritize collecting unpaid invoices to improve cash flow.",
    });
  }

  if (outstanding > 0 && outstanding <= revenue) {
    recommendations.push({
      priority: "medium",
      title: "Outstanding Invoices Pending",
      description:
        "Some invoices are still unpaid. Following up with customers will strengthen liquidity.",
    });
  }

  if (outstanding === 0) {
    recommendations.push({
      priority: "low",
      title: "Excellent Collections",
      description:
        "All invoices have been collected. Cash flow is currently healthy.",
    });
  }

  /* ---------------- Today's Payments ---------------- */

  if (todaysCollections > 0) {
    recommendations.push({
      priority: "low",
      title: "Revenue Increased Today",
      description: `₹${todaysCollections.toLocaleString(
        "en-IN"
      )} was collected today, improving available cash.`,
    });
  }

  /* ---------------- Health ---------------- */

  if (healthScore >= 90) {
    recommendations.push({
      priority: "low",
      title: "Business Health Excellent",
      description:
        "Your financial health remains strong. Continue maintaining healthy collections.",
    });
  }

  if (healthScore < 70) {
    recommendations.push({
      priority: "high",
      title: "Business Health Declining",
      description:
        "Cash flow and collections require attention. Reduce outstanding receivables.",
    });
  }

  /* ---------------- Customers ---------------- */

  if (customerCount < 5) {
    recommendations.push({
      priority: "medium",
      title: "Grow Customer Base",
      description:
        "Acquiring more customers will diversify revenue and reduce dependency.",
    });
  }

  /* ---------------- Invoices ---------------- */

  if (invoiceCount === 0) {
    recommendations.push({
      priority: "high",
      title: "No Invoices Created",
      description:
        "Start creating invoices to begin tracking revenue and collections.",
    });
  }

  if (overdueInvoices > 0) {
    recommendations.push({
      priority: "high",
      title: "Overdue Invoices Detected",
      description: `${overdueInvoices} invoice${
        overdueInvoices > 1 ? "s are" : " is"
      } overdue and should be followed up immediately.`,
    });
  }

  return recommendations.sort((a, b) => {
    const order = {
      high: 0,
      medium: 1,
      low: 2,
    };

    return order[a.priority] - order[b.priority];
  });
}