"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  FileText,
  CalendarDays,
  TrendingUp,
  Wallet,
  Receipt,
  Sparkles,
  CircleDollarSign,
  Clock3,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  report_type: string;
  period_start: string;
  period_end: string;
  status: string;
  metadata: Record<string, unknown> | null;
  report_data: Record<string, unknown> | null;
  created_at: string;
}

interface Metric {
  label: string;
  value: number;
  change?: number;
}

function formatCurrency(value: unknown) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(value: unknown) {
  return new Intl.NumberFormat("en-IN").format(
    Number(value ?? 0)
  );
}

function getNumber(
  data: Record<string, unknown> | null,
  keys: string[]
) {
  if (!data) return 0;

  for (const key of keys) {
    if (
      data[key] !== undefined &&
      data[key] !== null
    ) {
      const value = Number(data[key]);

      if (!Number.isNaN(value)) {
        return value;
      }
    }
  }

  return 0;
}

function getString(
  data: Record<string, unknown> | null,
  keys: string[]
) {
  if (!data) return "";

  for (const key of keys) {
    if (typeof data[key] === "string") {
      return data[key] as string;
    }
  }

  return "";
}

function getStringArray(
  data: Record<string, unknown> | null,
  keys: string[]
) {
  if (!data) return [];

  for (const key of keys) {
    if (Array.isArray(data[key])) {
      return data[key].filter(
        (item): item is string =>
          typeof item === "string"
      );
    }
  }

  return [];
}

function getMetrics(
  data: Record<string, unknown> | null
): Metric[] {
  if (!data || !Array.isArray(data.metrics)) {
    return [];
  }

  return data.metrics.filter(
    (item): item is Metric =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Metric).label === "string" &&
      typeof (item as Metric).value === "number"
  );
}

