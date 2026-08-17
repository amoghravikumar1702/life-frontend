"use client";

import {
  Download,
  Pencil,
  Printer,
  MessageCircle,
  CreditCard,
} from "lucide-react";

import ActionButton from "@/components/ui/ActionButton";

type InvoiceActionsProps = {
  onEdit: () => void;
  onPrint: () => void;
  onDownload: () => void;
  onWhatsApp: () => void;
  onCollectPayment: () => void;
};

export default function InvoiceActions({
  onEdit,
  onPrint,
  onDownload,
  onWhatsApp,
  onCollectPayment,
}: InvoiceActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">

      {/* PRIMARY ACTION */}

      <ActionButton
        variant="primary"
        onClick={onCollectPayment}
      >
        <CreditCard size={17} strokeWidth={1.8} />
        Collect Payment
      </ActionButton>

      {/* SECONDARY ACTIONS */}

      <ActionButton onClick={onEdit}>
        <Pencil size={16} strokeWidth={1.8} />
        Edit
      </ActionButton>

      <ActionButton onClick={onPrint}>
        <Printer size={16} strokeWidth={1.8} />
        Print
      </ActionButton>

      <ActionButton onClick={onDownload}>
        <Download size={16} strokeWidth={1.8} />
        PDF
      </ActionButton>

      <ActionButton onClick={onWhatsApp}>
        <MessageCircle size={16} strokeWidth={1.8} />
        WhatsApp
      </ActionButton>

    </div>
  );
}