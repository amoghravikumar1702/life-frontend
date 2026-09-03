"use client";

import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileBarChart2,
  FileText,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Report {
  id: string;
  title: string;
  report_type: string;
  status: string;
  created_at: string;
}

function formatReportType(type: string) {
  return type
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  async function loadReports() {
    try {
      setLoading(true);

      const res = await fetch("/api/reports", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load reports");
      }

      const data = await res.json();

      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("[ReportsPage] Failed to load reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  async function generateReport() {
    if (generating) return;

    try {
      setGenerating(true);

      const today = new Date();

      const firstDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const periodStart = firstDay
        .toISOString()
        .split("T")[0];

      const periodEnd = today
        .toISOString()
        .split("T")[0];

      const response = await fetch(
        "/api/reports/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportType: "revenue",
            periodStart,
            periodEnd,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message ??
            "Failed to generate report."
        );
      }

      await loadReports();
    } catch (error) {
      console.error(
        "[ReportsPage] Failed to generate report:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate report."
      );
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 pb-12">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[34px]
          border
          border-white/[0.07]
          bg-[#101114]
          px-7
          py-8
          lg:px-10
          lg:py-10
        "
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/[0.035] blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
                <FileBarChart2
                  size={20}
                  className="text-[#D4AF37]"
                />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#D4AF37]">
                  DhanarkOS Intelligence
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Executive reporting
                </p>
              </div>
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white lg:text-5xl">
              Executive Reports
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 lg:text-base">
              Turn your financial data into professional,
              decision-ready reports designed for business
              owners, leadership teams, and stakeholders.
            </p>
          </div>

          <button
            type="button"
            onClick={generateReport}
            disabled={generating}
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#D4AF37]
              px-6
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-[#E0BE4A]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {generating ? (
              <>
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />
                Generating...
              </>
            ) : (
              <>
                <Plus size={17} />
                Generate Report
              </>
            )}
          </button>
        </div>
      </section>

      {/* =========================================================
          REPORT CAPABILITIES
      ========================================================= */}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[26px] border border-white/[0.06] bg-[#101114] p-6">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/[0.07]">
            <BarChart3
              size={18}
              className="text-[#D4AF37]"
            />
          </div>

          <h3 className="text-sm font-semibold text-white">
            Financial Performance
          </h3>

          <p className="mt-2 text-xs leading-6 text-zinc-600">
            Revenue, expenses, profitability and
            financial performance presented clearly.
          </p>
        </div>

        <div className="rounded-[26px] border border-white/[0.06] bg-[#101114] p-6">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/[0.07]">
            <Sparkles
              size={18}
              className="text-[#D4AF37]"
            />
          </div>

          <h3 className="text-sm font-semibold text-white">
            Executive Intelligence
          </h3>

          <p className="mt-2 text-xs leading-6 text-zinc-600">
            Surface strengths, risks and recommendations
            from your business data.
          </p>
        </div>

        <div className="rounded-[26px] border border-white/[0.06] bg-[#101114] p-6">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/[0.07]">
            <ShieldCheck
              size={18}
              className="text-[#D4AF37]"
            />
          </div>

          <h3 className="text-sm font-semibold text-white">
            Business Ready
          </h3>

          <p className="mt-2 text-xs leading-6 text-zinc-600">
            Professional reports built from your
            authenticated DhanarkOS financial data.
          </p>
        </div>
      </section>

      {/* =========================================================
          REPORT LIBRARY
      ========================================================= */}

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">
              Report Library
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
              Saved Reports
            </h2>
          </div>

          <button
            type="button"
            onClick={loadReports}
            disabled={loading}
            className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.02]
              px-4
              py-2.5
              text-xs
              font-medium
              text-zinc-400
              transition
              hover:bg-white/[0.05]
              hover:text-white
              disabled:opacity-50
              sm:self-auto
            "
          >
            <RefreshCw
              size={14}
              className={
                loading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-[30px] border border-white/[0.06] bg-[#101114] p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <RefreshCw
                size={22}
                className="animate-spin text-[#D4AF37]"
              />

              <p className="mt-4 text-sm text-zinc-500">
                Loading your reports...
              </p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-white/[0.08] bg-[#101114] px-6 py-16">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <FileText
                  size={25}
                  className="text-zinc-600"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-white">
                No executive reports yet
              </h3>

              <p className="mt-2 text-sm leading-7 text-zinc-600">
                Generate your first report to create a
                professional snapshot of your business
                performance.
              </p>

              <button
                type="button"
                onClick={generateReport}
                disabled={generating}
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#D4AF37]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-[#E0BE4A]
                  disabled:opacity-50
                "
              >
                <Plus size={16} />
                Create First Report
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {reports.map((report) => (
              <article
                key={report.id}
                className="
                  group
                  rounded-[28px]
                  border
                  border-white/[0.06]
                  bg-[#101114]
                  p-6
                  transition
                  hover:border-[#D4AF37]/20
                  hover:bg-[#111216]
                "
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
                      <FileText
                        size={20}
                        className="text-[#D4AF37]"
                      />
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/reports/${report.id}`}
                        className="
                          block
                          truncate
                          text-base
                          font-semibold
                          text-white
                          transition-colors
                          hover:text-[#D4AF37]
                        "
                      >
                        {report.title}
                      </Link>

                      <p className="mt-1 text-xs text-zinc-600">
                        {formatReportType(
                          report.report_type
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-400">
                    <CheckCircle2 size={11} />
                    {report.status}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/[0.05] pt-5">
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <CalendarDays size={14} />
                    {formatDate(report.created_at)}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <Clock3 size={14} />
                    Executive report
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <Link
                    href={`/dashboard/reports/${report.id}`}
                    className="
                      inline-flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.02]
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      text-zinc-300
                      transition
                      hover:bg-white/[0.05]
                      hover:text-white
                    "
                  >
                    Open Report
                    <ArrowRight size={14} />
                  </Link>

                  <a
                    href={`/api/reports/${report.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download ${report.title}`}
                    className="
                      inline-flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.07]
                      bg-white/[0.02]
                      text-zinc-500
                      transition
                      hover:border-[#D4AF37]/20
                      hover:bg-[#D4AF37]/[0.05]
                      hover:text-[#D4AF37]
                    "
                  >
                    <ArrowDownToLine size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          FOOTER NOTE
      ========================================================= */}

      <div className="flex items-center justify-center gap-2 pt-2 text-center text-[10px] uppercase tracking-[0.2em] text-zinc-700">
        <ShieldCheck size={12} />
        DhanarkOS Executive Intelligence
      </div>
    </div>
  );
}