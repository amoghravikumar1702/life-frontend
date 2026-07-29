import { Invoice } from "@/types/invoice";

export function generateWhatsAppMessage(
  invoice: Invoice,
  paymentUrl: string,
  formatCurrency: (amount: number) => string
) {
  const amount = formatCurrency(invoice.balance_due ?? invoice.total);

  const dueDate = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const greeting = `Hello ${invoice.customer},`;

  switch (invoice.status?.toLowerCase()) {
    case "draft":
      throw new Error("Draft invoices cannot be sent.");

    case "paid":
      return `${greeting}

This invoice has already been paid.

Thank you for your business.

— FINZURA`;

    case "partial":
      return `${greeting}

We've received part of your payment.

Invoice: ${invoice.invoice_number}
Remaining Balance: ${amount}
${dueDate ? `Due Date: ${dueDate}` : ""}

Complete your payment securely:

${paymentUrl}

If you've already completed the remaining payment, please ignore this message.

Thank you.

— FINZURA`;

    case "overdue":
      return `${greeting}

This is a reminder that the following invoice is overdue.

Invoice: ${invoice.invoice_number}
Outstanding Amount: ${amount}
${dueDate ? `Due Date: ${dueDate}` : ""}

Pay securely here:

${paymentUrl}

If payment has already been made, please disregard this reminder.

Thank you.

— FINZURA`;

    default:
      return `${greeting}

Your invoice is ready.

Invoice: ${invoice.invoice_number}
Amount Due: ${amount}
${dueDate ? `Due Date: ${dueDate}` : ""}

Secure Payment Link:

${paymentUrl}

Thank you for choosing FINZURA.

— FINZURA`;
  }
}