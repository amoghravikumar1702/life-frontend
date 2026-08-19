import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabase";

function getMonthKey(dateValue: string | null) {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    1
  ).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

export async function GET() {
  try {
    /*
     * =========================================================
     * AUTHENTICATE BUSINESS OWNER
     * =========================================================
     */

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error(
        "[Financial Analysis] Auth error:",
        authError
      );

      return NextResponse.json(
        {
          error: "Unable to verify your session.",
        },
        {
          status: 401,
        }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * =========================================================
     * LOAD INVOICES
     * =========================================================
     */

    const {
      data: invoices,
      error: invoiceError,
    } = await supabaseAdmin
      .from("invoices")
      .select(`
        id,
        total,
        amount_paid,
        created_at,
        owner_id
      `)
      .eq("owner_id", user.id);

    if (invoiceError) {
      console.error(
        "[Financial Analysis] Invoice error:",
        invoiceError
      );

      return NextResponse.json(
        {
          error: invoiceError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =========================================================
     * LOAD EXPENSES
     * =========================================================
     */

    const {
      data: expenses,
      error: expenseError,
    } = await supabaseAdmin
      .from("expenses")
      .select(`
        id,
        amount,
        created_at,
        owner_id
      `)
      .eq("owner_id", user.id);

    if (expenseError) {
      console.error(
        "[Financial Analysis] Expense error:",
        expenseError
      );

      return NextResponse.json(
        {
          error: expenseError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * =========================================================
     * REVENUE
     *
     * Revenue = total invoice value.
     * =========================================================
     */

    const totalRevenue = (
      invoices ?? []
    ).reduce(
      (sum, invoice) =>
        sum + Number(invoice.total ?? 0),
      0
    );

    /*
     * =========================================================
     * CASH INFLOW
     *
     * Actual money received.
     * =========================================================
     */

    const cashInflow = (
      invoices ?? []
    ).reduce(
      (sum, invoice) =>
        sum + Number(invoice.amount_paid ?? 0),
      0
    );

    /*
     * =========================================================
     * EXPENSES
     * =========================================================
     */

    const totalExpenses = (
      expenses ?? []
    ).reduce(
      (sum, expense) =>
        sum + Number(expense.amount ?? 0),
      0
    );

    /*
     * =========================================================
     * PROFIT
     * =========================================================
     */

    const netProfit =
      totalRevenue - totalExpenses;

    const profitMargin =
      totalRevenue > 0
        ? (netProfit / totalRevenue) * 100
        : 0;

    /*
     * =========================================================
     * CASH FLOW
     * =========================================================
     */

    const cashOutflow =
      totalExpenses;

    const netCashFlow =
      cashInflow - cashOutflow;

    /*
     * =========================================================
     * ANALYSIS PERIOD
     *
     * Full calendar month(s) containing activity.
     * =========================================================
     */

    const activityDates = [
      ...(invoices ?? []).map(
        (invoice) =>
          invoice.created_at
      ),

      ...(expenses ?? []).map(
        (expense) =>
          expense.created_at
      ),
    ].filter(
      (date): date is string =>
        Boolean(date)
    );

    const validDates = activityDates
      .map(
        (date) =>
          new Date(date)
      )
      .filter(
        (date) =>
          !Number.isNaN(
            date.getTime()
          )
      )
      .sort(
        (a, b) =>
          a.getTime() -
          b.getTime()
      );

    let periodStart: string | null =
      null;

    let periodEnd: string | null =
      null;

    if (validDates.length > 0) {
      const first = validDates[0];

      const last =
        validDates[
          validDates.length - 1
        ];

      periodStart = new Date(
        first.getFullYear(),
        first.getMonth(),
        1
      ).toISOString();

      periodEnd = new Date(
        last.getFullYear(),
        last.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      ).toISOString();
    }

    /*
     * =========================================================
     * MONTHLY DATA
     * =========================================================
     */

    const monthlyMap = new Map<
      string,
      {
        month: string;
        revenue: number;
        expenses: number;
      }
    >();

    /*
     * Revenue by month
     */

    for (const invoice of invoices ?? []) {
      const monthKey =
        getMonthKey(
          invoice.created_at
        );

      if (!monthKey) continue;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(
          monthKey,
          {
            month:
              getMonthLabel(
                monthKey
              ),
            revenue: 0,
            expenses: 0,
          }
        );
      }

      const current =
        monthlyMap.get(
          monthKey
        )!;

      current.revenue += Number(
        invoice.total ?? 0
      );
    }

    /*
     * Expenses by month
     */

    for (const expense of expenses ?? []) {
      const monthKey =
        getMonthKey(
          expense.created_at
        );

      if (!monthKey) continue;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(
          monthKey,
          {
            month:
              getMonthLabel(
                monthKey
              ),
            revenue: 0,
            expenses: 0,
          }
        );
      }

      const current =
        monthlyMap.get(
          monthKey
        )!;

      current.expenses += Number(
        expense.amount ?? 0
      );
    }

    /*
     * Latest 7 months
     */

    const monthlyData =
      Array.from(
        monthlyMap.entries()
      )
        .sort(
          ([a], [b]) =>
            a.localeCompare(b)
        )
        .slice(-7)
        .map(
          ([, value]) =>
            value
        );

    /*
     * =========================================================
     * RESPONSE
     * =========================================================
     */

    return NextResponse.json({
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,

      cashInflow,
      cashOutflow,
      netCashFlow,

      periodStart,
      periodEnd,

      monthlyData,
    });
  } catch (error) {
    console.error(
      "[Financial Analysis] Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load financial analysis.",
      },
      {
        status: 500,
      }
    );
  }
}