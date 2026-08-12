import * as XLSX from "xlsx";

interface Metric {
  label: string;
  value: number;
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

interface ReportData {
  metrics?: Metric[];

  raw?: {
    topCustomers?: Customer[];

    invoices?: Invoice[];
  };
}

interface ExportExcelOptions {
  filename?: string;

  reportTitle: string;

  periodStart: string;

  periodEnd: string;

  reportData: ReportData;
}

export async function exportToExcel({
  filename = "Executive_Report.xlsx",
  reportTitle,
  periodStart,
  periodEnd,
  reportData,
}: ExportExcelOptions) {
  const workbook = XLSX.utils.book_new();

  // ------------------------
  // Summary Sheet
  // ------------------------

  const summarySheet = XLSX.utils.json_to_sheet([
    {
      Report: reportTitle,
      "Period Start": periodStart,
      "Period End": periodEnd,
      Generated: new Date().toLocaleString(),
    },
  ]);

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Summary"
  );

  // ------------------------
  // Metrics Sheet
  // ------------------------

  const metrics =
    reportData.metrics?.map((metric) => ({
      Metric: metric.label,
      Value: metric.value,
    })) ?? [];

  const metricsSheet =
    XLSX.utils.json_to_sheet(metrics);

  XLSX.utils.book_append_sheet(
    workbook,
    metricsSheet,
    "Metrics"
  );

  // ------------------------
  // Customers Sheet
  // ------------------------

  const customers =
    reportData.raw?.topCustomers?.map(
      (customer) => ({
        Customer: customer.customer,
        Revenue: customer.revenue,
        Invoices: customer.invoices,
      })
    ) ?? [];

  const customersSheet =
    XLSX.utils.json_to_sheet(customers);

  XLSX.utils.book_append_sheet(
    workbook,
    customersSheet,
    "Customers"
  );

  // ------------------------
  // Invoice Sheet
  // ------------------------

  const invoices =
    reportData.raw?.invoices?.map(
      (invoice) => ({
        "Invoice Number":
          invoice.invoice_number,

        Customer: invoice.customer,

        "Invoice Date":
          invoice.invoice_date,

        "Due Date":
          invoice.due_date,

        Total: invoice.total,

        "Amount Paid":
          invoice.amount_paid ?? 0,

        "Balance Due":
          invoice.balance_due ?? 0,

        Status: invoice.status,
      })
    ) ?? [];

  const invoicesSheet =
    XLSX.utils.json_to_sheet(invoices);

  XLSX.utils.book_append_sheet(
    workbook,
    invoicesSheet,
    "Invoices"
  );

  XLSX.writeFile(workbook, filename);
}