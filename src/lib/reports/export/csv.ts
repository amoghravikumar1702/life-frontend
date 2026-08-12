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

interface ExportCSVOptions {
  filename?: string;

  reportData: ReportData;
}

function downloadCSV(
  filename: string,
  csv: string
) {
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download = filename;

  link.click();

  URL.revokeObjectURL(url);
}

export async function exportToCSV({
  filename = "Executive_Report.csv",
  reportData,
}: ExportCSVOptions) {
  const sections: string[] = [];

  // --------------------------
  // Metrics
  // --------------------------

  sections.push("METRICS");

  sections.push("Metric,Value");

  (reportData.metrics ?? []).forEach(
    (metric) => {
      sections.push(
        `"${metric.label}",${metric.value}`
      );
    }
  );

  sections.push("");

  // --------------------------
  // Customers
  // --------------------------

  sections.push("TOP CUSTOMERS");

  sections.push(
    "Customer,Revenue,Invoices"
  );

  (
    reportData.raw?.topCustomers ?? []
  ).forEach((customer) => {
    sections.push(
      `"${customer.customer}",${customer.revenue},${customer.invoices}`
    );
  });

  sections.push("");

  // --------------------------
  // Invoices
  // --------------------------

  sections.push("INVOICES");

  sections.push(
    "Invoice Number,Customer,Invoice Date,Due Date,Total,Amount Paid,Balance Due,Status"
  );

  (
    reportData.raw?.invoices ?? []
  ).forEach((invoice) => {
    sections.push(
      [
        invoice.invoice_number,
        invoice.customer,
        invoice.invoice_date,
        invoice.due_date,
        invoice.total,
        invoice.amount_paid ?? 0,
        invoice.balance_due ?? 0,
        invoice.status,
      ]
        .map((value) => `"${value}"`)
        .join(",")
    );
  });

  downloadCSV(
    filename,
    sections.join("\n")
  );
}