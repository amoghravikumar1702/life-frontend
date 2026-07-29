export interface FinancialBenchmark {
  excellent: number;
  healthy: number;
  warning: number;
}

export const FinancialBenchmarks = {
  profitMargin: {
    excellent: 25,
    healthy: 15,
    warning: 8,
  },

  receivableRatio: {
    excellent: 10,
    healthy: 20,
    warning: 35,
  },

  expenseRatio: {
    excellent: 50,
    healthy: 65,
    warning: 80,
  },

  cashCoverageMonths: {
    excellent: 6,
    healthy: 3,
    warning: 1,
  },
};