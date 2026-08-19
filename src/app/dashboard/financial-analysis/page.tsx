"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wallet,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  getFinancialAnalysis,
  FinancialAnalysis,
} from "@/services/financialAnalysisService";

function money(value: number) {
  return `₹${value.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;
}

function percentage(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatPeriod(
  start: string | null,
  end: string | null
) {
  if (!start || !end) {
    return "No activity recorded";
  }

  const startDate =
    new Date(start);

  const endDate =
    new Date(end);

  if (
    Number.isNaN(
      startDate.getTime()
    ) ||
    Number.isNaN(
      endDate.getTime()
    )
  ) {
    return "Period unavailable";
  }

  const formatter =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        month: "short",
        year: "numeric",
      }
    );

  const startLabel =
    formatter.format(
      startDate
    );

  const endLabel =
    formatter.format(
      endDate
    );

  if (
    startLabel ===
    endLabel
  ) {
    return startLabel;
  }

  return `${startLabel} → ${endLabel}`;
}

export default function FinancialAnalysisPage() {
  const [data, setData] =
    useState<FinancialAnalysis | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  async function loadAnalysis() {
    try {
      setError(null);

      const result =
        await getFinancialAnalysis();

      setData(result);
    } catch (err) {
      console.error(
        "[Financial Analysis] Load error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load financial analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalysis();

    const interval =
      window.setInterval(
        loadAnalysis,
        30000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);

  const maxChartValue =
    useMemo(() => {
      if (
        !data?.monthlyData.length
      ) {
        return 1;
      }

      return Math.max(
        ...data.monthlyData.flatMap(
          (item) => [
            item.revenue,
            item.expenses,
          ]
        ),
        1
      );
    }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030712] px-4 pb-10 pt-5 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-72 animate-pulse rounded-[30px] border border-white/[0.06] bg-white/[0.025]" />

          <div className="mt-6 h-64 animate-pulse rounded-[30px] border border-white/[0.06] bg-white/[0.025]" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#030712] px-4 pb-10 pt-5 text-white md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-red-400/10 bg-[#111318] p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-red-400">
              Financial Analysis
            </p>

            <h1 className="mt-3 text-xl font-semibold">
              Unable to load financial data
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadAnalysis
              }
              className="mt-6 flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black"
            >
              <RefreshCw
                size={15}
              />
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const profitPositive =
    data.netProfit >= 0;

  const cashFlowPositive =
    data.netCashFlow >= 0;

  return (
    <main className="min-h-screen min-w-0 bg-[#030712] px-3 pb-10 pt-3 text-white sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#101113] px-6 py-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)] md:px-10 md:py-10">

          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#D4AF37]/[0.035] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="flex items-start gap-5">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.07]">
                <BarChart3
                  size={27}
                  className="text-[#D4AF37]"
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
                  Intelligence
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#E8C75A] md:text-5xl">
                  Financial Analysis
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
                  Understand how revenue becomes
                  profit, identify cost drivers,
                  monitor margins, and make informed
                  financial decisions using live
                  financial intelligence.
                </p>

                <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live financial data
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={
                loadAnalysis
              }
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs font-medium text-zinc-400 transition hover:border-[#D4AF37]/20 hover:text-white"
            >
              <RefreshCw
                size={14}
              />
              Refresh
            </button>
          </div>
        </section>

        {/* =====================================================
            EXECUTIVE SUMMARY
        ====================================================== */}

        <section className="mt-6 rounded-[30px] border border-white/[0.07] bg-[#101113] p-6 md:p-8">

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
              Executive Summary
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Live business performance
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              Automatically calculated from your
              invoices and expenses.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* REVENUE */}

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                <TrendingUp
                  size={15}
                  className="text-emerald-400"
                />
                Total Revenue
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {money(
                  data.totalRevenue
                )}
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                Invoice value
              </p>
            </div>

            {/* EXPENSES */}

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                <TrendingDown
                  size={15}
                  className="text-red-400"
                />
                Total Expenses
              </div>

              <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                {money(
                  data.totalExpenses
                )}
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                Recorded business costs
              </p>
            </div>

            {/* PROFIT */}

            <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.025] p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                <Wallet
                  size={15}
                  className="text-[#D4AF37]"
                />
                Net Profit
              </div>

              <p
                className={`mt-4 text-3xl font-semibold tracking-tight ${
                  profitPositive
                    ? "text-[#E8C75A]"
                    : "text-red-400"
                }`}
              >
                {money(
                  data.netProfit
                )}
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                Revenue minus expenses
              </p>
            </div>

            {/* MARGIN */}

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                <BarChart3
                  size={15}
                  className="text-purple-400"
                />
                Profit Margin
              </div>

              <p
                className={`mt-4 text-3xl font-semibold tracking-tight ${
                  data.profitMargin >= 0
                    ? "text-white"
                    : "text-red-400"
                }`}
              >
                {percentage(
                  data.profitMargin
                )}
              </p>

              <p className="mt-2 text-xs text-zinc-600">
                Net profit as % of revenue
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            CHARTS
        ====================================================== */}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">

          {/* REVENUE VS EXPENSE */}

          <div className="rounded-[30px] border border-white/[0.07] bg-[#101113] p-6 md:p-8">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                  Performance
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#E8C75A]">
                  Revenue vs Expenses
                </h2>

                <p className="mt-1 text-sm text-zinc-600">
                  Monthly financial performance
                </p>
              </div>

              <div className="flex gap-4 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Revenue
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Expenses
                </span>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <div className="flex min-w-[520px] items-end gap-3">

                {data.monthlyData.map(
                  (item) => {
                    const revenueHeight =
                      Math.max(
                        (item.revenue /
                          maxChartValue) *
                          180,
                        4
                      );

                    const expenseHeight =
                      Math.max(
                        (item.expenses /
                          maxChartValue) *
                          180,
                        4
                      );

                    return (
                      <div
                        key={
                          item.month
                        }
                        className="flex flex-1 flex-col items-center"
                      >
                        <div className="flex h-[190px] items-end gap-2">

                          <div
                            title={`Revenue: ${money(
                              item.revenue
                            )}`}
                            style={{
                              height: `${revenueHeight}px`,
                            }}
                            className="w-5 rounded-t-md bg-emerald-400/70 transition-all"
                          />

                          <div
                            title={`Expenses: ${money(
                              item.expenses
                            )}`}
                            style={{
                              height: `${expenseHeight}px`,
                            }}
                            className="w-5 rounded-t-md bg-red-400/60 transition-all"
                          />

                        </div>

                        <span className="mt-3 text-[10px] uppercase tracking-wider text-zinc-600">
                          {item.month}
                        </span>
                      </div>
                    );
                  }
                )}

                {data.monthlyData
                  .length === 0 && (
                  <div className="flex h-[190px] w-full items-center justify-center text-sm text-zinc-600">
                    No financial history yet.
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* CASH FLOW */}

          <div className="rounded-[30px] border border-white/[0.07] bg-[#101113] p-6 md:p-8">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                  Liquidity
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#E8C75A]">
                  Cash Flow Overview
                </h2>

                <p className="mt-1 text-sm text-zinc-600">
                  Money moving through your business
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em] ${
                  cashFlowPositive
                    ? "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-400"
                    : "border-red-400/10 bg-red-400/[0.04] text-red-400"
                }`}
              >
                {cashFlowPositive
                  ? "Healthy"
                  : "Attention"}
              </span>
            </div>

            {/* NET CASH FLOW */}

            <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                    Net Cash Flow
                  </p>

                  <p
                    className={`mt-3 text-3xl font-semibold tracking-tight ${
                      cashFlowPositive
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {money(
                      data.netCashFlow
                    )}
                  </p>

                  <p className="mt-2 text-xs text-zinc-600">
                    {cashFlowPositive
                      ? "Cash inflow exceeded cash outflow."
                      : "Cash outflow exceeded cash inflow."}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    cashFlowPositive
                      ? "border-emerald-400/10 bg-emerald-400/[0.04]"
                      : "border-red-400/10 bg-red-400/[0.04]"
                  }`}
                >
                  {cashFlowPositive ? (
                    <ArrowUpRight
                      size={18}
                      className="text-emerald-400"
                    />
                  ) : (
                    <ArrowDownRight
                      size={18}
                      className="text-red-400"
                    />
                  )}
                </div>

              </div>

            </div>

            {/* CASH INFLOW */}

            <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/[0.06]">
                    <ArrowUpRight
                      size={17}
                      className="text-emerald-400"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Cash Inflow
                    </p>

                    <p className="text-[10px] text-zinc-600">
                      Payments received
                    </p>
                  </div>

                </div>

                <span className="text-sm font-semibold text-emerald-400">
                  {money(
                    data.cashInflow
                  )}
                </span>

              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{
                    width: `${
                      data.cashInflow +
                        data.cashOutflow >
                      0
                        ? Math.min(
                            100,
                            (data.cashInflow /
                              (data.cashInflow +
                                data.cashOutflow)) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

            </div>

            {/* CASH OUTFLOW */}

            <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-4">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/[0.06]">
                    <ArrowDownRight
                      size={17}
                      className="text-red-400"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Cash Outflow
                    </p>

                    <p className="text-[10px] text-zinc-600">
                      Business expenses
                    </p>
                  </div>

                </div>

                <span className="text-sm font-semibold text-red-400">
                  {money(
                    data.cashOutflow
                  )}
                </span>

              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{
                    width: `${
                      data.cashInflow +
                        data.cashOutflow >
                      0
                        ? Math.min(
                            100,
                            (data.cashOutflow /
                              (data.cashInflow +
                                data.cashOutflow)) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

            </div>

            {/* LIQUIDITY POSITION */}

            <div
              className={`mt-4 rounded-xl border px-4 py-4 ${
                cashFlowPositive
                  ? "border-emerald-400/10 bg-emerald-400/[0.025]"
                  : "border-red-400/10 bg-red-400/[0.025]"
              }`}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                    Liquidity Position
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${
                      cashFlowPositive
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {cashFlowPositive
                      ? "Positive cash flow"
                      : "Cash flow deficit"}
                  </p>

                </div>

                <span
                  className={`h-2 w-2 rounded-full ${
                    cashFlowPositive
                      ? "bg-emerald-400"
                      : "bg-red-400"
                  }`}
                />

              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.05] pt-3">

                <div>

                  <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                    Analysis Period
                  </p>

                  <p className="mt-1 text-xs font-medium text-zinc-400">
                    {formatPeriod(
                      data.periodStart,
                      data.periodEnd
                    )}
                  </p>

                </div>

                <p
                  className={`text-right text-xs font-medium ${
                    cashFlowPositive
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {cashFlowPositive
                    ? "Inflow exceeds outflow"
                    : "Outflow exceeds inflow"}
                </p>

              </div>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}