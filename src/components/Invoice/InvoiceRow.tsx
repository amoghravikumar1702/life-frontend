"use client";

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
    if (!invoice.id) return;

    console.log(
      "Collect Payment clicked",
      invoice.id
    );

    try {
      const result = await collectPayment(
        invoice.id
      );

      console.log(
        "collectPayment result:",
        result
      );

      await navigator.clipboard.writeText(
        result.paymentUrl
      );

      alert(
        `✅ Payment Link Created!

The payment link has been copied to your clipboard.

${result.paymentUrl}`
      );
    } catch (error) {
      console.error(
        "Collect Payment failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "❌ Failed to create payment link."
      );
    }
  }

  async function handleSendWhatsApp() {
    if (!invoice.id) return;

    if (!invoice.customer_phone) {
      alert(
        "No phone number on file for this customer. Add one from the Customers page first."
      );

      return;
    }

    try {
      const result = await collectPayment(
        invoice.id
      );

      let phone =
        invoice.customer_phone.replace(
          /\D/g,
          ""
        );

      if (phone.length === 10) {
        phone = "91" + phone;
      }

      const message =
        generateWhatsAppMessage(
          invoice,
          result.paymentUrl,
          formatCurrency
        );

      const whatsappUrl =
        `https://wa.me/${phone}?text=${encodeURIComponent(
          message
        )}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      await recordReminder(
        invoice.id,
        "whatsapp"
      );
    } catch (error) {
      console.error(
        "WhatsApp reminder failed:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "❌ Failed to send WhatsApp reminder."
      );
    }
  }

  const invoiceDate = invoice.invoice_date
    ? new Date(
        invoice.invoice_date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "-";

  const actionButtonClass = `
    flex
    h-10
    w-10
    shrink-0
    items-center
    justify-center
    rounded-xl
    border
    border-white/[0.06]
    bg-[#15181C]
    text-zinc-400
    transition-all
    duration-200
    hover:border-[#D4AF37]/30
    hover:bg-[#1A1D21]
    hover:text-[#D4AF37]
    active:scale-95
  `;

  return (
    <tr
      className="
        border-b
        border-white/[0.06]
        transition-all
        duration-300
        hover:bg-white/[0.025]
      "
    >
      {/* Invoice */}

      <td className="px-8 py-7">
        <div>
          <h3 className="font-mono text-base font-semibold tracking-wide text-white">
            {invoice.invoice_number}
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            {invoiceDate}
          </p>
        </div>
      </td>

      {/* Customer */}

      <td className="px-8 py-7">
        <div className="min-w-0">
          <p className="truncate font-medium text-white">
            {invoice.customer}
          </p>

          {invoice.customer_email && (
            <p className="mt-1 max-w-[220px] truncate text-sm text-zinc-500">
              {invoice.customer_email}
            </p>
          )}
        </div>
      </td>

      {/* Amount */}

      <td className="px-8 py-7">
        <div>
          <p className="text-xl font-semibold text-[#F3D37A]">
            {formatCurrency(
              Number(invoice.total)
            )}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Balance:{" "}
            {formatCurrency(
              Number(
                invoice.balance_due ?? 0
              )
            )}
          </p>
        </div>
      </td>

      {/* Status */}

      <td className="px-8 py-7">
        <InvoiceStatus
          status={invoice.status}
        />
      </td>

      {/* Actions */}

      <td className="px-8 py-7">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              invoice.id &&
              onView(invoice.id)
            }
            title="View Invoice"
            aria-label="View Invoice"
            className={actionButtonClass}
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              invoice.id &&
              onPDF(invoice.id)
            }
            title="Download PDF"
            aria-label="Download PDF"
            className={actionButtonClass}
          >
            <Download size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              invoice.id &&
              onPrint(invoice.id)
            }
            title="Print Invoice"
            aria-label="Print Invoice"
            className={actionButtonClass}
          >
            <Printer size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              invoice.id &&
              onEdit(invoice.id)
            }
            title="Edit Invoice"
            aria-label="Edit Invoice"
            className={actionButtonClass}
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            title="Send via WhatsApp"
            aria-label="Send via WhatsApp"
            className={actionButtonClass}
          >
            <MessageCircle
              size={18}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              invoice.id &&
              onDelete(invoice.id)
            }
            title="Delete Invoice"
            aria-label="Delete Invoice"
            className={actionButtonClass}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>

      {/* Collect Payment */}

      <td className="px-8 py-7">
        <button
          type="button"
          onClick={handleCollectPayment}
          className="
            inline-flex
            h-11
            min-w-[170px]
            items-center
            justify-center
            rounded-xl
            bg-[#D4AF37]
            px-5
            text-sm
            font-semibold
            text-[#090909]
            shadow-[0_8px_24px_rgba(212,175,55,0.18)]
            transition-all
            duration-200
            hover:scale-[1.02]
            hover:brightness-105
            active:scale-[0.98]
          "
        >
          Collect Payment
        </button>
      </td>
    </tr>
  );
}