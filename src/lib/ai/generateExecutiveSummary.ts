import { FinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function generateExecutiveSummary(
  snapshot: FinancialSnapshot
) {
  const {
    revenue,
    expenses,
    profit,
    cashAvailable,
    outstandingReceivables,
    customerCount,
    invoiceCount,
    paymentCount,
    healthScore,
    trend,
  } = snapshot;

  /*
   * ==========================================================
   * CORE FINANCIAL RATIOS
   * ==========================================================
   */

  const profitMargin =
    revenue > 0
      ? (profit / revenue) * 100
      : 0;

  const expenseRatio =
    revenue > 0
      ? (expenses / revenue) * 100
      : 0;

  const receivableRatio =
    revenue > 0
      ? (outstandingReceivables / revenue) * 100
      : 0;

  /*
   * ==========================================================
   * LIQUIDITY
   * ==========================================================
   */

  let liquidity = "healthy";

  if (receivableRatio > 50) {
    liquidity = "under significant pressure";
  } else if (receivableRatio > 35) {
    liquidity = "under pressure";
  } else if (receivableRatio > 20) {
    liquidity = "stable but requires attention";
  }

  /*
   * ==========================================================
   * PROFITABILITY STATUS
   * ==========================================================
   */

  let profitability = "profitable";

  if (revenue === 0) {
    profitability = "not yet generating recorded revenue";
  } else if (profit < 0) {
    profitability = "operating at a loss";
  } else if (profitMargin < 10) {
    profitability = "profitable with a thin margin";
  } else if (profitMargin < 20) {
    profitability = "moderately profitable";
  } else {
    profitability = "strongly profitable";
  }

  /*
   * ==========================================================
   * EXPENSE STATUS
   * ==========================================================
   */

  let expenseStatus = "controlled";

  if (expenseRatio > 90) {
    expenseStatus = "extremely high relative to revenue";
  } else if (expenseRatio > 75) {
    expenseStatus = "high relative to revenue";
  } else if (expenseRatio > 60) {
    expenseStatus = "elevated";
  } else if (expenseRatio > 45) {
    expenseStatus = "moderate";
  }

  /*
   * ==========================================================
   * STRENGTHS
   * ==========================================================
   */

  const strengths: string[] = [];

  if (profit > 0) {
    strengths.push(
      `The business is generating a positive profit of ₹${formatCurrency(
        profit
      )}.`
    );
  }

  if (profitMargin >= 20) {
    strengths.push(
      `Profit margin is ${formatPercent(
        profitMargin
      )}, indicating strong operating profitability.`
    );
  } else if (profitMargin >= 10) {
    strengths.push(
      `Profit margin is ${formatPercent(
        profitMargin
      )}, providing a positive operating cushion.`
    );
  }

  if (expenseRatio < 45 && revenue > 0) {
    strengths.push(
      `Expenses represent only ${formatPercent(
        expenseRatio
      )} of revenue, indicating relatively controlled operating costs.`
    );
  }

  if (
    revenue > 0 &&
    receivableRatio < 20
  ) {
    strengths.push(
      `Outstanding receivables are limited to ${formatPercent(
        receivableRatio
      )} of revenue, supporting healthier liquidity.`
    );
  }

  if (customerCount > 0) {
    strengths.push(
      `The business has ${customerCount} recorded customer relationships supporting its revenue base.`
    );
  }

  if (paymentCount > 0) {
    strengths.push(
      `${paymentCount} recorded payments demonstrate active cash collection activity.`
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "Financial data is still being established. Continue recording revenue, expenses and collections to build a reliable financial picture."
    );
  }

  /*
   * ==========================================================
   * RISKS
   * ==========================================================
   */

  const risks: string[] = [];

  if (profit < 0) {
    risks.push(
      `The business is currently operating at a loss of ₹${formatCurrency(
        Math.abs(profit)
      )}.`
    );
  }

  if (
    revenue > 0 &&
    profitMargin >= 0 &&
    profitMargin < 10
  ) {
    risks.push(
      `Profit margin is only ${formatPercent(
        profitMargin
      )}, leaving limited room for unexpected costs.`
    );
  }

  if (expenseRatio > 75) {
    risks.push(
      `Expenses consume ${formatPercent(
        expenseRatio
      )} of revenue, creating significant pressure on profitability.`
    );
  } else if (expenseRatio > 60) {
    risks.push(
      `Expenses consume ${formatPercent(
        expenseRatio
      )} of revenue and should be monitored closely.`
    );
  }

  if (receivableRatio > 50) {
    risks.push(
      `Outstanding receivables of ₹${formatCurrency(
        outstandingReceivables
      )} represent ${formatPercent(
        receivableRatio
      )} of revenue and create significant collection risk.`
    );
  } else if (receivableRatio > 35) {
    risks.push(
      `Outstanding receivables represent ${formatPercent(
        receivableRatio
      )} of revenue, putting pressure on short-term liquidity.`
    );
  } else if (receivableRatio > 20) {
    risks.push(
      `Receivables represent ${formatPercent(
        receivableRatio
      )} of revenue and should be actively followed up.`
    );
  }

  if (invoiceCount > 0 && paymentCount === 0) {
    risks.push(
      "Invoices exist but no recorded payments are currently available, so cash conversion should be verified."
    );
  }

  if (revenue === 0) {
    risks.push(
      "No recorded revenue is currently available, so profitability and financial health cannot yet be assessed reliably."
    );
  }

  if (risks.length === 0) {
    risks.push(
      "No major financial risks are currently visible from the recorded data."
    );
  }

  /*
   * ==========================================================
   * PRIORITY
   * ==========================================================
   */

  let priority: string;

  if (profit < 0) {
    priority =
      `Reduce operating costs and improve revenue generation to eliminate the current ₹${formatCurrency(
        Math.abs(profit)
      )} loss.`;
  } else if (receivableRatio > 35) {
    priority =
      `Recover ₹${formatCurrency(
        outstandingReceivables
      )} in outstanding receivables to strengthen liquidity.`;
  } else if (expenseRatio > 75) {
    priority =
      `Review the ₹${formatCurrency(
        expenses
      )} expense base and identify costs that can be reduced without affecting revenue generation.`;
  } else if (profitMargin < 10 && revenue > 0) {
    priority =
      "Improve margins by increasing pricing, collections, or operating efficiency.";
  } else {
    priority =
      "Maintain collection discipline while continuing to grow profitable revenue.";
  }

  /*
   * ==========================================================
   * IMPACT
   * ==========================================================
   */

  let impact: string;

  if (profit < 0) {
    impact =
      "Improving profitability is the immediate priority because continued losses will reduce available working capital.";
  } else if (receivableRatio > 35) {
    impact =
      "Improving collections will convert outstanding sales into usable cash and strengthen short-term working capital.";
  } else if (expenseRatio > 75) {
    impact =
      "Reducing unnecessary operating costs can materially improve profit without requiring additional revenue.";
  } else {
    impact =
      "Maintaining healthy margins and disciplined collections will give the business greater capacity to reinvest and grow.";
  }

  /*
   * ==========================================================
   * EXECUTIVE SUMMARY
   * ==========================================================
   */

  const summary =
    revenue === 0
      ? `ArkenOne currently has ₹0 in recorded revenue. The business has ${customerCount} customers, ${invoiceCount} invoices and ${paymentCount} recorded payments. Financial intelligence will become more accurate as revenue and expense activity is recorded.`
      : `Revenue stands at ₹${formatCurrency(
          revenue
        )}, against ₹${formatCurrency(
          expenses
        )} in recorded expenses, producing a ${profit >= 0 ? "profit" : "loss"} of ₹${formatCurrency(
          Math.abs(profit)
        )}. Profit margin is ${formatPercent(
          profitMargin
        )}. ₹${formatCurrency(
          outstandingReceivables
        )} remains outstanding, representing ${formatPercent(
          receivableRatio
        )} of revenue. Overall liquidity is ${liquidity} and the business is currently ${profitability}.`;

  /*
   * ==========================================================
   * RETURN
   * ==========================================================
   */

  return {
    title: "Executive Financial Brief",

    summary,

    priority,

    impact,

    strengths,

    risks,

    recommendations: [
      priority,
      impact,
      `Monitor the ${formatPercent(
        expenseRatio
      )} expense-to-revenue ratio.`,
      `Maintain visibility over ₹${formatCurrency(
        outstandingReceivables
      )} in outstanding receivables.`,
    ],

    metrics: {
      revenue,
      expenses,
      profit,
      profitMargin,
      cashAvailable,
      outstandingReceivables,
      receivableRatio,
      expenseRatio,
      healthScore,
      trend,
    },
  };
}