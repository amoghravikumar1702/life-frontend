"use client";

import { useState } from "react";

import {
  ArrowRight,
  IndianRupee,
  Sparkles,
  HelpCircle,
} from "lucide-react";

interface FinancialSetupStepProps {
  initialRevenue?: number | null;
  onContinue: (
    revenue: number | null
  ) => void;
}

function formatPreview(value: string) {
  const numeric = Number(
    value.replace(/,/g, "")
  );

  if (
    !Number.isFinite(numeric) ||
    numeric <= 0
  ) {
    return "₹0";
  }

  return `₹${numeric.toLocaleString(
    "en-IN"
  )}`;
}

export default function FinancialSetupStep({
  initialRevenue = null,
  onContinue,
}: FinancialSetupStepProps) {
  const [revenue, setRevenue] =
    useState(
      initialRevenue !== null &&
      initialRevenue !== undefined &&
      initialRevenue > 0
        ? String(initialRevenue)
        : ""
    );

  const [unknownRevenue, setUnknownRevenue] =
    useState(false);

  const numericRevenue = Number(
    revenue.replace(/,/g, "")
  );

  const valid =
    unknownRevenue ||
    (Number.isFinite(
      numericRevenue
    ) &&
      numericRevenue >= 0);

  function handleContinue() {
    if (!valid) {
      return;
    }

    if (unknownRevenue) {
      onContinue(null);
      return;
    }

    onContinue(
      Math.max(
        0,
        numericRevenue
      )
    );
  }

  function handleUnknownRevenue() {
    setUnknownRevenue(true);
    setRevenue("");
  }

  function handleEnterAmount() {
    setUnknownRevenue(false);
  }

  return (
    <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-[28px] border border-[#D4AF37]/15 bg-[#101318]">
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
              Give DhanarkOS a starting point
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
            How much has your business earned so far?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-500">
            An estimate is completely fine. DhanarkOS
            will combine this starting point with the
            actual financial activity you record.
          </p>
        </div>

        {!unknownRevenue && (
          <div className="mx-auto mt-8 max-w-xl">
            <label
              htmlFor="current-business-income"
              className="mb-2 block text-left text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600"
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
                  const value =
                    event.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(
                        /^(\d*\.\d{0,2}).*$/,
                        "$1"
                      );

                  setRevenue(value);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
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
                Starting revenue:{" "}
                <span className="text-zinc-400">
                  {formatPreview(
                    revenue
                  )}
                </span>
              </p>
            )}

            <p className="mt-3 text-xs text-zinc-600">
              It does not need to be exact.
            </p>
          </div>
        )}

        {unknownRevenue && (
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
                <HelpCircle
                  size={17}
                  className="text-[#D4AF37]"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-200">
                  That's completely fine.
                </p>

                <p className="mt-1 text-xs leading-6 text-zinc-600">
                  DhanarkOS will build your financial
                  picture from the transactions you
                  record.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleEnterAmount
              }
              className="mt-4 text-xs font-medium text-[#D4AF37] transition hover:text-[#E6C75A]"
            >
              I know the amount →
            </button>
          </div>
        )}

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
            Your AI CFO will use
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-sm text-zinc-300">
                Business
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Your company and business model
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-300">
                Revenue
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Your starting financial position
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-300">
                Transactions
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Actual activity recorded in DhanarkOS
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {!unknownRevenue && (
            <button
              type="button"
              onClick={
                handleUnknownRevenue
              }
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <HelpCircle
                size={16}
                strokeWidth={1.7}
              />

              I don't know yet
            </button>
          )}

          <button
            type="button"
            onClick={
              handleContinue
            }
            disabled={!valid}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {unknownRevenue
              ? "Continue Without Revenue"
              : "Finish Setup"}

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