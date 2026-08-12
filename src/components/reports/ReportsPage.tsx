"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Report {
  id: string;
  title: string;
  report_type: string;
  status: string;
  created_at: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadReports() {
    try {
      setLoading(true);

      const res = await fetch("/api/reports");

      if (!res.ok) {
        throw new Error("Failed to load reports");
      }

      const data = await res.json();

      setReports(data);
    } finally {
      setLoading(false);
    }
  }

  async function generateReport() {
    const today = new Date();

    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const response = await fetch(
      "/api/reports/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType: "revenue",
          periodStart: firstDay
            .toISOString()
            .split("T")[0],
          periodEnd: today
            .toISOString()
            .split("T")[0],
        }),
      }
    );

    if (!response.ok) {
      alert("Failed to generate report.");
      return;
    }

    await loadReports();

    alert("Revenue report generated successfully.");
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Executive Reports
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-white">
            Reports
          </h1>
        </div>

        <button
          onClick={generateReport}
          className="
            rounded-2xl
            bg-[#D4AF37]
            px-6
            py-3
            font-medium
            text-black
            transition
            hover:opacity-90
          "
        >
          Generate Report
        </button>
      </div>

      <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#101214]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-sm text-zinc-500">
              <th className="px-6 py-4">Report</th>
              <th>Type</th>
              <th>Status</th>
              <th>Generated</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-zinc-500"
                >
                  Loading reports...
                </td>
              </tr>
            )}

            {!loading &&
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-5">
                    <Link
                      href={`/dashboard/reports/${report.id}`}
                      className="font-medium text-white transition-colors hover:text-[#D4AF37]"
                    >
                      {report.title}
                    </Link>
                  </td>

                  <td className="text-zinc-400">
                    {report.report_type}
                  </td>

                  <td>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                      {report.status}
                    </span>
                  </td>

                  <td className="text-zinc-500">
                    {new Date(
                      report.created_at
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}

            {!loading && reports.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-zinc-500"
                >
                  No reports generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}