"use client";

import { handleCollectPayment } from "@/services/paymentActions";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  FileText,
  Loader2,
  IndianRupee,
  Wallet,
  Receipt,
  Package,
} from "lucide-react";

import {
  getInvoiceById,
  getInvoiceItems,
} from "@/services/invoiceService";

import {
  getPaymentsForInvoice,
  type Payment,
} from "@/services/paymentService";

import { Invoice } from "@/types/invoice";

import GlassPanel from "@/components/ui/GlassPanel";
import KPICard from "@/components/ui/KPICard";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/ui/PageHeader";
import ActionButton from "@/components/ui/ActionButton";

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

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const invoiceId = Number(params.id);

  const [loading, setLoading] =
    useState(true);

  const [invoice, setInvoice] =
    useState<Invoice | null>(null);

  const [items, setItems] =
    useState<InvoiceItem[]>([]);

  const [payments, setPayments] =
    useState<Payment[]>([]);

  async function loadInvoice() {
    try {
      setLoading(true);

      if (
        !Number.isInteger(invoiceId) ||
        invoiceId <= 0
      ) {
        throw new Error(
          "Invalid invoice ID."
        );
      }

      /*
       * Load all invoice data together.
       */

      const [
        invoiceData,
        invoiceItems,
        invoicePayments,
      ] = await Promise.all([
        getInvoiceById(invoiceId),
        getInvoiceItems(invoiceId),
        getPaymentsForInvoice(invoiceId),
      ]);

      setInvoice(invoiceData);

      setItems(
        invoiceItems ?? []
      );

      setPayments(
        invoicePayments ?? []
      );
    } catch (error) {
      console.error(
        "Load Invoice Details Error:",
        error
      );

      setInvoice(null);
      setItems([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2
          size={40}
          className="animate-spin text-[var(--primary)]"
        />
      </main>
    );
  }

  /*
   * =========================================================
   * NOT FOUND
   * =========================================================
   */

  if (!invoice) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <GlassPanel className="w-full max-w-lg p-10 text-center">
          <FileText
            size={60}
            className="mx-auto mb-6 text-[var(--text-muted)]"
          />

          <h1 className="text-3xl font-bold">
            Invoice Not Found
          </h1>

          <p className="mt-3 text-[var(--text-secondary)]">
            The invoice you are looking for
            either does not exist or has
            been removed.
          </p>

          <ActionButton
            variant="secondary"
            className="mt-8"
            onClick={() =>
              router.push("/invoices")
            }
          >
            Back to Invoices
          </ActionButton>
        </GlassPanel>
      </main>
    );
  }

  /*
   * =========================================================
   * PAYMENT STATE HELPERS
   * =========================================================
   */

  const pendingPayments =
    payments.filter(
      (payment) =>
        payment.payment_status
          ?.toLowerCase()
          .trim() === "pending"
    );

  const completedPayments =
    payments.filter((payment) => {
      const status =
        payment.payment_status
          ?.toLowerCase()
          .trim();

      return (
        status === "completed" ||
        status === "paid" ||
        status === "success" ||
        status === "successful"
      );
    });

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* BACK */}

        <ActionButton
          onClick={() => router.back()}
          className="mb-8"
        >
          <ArrowLeft
            size={18}
            className="mr-2 inline-block"
          />
          Back
        </ActionButton>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <GlassPanel className="p-10">
          <PageHeader
            title={
              invoice.invoice_number
            }
            subtitle={
              invoice.customer
            }
            actions={
              <div className="flex flex-wrap items-center gap-4">

                <StatusBadge
                  status={invoice.status}
                />

                <InvoiceActions
                  onEdit={() =>
                    router.push(
                      `/invoices/edit/${invoice.id}`
                    )
                  }
                  onPrint={() =>
                    window.print()
                  }
                  onDownload={() => {}}
                  onWhatsApp={() => {}}
                  onCollectPayment={() =>
                    handleCollectPayment(
                      invoice.id!
                    )
                  }
                />

              </div>
            }
          />
        </GlassPanel>

        {/* =====================================================
            PAYMENT ATTENTION BANNER
        ===================================================== */}

        {pendingPayments.length > 0 && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-amber-400/15
              bg-amber-400/[0.04]
              px-6
              py-5
            "
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-amber-300">
                  Payment reported by customer
                </p>

                <p className="mt-1 text-xs text-amber-400/70">
                  A customer has reported a
                  UPI payment. Verify the
                  payment below before marking
                  the invoice as paid.
                </p>
              </div>

              <div className="text-sm font-semibold text-amber-300">
                ₹
                {pendingPayments
                  .reduce(
                    (
                      total,
                      payment
                    ) =>
                      total +
                      Number(
                        payment.amount ?? 0
                      ),
                    0
                  )
                  .toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
              </div>

            </div>
          </div>
        )}

        {/* =====================================================
            KPI
        ===================================================== */}

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <KPICard
            title="Invoice Value"
            value={`₹${Number(
              invoice.total
            ).toLocaleString("en-IN")}`}
            icon={
              <IndianRupee size={22} />
            }
          />

          <KPICard
            title="Amount Paid"
            value={`₹${Number(
              invoice.amount_paid ?? 0
            ).toLocaleString("en-IN")}`}
            icon={
              <Wallet size={22} />
            }
          />

          <KPICard
            title="Balance Due"
            value={`₹${Number(
              invoice.balance_due ?? 0
            ).toLocaleString("en-IN")}`}
            icon={
              <Receipt size={22} />
            }
          />

          <KPICard
            title="Items"
            value={items.length}
            icon={
              <Package size={22} />
            }
          />

        </section>

        {/* =====================================================
            CUSTOMER + TOTALS
        ===================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <CustomerCard
              name={invoice.customer}
              email={
                (invoice as any)
                  .customer_email
              }
              phone={
                (invoice as any)
                  .customer_phone
              }
            />
          </div>

          <InvoiceTotals
            total={Number(
              invoice.total
            )}
            paid={Number(
              invoice.amount_paid ?? 0
            )}
            balance={Number(
              invoice.balance_due ?? 0
            )}
          />

        </div>

        {/* =====================================================
            INVOICE ITEMS
        ===================================================== */}

        <GlassPanel className="mt-8 p-8">

          <PageHeader
            title="Invoice Items"
            subtitle={`${items.length} item${
              items.length !== 1
                ? "s"
                : ""
            } included in this invoice.`}
          />

          <div className="mt-8 overflow-x-auto">

            <table className="executive-table w-full">

              <thead>
                <tr>
                  <th align="left">
                    Item
                  </th>

                  <th align="center">
                    Qty
                  </th>

                  <th align="right">
                    Price
                  </th>

                  <th align="right">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>

                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="
                        py-10
                        text-center
                        text-[var(--text-secondary)]
                      "
                    >
                      No invoice items
                      found.
                    </td>
                  </tr>
                )}

                {items.map((item) => (
                  <tr key={item.id}>

                    <td>
                      <div className="font-medium">
                        {item.item_name}
                      </div>
                    </td>

                    <td align="center">
                      {item.quantity}
                    </td>

                    <td align="right">
                      ₹
                      {Number(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td
                      align="right"
                      className="font-semibold"
                    >
                      ₹
                      {Number(
                        item.total
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>

          {/* TOTALS */}

          <div className="mt-10 border-t border-[var(--border)] pt-8">

            <div className="ml-auto max-w-sm space-y-5">

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">
                  Subtotal
                </span>

                <span className="font-semibold">
                  ₹
                  {Number(
                    invoice.total
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">

                <span className="text-[var(--text-secondary)]">
                  Amount Paid
                </span>

                <span className="font-semibold text-green-400">
                  ₹
                  {Number(
                    invoice.amount_paid ??
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-5 text-xl font-bold">

                <span>
                  Balance Due
                </span>

                <span className="text-[var(--primary)]">
                  ₹
                  {Number(
                    invoice.balance_due ??
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

          </div>

        </GlassPanel>

        {/* =====================================================
            PAYMENT HISTORY
        ===================================================== */}

        <div className="mt-8 grid gap-8 xl:grid-cols-2">

          <PaymentHistory
            payments={payments}
          />

          <ActivityTimeline
            events={[
              {
                title:
                  "Invoice Created",
                date:
                  invoice.invoice_date ??
                  "-",
              },

              {
                title:
                  "Invoice Sent",
                date:
                  invoice.invoice_date ??
                  "-",
              },

              {
                title:
                  pendingPayments.length >
                  0
                    ? "Payment Reported"
                    : completedPayments.length >
                      0
                    ? "Payment Received"
                    : "Awaiting Payment",

                date:
                  pendingPayments.length >
                  0
                    ? new Date(
                        pendingPayments[0]
                          .created_at ??
                          Date.now()
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : invoice.status ===
                      "Paid"
                    ? invoice.invoice_date ??
                      "-"
                    : invoice.due_date ??
                      "-",
              },
            ]}
          />

        </div>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <div className="mt-8">

          <GlassPanel className="p-8">

            <PageHeader
              title="Invoice Summary"
              subtitle=""
            />

            <div className="mt-8 grid gap-6 md:grid-cols-3">

              <KPICard
                title="Invoice Status"
                value={
                  invoice.status
                }
                icon={
                  <Receipt size={20} />
                }
              />

              <KPICard
                title="Invoice Date"
                value={
                  invoice.invoice_date ??
                  "-"
                }
                icon={
                  <FileText size={20} />
                }
              />

              <KPICard
                title="Due Date"
                value={
                  invoice.due_date ??
                  "-"
                }
                icon={
                  <Wallet size={20} />
                }
              />

            </div>

          </GlassPanel>

        </div>

      </div>
    </main>
  );
}