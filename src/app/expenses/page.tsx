"use client";

// src/app/expenses/page.tsx

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

    if (!confirmed) return;

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

  const totalExpenses = useMemo(
    () =>
      expenses.reduce(
        (total, expense) =>
          total + Number(expense.amount || 0),
        0
      ),
    [expenses]
  );

  const recurringExpenses = useMemo(
    () =>
      expenses
        .filter((expense) => expense.is_recurring)
        .reduce(
          (total, expense) =>
            total + Number(expense.amount || 0),
          0
        ),
    [expenses]
  );

  const categoryCount = useMemo(
    () => new Set(expenses.map((expense) => expense.category)).size,
    [expenses]
  );

  return (
    <PageContainer>
      <div className="mx-auto mt-3 w-full max-w-7xl space-y-5 pb-8 sm:mt-5 sm:space-y-6 sm:pb-12">
        {/* HEADER */}
        <section className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-[9px] font-medium uppercase tracking-[0.34em] text-[#D4AF37] sm:text-[11px] sm:tracking-[0.42em]">
              FINANCIAL MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white sm:mt-3 sm:text-4xl">
              Expenses
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-zinc-500 sm:mt-3 sm:text-sm sm:leading-7">
              Track business spending and give ArkenOne the
              financial data required for accurate CFO analysis.
            </p>
          </div>

          <Link
            href="/expenses/new"
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#D4AF37]
              px-5
              py-3
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-[#E0BE4A]
              sm:w-auto
              sm:px-6
              sm:py-3.5
            "
          >
            <Plus size={17} />
            Add Expense
          </Link>
        </section>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm leading-6 text-red-400 sm:px-5 sm:py-4">
            {error}
          </div>
        )}

        {/* SUMMARY */}
        <section className="grid min-w-0 gap-3 sm:gap-5 md:grid-cols-3">
          <div className="min-w-0 rounded-[24px] border border-white/[0.06] bg-[#101114] p-5 sm:rounded-[28px] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[10px] sm:tracking-[0.32em]">
                  TOTAL EXPENSES
                </p>

                <h2 className="mt-3 break-words text-2xl font-bold tracking-[-0.04em] text-white sm:mt-4 sm:text-3xl">
                  {loading ? "—" : formatCurrency(totalExpenses)}
                </h2>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 sm:h-11 sm:w-11 sm:rounded-2xl">
                <TrendingDown size={18} className="text-red-400" />
              </div>
            </div>

            <p className="mt-3 text-xs text-zinc-600 sm:mt-4 sm:text-sm">
              Recorded business spending
            </p>
          </div>

          <div className="min-w-0 rounded-[24px] border border-white/[0.06] bg-[#101114] p-5 sm:rounded-[28px] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[10px] sm:tracking-[0.32em]">
                  RECURRING
                </p>

                <h2 className="mt-3 break-words text-2xl font-bold tracking-[-0.04em] text-white sm:mt-4 sm:text-3xl">
                  {loading
                    ? "—"
                    : formatCurrency(recurringExpenses)}
                </h2>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 sm:h-11 sm:w-11 sm:rounded-2xl">
                <Repeat size={18} className="text-[#D4AF37]" />
              </div>
            </div>

            <p className="mt-3 text-xs text-zinc-600 sm:mt-4 sm:text-sm">
              Expenses marked as recurring
            </p>
          </div>

          <div className="min-w-0 rounded-[24px] border border-white/[0.06] bg-[#101114] p-5 sm:rounded-[28px] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[10px] sm:tracking-[0.32em]">
                  CATEGORIES
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-white sm:mt-4 sm:text-3xl">
                  {loading ? "—" : categoryCount}
                </h2>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 sm:h-11 sm:w-11 sm:rounded-2xl">
                <Wallet size={18} className="text-emerald-400" />
              </div>
            </div>

            <p className="mt-3 text-xs text-zinc-600 sm:mt-4 sm:text-sm">
              Spending categories
            </p>
          </div>
        </section>

        {/* EXPENSE LIST */}
        <section className="min-w-0 overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#101114] sm:rounded-[30px]">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-5 sm:px-7 sm:py-6">
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.26em] text-zinc-500 sm:text-[10px] sm:tracking-[0.32em]">
                EXPENSE LEDGER
              </p>

              <h2 className="mt-1.5 text-lg font-semibold text-white sm:mt-2 sm:text-xl">
                Recent Expenses
              </h2>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] sm:h-10 sm:w-10">
              <Receipt size={17} className="text-zinc-500" />
            </div>
          </div>

          {loading ? (
            <div className="px-5 py-14 text-center text-sm text-zinc-600 sm:px-7 sm:py-16">
              Loading expenses...
            </div>
          ) : expenses.length === 0 ? (
            <div className="px-5 py-14 text-center sm:px-7 sm:py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <Receipt size={22} className="text-zinc-600" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                No expenses recorded
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600 sm:leading-7">
                Start recording business expenses so ArkenOne
                can calculate real profitability and financial
                health.
              </p>

              <Link
                href="/expenses/new"
                className="
                  mt-6
                  inline-flex
                  min-h-11
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
                    min-w-0
                    flex-col
                    gap-4
                    px-4
                    py-5
                    transition
                    hover:bg-white/[0.015]
                    sm:px-7
                    sm:py-6
                    md:flex-row
                    md:items-center
                    md:justify-between
                  "
                >
                  <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] sm:h-11 sm:w-11">
                      <Receipt size={17} className="text-zinc-500" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="max-w-full truncate text-sm font-semibold text-white">
                          {expense.category}
                        </h3>

                        {expense.is_recurring && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-[#D4AF37] sm:px-2.5 sm:text-[10px] sm:tracking-[0.15em]">
                            <Repeat size={9} />
                            Recurring
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-zinc-600 sm:gap-x-3 sm:text-xs">
                        <span>{formatDate(expense.expense_date)}</span>

                        {expense.vendor && (
                          <>
                            <span>•</span>
                            <span className="max-w-[180px] truncate">
                              {expense.vendor}
                            </span>
                          </>
                        )}
                      </div>

                      {expense.description && (
                        <p className="mt-1.5 line-clamp-2 max-w-xl text-xs leading-5 text-zinc-500 sm:mt-2 sm:text-sm">
                          {expense.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-4 border-t border-white/[0.04] pt-3 sm:pt-0 md:w-auto md:justify-end md:border-t-0 md:pl-4">
                    <div className="text-left md:text-right">
                      <p className="text-base font-semibold text-white sm:text-lg">
                        {formatCurrency(
                          Number(expense.amount || 0)
                        )}
                      </p>

                      <p className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-zinc-600 sm:mt-1 sm:text-[10px]">
                        INR
                      </p>
                    </div>

                    <button
                      type="button"
                      title="Delete expense"
                      aria-label={`Delete ${expense.category} expense`}
                      disabled={deletingId === expense.id}
                      onClick={() => handleDelete(expense.id)}
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
        <section className="rounded-[24px] border border-[#D4AF37]/10 bg-[#D4AF37]/[0.025] p-5 sm:rounded-[28px] sm:p-7">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] sm:h-11 sm:w-11">
              <Wallet size={17} className="text-[#D4AF37]" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.26em] text-[#D4AF37] sm:text-[10px] sm:tracking-[0.32em]">
                ARKENONE CFO
              </p>

              <p className="mt-2 text-xs leading-6 text-zinc-400 sm:text-sm sm:leading-7">
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