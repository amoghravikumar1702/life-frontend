// src/lib/finance/getFinancialSnapshot.ts

import { createClient } from "@/lib/supabase/server";

/*
 * ============================================================
 * ARKENONE — FINANCIAL SNAPSHOT
 * ============================================================
 *
 * This file is intentionally calculated directly from Supabase
 * instead of depending on the get_financial_snapshot RPC.
 *
 * Current database schema:
 *
 * invoices
 *   - total
 *   - amount_paid
 *   - balance_due
 *   - due_date
 *   - status
 *   - owner_id
 *
 * expenses
 *   - amount
 *   - expense_date
 *   - owner_id
 *
 * customers
 *   - owner_id
 *
 * payments
 *   - owner_id
 *
 * IMPORTANT:
 *
 * "revenue" = collected invoice revenue
 * "outstandingReceivables" = unpaid invoice balances
 *
 * This prevents unpaid invoices from being treated as cash.
 */

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

export type FinancialStrength = {
  title: string;
  description: string;
};

export type FinancialRisk = {
  title: string;
  description: string;
};

export type FinancialSnapshot = {
  revenue: number;
  expenses: number;
  profit: number;
  cashAvailable: number;

  outstandingReceivables: number;
  overdueInvoices: number;

  customerCount: number;
  invoiceCount: number;
  paymentCount: number;

  healthScore: number;

  trend:
    | "Improving"
    | "Stable"
    | "Declining";

  profitMargin: number;
  receivablePercentage: number;
  expensePercentage: number;

  strengths: FinancialStrength[];
  risks: FinancialRisk[];
};

/*
 * ============================================================
 * SAFE NUMBER
 * ============================================================
 */

