"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Download,
  Eye,
  MessageCircle,
  Pencil,
  Printer,
  Receipt,
  Trash2,
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

export default function InvoiceCard({
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

      await navigator.clipboard.writeText(
        result.paymentUrl
      );

      alert(
        `Payment Link Created!\n\nThe payment link has been copied to your clipboard.\n\n${result.paymentUrl}`
      );
    } catch (error) {
      console.error(
        "Collect Payment failed:",
        error
      );

      alert("Failed to create payment link.");
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
      const result = await collectPayment(
        invoice.id!
      );

      let phone = invoice.customer_phone.replace(
        /\D/g,
        ""
      );

      if (phone.length === 10) {
        phone = "91" + phone;
      }

      const message = generateWhatsAppMessage(
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
        invoice.id!,
        "whatsapp"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to send WhatsApp reminder."
      );
    }
  }

  const invoiceDate = new Date(
    invoice.invoice_date
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.06]
        bg-[#0E1013]
        shadow-[0_10px_35px_rgba(0,0,0,0.28)]
      "
    >
      {/* HEADER */}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#D4AF37]/15
                  bg-[#D4AF37]/[0.07]
                "
              >
                <Receipt
                  size={15}
                  className="text-[#D4AF37]"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-semibold tracking-wide text-white">
                  {invoice.invoice_number}
                </p>

                <p className="mt-0.5 text-[11px] text-zinc-600">
                  {invoiceDate}
                </p>
              </div>
            </div>
          </div>

          <InvoiceStatus
            status={invoice.status}
          />
        </div>

        {/* CUSTOMER */}

        <div className="mt-5">
          <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-zinc-600">
            Customer
          </p>

          <p className="mt-1 truncate text-sm font-medium text-white">
            {invoice.customer}
          </p>

          {invoice.customer_email && (
            <p className="mt-1 truncate text-xs text-zinc-500">
              {invoice.customer_email}
            </p>
          )}
        </div>
      </div>

      {/* FINANCIALS */}

      <div className="grid grid-cols-2 gap-px border-y border-white/[0.05] bg-white/[0.04]">
        <div className="bg-[#101214] px-5 py-4">
          <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-600">
            Amount
          </p>

          <p className="mt-2 text-xl font-semibold tracking-tight text-[#F3D37A]">
            {formatCurrency(invoice.total)}
          </p>
        </div>

        <div className="bg-[#101214] px-5 py-4">
          <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-600">
            Balance
          </p>

          <p
            className={`mt-2 text-xl font-semibold tracking-tight ${
              (invoice.balance_due ?? 0) > 0
                ? "text-amber-300"
                : "text-emerald-400"
            }`}
          >
            {formatCurrency(
              invoice.balance_due ?? 0
            )}
          </p>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="p-5">
        <div className="grid grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() =>
              onView(invoice.id!)
            }
            title="View Invoice"
            className="
              flex
              h-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              text-zinc-400
              transition
              active:scale-95
              hover:border-[#D4AF37]/25
              hover:text-[#D4AF37]
            "
          >
            <Eye size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              onPDF(invoice.id!)
            }
            title="Download PDF"
            className="
              flex
              h-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              text-zinc-400
              transition
              active:scale-95
              hover:border-[#D4AF37]/25
              hover:text-[#D4AF37]
            "
          >
            <Download size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              onPrint(invoice.id!)
            }
            title="Print Invoice"
            className="
              flex
              h-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              text-zinc-400
              transition
              active:scale-95
              hover:border-[#D4AF37]/25
              hover:text-[#D4AF37]
            "
          >
            <Printer size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              onEdit(invoice.id!)
            }
            title="Edit Invoice"
            className="
              flex
              h-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              text-zinc-400
              transition
              active:scale-95
              hover:border-[#D4AF37]/25
              hover:text-[#D4AF37]
            "
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(invoice.id!)
            }
            title="Delete Invoice"
            className="
              flex
              h-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              text-zinc-500
              transition
              active:scale-95
              hover:border-red-500/20
              hover:bg-red-500/[0.05]
              hover:text-red-400
            "
          >
            <Trash2 size={17} />
          </button>
        </div>

        {/* SECONDARY ACTIONS */}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="
              flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              text-xs
              font-medium
              text-zinc-400
              transition
              active:scale-[0.98]
              hover:border-[#D4AF37]/25
              hover:bg-[#D4AF37]/[0.04]
              hover:text-[#D4AF37]
            "
          >
            <MessageCircle size={15} />
            WhatsApp
          </button>

          <Link
            href={`/invoices/${invoice.id}`}
            className="
              flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              text-xs
              font-medium
              text-zinc-400
              transition
              active:scale-[0.98]
              hover:border-[#D4AF37]/25
              hover:text-[#D4AF37]
            "
          >
            Details
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* PRIMARY CTA */}

        <button
          type="button"
          onClick={handleCollectPayment}
          className="
            mt-3
            flex
            h-12
            w-full
            items-center
            justify-center
            rounded-xl
            bg-[#D4AF37]
            px-5
            text-sm
            font-semibold
            text-[#090909]
            shadow-[0_8px_24px_rgba(212,175,55,0.16)]
            transition-all
            duration-200
            active:scale-[0.98]
            hover:brightness-105
          "
        >
          Collect Payment
        </button>
      </div>
    </motion.article>
  );
}