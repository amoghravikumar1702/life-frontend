// src/lib/cfo/getCFOContext.ts

import { createClient } from "@/lib/supabase/server";
import { getFinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

export async function getCFOContext() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User is not authenticated.");
  }

  /*
   * ============================================================
   * FINANCIAL SNAPSHOT
   * ============================================================
   */

  const snapshot = await getFinancialSnapshot();

  /*
   * ============================================================
   * COMPANY
   * ============================================================
   *
   * We use owner_id -> company.id because the companies table
   * uses a bigint primary key.
   */

  const {
    data: company,
    error: companyError,
  } = await supabase
    .from("companies")
    .select(
      `
        id,
        industry,
        starting_revenue
      `
    )
    .eq("owner_id", user.id)
    .single();

  if (companyError) {
    console.error(
      "[CFO] Failed to fetch company:",
      companyError
    );

    throw companyError;
  }

  /*
   * ============================================================
   * BUSINESS PROFILE
   * ============================================================
   *
   * This contains the sector-specific onboarding answers.
   *
   * Example:
   *
   * {
   *   revenue_model: "Monthly retainers",
   *   active_clients: "12",
   *   team_size: "5"
   * }
   */

  const {
    data: businessProfile,
    error: businessProfileError,
  } = await supabase
    .from("business_profiles")
    .select(
      `
        industry,
        answers,
        created_at,
        updated_at
      `
    )
    .eq("company_id", company.id)
    .maybeSingle();

  if (businessProfileError) {
    console.error(
      "[CFO] Failed to fetch business profile:",
      businessProfileError
    );

    throw businessProfileError;
  }

  /*
   * ============================================================
   * RECENT INVOICES
   * ============================================================
   */

  const {
    data: invoices,
    error: invoicesError,
  } = await supabase
    .from("invoices")
    .select(
      `
        id,
        invoice_number,
        customer,
        invoice_date,
        due_date,
        total,
        amount_paid,
        balance_due,
        status
      `
    )
    .eq("owner_id", user.id)
    .order("invoice_date", {
      ascending: false,
    })
    .limit(50);

  if (invoicesError) {
    console.error(
      "[CFO] Failed to fetch invoices:",
      invoicesError
    );

    throw invoicesError;
  }

  /*
   * ============================================================
   * RECENT EXPENSES
   * ============================================================
   */

  const {
    data: expenses,
    error: expensesError,
  } = await supabase
    .from("expenses")
    .select(
      `
        id,
        amount,
        category,
        description,
        vendor,
        expense_date,
        is_recurring
      `
    )
    .eq("owner_id", user.id)
    .order("expense_date", {
      ascending: false,
    })
    .limit(50);

  if (expensesError) {
    console.error(
      "[CFO] Failed to fetch expenses:",
      expensesError
    );

    throw expensesError;
  }

  /*
   * ============================================================
   * CUSTOMERS
   * ============================================================
   */

  const {
    data: customers,
    error: customersError,
  } = await supabase
    .from("customers")
    .select("*")
    .eq("owner_id", user.id)
    .limit(100);

  if (customersError) {
    console.error(
      "[CFO] Failed to fetch customers:",
      customersError
    );

    throw customersError;
  }

  /*
   * ============================================================
   * NORMALIZED BUSINESS PROFILE
   * ============================================================
   *
   * Keep this predictable for the AI.
   */

  const industry =
    businessProfile?.industry ??
    company?.industry ??
    "Other";

  const answers =
    businessProfile?.answers &&
    typeof businessProfile.answers === "object"
      ? businessProfile.answers
      : {};

  /*
   * ============================================================
   * CFO CONTEXT
   * ============================================================
   */

  return {
    /*
     * BUSINESS IDENTITY
     */

    business: {
      companyId: company.id,
      industry,
      startingRevenue: Number(
        company?.starting_revenue ?? 0
      ),
      profile: answers,
    },

    /*
     * FINANCIAL POSITION
     */

    financialSummary: {
      revenue: Number(snapshot.revenue ?? 0),

      expenses: Number(
        snapshot.expenses ?? 0
      ),

      profit: Number(
        snapshot.profit ?? 0
      ),

      outstandingReceivables: Number(
        snapshot.outstandingReceivables ?? 0
      ),

      invoiceCount: Number(
        snapshot.invoiceCount ?? 0
      ),

      expenseCount: Number(
        snapshot.expenseCount ?? 0
      ),
    },

    /*
     * RAW SNAPSHOT
     */

    snapshot,

    /*
     * TRANSACTION DATA
     */

    invoices: invoices ?? [],

    expenses: expenses ?? [],

    customers: customers ?? [],
  };
}