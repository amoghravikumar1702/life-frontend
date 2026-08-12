"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Plus,
  Repeat,
  Receipt,
  Trash2,
  TrendingDown,
  Wallet,
} from "lucide-react";

import PageContainer from "@/components/ui/PageContainer";
import {
  deleteExpense,
  getExpenses,
} from "@/services/expenseService";

import type { Expense } from "@/types/expense";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadExpenses() {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses();

      setExpenses(data);
    } catch (err) {
      console.error("[ExpensesPage] Failed to load expenses:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load expenses."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this expense? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteExpense(id);

      setExpenses((current) =>
        current.filter((expense) => expense.id !== id)
      );
    } catch (err) {
      console.error(
        "[ExpensesPage] Failed to delete expense:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete expense."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  const recurringExpenses = useMemo(() => {
    return expenses
      .filter((expense) => expense.is_recurring)
      .reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      );
  }, [expenses]);

  const categoryCount = useMemo(() => {
    return new Set(expenses.map((expense) => expense.category))
      .size;
  }, [expenses]);

  return (
    <PageContainer>
      <div className="mx-auto mt-8 max-w-7xl space-y-8 pb-12">

        {/* HEADER */}

        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.42em] text-[#D4AF37]">
              FINANCIAL MANAGEMENT
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
              Expenses
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
              Track business spending and give ArkenOne the
              financial data required for accurate CFO analysis.
            </p>
          </div>

          <Link
            href="/expenses/new"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#D4AF37]
              px-6
              py-3.5
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-[#E0BE4A]
            "
          >
            <Plus size={17} />
            Add Expense
          </Link>
        </section>

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* SUMMARY */}

        <section className="grid gap-5 md:grid-cols-3">

          <div className="rounded-[28px] border border-white/[0.06] bg-[#101114] p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                  TOTAL EXPENSES
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-white">
                  {loading
                    ? "—"
                    : formatCurrency(totalExpenses)}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10">
                <TrendingDown
                  size={19}
                  className="text-red-400"
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-zinc-600">
              Recorded business spending
            </p>
          </div>

          <div className="rounded-[28px] border border-white/[0.06] bg-[#101114] p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                  RECURRING
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-white">
                  {loading
                    ? "—"
                    : formatCurrency(recurringExpenses)}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                <Repeat
                  size={19}
                  className="text-[#D4AF37]"
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-zinc-600">
              Expenses marked as recurring
            </p>
          </div>

          <div className="rounded-[28px] border border-white/[0.06] bg-[#101114] p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                  CATEGORIES
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-white">
                  {loading ? "—" : categoryCount}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10">
                <Wallet
                  size={19}
                  className="text-emerald-400"
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-zinc-600">
              Spending categories
            </p>
          </div>

        </section>

        {/* EXPENSE LIST */}

        <section className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#101114]">

          <div className="flex items-center justify-between border-b border-white/[0.06] px-7 py-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                EXPENSE LEDGER
              </p>

              <h2 className="mt-2 text-xl font-semibold text-white">
                Recent Expenses
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
              <Receipt
                size={18}
                className="text-zinc-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="px-7 py-16 text-center text-sm text-zinc-600">
              Loading expenses...
            </div>
          ) : expenses.length === 0 ? (
            <div className="px-7 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <Receipt
                  size={22}
                  className="text-zinc-600"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                No expenses recorded
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-zinc-600">
                Start recording business expenses so ArkenOne
                can calculate real profitability and financial
                health.
              </p>

              <Link
                href="/expenses/new"
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#D4AF37]/20
                  bg-[#D4AF37]/[0.06]
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-[#D4AF37]
                  transition
                  hover:bg-[#D4AF37]/10
                "
              >
                <Plus size={16} />
                Add your first expense
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">

              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="
                    group
                    flex
                    flex-col
                    gap-5
                    px-7
                    py-6
                    transition
                    hover:bg-white/[0.015]
                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.03]">
                      <Receipt
                        size={18}
                        className="text-zinc-500"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-white">
                          {expense.category}
                        </h3>

                        {expense.is_recurring && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-[#D4AF37]">
                            <Repeat size={10} />
                            Recurring
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-600">
                        <span>
                          {formatDate(expense.expense_date)}
                        </span>

                        {expense.vendor && (
                          <>
                            <span>•</span>
                            <span>{expense.vendor}</span>
                          </>
                        )}
                      </div>

                      {expense.description && (
                        <p className="mt-2 max-w-xl truncate text-sm text-zinc-500">
                          {expense.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 md:justify-end">

                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">
                        {formatCurrency(
                          Number(expense.amount || 0)
                        )}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                        INR
                      </p>
                    </div>

                    <button
                      type="button"
                      title="Delete expense"
                      disabled={deletingId === expense.id}
                      onClick={() =>
                        handleDelete(expense.id)
                      }
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-white/[0.02]
                        text-zinc-600
                        transition
                        hover:border-red-500/20
                        hover:bg-red-500/[0.06]
                        hover:text-red-400
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      <Trash2 size={16} />
                    </button>

                    <ArrowUpRight
                      size={16}
                      className="
                        hidden
                        text-zinc-700
                        transition
                        group-hover:text-[#D4AF37]
                        md:block
                      "
                    />
                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* CFO CONNECTION */}

        <section className="rounded-[28px] border border-[#D4AF37]/10 bg-[#D4AF37]/[0.025] p-7">
          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06]">
              <Wallet
                size={18}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#D4AF37]">
                ARKENONE CFO
              </p>

              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Recorded expenses will be incorporated into
                ArkenOne&apos;s profitability, cash-flow,
                margin, and financial-health analysis.
              </p>
            </div>

          </div>
        </section>

      </div>
    </PageContainer>
  );
}