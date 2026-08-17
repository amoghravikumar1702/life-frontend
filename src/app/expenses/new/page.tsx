"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";

import PageContainer from "@/components/ui/PageContainer";
import { createExpense } from "@/services/expenseService";

const categories = [
  "Salaries & Wages",
  "Rent",
  "Utilities",
  "Software & Subscriptions",
  "Marketing",
  "Operations",
  "Travel",
  "Equipment",
  "Professional Services",
  "Taxes",
  "Other",
];

export default function NewExpensePage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState("Salaries & Wages");

  const [vendor, setVendor] = useState("");

  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [description, setDescription] =
    useState("");

  const [isRecurring, setIsRecurring] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const numericAmount =
      Number(amount);

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      setError(
        "Enter a valid expense amount."
      );
      return;
    }

    if (!expenseDate) {
      setError(
        "Select an expense date."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createExpense({
        amount: numericAmount,
        category,
        vendor:
          vendor.trim() || undefined,
        expense_date: expenseDate,
        description:
          description.trim() ||
          undefined,
        is_recurring: isRecurring,
      });

      router.push("/expenses");
    } catch (err) {
      console.error(
        "[NewExpensePage] Failed to create expense:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create expense."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageContainer>
      <div className="mx-auto mt-8 max-w-4xl space-y-8 pb-12">

        {/* HEADER */}

        <section>
          <Link
            href="/expenses"
            className="
              inline-flex
              items-center
              gap-2
              text-xs
              font-medium
              text-zinc-500
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={14} />
            Back to Expenses
          </Link>

          <div className="mt-7">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
              FINANCIAL MANAGEMENT
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
              Add Expense
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
              Record a business expense so ArkenOne can
              accurately understand profitability, cash flow,
              and financial health.
            </p>
          </div>
        </section>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.06]
            bg-[#101114]
          "
        >

          {/* FORM HEADER */}

          <div className="border-b border-white/[0.05] px-6 py-6 sm:px-8">
            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#D4AF37]/15
                  bg-[#D4AF37]/[0.06]
                "
              >
                <Receipt
                  size={20}
                  className="text-[#D4AF37]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Expense Details
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Enter the details of this business expense.
                </p>
              </div>

            </div>
          </div>

          {/* FORM BODY */}

          <div className="space-y-7 p-6 sm:p-8">

            {error && (
              <div
                className="
                  rounded-2xl
                  border
                  border-red-500/20
                  bg-red-500/[0.06]
                  px-5
                  py-4
                  text-sm
                  text-red-400
                "
              >
                {error}
              </div>
            )}

            {/* Amount + Category */}

            <div className="grid gap-6 md:grid-cols-2">

              {/* AMOUNT */}

              <div>
                <label
                  htmlFor="amount"
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-zinc-500
                  "
                >
                  Amount
                </label>

                <div className="relative">

                  <span
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-sm
                      text-zinc-600
                    "
                  >
                    ₹
                  </span>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    required
                    className="
                      h-12
                      w-full
                      rounded-2xl
                      border
                      border-white/[0.07]
                      bg-white/[0.025]
                      pl-9
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-zinc-700
                      transition
                      focus:border-[#D4AF37]/25
                      focus:bg-white/[0.035]
                      focus:ring-1
                      focus:ring-[#D4AF37]/10
                    "
                  />

                </div>
              </div>

              {/* CATEGORY */}

              <div>
                <label
                  htmlFor="category"
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-zinc-500
                  "
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  className="
                    h-12
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-[#15171B]
                    px-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    focus:border-[#D4AF37]/25
                    focus:ring-1
                    focus:ring-[#D4AF37]/10
                  "
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-[#15171B]"
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

            {/* Vendor + Date */}

            <div className="grid gap-6 md:grid-cols-2">

              {/* VENDOR */}

              <div>
                <label
                  htmlFor="vendor"
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-zinc-500
                  "
                >
                  Vendor
                </label>

                <input
                  id="vendor"
                  name="vendor"
                  type="text"
                  value={vendor}
                  onChange={(event) =>
                    setVendor(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Microsoft, AWS, Landlord"
                  className="
                    h-12
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    px-4
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-zinc-700
                    transition
                    focus:border-[#D4AF37]/25
                    focus:bg-white/[0.035]
                    focus:ring-1
                    focus:ring-[#D4AF37]/10
                  "
                />
              </div>

              {/* DATE */}

              <div>
                <label
                  htmlFor="expense-date"
                  className="
                    mb-2
                    block
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-zinc-500
                  "
                >
                  Expense Date
                </label>

                <input
                  id="expense-date"
                  name="expense_date"
                  type="date"
                  value={expenseDate}
                  onChange={(event) =>
                    setExpenseDate(
                      event.target.value
                    )
                  }
                  required
                  className="
                    h-12
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    px-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    focus:border-[#D4AF37]/25
                    focus:bg-white/[0.035]
                    focus:ring-1
                    focus:ring-[#D4AF37]/10
                  "
                />
              </div>

            </div>

            {/* DESCRIPTION */}

            <div>
              <label
                htmlFor="description"
                className="
                  mb-2
                  block
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-zinc-500
                "
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Add any useful context about this expense..."
                rows={5}
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-3.5
                  text-sm
                  leading-6
                  text-white
                  outline-none
                  placeholder:text-zinc-700
                  transition
                  focus:border-[#D4AF37]/25
                  focus:bg-white/[0.035]
                  focus:ring-1
                  focus:ring-[#D4AF37]/10
                "
              />
            </div>

            {/* RECURRING */}

            <button
              type="button"
              onClick={() =>
                setIsRecurring(
                  (current) => !current
                )
              }
              className="
                flex
                w-full
                items-center
                justify-between
                gap-4
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.02]
                px-5
                py-4
                text-left
                transition
                hover:border-white/[0.10]
                hover:bg-white/[0.035]
              "
            >
              <div>
                <p className="text-sm font-medium text-white">
                  Recurring expense
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Mark this when the expense repeats regularly.
                </p>
              </div>

              <div
                className={`
                  flex
                  h-6
                  w-11
                  shrink-0
                  items-center
                  rounded-full
                  p-1
                  transition
                  ${
                    isRecurring
                      ? "bg-[#D4AF37]"
                      : "bg-white/[0.08]"
                  }
                `}
              >
                <div
                  className={`
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    shadow-sm
                    transition-transform
                    ${
                      isRecurring
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                >
                  {isRecurring && (
                    <Check
                      size={10}
                      className="text-black"
                    />
                  )}
                </div>
              </div>
            </button>

          </div>

          {/* ACTIONS */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-white/[0.05]
              bg-white/[0.01]
              px-6
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-end
              sm:px-8
            "
          >

            <Link
              href="/expenses"
              className="
                inline-flex
                h-11
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.07]
                px-5
                text-sm
                font-medium
                text-zinc-400
                transition
                hover:bg-white/[0.04]
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
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#D4AF37]
                px-6
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-[#E0BE4A]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-black/20
                      border-t-black
                    "
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save Expense
                </>
              )}
            </button>

          </div>

        </form>

        {/* CFO NOTE */}

        <section
          className="
            rounded-[28px]
            border
            border-[#D4AF37]/10
            bg-[#D4AF37]/[0.025]
            p-6
            sm:p-7
          "
        >
          <div className="flex items-start gap-4">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#D4AF37]/15
                bg-[#D4AF37]/[0.06]
              "
            >
              <Receipt
                size={18}
                className="text-[#D4AF37]"
              />
            </div>

            <div>

              <p className="text-[10px] uppercase tracking-[0.32em] text-[#D4AF37]">
                ARKENONE CFO
              </p>

              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Every expense you record improves ArkenOne&apos;s
                understanding of your actual costs, profitability,
                cash position, and financial health.
              </p>

            </div>

          </div>
        </section>

      </div>
    </PageContainer>
  );
}