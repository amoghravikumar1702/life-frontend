// src/lib/ai/generateExecutiveSummary.ts

import { getFinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

function money(value: number): string {
  const amount = Number(value ?? 0);

  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  }

  if (amount >= 100_000) {
    return `₹${Math.round(amount / 100_000)}L`;
  }

  if (amount >= 1_000) {
    return `₹${Math.round(amount / 1_000)}K`;
  }

  return `₹${Math.round(amount)}`;
}

export async function generateExecutiveSummary() {
  const snapshot = await getFinancialSnapshot();

  const {
    revenue,
    expenses,
    profit,
    outstandingReceivables,
    invoiceCount,
    expenseCount,
  } = snapshot;

  const profitMargin =
    revenue > 0
      ? Math.round((profit / revenue) * 100)
      : 0;

  const receivablesRatio =
    revenue > 0
      ? Math.round(
          (outstandingReceivables / revenue) * 100
        )
      : 0;

  let headline = "Your business is getting started.";

  if (profit > 0 && profitMargin >= 30) {
    headline =
      "Your business is operating with a healthy profit margin.";
  } else if (profit > 0) {
    headline =
      "Your business is profitable, but there is room to improve margins.";
  } else if (profit < 0) {
    headline =
      "Your expenses are currently higher than recorded revenue.";
  } else if (revenue > 0) {
    headline =
      "Revenue is being recorded, but there is currently no operating profit.";
  }

  const insights: string[] = [];

  if (revenue === 0) {
    insights.push(
      "No recorded revenue is currently available."
    );
  }

  if (expenses > 0) {
    insights.push(
      `Recorded expenses are ${money(expenses)}.`
    );
  }

  if (profit > 0) {
    insights.push(
      `Current operating profit is ${money(profit)} with a ${profitMargin}% margin.`
    );
  }

  if (profit < 0) {
    insights.push(
      `Current operating loss is ${money(
        Math.abs(profit)
      )}.`
    );
  }

  if (outstandingReceivables > 0) {
    insights.push(
      `${money(
        outstandingReceivables
      )} remains outstanding from customers.`
    );
  }

  if (invoiceCount > 0) {
    insights.push(
      `${invoiceCount} invoice${
        invoiceCount === 1 ? "" : "s"
      } recorded.`
    );
  }

  if (expenseCount > 0) {
    insights.push(
      `${expenseCount} expense${
        expenseCount === 1 ? "" : "s"
      } recorded.`
    );
  }

  return {
    headline,

    summary: headline,

    metrics: {
      revenue,
      expenses,
      profit,
      outstandingReceivables,
      profitMargin,
      invoiceCount,
      expenseCount,
    },

    insights,
  };
}