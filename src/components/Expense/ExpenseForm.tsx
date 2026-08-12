"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  FileText,
  Repeat,
  Store,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { createExpense } from "@/services/expenseService";

const EXPENSE_CATEGORIES = [
  "Office",
  "Software",
  "Marketing",
  "Payroll",
  "Travel",
  "Utilities",
  "Rent",
  "Equipment",
  "Professional Services",
  "Taxes",
  "Inventory",
  "Other",
];

export default function ExpenseForm() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isRecurring, setIsRecurring] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid expense amount.");
      return;
    }

    if (!category) {
      setError("Select an expense category.");
      return;
    }

    if (!expenseDate) {
      setError("Select an expense date.");
      return;
    }

    try {
      setSaving(true);

      await createExpense({
        amount: numericAmount,
        category,
        description: description.trim() || undefined,
        vendor: vendor.trim() || undefined,
        expense_date: expenseDate,
        is_recurring: isRecurring,
      });

      router.push("/expenses");
      router.refresh();
    } catch (err) {
      console.error("[ExpenseForm] Failed to create expense:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save expense. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}

      <div className="mb-8">
        <Link
          href="/expenses"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Expenses
        </Link>

        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37]">
            EXPENSE MANAGEMENT
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
            Add Expense
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
            Record a business expense so ArkenOne can incorporate it into
            financial health, profitability, cash flow, and CFO analysis.
          </p>
        </div>
      </div>

      {/* Form */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-[30px] border border-white/[0.06] bg-[#101114] p-8 lg:p-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
              <Wallet size={20} className="text-[#D4AF37]" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                FINANCIAL RECORD
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Expense Details
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Amount */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Amount
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-zinc-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#0D1014]
                    py-4
                    pl-10
                    pr-4
                    text-lg
                    font-medium
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-[#D4AF37]/40
                    focus:ring-1
                    focus:ring-[#D4AF37]/20
                  "
                />
              </div>
            </div>

            {/* Category */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
                  w-full
                  appearance-none
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-[#0D1014]
                  px-4
                  py-4
                  text-sm
                  text-white
                  outline-none
                  transition
                  focus:border-[#D4AF37]/40
                  focus:ring-1
                  focus:ring-[#D4AF37]/20
                "
              >
                <option value="" disabled>
                  Select category
                </option>

                {EXPENSE_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Vendor
                <span className="ml-2 text-xs text-zinc-600">
                  Optional
                </span>
              </label>

              <div className="relative">
                <Store
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. AWS, Adobe, Landlord"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#0D1014]
                    py-4
                    pl-11
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-[#D4AF37]/40
                    focus:ring-1
                    focus:ring-[#D4AF37]/20
                  "
                />
              </div>
            </div>

            {/* Date */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Expense Date
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                />

                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#0D1014]
                    py-4
                    pl-11
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    focus:border-[#D4AF37]/40
                    focus:ring-1
                    focus:ring-[#D4AF37]/20
                  "
                />
              </div>
            </div>

            {/* Recurring */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Expense Type
              </label>

              <button
                type="button"
                onClick={() => setIsRecurring((value) => !value)}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  px-4
                  py-4
                  text-left
                  transition
                  ${
                    isRecurring
                      ? "border-[#D4AF37]/30 bg-[#D4AF37]/[0.06]"
                      : "border-white/[0.07] bg-[#0D1014]"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Repeat
                    size={17}
                    className={
                      isRecurring
                        ? "text-[#D4AF37]"
                        : "text-zinc-600"
                    }
                  />

                  <div>
                    <p className="text-sm font-medium text-white">
                      Recurring expense
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      Repeats as part of ongoing business costs
                    </p>
                  </div>
                </div>

                <div
                  className={`
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    border
                    transition
                    ${
                      isRecurring
                        ? "border-[#D4AF37] bg-[#D4AF37]"
                        : "border-white/[0.12] bg-transparent"
                    }
                  `}
                >
                  {isRecurring && (
                    <Check size={14} className="text-black" />
                  )}
                </div>
              </button>
            </div>

            {/* Description */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Description
                <span className="ml-2 text-xs text-zinc-600">
                  Optional
                </span>
              </label>

              <div className="relative">
                <FileText
                  size={17}
                  className="pointer-events-none absolute left-4 top-4 text-zinc-600"
                />

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this expense for?"
                  rows={4}
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#0D1014]
                    py-4
                    pl-11
                    pr-4
                    text-sm
                    leading-7
                    text-white
                    outline-none
                    transition
                    placeholder:text-zinc-700
                    focus:border-[#D4AF37]/40
                    focus:ring-1
                    focus:ring-[#D4AF37]/20
                  "
                />
              </div>
            </div>
          </div>
        </section>

        {/* Error */}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/expenses"
            className="
              inline-flex
              items-center
              justify-center
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.02]
              px-6
              py-3.5
              text-sm
              font-medium
              text-zinc-400
              transition
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#D4AF37]
              px-7
              py-3.5
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-[#E0BE4A]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}