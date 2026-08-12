"use client";

import { useEffect, useMemo, useState } from "react";

import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  printReport,
  shareReport,
} from "@/lib/reports/export";

import DocumentContainer from "./document/DocumentContainer";
import DocumentDivider from "./document/DocumentDivider";
import Toolbar from "./document/Toolbar";

import ReportHeader from "./viewer/ReportHeader";
import ExecutiveSummary from "./viewer/ExecutiveSummary";
import MetricsGrid from "./viewer/MetricsGrid";
import RevenueChart from "./viewer/RevenueChart";
import TopCustomers from "./viewer/TopCustomers";
import InvoiceTable from "./viewer/InvoiceTable";
import Recommendations from "./viewer/Recommendations";
import AICFOAnalysis from "./viewer/AICFOAnalysis";

interface Metric {
  label: string;
  value: number;
}

interface RevenueTrend {
  date: string;
  revenue: number;
}

interface Customer {
  customer: string;
  revenue: number;
  invoices: number;
}

interface Invoice {
  invoice_number: string;
  customer: string;
  invoice_date: string;
  due_date: string;
  total: number;
  amount_paid?: number;
  balance_due?: number;
  status: string;
}

interface AIAnalysis {
  narrative: string;
  risks: string[];
  opportunities: string[];
  score: number;
}

interface ReportData {
  summary?: string;

  metrics?: Metric[];

  recommendations?: string[];

  aiAnalysis?: AIAnalysis;

  raw?: {
    revenueTrend?: RevenueTrend[];

    topCustomers?: Customer[];

    invoices?: Invoice[];
  };
}

interface Report {
  id: string;

  title: string;

  report_type: string;

  period_start: string;

  period_end: string;

  report_data?: ReportData;
}

interface Props {
  reportId: string;
}

export default function ReportViewer({
  reportId,
}: Props) {
  const [report, setReport] =
    useState<Report | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await fetch(
          `/api/reports/${reportId}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch report."
          );
        }

        const data =
          await response.json();

        setReport(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [reportId]);

  const exportFilename = useMemo(() => {
    if (!report) {
      return "Executive_Report";
    }

    const month = new Date(
      report.period_start
    ).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });

    return `${report.title.replace(
      /\s+/g,
      "_"
    )}_${month.replace(",", "")}`;
  }, [report]);

  async function handlePDF() {
  await printReport({
    title: report?.title ?? "Executive Report",
  });
}

  async function handleExcel() {
    if (!report?.report_data) return;

    await exportToExcel({
      filename: `${exportFilename}.xlsx`,
      reportTitle: report.title,
      periodStart: report.period_start,
      periodEnd: report.period_end,
      reportData: report.report_data,
    });
  }

  async function handleCSV() {
    if (!report?.report_data) return;

    await exportToCSV({
      filename: `${exportFilename}.csv`,
      reportData: report.report_data,
    });
  }

  async function handlePrint() {
    await printReport({
      title: report?.title,
    });
  }

  async function handleShare() {
    if (!report) return;

    await shareReport({
      title: report.title,
      text: `${report.title} generated using ArkenOne.`,
    });
  }
    if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-500">
          Loading Executive Report...
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-400">
          Report not found.
        </p>
      </div>
    );
  }

  return (
    <DocumentContainer>

      <ReportHeader
        title={report.title}
        periodStart={report.period_start}
        periodEnd={report.period_end}
      />

      <Toolbar
        onPdf={handlePDF}
        onExcel={handleExcel}
        onCsv={handleCSV}
        onPrint={handlePrint}
        onShare={handleShare}
      />

      <DocumentDivider />

      <ExecutiveSummary
        summary={
          report.report_data?.summary
        }
      />

      <DocumentDivider />

      <MetricsGrid
        metrics={
          report.report_data?.metrics ??
          []
        }
      />

      <DocumentDivider />

      <RevenueChart
        data={
          report.report_data?.raw
            ?.revenueTrend ?? []
        }
      />

      <DocumentDivider />

      <TopCustomers
        customers={
          report.report_data?.raw
            ?.topCustomers ?? []
        }
      />

      <DocumentDivider />

      <InvoiceTable
        invoices={
          report.report_data?.raw
            ?.invoices ?? []
        }
      />

      <DocumentDivider />

      <Recommendations
        recommendations={
          report.report_data
            ?.recommendations ?? []
        }
      />

      <DocumentDivider />

      <AICFOAnalysis
              narrative={report.report_data?.aiAnalysis
                  ?.narrative ??
                  "No executive analysis available for this report."}
              risks={report.report_data?.aiAnalysis
                  ?.risks ?? []}
              opportunities={report.report_data?.aiAnalysis
                  ?.opportunities ?? []}
              score={report.report_data?.aiAnalysis
                  ?.score ?? 0} revenue={0} outstanding={0} customerCount={0} invoiceCount={0} overdueInvoices={0} todaysCollections={0}      />

    </DocumentContainer>
  );
}