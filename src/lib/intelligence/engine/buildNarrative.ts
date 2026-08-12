import { BusinessAnalysis } from "./types";

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function buildNarrative(
  analysis: BusinessAnalysis
) {
  const s = analysis.snapshot;

  // Brand new business
  if (s.revenue === 0) {
    return "Welcome to ArkenOne. Your business hasn't generated revenue yet, so your immediate focus should be creating your first invoices and converting them into cash. Every successful collection builds the financial foundation of your business.";
  }

  // Critical state
  if (analysis.state === "critical") {
    return `Your business needs immediate financial attention. ${money(
      s.receivables
    )} remains tied up in unpaid invoices, restricting available cash. Recovering these payments should take priority before increasing expenses or making new investments.`;
  }

  // Collections are the biggest issue
  if (analysis.priority === "collections") {
    return `Revenue has reached ${money(
      s.revenue
    )}, but ${money(
      s.receivables
    )} is still awaiting collection. Recovering these outstanding payments will have the greatest impact on improving liquidity and strengthening your financial position today.`;
  }

  // Growth is the priority
  if (analysis.priority === "growth") {
    return `Your finances are stable, but growth is now the biggest opportunity. Focus on acquiring more customers and increasing invoice value to build stronger recurring revenue.`;
  }

  // Cash flow is weak
  if (analysis.priority === "cashflow") {
    return `Revenue generation is healthy, but available cash is lower than expected. Maintaining tighter control over spending while improving collections will strengthen day-to-day financial stability.`;
  }

  // Excellent business
  if (analysis.state === "excellent") {
    return `Your business is in an excellent financial position. Revenue is growing, collections remain strong, and cash flow is healthy. This is a good time to focus on sustainable growth rather than financial recovery.`;
  }

  // Healthy business
  if (analysis.state === "healthy") {
    return `Your business is financially healthy with steady revenue and manageable receivables. Continue maintaining collection discipline while focusing on growing sales and strengthening customer relationships.`;
  }

  // Stable business
  return `Your business is operating steadily. There are no immediate financial risks, but improving collections and increasing revenue should remain your focus over the coming weeks.`;
}