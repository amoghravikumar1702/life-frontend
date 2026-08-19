export type FinancialMonth = {
  month: string;
  revenue: number;
  expenses: number;
};

export type FinancialAnalysis = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;

  cashInflow: number;
  cashOutflow: number;
  netCashFlow: number;

  periodStart: string | null;
  periodEnd: string | null;

  monthlyData: FinancialMonth[];
};

export async function getFinancialAnalysis(): Promise<FinancialAnalysis> {
  const response = await fetch(
    "/api/financial-analysis",
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    let message =
      "Unable to load financial analysis.";

    try {
      const body =
        await response.json();

      if (
        body &&
        typeof body.error ===
          "string"
      ) {
        message = body.error;
      }
    } catch {
      // Ignore invalid JSON responses.
    }

    throw new Error(
      `${message} (${response.status})`
    );
  }

  const data =
    (await response.json()) as FinancialAnalysis;

  return data;
}