function getMetricValue(
  metrics: Metric[],
  labels: string[]
) {
  const metric = metrics.find((item) =>
    labels.some(
      (label) =>
        item.label.toLowerCase() ===
        label.toLowerCase()
    )
  );

  return metric?.value ?? 0;
}

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [report, setReport] =
    useState<Report | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [downloading, setDownloading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        const { id } = await params;

        const response = await fetch(
          `/api/reports/${id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load report."
          );
        }

        const data = await response.json();

        setReport(data);
      } catch (err) {
        console.error(
          "[ReportDetail] Failed to load report:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load report."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [params]);

  async function downloadReport() {
    if (!report) return;

    try {
      setDownloading(true);

      const { pdf } =
        await import("@react-pdf/renderer");

      const {
        default: ExecutiveReportPDF,
      } = await import(
        "@/components/reports/ExecutiveReportPDF"
      );

      const blob = await pdf(
        <ExecutiveReportPDF report={report} />
      ).toBlob();

      const url =
        URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = url;

      anchor.download = `${report.title
        .replace(/[^a-z0-9]+/gi, "-")
        .toLowerCase()}.pdf`;

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        "[ReportDetail] Failed to download PDF:",
        err
      );

      alert(
        "Unable to generate the PDF. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-zinc-500">
          Loading executive report...
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/reports"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Reports
        </Link>

        <div className="rounded-[30px] border border-red-500/20 bg-red-500/[0.05] p-8">
          <p className="text-sm text-red-400">
            {error || "Report not found."}
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * REPORT DATA STRUCTURE
   *
   * Generated reports are stored as:
   *
   * report_data
   * ├── title
   * ├── type
   * ├── period
   * ├── metrics
   * ├── summary
   * ├── metadata
   * ├── tables
   * ├── recommendations
   * └── raw
   *
   * The old page incorrectly searched only the top level
   * for revenue / outstanding / etc.
   *
   * We now read both:
   *
   *   report_data.metrics
   *   report_data.raw
   *
   * so existing generated reports work correctly.
   * ============================================================
   */

  const data = report.report_data;

  const raw =
    data &&
    typeof data.raw === "object" &&
    data.raw !== null
      ? (data.raw as Record<string, unknown>)
      : null;

  const metrics = getMetrics(data);

  /*
   * Revenue
   */

  const revenue =
    getNumber(raw, [
      "revenue",
      "totalRevenue",
    ]) ||
    getMetricValue(metrics, [
      "Revenue",
      "Total Revenue",
    ]);

  /*
   * Collected
   */

  const collected =
    getNumber(raw, [
      "collected",
      "totalCollected",
      "amountCollected",
    ]) ||
    getMetricValue(metrics, [
      "Collected",
      "Total Collected",
    ]);

  /*
   * Outstanding
   */

  const outstanding =
    getNumber(raw, [
      "outstanding",
      "receivables",
      "outstandingReceivables",
    ]) ||
    getMetricValue(metrics, [
      "Outstanding",
      "Receivables",
    ]);

  /*
   * Invoice count
   */

  const invoiceCount =
    getNumber(raw, [
      "invoiceCount",
      "totalInvoices",
    ]) ||
    getMetricValue(metrics, [
      "Invoices",
      "Total Invoices",
    ]);

  /*
   * Paid invoices
   */

  const paidInvoices =
    getNumber(raw, [
      "paidInvoices",
    ]) ||
    getMetricValue(metrics, [
      "Paid Invoices",
    ]);

  /*
   * Pending invoices
   */

  const pendingInvoices =
    getNumber(raw, [
      "pendingInvoices",
    ]) ||
    getMetricValue(metrics, [
      "Pending Invoices",
    ]);

  /*
   * Average invoice
   */

  const averageInvoice =
    getNumber(raw, [
      "averageInvoice",
      "averageReceivable",
    ]) ||
    getMetricValue(metrics, [
      "Average Invoice",
      "Average Receivable",
    ]);

  /*
   * Collection rate
   */

  const collectionRate =
    getNumber(raw, [
      "collectionRate",
    ]) ||
    getMetricValue(metrics, [
      "Collection Rate",
    ]);

  /*
   * Profit and expenses are intentionally NOT invented.
   *
   * The current revenue generator does not calculate them.
   */

  const expenses =
    getNumber(raw, [
      "expenses",
      "totalExpenses",
    ]) ||
    getMetricValue(metrics, [
      "Expenses",
      "Total Expenses",
    ]);

  const profit =
    getNumber(raw, [
      "profit",
      "netProfit",
    ]) ||
    getMetricValue(metrics, [
      "Profit",
      "Net Profit",
    ]);

  const hasProfitData =
    expenses !== 0 || profit !== 0;

  const calculatedProfitMargin =
    revenue > 0 && hasProfitData
      ? (profit / revenue) * 100
      : 0;

  /*
   * Text intelligence
   */

  const executiveSummary =
    getString(data, [
      "summary",
      "executiveSummary",
      "description",
    ]);

  const strengths =
    getStringArray(data, [
      "strengths",
      "financialStrengths",
    ]);

  const risks =
    getStringArray(data, [
      "risks",
      "financialRisks",
    ]);

  const recommendations =
    getStringArray(data, [
      "recommendations",
      "financialRecommendations",
    ]);

  /*
   * Report-specific metrics
   */

  const isRevenueReport =
    report.report_type === "revenue";

  const isReceivablesReport =
    report.report_type === "receivables";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href="/dashboard/reports"
            className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Reports
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
              <FileText
                size={24}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
                DhanarkOS · EXECUTIVE REPORT
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white lg:text-4xl">
                {report.title}
              </h1>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadReport}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#E0BE4A] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={17} />

          {downloading
            ? "Preparing PDF..."
            : "Download Executive Report"}
        </button>
      </div>

      {/* ========================================================
          META
      ======================================================== */}

      <section className="rounded-[30px] border border-white/[0.07] bg-[#101114] p-6 lg:p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <CalendarDays
              size={19}
              className="text-zinc-600"
            />

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                Reporting Period
              </p>

              <p className="mt-1 text-sm text-zinc-300">
                {new Date(
                  report.period_start
                ).toLocaleDateString("en-IN")}{" "}
                —{" "}
                {new Date(
                  report.period_end
                ).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FileText
              size={19}
              className="text-zinc-600"
            />

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                Report Type
              </p>

              <p className="mt-1 text-sm capitalize text-zinc-300">
                {report.report_type.replace(
                  /_/g,
                  " "
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Sparkles
              size={19}
              className="text-[#D4AF37]"
            />

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                Status
              </p>

              <p className="mt-1 text-sm capitalize text-emerald-400">
                {report.status}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SUMMARY
      ======================================================== */}

      {executiveSummary && (
        <section className="rounded-[30px] border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
            Executive Summary
          </p>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-zinc-300">
            {executiveSummary}
          </p>
        </section>
      )}

      {/* ========================================================
          FINANCIAL OVERVIEW
      ======================================================== */}

      <section>
        <div className="mb-5">
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600">
            Financial Overview
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Executive Performance
          </h2>
        </div>

        {isReceivablesReport ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Outstanding
                </p>

                <Wallet
                  size={18}
                  className="text-zinc-600"
                />
              </div>

              <p className="text-3xl font-semibold text-white">
                {formatCurrency(outstanding)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Pending Invoices
                </p>

                <Clock3
                  size={18}
                  className="text-zinc-600"
                />
              </div>

              <p className="text-3xl font-semibold text-white">
                {formatNumber(
                  pendingInvoices ||
                    getMetricValue(
                      metrics,
                      ["Pending Invoices"]
                    )
                )}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Average Receivable
                </p>

                <Receipt
                  size={18}
                  className="text-zinc-600"
                />
              </div>

              <p className="text-3xl font-semibold text-[#D4AF37]">
                {formatCurrency(
                  averageInvoice
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Revenue
                </p>

                <TrendingUp
                  size={18}
                  className="text-zinc-600"
                />
              </div>

              <p className="text-3xl font-semibold text-white">
                {formatCurrency(revenue)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Collected
                </p>

                <CircleDollarSign
                  size={18}
                  className="text-zinc-600"
                />
              </div>

              <p className="text-3xl font-semibold text-white">
                {formatCurrency(collected)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Outstanding
                </p>

                <Wallet
                  size={18}
                  className="text-zinc-600"
                />
              </div>

              <p className="text-3xl font-semibold text-[#D4AF37]">
                {formatCurrency(outstanding)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  Collection Rate
                </p>
              </div>

              <p className="text-3xl font-semibold text-white">
                {collectionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          REVENUE DETAILS
      ======================================================== */}

      {isRevenueReport && (
        <section>
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600">
              Revenue Intelligence
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Collection Performance
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <p className="text-xs text-zinc-500">
                Total Invoices
              </p>

              <p className="mt-4 text-2xl font-semibold text-white">
                {formatNumber(invoiceCount)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <p className="text-xs text-zinc-500">
                Paid Invoices
              </p>

              <p className="mt-4 text-2xl font-semibold text-emerald-400">
                {formatNumber(paidInvoices)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <p className="text-xs text-zinc-500">
                Pending Invoices
              </p>

              <p className="mt-4 text-2xl font-semibold text-amber-400">
                {formatNumber(pendingInvoices)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <p className="text-xs text-zinc-500">
                Average Invoice
              </p>

              <p className="mt-4 text-2xl font-semibold text-white">
                {formatCurrency(averageInvoice)}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          EXPENSE / PROFIT
          Only shown if the generator actually supplied data.
      ======================================================== */}

      {hasProfitData && (
        <section>
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600">
              Profitability
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Business Performance
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <p className="text-xs text-zinc-500">
                Expenses
              </p>

              <p className="mt-4 text-2xl font-semibold text-white">
                {formatCurrency(expenses)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <p className="text-xs text-zinc-500">
                Net Profit
              </p>

              <p className="mt-4 text-2xl font-semibold text-[#D4AF37]">
                {formatCurrency(profit)}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6">
              <p className="text-xs text-zinc-500">
                Profit Margin
              </p>

              <p className="mt-4 text-2xl font-semibold text-white">
                {calculatedProfitMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          RECEIVABLES
      ======================================================== */}

      {!isReceivablesReport &&
        outstanding > 0 && (
          <section className="rounded-[30px] border border-white/[0.07] bg-[#101114] p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">
                  Liquidity
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Outstanding Receivables
                </h2>
              </div>

              <p className="text-3xl font-semibold text-white">
                {formatCurrency(outstanding)}
              </p>
            </div>
          </section>
        )}

      {/* ========================================================
          RAW METRICS
          Useful for report types that don't have a dedicated UI.
      ======================================================== */}

      {!isRevenueReport &&
        !isReceivablesReport &&
        metrics.length > 0 && (
          <section>
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600">
                Report Metrics
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Performance Snapshot
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[26px] border border-white/[0.07] bg-[#101114] p-6"
                >
                  <p className="text-xs text-zinc-500">
                    {metric.label}
                  </p>

                  <p className="mt-4 text-2xl font-semibold text-white">
                    {formatNumber(metric.value)}
                  </p>

                  {metric.change !==
                    undefined && (
                    <p className="mt-2 text-xs text-zinc-600">
                      {metric.change > 0
                        ? "+"
                        : ""}
                      {metric.change}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      {/* ========================================================
          INTELLIGENCE
      ======================================================== */}

      {(strengths.length > 0 ||
        risks.length > 0 ||
        recommendations.length >
          0) && (
        <section>
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]">
              DhanarkOS Intelligence
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Financial Intelligence
            </h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-[28px] border border-emerald-500/15 bg-emerald-500/[0.035] p-7">
              <h3 className="text-lg font-semibold text-white">
                Strengths
              </h3>

              <div className="mt-5 space-y-3">
                {strengths.length >
                0 ? (
                  strengths.map(
                    (item) => (
                      <p
                        key={item}
                        className="text-sm leading-7 text-zinc-300"
                      >
                        • {item}
                      </p>
                    )
                  )
                ) : (
                  <p className="text-sm text-zinc-600">
                    No significant
                    strengths
                    recorded.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-red-500/15 bg-red-500/[0.035] p-7">
              <h3 className="text-lg font-semibold text-white">
                Risks
              </h3>

              <div className="mt-5 space-y-3">
                {risks.length > 0 ? (
                  risks.map(
                    (item) => (
                      <p
                        key={item}
                        className="text-sm leading-7 text-zinc-300"
                      >
                        • {item}
                      </p>
                    )
                  )
                ) : (
                  <p className="text-sm text-zinc-600">
                    No major risks
                    recorded.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-7">
              <h3 className="text-lg font-semibold text-white">
                Recommendations
              </h3>

              <div className="mt-5 space-y-3">
                {recommendations.length >
                0 ? (
                  recommendations.map(
                    (item) => (
                      <p
                        key={item}
                        className="text-sm leading-7 text-zinc-300"
                      >
                        • {item}
                      </p>
                    )
                  )
                ) : (
                  <p className="text-sm text-zinc-600">
                    Continue
                    monitoring
                    current
                    financial
                    performance.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <div className="border-t border-white/[0.06] py-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-zinc-700">
          DhanarkOS · EXECUTIVE FINANCIAL INTELLIGENCE
        </p>

        <p className="mt-2 text-xs text-zinc-700">
          Generated{" "}
          {new Date(
            report.created_at
          ).toLocaleDateString("en-IN")}
        </p>
      </div>
    </div>
  );
}