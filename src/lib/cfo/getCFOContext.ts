// src/lib/cfo/getCFOContext.ts

import { createClient } from "@/lib/supabase/server";
import { getFinancialSnapshot } from "@/lib/finance/getFinancialSnapshot";

export async function getCFOContext() {
  const supabase = await createClient();

  // ============================================================
  // 1. AUTHENTICATION
  // ============================================================

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error(
      "[CFO Context] Authentication error:",
      authError
    );

    throw authError;
  }

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  // ============================================================
  // 2. FINANCIAL SNAPSHOT
  // ============================================================

  const snapshot =
    await getFinancialSnapshot();

  // ============================================================
  // 3. RECENT INVOICES
  // ============================================================

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
        status,
        created_at
      `
    )
    .eq("owner_id", user.id)
    .order("invoice_date", {
      ascending: false,
    })
    .limit(100);

  if (invoicesError) {
    console.error(
      "[CFO Context] Failed to fetch invoices:",
      invoicesError
    );

    throw invoicesError;
  }

  // ============================================================
  // 4. RECENT EXPENSES
  // ============================================================

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
        is_recurring,
        created_at
      `
    )
    .eq("owner_id", user.id)
    .order("expense_date", {
      ascending: false,
    })
    .limit(100);

  if (expensesError) {
    console.error(
      "[CFO Context] Failed to fetch expenses:",
      expensesError
    );

    throw expensesError;
  }

  // ============================================================
  // 5. CUSTOMERS
  // ============================================================

  const {
    data: customers,
    error: customersError,
  } = await supabase
    .from("customers")
    .select("*")
    .eq("owner_id", user.id)
    .limit(200);

  if (customersError) {
    console.error(
      "[CFO Context] Failed to fetch customers:",
      customersError
    );

    throw customersError;
  }

  // ============================================================
  // 6. NORMALIZE NUMBERS
  // ============================================================

  const safeNumber = (
    value: unknown
  ): number => {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  // ============================================================
  // 7. NORMALIZE INVOICES
  // ============================================================

  const normalizedInvoices =
    (invoices ?? []).map(
      (invoice) => ({
        id: invoice.id,

        invoiceNumber:
          invoice.invoice_number ?? "",

        customer:
          invoice.customer ?? "",

        invoiceDate:
          invoice.invoice_date ?? null,

        dueDate:
          invoice.due_date ?? null,

        total:
          safeNumber(invoice.total),

        amountPaid:
          safeNumber(
            invoice.amount_paid
          ),

        balanceDue:
          Math.max(
            0,
            safeNumber(
              invoice.balance_due
            )
          ),

        status:
          invoice.status ?? "",

        createdAt:
          invoice.created_at ?? null,
      })
    );

  // ============================================================
  // 8. NORMALIZE EXPENSES
  // ============================================================

  const normalizedExpenses =
    (expenses ?? []).map(
      (expense) => ({
        id: expense.id,

        amount:
          safeNumber(
            expense.amount
          ),

        category:
          expense.category ?? "",

        description:
          expense.description ?? "",

        vendor:
          expense.vendor ?? "",

        expenseDate:
          expense.expense_date ?? null,

        isRecurring:
          Boolean(
            expense.is_recurring
          ),

        createdAt:
          expense.created_at ?? null,
      })
    );

  // ============================================================
  // 9. NORMALIZE CUSTOMERS
  // ============================================================

  const normalizedCustomers =
    (customers ?? []).map(
      (customer) => ({
        ...customer,

        name:
          customer.name ??
          customer.customer_name ??
          "",

        email:
          customer.email ?? "",

        phone:
          customer.phone ?? "",

        company:
          customer.company ?? "",

        totalRevenue:
          safeNumber(
            customer.total_revenue
          ),

        outstanding:
          safeNumber(
            customer.outstanding
          ),
      })
    );

  // ============================================================
  // 10. CALCULATED CFO SIGNALS
  // ============================================================

  const totalInvoiced =
    normalizedInvoices.reduce(
      (sum, invoice) =>
        sum + invoice.total,
      0
    );

  const totalCollected =
    normalizedInvoices.reduce(
      (sum, invoice) =>
        sum + invoice.amountPaid,
      0
    );

  const totalOutstanding =
    normalizedInvoices.reduce(
      (sum, invoice) =>
        sum + invoice.balanceDue,
      0
    );

  const totalExpenses =
    normalizedExpenses.reduce(
      (sum, expense) =>
        sum + expense.amount,
      0
    );

  const overdueInvoices =
    normalizedInvoices.filter(
      (invoice) => {
        if (
          invoice.balanceDue <= 0 ||
          !invoice.dueDate
        ) {
          return false;
        }

        const dueDate =
          new Date(
            invoice.dueDate
          );

        return (
          !Number.isNaN(
            dueDate.getTime()
          ) &&
          dueDate <
            new Date()
        );
      }
    );

  const overdueReceivables =
    overdueInvoices.reduce(
      (sum, invoice) =>
        sum + invoice.balanceDue,
      0
    );

  // ============================================================
  // 11. RETURN CFO CONTEXT
  // ============================================================

  return {
    generatedAt:
      new Date().toISOString(),

    userId: user.id,

    financialSnapshot: snapshot,

    summary: {
      totalInvoiced,
      totalCollected,
      totalOutstanding,
      totalExpenses,
      overdueReceivables,

      invoiceCount:
        normalizedInvoices.length,

      expenseCount:
        normalizedExpenses.length,

      customerCount:
        normalizedCustomers.length,

      overdueInvoiceCount:
        overdueInvoices.length,
    },

    invoices:
      normalizedInvoices,

    expenses:
      normalizedExpenses,

    customers:
      normalizedCustomers,
  };
}