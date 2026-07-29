export interface BusinessMetricsInput {
  revenue: number;
  expenses: number;
  cash: number;
  receivables: number;
  overdueInvoices: number;
  customerCount: number;
  invoiceCount: number;
}

export interface BusinessMetrics {
  profit: number;

  profitMargin: number;

  expenseRatio: number;

  receivableRatio: number;

  averageRevenuePerCustomer: number;

  averageInvoiceValue: number;

  cashCoverage: number;

  collectionRate: number;

  operatingMargin: number;

  burnRate: number;

  monthlyRunway: number;
}

export function calculateBusinessMetrics(
  input: BusinessMetricsInput
): BusinessMetrics {

  const profit =
    input.revenue - input.expenses;

  const profitMargin =
    input.revenue > 0
      ? (profit / input.revenue) * 100
      : 0;

  const expenseRatio =
    input.revenue > 0
      ? (input.expenses / input.revenue) * 100
      : 0;

  const receivableRatio =
    input.revenue > 0
      ? (input.receivables / input.revenue) * 100
      : 0;

  const averageRevenuePerCustomer =
    input.customerCount > 0
      ? input.revenue /
        input.customerCount
      : 0;

  const averageInvoiceValue =
    input.invoiceCount > 0
      ? input.revenue /
        input.invoiceCount
      : 0;

  const cashCoverage =
    input.expenses > 0
      ? input.cash /
        input.expenses
      : 0;

  const collectionRate =
    input.revenue > 0
      ? (
          (input.revenue -
            input.receivables) /
          input.revenue
        ) *
        100
      : 0;

  const operatingMargin =
    profitMargin;

  const burnRate =
    Math.max(
      input.expenses -
        input.revenue,
      0
    );

  const monthlyRunway =
    burnRate > 0
      ? input.cash /
        burnRate
      : 12;

  return {

    profit,

    profitMargin,

    expenseRatio,

    receivableRatio,

    averageRevenuePerCustomer,

    averageInvoiceValue,

    cashCoverage,

    collectionRate,

    operatingMargin,

    burnRate,

    monthlyRunway,

  };
}