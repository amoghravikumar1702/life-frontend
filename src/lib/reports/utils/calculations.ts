export interface ProfitLossCalculation {
  revenue: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
}

export interface CashFlowCalculation {
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
}

export interface ReceivableCalculation {
  totalReceivable: number;
  overdueReceivable: number;
  collectionRate: number;
}

export function calculateProfitLoss(
  revenue: number,
  expenses: number
): ProfitLossCalculation {
  const grossProfit = revenue - expenses;

  const netProfit = grossProfit;

  const profitMargin =
    revenue === 0
      ? 0
      : Number(((netProfit / revenue) * 100).toFixed(2));

  return {
    revenue,
    expenses,
    grossProfit,
    netProfit,
    profitMargin,
  };
}

export function calculateCashFlow(
  cashIn: number,
  cashOut: number
): CashFlowCalculation {
  return {
    cashIn,
    cashOut,
    netCashFlow: cashIn - cashOut,
  };
}

export function calculateReceivables(
  outstanding: number,
  overdue: number,
  collected: number
): ReceivableCalculation {
  const total = outstanding + collected;

  const collectionRate =
    total === 0
      ? 0
      : Number(((collected / total) * 100).toFixed(2));

  return {
    totalReceivable: outstanding,
    overdueReceivable: overdue,
    collectionRate,
  };
}