
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  CreditCard,
  IndianRupee,
  AlertCircle,
} from "lucide-react";

import { useRecordPayment } from "@/components/Payment/mutations/paymentMutations";

type InvoiceOption = {
  id: number;
  invoice_number: string;
  customer: string;
  total: number;
  amount_paid: number;
  balance_due: number;
};

type PaymentFormProps = {
  invoices?: InvoiceOption[];
};

export default function PaymentForm({
  invoices = [],
}: PaymentFormProps) {
  const router = useRouter();

  const paymentMutation = useRecordPayment();

  const [selectedInvoice, setSelectedInvoice] =
    useState("");

  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const [paymentReference, setPaymentReference] =
    useState("");

  const [error, setError] = useState("");

  const selectedInvoiceData =
    invoices.find(
      (invoice) =>
        invoice.id === Number(selectedInvoice)
    ) ?? null;

  const maxAmount =
    selectedInvoiceData?.balance_due ?? 0;

  function clearError() {
    if (error) {
      setError("");
    }
  }

  function handleInvoiceChange(value: string) {
    setSelectedInvoice(value);
    setError("");

    const invoice = invoices.find(
      (item) => item.id === Number(value)
    );

    if (invoice) {
      setAmount(
        Number(invoice.balance_due).toFixed(2)
      );
    } else {
      setAmount("");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const invoiceId = Number(selectedInvoice);
    const paymentAmount = Number(amount);

    if (
      !Number.isInteger(invoiceId) ||
      invoiceId <= 0
    ) {
      setError(
        "Please select an invoice before recording the payment."
      );
      return;
    }

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      setError(
        "Please enter a valid payment amount greater than ₹0."
      );
      return;
    }

    if (
      selectedInvoiceData &&
      paymentAmount >
        Number(selectedInvoiceData.balance_due)
    ) {
      setError(
        "Payment amount cannot be greater than the invoice balance."
      );
      return;
    }

    try {
      await paymentMutation.mutateAsync({
        invoiceId,
        amount: paymentAmount,
        paymentMethod,
        paymentReference:
          paymentReference.trim() || null,
        paymentStatus: "completed",
      });

      router.push(`/invoices/${invoiceId}`);
      router.refresh();
    } catch (error) {
      console.error(
        "Record payment error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to record payment. Please try again."
      );
    }
  }

  const isSubmitting =
    paymentMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-3xl overflow-x-hidden">
      {/* BACK */}

      <button
        type="button"
        onClick={() => router.back()}
        className="
          mb-5
          inline-flex
          min-h-11
          items-center
          justify-center
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
          active:scale-[0.98]
          sm:mb-6
        "
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* HEADER */}

      <div className="mb-5 min-w-0 sm:mb-6">
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.30em]
            text-zinc-600
          "
        >
          Payments
        </p>

        <h1
          className="
            mt-2
            text-2xl
            font-semibold
            leading-tight
            tracking-[-0.04em]
            text-white
            sm:text-3xl
          "
        >
          Record Payment
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
          Record a payment received against an
          outstanding invoice.
        </p>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="
          w-full
          overflow-hidden
          rounded-[24px]
          border
          border-white/[0.06]
          bg-[#101318]
          sm:rounded-[28px]
        "
      >
        {/* TOP GOLD LINE */}

        <div
          className="
            h-px
            w-full
            bg-gradient-to-r
            from-transparent
            via-[#D4AF37]/30
            to-transparent
          "
        />

        <div
          className="
            space-y-6
            p-4
            sm:space-y-7
            sm:p-8
          "
        >
          {/* INVOICE */}

          <div className="min-w-0">
            <label
              htmlFor="invoice"
              className="
                mb-2
                block
                text-[10px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-zinc-500
              "
            >
              Invoice
            </label>

            {invoices.length === 0 ? (
              <div
                className="
                  rounded-xl
                  border
                  border-amber-400/10
                  bg-amber-400/[0.03]
                  px-4
                  py-3
                  text-sm
                  leading-6
                  text-amber-400/80
                "
              >
                No invoices are available for
                payment recording.
              </div>
            ) : (
              <select
                id="invoice"
                value={selectedInvoice}
                onChange={(event) =>
                  handleInvoiceChange(
                    event.target.value
                  )
                }
                disabled={isSubmitting}
                className="
                  h-12
                  w-full
                  min-w-0
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  px-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  focus:border-[#D4AF37]/30
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:px-4
                "
              >
                <option
                  value=""
                  className="bg-[#101318]"
                >
                  Select an invoice
                </option>

                {invoices.map((invoice) => (
                  <option
                    key={invoice.id}
                    value={invoice.id}
                    className="bg-[#101318]"
                  >
                    {invoice.invoice_number} —{" "}
                    {invoice.customer} — ₹
                    {Number(
                      invoice.balance_due
                    ).toLocaleString("en-IN")}{" "}
                    due
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* SELECTED INVOICE SUMMARY */}

          {selectedInvoiceData && (
            <div
              className="
                grid
                min-w-0
                grid-cols-1
                gap-3
                sm:grid-cols-3
              "
            >
              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.018]
                  p-4
                "
              >
                <p className="text-[9px] uppercase tracking-[0.20em] text-zinc-600">
                  Invoice
                </p>

                <p className="mt-2 break-words text-sm font-medium text-white">
                  {selectedInvoiceData.invoice_number}
                </p>
              </div>

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-white/[0.018]
                  p-4
                "
              >
                <p className="text-[9px] uppercase tracking-[0.20em] text-zinc-600">
                  Customer
                </p>

                <p className="mt-2 break-words text-sm font-medium text-white">
                  {selectedInvoiceData.customer}
                </p>
              </div>

              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-[#D4AF37]/10
                  bg-[#D4AF37]/[0.04]
                  p-4
                "
              >
                <p className="text-[9px] uppercase tracking-[0.20em] text-[#D4AF37]/60">
                  Balance Due
                </p>

                <p className="mt-2 break-words text-sm font-semibold text-[#F3D37A]">
                  ₹
                  {Number(
                    selectedInvoiceData.balance_due
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          )}

          {/* AMOUNT */}

          <div className="min-w-0">
            <label
              htmlFor="amount"
              className="
                mb-2
                block
                text-[10px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-zinc-500
              "
            >
              Payment Amount
            </label>

            <div className="relative">
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-4
                  flex
                  items-center
                  text-zinc-500
                "
              >
                <IndianRupee size={16} />
              </div>

              <input
                id="amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                max={
                  maxAmount > 0
                    ? maxAmount
                    : undefined
                }
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  clearError();
                }}
                disabled={
                  isSubmitting ||
                  !selectedInvoice
                }
                placeholder="0.00"
                className="
                  h-12
                  w-full
                  min-w-0
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-700
                  focus:border-[#D4AF37]/30
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              />
            </div>

            {selectedInvoiceData && (
              <p className="mt-2 break-words text-[11px] leading-5 text-zinc-600">
                Maximum recordable amount: ₹
                {Number(
                  selectedInvoiceData.balance_due
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>

          {/* PAYMENT METHOD */}

          <div className="min-w-0">
            <label
              htmlFor="paymentMethod"
              className="
                mb-2
                block
                text-[10px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-zinc-500
              "
            >
              Payment Method
            </label>

            <div className="relative">
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-4
                  flex
                  items-center
                  text-zinc-500
                "
              >
                <CreditCard size={16} />
              </div>

              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(event) => {
                  setPaymentMethod(
                    event.target.value
                  );
                  clearError();
                }}
                disabled={isSubmitting}
                className="
                  h-12
                  w-full
                  min-w-0
                  appearance-none
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  pl-11
                  pr-4
                  text-sm
                  capitalize
                  text-white
                  outline-none
                  transition
                  focus:border-[#D4AF37]/30
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <option
                  value="upi"
                  className="bg-[#101318]"
                >
                  UPI
                </option>

                <option
                  value="cash"
                  className="bg-[#101318]"
                >
                  Cash
                </option>

                <option
                  value="bank_transfer"
                  className="bg-[#101318]"
                >
                  Bank Transfer
                </option>

                <option
                  value="card"
                  className="bg-[#101318]"
                >
                  Card
                </option>

                <option
                  value="other"
                  className="bg-[#101318]"
                >
                  Other
                </option>
              </select>
            </div>
          </div>

          {/* REFERENCE */}

          <div className="min-w-0">
            <label
              htmlFor="paymentReference"
              className="
                mb-2
                block
                text-[10px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-zinc-500
              "
            >
              Payment Reference

              <span className="ml-2 normal-case tracking-normal text-zinc-700">
                Optional
              </span>
            </label>

            <input
              id="paymentReference"
              type="text"
              value={paymentReference}
              onChange={(event) => {
                setPaymentReference(
                  event.target.value
                );
                clearError();
              }}
              disabled={isSubmitting}
              placeholder="UPI reference, transaction ID, etc."
              className="
                h-12
                w-full
                min-w-0
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-4
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-zinc-700
                focus:border-[#D4AF37]/30
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />
          </div>

          {/* ERROR */}

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="
                rounded-2xl
                border
                border-red-400/15
                bg-red-400/[0.04]
                px-4
                py-4
              "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    mt-0.5
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-400/[0.08]
                  "
                >
                  <AlertCircle
                    size={15}
                    className="text-red-400"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-red-300">
                    Payment could not be recorded
                  </p>

                  <p className="mt-1 break-words text-xs leading-5 text-red-400/80">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-white/[0.05]
              pt-5
              sm:flex-row
              sm:justify-end
              sm:pt-6
            "
          >
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                px-5
                text-sm
                font-medium
                text-zinc-400
                transition
                hover:border-white/[0.12]
                hover:bg-white/[0.04]
                hover:text-white
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                invoices.length === 0
              }
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#D4AF37]/20
                bg-[#D4AF37]/10
                px-6
                text-sm
                font-medium
                text-[#F3D37A]
                transition-all
                duration-200
                hover:border-[#D4AF37]/30
                hover:bg-[#D4AF37]/15
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:w-auto
              "
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Recording...
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  Record Payment
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
