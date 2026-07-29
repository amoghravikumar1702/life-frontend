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
    <div className="flex flex-wrap items-center gap-3">

      <ActionButton variant="primary" onClick={onCollectPayment}>
        <CreditCard size={18} />
        Collect Payment
      </ActionButton>

      <ActionButton onClick={onEdit}>
        <Pencil size={18} />
        Edit
      </ActionButton>

      <ActionButton onClick={onPrint}>
        <Printer size={18} />
        Print
      </ActionButton>

      <ActionButton onClick={onDownload}>
        <Download size={18} />
        PDF
      </ActionButton>

      <ActionButton onClick={onWhatsApp}>
        <MessageCircle size={18} />
        WhatsApp
      </ActionButton>

    </div>
  );
}