function safeNumber(
  value: unknown
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

/*
 * ============================================================
 * SAFE NON-NEGATIVE NUMBER
 * ============================================================
 */

function safeNonNegativeNumber(
  value: unknown
): number {
  return Math.max(
    0,
    safeNumber(value)
  );
}

/*
 * ============================================================
 * DATE HELPERS
 * ============================================================
 */

function isOverdue(
  dueDate: unknown,
  balanceDue: number
): boolean {
  if (
    balanceDue <= 0 ||
    !dueDate
  ) {
    return false;
  }

  const date =
    new Date(
      String(dueDate)
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date < today;
}

/*
 * ============================================================
 * MAIN SNAPSHOT
 * ============================================================
 */

export async function getFinancialSnapshot(): Promise<FinancialSnapshot> {
  const supabase =
    await createClient();

  /*
   * ==========================================================
   * AUTHENTICATION
   * ==========================================================
   */

  const {
    data: {
      user,
    },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (
    authError ||
    !user
  ) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const ownerId =
    user.id;

  /*
   * ==========================================================
   * FETCH BUSINESS DATA
   * ==========================================================
   *
   * We query only the columns we actually need.
   */

  const [
    invoicesResult,
    expensesResult,
    customersResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from("invoices")
      .select(
        `
          id,
          total,
          amount_paid,
          balance_due,
          due_date,
          status
        `
      )
      .eq(
        "owner_id",
        ownerId
      ),

    supabase
      .from("expenses")
      .select(
        `
          id,
          amount,
          expense_date
        `
      )
      .eq(
        "owner_id",
        ownerId
      ),

    supabase
      .from("customers")
      .select(
        "id"
      )
      .eq(
        "owner_id",
        ownerId
      ),

    supabase
      .from("payments")
      .select(
        "id"
      )
      .eq(
        "owner_id",
        ownerId
      ),
  ]);

  /*
   * ==========================================================
   * ERROR HANDLING
   * ==========================================================
   */

  if (
    invoicesResult.error
  ) {
    console.error(
      "[FinancialSnapshot] Invoice query failed:",
      invoicesResult.error.message
    );

    throw invoicesResult.error;
  }

  if (
    expensesResult.error
  ) {
    console.error(
      "[FinancialSnapshot] Expense query failed:",
      expensesResult.error.message
    );

    throw expensesResult.error;
  }

  if (
    customersResult.error
  ) {
    console.error(
      "[FinancialSnapshot] Customer query failed:",
      customersResult.error.message
    );

    throw customersResult.error;
  }

  if (
    paymentsResult.error
  ) {
    console.error(
      "[FinancialSnapshot] Payment query failed:",
      paymentsResult.error.message
    );

    throw paymentsResult.error;
  }

  /*
   * ==========================================================
   * NORMALIZE ARRAYS
   * ==========================================================
   */

  const invoices =
    invoicesResult.data ?? [];

  const expenses =
    expensesResult.data ?? [];

  const customers =
    customersResult.data ?? [];

  const payments =
    paymentsResult.data ?? [];

  /*
   * ==========================================================
   * REVENUE
   * ==========================================================
   *
   * Revenue is based on money actually collected.
   *
   * invoice.amount_paid is the authoritative value currently
   * available in ArkenOne.
   */

  const revenue =
    invoices.reduce(
      (
        sum,
        invoice
      ) =>
        sum +
        safeNonNegativeNumber(
          invoice.amount_paid
        ),
      0
    );

  /*
   * ==========================================================
   * EXPENSES
   * ==========================================================
   */

  const totalExpenses =
    expenses.reduce(
      (
        sum,
        expense
      ) =>
        sum +
        safeNonNegativeNumber(
          expense.amount
        ),
      0
    );

  /*
   * ==========================================================
   * PROFIT
   * ==========================================================
   */

  const profit =
    revenue -
    totalExpenses;

  /*
   * ==========================================================
   * CASH AVAILABLE
   * ==========================================================
   *
   * This is an estimated cash position because ArkenOne is not
   * currently connected to a bank account.
   */

  const cashAvailable =
    Math.max(
      0,
      profit
    );

  /*
   * ==========================================================
   * OUTSTANDING RECEIVABLES
   * ==========================================================
   */

  const outstandingReceivables =
    invoices.reduce(
      (
        sum,
        invoice
      ) =>
        sum +
        safeNonNegativeNumber(
          invoice.balance_due
        ),
      0
    );

  /*
   * ==========================================================
   * OVERDUE INVOICES
   * ==========================================================
   */

  const overdueInvoices =
    invoices.filter(
      (invoice) =>
        isOverdue(
          invoice.due_date,
          safeNonNegativeNumber(
            invoice.balance_due
          )
        )
    ).length;

  /*
   * ==========================================================
   * COUNTS
   * ==========================================================
   */

  const customerCount =
    customers.length;

  const invoiceCount =
    invoices.length;

  const paymentCount =
    payments.length;

  /*
   * ==========================================================
   * PROFIT MARGIN
   * ==========================================================
   */

  const profitMargin =
    revenue > 0
      ? (
          profit /
          revenue
        ) *
        100
      : 0;

  /*
   * ==========================================================
   * RECEIVABLE PERCENTAGE
   * ==========================================================
   */

  const receivablePercentage =
    revenue > 0
      ? (
          outstandingReceivables /
          revenue
        ) *
        100
      : 0;

  /*
   * ============================================================
   * EXPENSE PERCENTAGE
   * ============================================================
   */

  const expensePercentage =
    revenue > 0
      ? (
          totalExpenses /
          revenue
        ) *
        100
      : 0;

  /*
   * ============================================================
   * HEALTH SCORE
   * ============================================================
   */

  let healthScore = 100;

  if (
    revenue <= 0
  ) {
    healthScore = 0;
  } else {
    /*
     * Receivables pressure
     */

    if (
      receivablePercentage >
      75
    ) {
      healthScore -= 35;
    } else if (
      receivablePercentage >
      50
    ) {
      healthScore -= 25;
    } else if (
      receivablePercentage >
      35
    ) {
      healthScore -= 15;
    } else if (
      receivablePercentage >
      20
    ) {
      healthScore -= 5;
    }

    /*
     * Expense pressure
     */

    if (
      expensePercentage >
      90
    ) {
      healthScore -= 35;
    } else if (
      expensePercentage >
      75
    ) {
      healthScore -= 25;
    } else if (
      expensePercentage >
      60
    ) {
      healthScore -= 15;
    } else if (
      expensePercentage >
      45
    ) {
      healthScore -= 5;
    }

    /*
     * Profitability
     */

    if (
      profit < 0
    ) {
      healthScore -= 20;
    } else if (
      profitMargin >= 25
    ) {
      healthScore += 5;
    } else if (
      profitMargin >= 15
    ) {
      healthScore += 2;
    }

    /*
     * Overdue invoices
     */

    if (
      overdueInvoices >= 5
    ) {
      healthScore -= 15;
    } else if (
      overdueInvoices >= 3
    ) {
      healthScore -= 10;
    } else if (
      overdueInvoices >= 1
    ) {
      healthScore -= 5;
    }

    healthScore =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(
            healthScore
          )
        )
      );
  }

  /*
   * ============================================================
   * TREND
   * ============================================================
   */

  let trend:
    FinancialSnapshot["trend"];

  if (
    revenue <= 0
  ) {
    trend = "Stable";
  } else if (
    profit > 0 &&
    receivablePercentage <
      25 &&
    overdueInvoices === 0
  ) {
    trend = "Improving";
  } else if (
    profit < 0 ||
    receivablePercentage >
      50 ||
    overdueInvoices >= 3
  ) {
    trend = "Declining";
  } else {
    trend = "Stable";
  }

  /*
   * ============================================================
   * STRENGTHS
   * ============================================================
   */

  const strengths:
    FinancialStrength[] = [];

  if (
    profit > 0
  ) {
    strengths.push({
      title:
        "Positive Profitability",
      description:
        "The business is currently generating more collected revenue than recorded expenses.",
    });
  }

  if (
    revenue > 0 &&
    expensePercentage <
      60
  ) {
    strengths.push({
      title:
        "Controlled Expenses",
      description:
        "Recorded expenses currently represent a manageable share of collected revenue.",
    });
  }

  if (
    revenue > 0 &&
    profitMargin >= 25
  ) {
    strengths.push({
      title:
        "Healthy Profit Margin",
      description:
        "Operating profitability is currently strong relative to collected revenue.",
    });
  }

  if (
    overdueInvoices === 0 &&
    invoiceCount > 0
  ) {
    strengths.push({
      title:
        "Strong Collection Discipline",
      description:
        "There are currently no overdue outstanding invoices.",
    });
  }

  if (
    customerCount > 0
  ) {
    strengths.push({
      title:
        "Active Customer Base",
      description:
        "The business has an established customer base generating commercial activity.",
    });
  }

  if (
    strengths.length === 0
  ) {
    strengths.push({
      title:
        "Financial Data Available",
      description:
        "ArkenOne is actively building the financial picture from available business data.",
    });
  }

  /*
   * ============================================================
   * RISKS
   * ============================================================
   */

  const risks:
    FinancialRisk[] = [];

  if (
    profit < 0 &&
    revenue > 0
  ) {
    risks.push({
      title:
        "Negative Profitability",
      description:
        "Recorded expenses currently exceed collected revenue.",
    });
  }

  if (
    revenue > 0 &&
    receivablePercentage >
      35
  ) {
    risks.push({
      title:
        "Receivables Pressure",
      description:
        "A significant portion of business revenue remains tied up in outstanding invoices.",
    });
  }

  if (
    revenue > 0 &&
    expensePercentage >
      75
  ) {
    risks.push({
      title:
        "Expense Pressure",
      description:
        "Operating expenses are consuming a large share of collected revenue.",
    });
  }

  if (
    overdueInvoices > 0
  ) {
    risks.push({
      title:
        "Overdue Invoices",
      description:
        `${overdueInvoices} outstanding invoice${
          overdueInvoices === 1
            ? ""
            : "s"
        } currently require collection attention.`,
    });
  }

  if (
    profitMargin < 10 &&
    revenue > 0
  ) {
    risks.push({
      title:
        "Thin Profit Margin",
      description:
        "Current profitability leaves limited room for unexpected costs or weaker collections.",
    });
  }

  if (
    cashAvailable <= 0 &&
    revenue > 0
  ) {
    risks.push({
      title:
        "Limited Cash Position",
      description:
        "Estimated available cash is currently limited relative to recorded business activity.",
    });
  }

  if (
    risks.length === 0
  ) {
    risks.push({
      title:
        "No Major Risk Detected",
      description:
        "No major financial risk was detected from the currently available data.",
    });
  }

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return {
    revenue,

    expenses:
      totalExpenses,

    profit,

    cashAvailable,

    outstandingReceivables,

    overdueInvoices,

    customerCount,

    invoiceCount,

    paymentCount,

    healthScore,

    trend,

    profitMargin,

    receivablePercentage,

    expensePercentage,

    strengths,

    risks,
  };
}