import { FinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateExecutiveSummary(
  snapshot: FinancialSnapshot
) {
  const {
    revenue,
    outstandingReceivables,
    customerCount,
    invoiceCount,
  } = snapshot;

  const receivablePercentage =
    revenue > 0
      ? (outstandingReceivables / revenue) * 100
      : 0;

  let liquidity = "healthy";

  if (receivablePercentage > 35) {
    liquidity = "under pressure";
  } else if (receivablePercentage > 20) {
    liquidity = "stable";
  }

  return {
    title: "Executive Financial Brief",

    summary: `Revenue has reached ₹${formatCurrency(
      revenue
    )} with ₹${formatCurrency(
      outstandingReceivables
    )} currently awaiting collection. Outstanding receivables represent ${receivablePercentage.toFixed(
      1
    )}% of total revenue, indicating that liquidity remains ${liquidity}. Your business currently manages ${customerCount} customer relationships across ${invoiceCount} invoices.`,

    priority: `Recover ₹${formatCurrency(
      outstandingReceivables
    )} in outstanding receivables.`,

    impact:
      "Improving collections today will strengthen short-term cash flow and increase available working capital.",
  };
}