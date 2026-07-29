import {
  Eye,
  Download,
  Printer,
  Pencil,
  Trash2,
  MessageCircle,
} from "lucide-react";

import InvoiceStatus from "./InvoiceStatus";
import { Invoice } from "@/types/invoice";
import { collectPayment } from "@/services/collectPaymentService";
import { generateWhatsAppMessage } from "@/services/whatsappMessageService";
import { recordReminder } from "@/services/reminderService";

type Props = {
  invoice: Invoice;
  formatCurrency: (amount: number) => string;
  onView: (id: number) => void;
  onPDF: (id: number) => void;
  onPrint: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function InvoiceRow({
  invoice,
  formatCurrency,
  onView,
  onPDF,
  onPrint,
  onEdit,
  onDelete,
}: Props) {
  async function handleCollectPayment() {
    try {
      const result = await collectPayment(invoice.id!);

      await navigator.clipboard.writeText(result.paymentUrl);

      alert(
        `✅ Payment Link Created!\n\nThe payment link has been copied to your clipboard.\n\n${result.paymentUrl}`
      );
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create payment link.");
    }
  }

  async function handleSendWhatsApp() {
    if (!invoice.customer_phone) {
      alert(
        "No phone number on file for this customer. Add one from the Customers page first."
      );
      return;
    }

    try {
      // Generate payment link
      const result = await collectPayment(invoice.id!);

      // Format phone number
      let phone = invoice.customer_phone.replace(/\D/g, "");

      if (phone.length === 10) {
        phone = "91" + phone;
      }

      // Generate WhatsApp message
      const message = generateWhatsAppMessage(
        invoice,
        result.paymentUrl,
        formatCurrency
      );

      // Open WhatsApp
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappUrl, "_blank");

      // Record reminder in database
      await recordReminder(invoice.id!, "whatsapp");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to send WhatsApp reminder.");
    }
  }

  return (
    <tr className="border-b border-white/10 transition hover:bg-white/5">
      <td className="px-6 py-5 font-semibold">
        {invoice.invoice_number}
      </td>

      <td className="px-6 py-5">
        {invoice.customer}
      </td>

      <td className="px-6 py-5 font-semibold text-cyan-300">
        {formatCurrency(invoice.total)}
      </td>

      <td className="px-6 py-5">
        <InvoiceStatus status={invoice.status} />
      </td>

      <td className="px-6 py-5">
        <div className="flex flex-wrap items-center gap-2">

          <button
            onClick={() => onView(invoice.id!)}
            title="View Invoice"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-cyan-400 transition hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => onPDF(invoice.id!)}
            title="Download PDF"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-purple-400 transition hover:bg-purple-400/10 hover:text-purple-300"
          >
            <Download size={18} />
          </button>

          <button
            onClick={() => onPrint(invoice.id!)}
            title="Print Invoice"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-orange-400 transition hover:bg-orange-400/10 hover:text-orange-300"
          >
            <Printer size={18} />
          </button>

          <button
            onClick={() => onEdit(invoice.id!)}
            title="Edit Invoice"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-green-400 transition hover:bg-green-400/10 hover:text-green-300"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={handleSendWhatsApp}
            title="Send via WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-emerald-400 transition hover:bg-emerald-400/10 hover:text-emerald-300"
          >
            <MessageCircle size={18} />
          </button>

          <button
            onClick={handleCollectPayment}
            className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400"
          >
            Collect Payment
          </button>

          <button
            onClick={() => onDelete(invoice.id!)}
            title="Delete Invoice"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-400/10 hover:text-red-300"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </td>
    </tr>
  );
}