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

  return Number.isFinite(number) ? number : 0;
}

function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(String(value));

  return Number.isFinite(date.getTime()) ? date : null;
}

/* =========================================================
   FINANCIAL SNAPSHOT
========================================================= */

export async function getFinancialSnapshot(): Promise<FinancialSnapshot> {
  const supabase = await createClient();

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User is not authenticated.");
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
  } = await supabase
    .from("companies")
    .select(`
      starting_revenue,
      onboarding_completed_at
    `)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (companyError) {
    console.error(
      "[Financial Snapshot] Company query failed:",
      companyError
    );

    throw companyError;
  }

  const startingRevenue = Math.max(
    0,
    toNumber(company?.starting_revenue)
  );

  /* =========================================================
     INVOICES
  ========================================================= */

  const {
    data: invoices,
    error: invoicesError,
  } = await supabase
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
    .eq("owner_id", user.id);

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
  } = await supabase
    .from("expenses")
    .select(`
      id,
      amount
    `)
    .eq("owner_id", user.id);

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
  } = await supabase
    .from("customers")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("owner_id", user.id);

  if (customersError) {
    console.error(
      "[Financial Snapshot] Customer query failed:",
      customersError
    );

    throw customersError;
  }

  /* =========================================================
     INVOICE REVENUE
  =========================================================
  
     IMPORTANT ACCOUNTING RULE:

     Every invoice explicitly created inside ArkenOne
     represents business revenue for the financial snapshot.

     We DO NOT use onboarding_completed_at as a cutoff.

     Why?

     An invoice can legitimately be created before the
     onboarding timestamp while the business is being set up.

     Using onboarding_completed_at as a date filter caused
     valid invoices to disappear from the dashboard.

     Example:

       Invoice 46
       Total: ₹88,496.46
       Created: 06:52
       Onboarding: 08:32

     The previous logic excluded it.

     The correct behaviour is to include it.
  ========================================================= */

  const invoiceRevenue = (invoices ?? []).reduce(
    (sum, invoice) => {
      const total = Math.max(
        0,
        toNumber(invoice.total)
      );

      return sum + total;
    },
    0
  );

  /* =========================================================
     TOTAL REVENUE
  =========================================================
  
     starting_revenue represents the business revenue position
     supplied during onboarding.

     Invoice revenue represents invoices recorded in ArkenOne.

     Both are kept separate and then combined.
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
        const amount = Math.max(
          0,
          toNumber(expense.amount)
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
  =========================================================
  
     Receivables are NOT based on invoice total.

     They are based strictly on balance_due.

     Therefore:

       Invoice ₹88,496.46
       Paid ₹88,496.46
       Balance ₹0

     means:

       Receivables = ₹0
  ========================================================= */

  const outstandingReceivables =
    (invoices ?? []).reduce(
      (sum, invoice) => {
        const balanceDue = Math.max(
          0,
          toNumber(invoice.balance_due)
        );

        return sum + balanceDue;
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
        const balanceDue = toNumber(
          invoice.balance_due
        );

        /*
         * Paid invoices cannot be overdue.
         */
        if (balanceDue <= 0) {
          return false;
        }

        const dueDate = toDate(
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

  /*
   * No revenue
   */
  if (revenue <= 0) {
    healthScore -= 20;
  }

  /*
   * Profitability
   */
  if (revenue > 0) {
    const profitMargin =
      (profit / revenue) * 100;

    if (profitMargin < 0) {
      healthScore -= 35;
    } else if (profitMargin < 10) {
      healthScore -= 20;
    } else if (profitMargin < 20) {
      healthScore -= 10;
    }
  }

  /*
   * Expense ratio
   */
  if (revenue > 0) {
    const expenseRatio =
      totalExpenses / revenue;

    if (expenseRatio > 0.9) {
      healthScore -= 20;
    } else if (expenseRatio > 0.75) {
      healthScore -= 12;
    } else if (expenseRatio > 0.6) {
      healthScore -= 6;
    }
  }

  /*
   * Receivable exposure
   */
  if (revenue > 0) {
    const receivableRatio =
      outstandingReceivables / revenue;

    if (receivableRatio > 0.3) {
      healthScore -= 15;
    } else if (receivableRatio > 0.15) {
      healthScore -= 8;
    }
  }

  /*
   * Overdue invoices
   */
  healthScore -=
    overdueInvoices * 3;

  healthScore = Math.max(
    0,
    Math.min(
      Math.round(healthScore),
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
      invoiceCount: invoices?.length ?? 0,
      expenseCount: expenses?.length ?? 0,
      customerCount: customerCount ?? 0,
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