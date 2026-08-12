import { BusinessAnalysis } from "./types";

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function generateRecommendation(
  analysis: BusinessAnalysis
) {
  const s = analysis.snapshot;

  // Business hasn't started yet
  if (s.revenue === 0) {
    return "Your immediate objective is generating your first revenue. Focus on creating invoices, winning customers, and establishing a healthy cash flow from the very beginning.";
  }

  // Collections are the biggest issue
  if (analysis.priority === "collections") {
    return `Recover ${money(
      s.receivables
    )} before committing to new spending. Improving collections is the fastest way to strengthen liquidity and create flexibility for future growth.`;
  }

  // Cash flow is weak
  if (analysis.priority === "cashflow") {
    return "Cash flow is tighter than expected. Delay discretionary expenses, prioritise incoming payments, and preserve working capital until liquidity improves.";
  }

  // Growth should be the focus
  if (analysis.priority === "growth") {
    return "Your financial position is stable enough to focus on expansion. Invest your time in acquiring new customers, increasing invoice values, and building recurring revenue.";
  }

  // Excellent business
  if (analysis.state === "excellent") {
    return "Your business is operating from a position of strength. Continue maintaining collection discipline while investing in sustainable growth opportunities rather than unnecessary cost reductions.";
  }

  // Healthy business
  if (analysis.state === "healthy") {
    return "Maintain steady collections, control operational expenses, and continue growing revenue. Consistency is the best way to strengthen your long-term financial position.";
  }

  // Stable business
  return "Your business is stable but has room for improvement. Focus on increasing cash reserves, reducing outstanding receivables, and gradually improving profitability.";
}