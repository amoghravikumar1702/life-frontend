// src/lib/finance/getFinancialSnapshot.ts

import { createClient } from "@/lib/supabase/server";

export interface FinancialSnapshot {
  revenue: number;
  expenses: number;
  profit: number;
  outstandingReceivables: number;

  invoiceCount: number;
  expenseCount: number;
  customerCount: number;
  overdueInvoices: number;

  healthScore: number;
  trend: "Improving" | "Stable" | "Declining";
}

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value: unknown): number {
  const number = Number(value ?? 0);

  return Number.isFinite(number)
    ? number
    : 0;
}

function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(
    String(value)
  );

  return Number.isFinite(
    date.getTime()
  )
    ? date
    : null;
}

/* =========================================================
   FINANCIAL SNAPSHOT
========================================================= */

export async function getFinancialSnapshot(): Promise<FinancialSnapshot> {
  const supabase =
    await createClient();

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (authError) {
    console.error(
      "[Financial Snapshot] Auth error:",
      authError
    );

    throw new Error(
      "Unable to verify your account."
    );
  }

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  console.log(
    "[Financial Snapshot] Calculating snapshot for user:",
    user.id
  );

  /* =========================================================
     COMPANY
  ========================================================= */

  const {
    data: company,
    error: companyError,
  } =
    await supabase
      .from("companies")
      .select(`
        starting_revenue,
        onboarding_completed_at
      `)
      .eq(
        "owner_id",
        user.id
      )
      .maybeSingle();

  if (companyError) {
    console.error(
      "[Financial Snapshot] Company query failed:",
      companyError
    );

    throw companyError;
  }

  const startingRevenue =
    Math.max(
      0,
      toNumber(
        company?.starting_revenue
      )
    );

  /* =========================================================
     INVOICES
========================================================= */

  const {
    data: invoices,
    error: invoicesError,
  } =
    await supabase
      .from("invoices")
      .select(`
        id,
        total,
        amount_paid,
        balance_due,
        status,
        due_date,
        created_at
      `)
      .eq(
        "owner_id",
        user.id
      );

  if (invoicesError) {
    console.error(
      "[Financial Snapshot] Invoice query failed:",
      invoicesError
    );

    throw invoicesError;
  }

  /* =========================================================
     EXPENSES
========================================================= */

  const {
    data: expenses,
    error: expensesError,
  } =
    await supabase
      .from("expenses")
      .select(`
        id,
        amount
      `)
      .eq(
        "owner_id",
        user.id
      );

  if (expensesError) {
    console.error(
      "[Financial Snapshot] Expense query failed:",
      expensesError
    );

    throw expensesError;
  }

  /* =========================================================
     CUSTOMERS
========================================================= */

  const {
    count: customerCount,
    error: customersError,
  } =
    await supabase
      .from("customers")
      .select(
        "id",
        {
          count: "exact",
          head: true,
        }
      )
      .eq(
        "owner_id",
        user.id
      );

  if (customersError) {
    console.error(
      "[Financial Snapshot] Customer query failed:",
      customersError
    );

    throw customersError;
  }

  /* =========================================================
     INVOICE REVENUE
  ========================================================= */

  const invoiceRevenue =
    (invoices ?? []).reduce(
      (sum, invoice) => {
        const total =
          Math.max(
            0,
            toNumber(
              invoice.total
            )
          );

        return sum + total;
      },
      0
    );

  /* =========================================================
     TOTAL REVENUE
  ========================================================= */

  const revenue =
    startingRevenue +
    invoiceRevenue;

  /* =========================================================
     TOTAL EXPENSES
  ========================================================= */

  const totalExpenses =
    (expenses ?? []).reduce(
      (sum, expense) => {
        const amount =
          Math.max(
            0,
            toNumber(
              expense.amount
            )
          );

        return sum + amount;
      },
      0
    );

  /* =========================================================
     PROFIT
  ========================================================= */

  const profit =
    revenue -
    totalExpenses;

  /* =========================================================
     OUTSTANDING RECEIVABLES
  ========================================================= */

  const outstandingReceivables =
    (invoices ?? []).reduce(
      (sum, invoice) => {
        const balanceDue =
          Math.max(
            0,
            toNumber(
              invoice.balance_due
            )
          );

        return (
          sum + balanceDue
        );
      },
      0
    );

  /* =========================================================
     OVERDUE INVOICES
  ========================================================= */

  const now = new Date();

  const overdueInvoices =
    (invoices ?? []).filter(
      (invoice) => {
        const balanceDue =
          toNumber(
            invoice.balance_due
          );

        if (balanceDue <= 0) {
          return false;
        }

        const dueDate =
          toDate(
            invoice.due_date
          );

        if (!dueDate) {
          return false;
        }

        return dueDate < now;
      }
    ).length;

  /* =========================================================
     HEALTH SCORE
  ========================================================= */

  let healthScore = 100;

  if (revenue <= 0) {
    healthScore -= 20;
  }

  if (revenue > 0) {
    const profitMargin =
      (profit / revenue) *
      100;

    if (profitMargin < 0) {
      healthScore -= 35;
    } else if (
      profitMargin < 10
    ) {
      healthScore -= 20;
    } else if (
      profitMargin < 20
    ) {
      healthScore -= 10;
    }
  }

  if (revenue > 0) {
    const expenseRatio =
      totalExpenses /
      revenue;

    if (expenseRatio > 0.9) {
      healthScore -= 20;
    } else if (
      expenseRatio > 0.75
    ) {
      healthScore -= 12;
    } else if (
      expenseRatio > 0.6
    ) {
      healthScore -= 6;
    }
  }

  if (revenue > 0) {
    const receivableRatio =
      outstandingReceivables /
      revenue;

    if (receivableRatio > 0.3) {
      healthScore -= 15;
    } else if (
      receivableRatio > 0.15
    ) {
      healthScore -= 8;
    }
  }

  healthScore -=
    overdueInvoices * 3;

  healthScore =
    Math.max(
      0,
      Math.min(
        Math.round(
          healthScore
        ),
        100
      )
    );

  /* =========================================================
     TREND
  ========================================================= */

  let trend:
    | "Improving"
    | "Stable"
    | "Declining";

  if (profit > 0) {
    trend = "Improving";
  } else if (profit < 0) {
    trend = "Declining";
  } else {
    trend = "Stable";
  }

  /* =========================================================
     DEBUG
  ========================================================= */

  console.log(
    "[Financial Snapshot DEBUG] FINAL:",
    {
      userId: user.id,
      startingRevenue,
      invoiceRevenue,
      revenue,
      totalExpenses,
      profit,
      outstandingReceivables,
      invoiceCount:
        invoices?.length ?? 0,
      expenseCount:
        expenses?.length ?? 0,
      customerCount:
        customerCount ?? 0,
      overdueInvoices,
      healthScore,
      trend,
    }
  );

  /* =========================================================
     CANONICAL SNAPSHOT
  ========================================================= */

  return {
    revenue,

    expenses:
      totalExpenses,

    profit,

    outstandingReceivables,

    invoiceCount:
      invoices?.length ?? 0,

    expenseCount:
      expenses?.length ?? 0,

    customerCount:
      customerCount ?? 0,

    overdueInvoices,

    healthScore,

    trend,
  };
}