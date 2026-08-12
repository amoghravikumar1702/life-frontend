import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

type InvoicePDFData = {
  invoiceNumber: string;
  customer: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  items: InvoiceItem[];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export function generateInvoicePDF(data: InvoicePDFData) {
  const doc = new jsPDF();

  // Company Name
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ArkenOne", 14, 20);

  // Invoice Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Invoice: ${data.invoiceNumber}`, 14, 32);
  doc.text(`Customer: ${data.customer}`, 14, 40);
  doc.text(`Invoice Date: ${data.invoiceDate}`, 14, 48);
  doc.text(`Due Date: ${data.dueDate}`, 14, 56);
  doc.text(`Status: ${data.status}`, 14, 64);

  // Items Table
  autoTable(doc, {
    startY: 75,
    head: [["Item", "Qty", "Price", "Total"]],
    body: data.items.map((item) => [
      item.name,
      item.quantity.toString(),
      `INR ${formatCurrency(item.price)}`,
      `INR ${formatCurrency(item.quantity * item.price)}`,
    ]),
  });

  // Calculate Total
  const grandTotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // Grand Total
  const finalY =
    (doc as any).lastAutoTable.finalY + 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text(
    `Grand Total: INR ${formatCurrency(grandTotal)}`,
    14,
    finalY
  );

  doc.save(`${data.invoiceNumber}.pdf`);
}