// NEXT FILE: src/components/onboarding/FinancialSetupStep.tsx

"use client";

import { useState } from "react";
import { ArrowRight, IndianRupee, Sparkles } from "lucide-react";

interface FinancialSetupStepProps {
  initialRevenue?: number;
  onContinue: (revenue: number) => void;
}

function formatPreview(value: string) {
  const numeric = Number(value.replace(/,/g, ""));

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "₹0";
  }

  return `₹${numeric.toLocaleString("en-IN")}`;
}

export default function FinancialSetupStep({
  initialRevenue = 0,
  onContinue,
}: FinancialSetupStepProps) {
  const [revenue, setRevenue] = useState(
    initialRevenue > 0 ? String(initialRevenue) : ""
  );

  const numericRevenue = Number(
    revenue.replace(/,/g, "")
  );

  const valid =
    Number.isFinite(numericRevenue) &&
    numericRevenue >= 0;

  function handleContinue() {
    if (!valid) return;

    onContinue(Math.max(0, numericRevenue));
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#D4AF37]/15 bg-[#101318]">
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[360px] w-[600px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.045] blur-[120px]" />

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
            <Sparkles
              size={18}
              className="text-[#D4AF37]"
              strokeWidth={1.7}
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Financial Setup
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              One number to get ArkenOne started
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
            How much has your business earned so far?
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
            Enter your current total business income.
            ArkenOne will use this as your starting revenue
            and combine it with your invoices and expenses.
          </p>
        </div>

        <div className="mt-8 max-w-xl">
          <label
            htmlFor="current-business-income"
            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600"
          >
            Current Total Income
          </label>

          <div className="flex items-center rounded-2xl border border-[#D4AF37]/15 bg-black/25 px-5 transition focus-within:border-[#D4AF37]/35">
            <IndianRupee
              size={20}
              className="shrink-0 text-[#D4AF37]"
              strokeWidth={1.7}
            />

            <input
              id="current-business-income"
              type="text"
              inputMode="decimal"
              value={revenue}
              onChange={(event) => {
                const value = event.target.value
                  .replace(/[^\d.]/g, "")
                  .replace(/(\..*)\./g, "$1");

                setRevenue(value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleContinue();
                }
              }}
              placeholder="0"
              className="min-h-16 w-full bg-transparent px-4 text-2xl font-medium text-white outline-none placeholder:text-zinc-700"
              autoFocus
            />
          </div>

          {revenue && valid && (
            <p className="mt-3 text-xs text-zinc-600">
              ArkenOne will start your revenue at{" "}
              <span className="text-zinc-400">
                {formatPreview(revenue)}
              </span>
              .
            </p>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            How ArkenOne uses it
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-sm text-zinc-300">
                Revenue
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Your starting business income
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-300">
                Expenses
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Expenses recorded in ArkenOne
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-300">
                Profit
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Revenue minus expenses
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!valid}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Continue
            <ArrowRight
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    </section>
  );
}