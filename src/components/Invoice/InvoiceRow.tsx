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
    console.log("Collect Payment clicked", invoice.id);

    try {
      const result = await collectPayment(invoice.id!);

      console.log("collectPayment result:", result);

      await navigator.clipboard.writeText(result.paymentUrl);

      alert(
        `✅ Payment Link Created!\n\nThe payment link has been copied to your clipboard.\n\n${result.paymentUrl}`
      );
    } catch (error) {
      console.error("Collect Payment failed:", error);
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
      const result = await collectPayment(invoice.id!);

      let phone = invoice.customer_phone.replace(/\D/g, "");

      if (phone.length === 10) {
        phone = "91" + phone;
      }

      const message = generateWhatsAppMessage(
        invoice,
        result.paymentUrl,
        formatCurrency
      );

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappUrl, "_blank");

      await recordReminder(invoice.id!, "whatsapp");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to send WhatsApp reminder.");
    }
  }

  return (
    <tr className="group border-b border-white/[0.06] transition-all duration-300 hover:bg-white/[0.025]">
      <td className="px-8 py-7">

  <div>

    <h3 className="font-mono text-base font-semibold tracking-wide text-white">
      {invoice.invoice_number}
    </h3>

    <p className="mt-1 text-xs text-zinc-500">
      {new Date(invoice.invoice_date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </p>

  </div>

</td>

      <td className="px-8 py-7">

  <div>

    <p className="font-medium text-white">
      {invoice.customer}
    </p>

    {invoice.customer_email && (

      <p className="mt-1 text-sm text-zinc-500">
        {invoice.customer_email}
      </p>

    )}

  </div>

</td>

      <td className="px-8 py-7">

  <div>

    <p className="text-xl font-semibold text-[#F3D37A]">
      {formatCurrency(invoice.total)}
    </p>

    <p className="mt-1 text-xs text-zinc-500">
      Balance: {formatCurrency(invoice.balance_due ?? 0)}
    </p>

  </div>

</td>

     <td className="px-8 py-7">
        <InvoiceStatus status={invoice.status} />
      </td>

      <td className="px-8 py-7">
        <div className="flex flex-wrap items-center justify-end gap-2">

          <button
            type="button"
            onClick={() => onView(invoice.id!)}
            title="View Invoice"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#15181C] text-zinc-400 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#1A1D21] hover:text-[#D4AF37]"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() => onPDF(invoice.id!)}
            title="Download PDF"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#15181C] text-zinc-400 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#1A1D21] hover:text-[#D4AF37]"
          >
            <Download size={18} />
          </button>

          <button
            type="button"
            onClick={() => onPrint(invoice.id!)}
            title="Print Invoice"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#15181C] text-zinc-400 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#1A1D21] hover:text-[#D4AF37]"
          >
            <Printer size={18} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(invoice.id!)}
            title="Edit Invoice"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#15181C] text-zinc-400 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#1A1D21] hover:text-[#D4AF37]"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={() => handleSendWhatsApp()}
            title="Send via WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#15181C] text-zinc-400 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#1A1D21] hover:text-[#D4AF37]"
          >
            <MessageCircle size={18} />
          </button>

        

          <button
            type="button"
            onClick={() => onDelete(invoice.id!)}
            title="Delete Invoice"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-[#15181C] text-zinc-400 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#1A1D21] hover:text-[#D4AF37]"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </td>
      <td className="px-8 py-7">

  <button
    type="button"
    onClick={handleCollectPayment}
    className="inline-flex h-11 min-w-[170px] items-center justify-center rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-[#090909] shadow-[0_8px_24px_rgba(212,175,55,0.18)] transition-all duration-200 hover:scale-[1.02] hover:brightness-105 active:scale-[0.98]"
  >
    Collect Payment
  </button>

</td>
    </tr>
  );
}