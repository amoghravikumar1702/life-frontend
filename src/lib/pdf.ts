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

export function generateInvoicePDF(data: InvoicePDFData) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("NEXORA", 14, 20);

  doc.setFontSize(11);
  doc.text(`Invoice: ${data.invoiceNumber}`, 14, 32);
  doc.text(`Customer: ${data.customer}`, 14, 40);
  doc.text(`Invoice Date: ${data.invoiceDate}`, 14, 48);
  doc.text(`Due Date: ${data.dueDate}`, 14, 56);
  doc.text(`Status: ${data.status}`, 14, 64);

  autoTable(doc, {
    startY: 75,
    head: [["Item", "Qty", "Price", "Total"]],
    body: data.items.map((item) => [
      item.name,
      item.quantity,
      `₹${item.price}`,
      `₹${item.quantity * item.price}`,
    ]),
  });

  doc.save(`${data.invoiceNumber}.pdf`);
}