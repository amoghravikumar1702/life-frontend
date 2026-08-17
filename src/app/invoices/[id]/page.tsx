"use client";

import { handleCollectPayment } from "@/services/paymentActions";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  Loader2,
  IndianRupee,
  Wallet,
  Receipt,
  Package,
  CalendarDays,
  User,
} from "lucide-react";

import {
  getInvoiceById,
  getInvoiceItems,
} from "@/services/invoiceService";

import { Invoice } from "@/types/invoice";

import InvoiceActions from "@/components/Invoice/InvoiceActions";
import CustomerCard from "@/components/Invoice/CustomerCard";
import InvoiceTotals from "@/components/Invoice/InvoiceTotals";
import PaymentHistory from "@/components/Invoice/PaymentHistory";
import ActivityTimeline from "@/components/Invoice/ActivityTimeline";

type InvoiceItem = {
  id: number;
  invoice_id: number;
  item_name: string;
  quantity: number;
  price: number;
  total: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyles(status?: string) {
  const normalized = String(status ?? "").toLowerCase();

  if (normalized === "paid") {
    return {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      border: "border-emerald-400/15",
      background: "bg-emerald-400/[0.05]",
    };
  }

  if (
    normalized === "overdue" ||
    normalized === "cancelled"
  ) {
    return {
      dot: "bg-red-400",
      text: "text-red-400",
      border: "border-red-400/15",
      background: "bg-red-400/[0.05]",
    };
  }

  if (
    normalized === "pending" ||
    normalized === "sent"
  ) {
    return {
      dot: "bg-[#D4AF37]",
      text: "text-[#D4AF37]",
      border: "border-[#D4AF37]/15",
      background: "bg-[#D4AF37]/[0.05]",
    };
  }

  return {
    dot: "bg-zinc-400",
    text: "text-zinc-400",
    border: "border-white/[0.08]",
    background: "bg-white/[0.025]",
  };
}

function Metric({
  label,
  value,
  icon: Icon,
  valueClassName = "text-white",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  valueClassName?: string;
}) {
  return (
    <div
      className="
        group
        rounded-[22px]
        border
        border-white/[0.06]
        bg-[#101318]
        p-5
        transition-all
        duration-300
        hover:border-white/[0.10]
        hover:bg-[#11151A]
      "
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.28em]
            text-zinc-600
          "
        >
          {label}
        </p>

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-[#D4AF37]/10
            bg-[#D4AF37]/[0.06]
          "
        >
          <Icon
            size={15}
            strokeWidth={1.8}
            className="text-[#D4AF37]"
          />
        </div>
      </div>

      <p
        className={`
          mt-5
          truncate
          text-xl
          font-semibold
          tracking-[-0.03em]
          ${valueClassName}
        `}
      >
        {value}
      </p>
    </div>
  );
}

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const invoiceId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    if (!invoiceId || Number.isNaN(invoiceId)) {
      setLoading(false);
      return;
    }

    loadInvoice();
  }, [invoiceId]);

  async function loadInvoice() {
    try {
      setLoading(true);

      const [invoiceData, invoiceItems] =
        await Promise.all([
          getInvoiceById(invoiceId),
          getInvoiceItems(invoiceId),
        ]);

      setInvoice(invoiceData);
      setItems(invoiceItems ?? []);
    } catch (error) {
      console.error("Failed to load invoice:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-[#D4AF37]/15
              bg-[#D4AF37]/[0.05]
            "
          >
            <Loader2
              size={20}
              className="animate-spin text-[#D4AF37]"
            />
          </div>

          <p className="text-xs text-zinc-600">
            Loading invoice...
          </p>
        </div>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-5">
        <div
          className="
            w-full
            max-w-lg
            rounded-[28px]
            border
            border-white/[0.06]
            bg-[#101318]
            p-8
            text-center
            sm:p-10
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-[#D4AF37]/10
              bg-[#D4AF37]/[0.05]
            "
          >
            <FileText
              size={28}
              strokeWidth={1.5}
              className="text-[#D4AF37]"
            />
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">
            Invoice Not Found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
            The invoice you are looking for either does not
            exist or has been removed.
          </p>

          <button
            type="button"
            onClick={() => router.push("/invoices")}
            className="
              mt-8
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.03]
              px-5
              text-sm
              font-medium
              text-zinc-300
              transition-all
              duration-200
              hover:border-[#D4AF37]/20
              hover:bg-[#D4AF37]/[0.05]
              hover:text-[#D4AF37]
            "
          >
            <ArrowLeft size={15} />
            Back to Invoices
          </button>
        </div>
      </main>
    );
  }

  const total = Number(invoice.total ?? 0);
  const paid = Number(invoice.amount_paid ?? 0);
  const balance = Number(invoice.balance_due ?? 0);

  const styles = statusStyles(invoice.status);

  return (
    <main className="min-h-screen">
      <div
        className="
          mx-auto
          w-full
          max-w-[1440px]
          px-4
          py-5
          sm:px-6
          sm:py-7
          lg:px-8
          lg:py-9
        "
      >
        {/* ========================================================
            BACK
        ======================================================== */}

        <button
          type="button"
          onClick={() => router.back()}
          className="
            mb-6
            inline-flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.02]
            px-3.5
            text-xs
            font-medium
            text-zinc-500
            transition-all
            duration-200
            hover:border-white/[0.12]
            hover:bg-white/[0.04]
            hover:text-white
          "
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {/* ========================================================
            HERO
        ======================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.06]
            bg-[#101318]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-[#D4AF37]/30
              to-transparent
            "
          />

          <div
            className="
              flex
              flex-col
              gap-7
              p-5
              sm:p-7
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:p-8
            "
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-1.5
                    ${styles.border}
                    ${styles.background}
                  `}
                >
                  <span
                    className={`
                      h-1.5
                      w-1.5
                      rounded-full
                      ${styles.dot}
                    `}
                  />

                  <span
                    className={`
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.18em]
                      ${styles.text}
                    `}
                  >
                    {invoice.status}
                  </span>
                </div>

                <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                  Invoice
                </span>
              </div>

              <h1
                className="
                  mt-4
                  truncate
                  text-[28px]
                  font-semibold
                  tracking-[-0.04em]
                  text-white
                  sm:text-[32px]
                "
              >
                {invoice.invoice_number}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <User size={13} />
                  {invoice.customer}
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  Issued {formatDate(invoice.invoice_date)}
                </span>

                {invoice.due_date && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    Due {formatDate(invoice.due_date)}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0">
              <InvoiceActions
                onEdit={() =>
                  router.push(
                    `/invoices/edit/${invoice.id}`
                  )
                }
                onPrint={() => window.print()}
                onDownload={() => {}}
                onWhatsApp={() => {}}
                onCollectPayment={() =>
                  handleCollectPayment(invoice.id!)
                }
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            KPI
        ======================================================== */}

        <section
          className="
            mt-5
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <Metric
            label="Invoice Value"
            value={formatCurrency(total)}
            icon={IndianRupee}
          />

          <Metric
            label="Amount Paid"
            value={formatCurrency(paid)}
            icon={Wallet}
            valueClassName="text-emerald-400"
          />

          <Metric
            label="Balance Due"
            value={formatCurrency(balance)}
            icon={Receipt}
            valueClassName={
              balance > 0
                ? "text-[#F3D37A]"
                : "text-emerald-400"
            }
          />

          <Metric
            label="Items"
            value={items.length}
            icon={Package}
          />
        </section>

        {/* ========================================================
            CUSTOMER + TOTALS
        ======================================================== */}

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <CustomerCard
              name={invoice.customer}
              email={(invoice as any).customer_email}
              phone={(invoice as any).customer_phone}
            />
          </div>

          <div className="min-w-0">
            <InvoiceTotals
              total={total}
              paid={paid}
              balance={balance}
            />
          </div>
        </section>

        {/* ========================================================
            ITEMS
        ======================================================== */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.06]
            bg-[#101318]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-2
              border-b
              border-white/[0.05]
              px-5
              py-5
              sm:px-7
              sm:py-6
            "
          >
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.30em]
                text-zinc-600
              "
            >
              Invoice Breakdown
            </p>

            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                Invoice Items
              </h2>

              <span className="text-xs text-zinc-600">
                {items.length}{" "}
                {items.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Package
                size={28}
                strokeWidth={1.5}
                className="mx-auto text-zinc-700"
              />

              <p className="mt-4 text-sm text-zinc-500">
                No invoice items found.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.05] bg-white/[0.015]">
                      <th className="px-7 py-4 text-left text-[9px] font-medium uppercase tracking-[0.24em] text-zinc-600">
                        Item
                      </th>

                      <th className="px-7 py-4 text-center text-[9px] font-medium uppercase tracking-[0.24em] text-zinc-600">
                        Qty
                      </th>

                      <th className="px-7 py-4 text-right text-[9px] font-medium uppercase tracking-[0.24em] text-zinc-600">
                        Price
                      </th>

                      <th className="px-7 py-4 text-right text-[9px] font-medium uppercase tracking-[0.24em] text-zinc-600">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="
                          border-b
                          border-white/[0.04]
                          transition-colors
                          duration-200
                          hover:bg-white/[0.02]
                        "
                      >
                        <td className="px-7 py-5">
                          <span className="font-medium text-white">
                            {item.item_name}
                          </span>
                        </td>

                        <td className="px-7 py-5 text-center text-sm text-zinc-400">
                          {item.quantity}
                        </td>

                        <td className="px-7 py-5 text-right text-sm text-zinc-400">
                          {formatCurrency(item.price)}
                        </td>

                        <td className="px-7 py-5 text-right text-sm font-semibold text-white">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}

              <div className="divide-y divide-white/[0.05] md:hidden">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {item.item_name}
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-white">
                        {formatCurrency(item.total)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="text-zinc-600">
                        Unit price
                      </span>

                      <span className="text-zinc-400">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Totals */}

          <div className="border-t border-white/[0.06] px-5 py-6 sm:px-7">
            <div className="ml-auto max-w-sm space-y-4">
              <div className="flex items-center justify-between gap-5 text-sm">
                <span className="text-zinc-500">
                  Subtotal
                </span>

                <span className="font-medium text-white">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-5 text-sm">
                <span className="text-zinc-500">
                  Amount Paid
                </span>

                <span className="font-medium text-emerald-400">
                  {formatCurrency(paid)}
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-5
                  border-t
                  border-white/[0.06]
                  pt-4
                "
              >
                <span className="text-sm font-medium text-zinc-300">
                  Balance Due
                </span>

                <span
                  className={`
                    text-lg
                    font-semibold
                    tracking-tight
                    ${
                      balance > 0
                        ? "text-[#F3D37A]"
                        : "text-emerald-400"
                    }
                  `}
                >
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 
            PAYMENT + ACTIVITY
         */}

        <section className="mt-5 grid gap-5 xl:grid-cols-2">
          <PaymentHistory payments={[]} />

          <ActivityTimeline
            events={[
              {
                title: "Invoice Created",
                date: formatDate(invoice.invoice_date),
              },
              {
                title: "Invoice Sent",
                date: formatDate(invoice.invoice_date),
              },
              {
                title:
                  invoice.status === "Paid"
                    ? "Payment Received"
                    : "Awaiting Payment",
                date:
                  invoice.status === "Paid"
                    ? formatDate(invoice.invoice_date)
                    : formatDate(invoice.due_date),
              },
            ]}
          />
        </section>
        

        {/* ========================================================
            SUMMARY
        ======================================================== */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.06]
            bg-[#101318]
          "
        >
          <div className="border-b border-white/[0.05] px-5 py-5 sm:px-7 sm:py-6">
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.30em]
                text-zinc-600
              "
            >
              Executive Overview
            </p>

            <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
              Invoice Summary
            </h2>
          </div>

          <div
            className="
              grid
              grid-cols-1
              divide-y
              divide-white/[0.05]
              sm:grid-cols-3
              sm:divide-x
              sm:divide-y-0
            "
          >
            <div className="p-5 sm:p-7">
              <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-600">
                Status
              </p>

              <div
                className={`
                  mt-3
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-3
                  py-1.5
                  ${styles.border}
                  ${styles.background}
                `}
              >
                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${styles.dot}
                  `}
                />

                <span
                  className={`
                    text-xs
                    font-medium
                    ${styles.text}
                  `}
                >
                  {invoice.status}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-600">
                Invoice Date
              </p>

              <p className="mt-3 text-sm font-medium text-white">
                {formatDate(invoice.invoice_date)}
              </p>
            </div>

            <div className="p-5 sm:p-7">
              <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-600">
                Due Date
              </p>

              <p
                className={`
                  mt-3
                  text-sm
                  font-medium
                  ${
                    balance > 0
                      ? "text-[#F3D37A]"
                      : "text-white"
                  }
                `}
              >
                {formatDate(invoice.due_date)}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            QUICK ACTION
        ======================================================== */}

        {balance > 0 && (
          <section className="mt-5">
            <button
              type="button"
              onClick={() =>
                handleCollectPayment(invoice.id!)
              }
              className="
                group
                flex
                w-full
                items-center
                justify-between
                gap-5
                rounded-[24px]
                border
                border-[#D4AF37]/15
                bg-[#D4AF37]/[0.045]
                px-5
                py-5
                text-left
                transition-all
                duration-300
                hover:border-[#D4AF37]/30
                hover:bg-[#D4AF37]/[0.07]
                sm:px-7
              "
            >
              <div className="min-w-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#D4AF37]/70">
                  Outstanding Payment
                </p>

                <p className="mt-2 text-sm font-medium text-white">
                  Collect {formatCurrency(balance)}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Generate a secure payment link for this invoice.
                </p>
              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#D4AF37]/20
                  bg-[#D4AF37]/10
                  text-[#D4AF37]
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              >
                <ArrowUpRight size={17} />
              </div>
            </button>
          </section>
        )}
      </div>
    </main>
  );
}