"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Banknote,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  FileText,
  Loader2,
  Search,
  Smartphone,
  WalletCards,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Invoice = {
  id: string;
  invoice_number: string | null;
  customer_id: string | null;
  total: number | null;
  amount_paid: number | null;
  balance_due: number | null;
  status: string | null;
  customers?: {
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
};

type PaymentMethod =
  | "upi"
  | "bank_transfer"
  | "cash"
  | "other";

const paymentMethods: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Smartphone;
}[] = [
  {
    id: "upi",
    label: "UPI",
    description: "UPI / QR payment",
    icon: Smartphone,
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    description: "NEFT / RTGS / IMPS",
    icon: Building2,
  },
  {
    id: "cash",
    label: "Cash",
    description: "Cash received",
    icon: Banknote,
  },
  {
    id: "other",
    label: "Other",
    description: "Other payment method",
    icon: WalletCards,
  },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function getBalance(invoice: Invoice) {
  const balance = Number(invoice.balance_due ?? 0);

  if (Number.isFinite(balance)) {
    return Math.max(balance, 0);
  }

  return Math.max(
    Number(invoice.total ?? 0) -
      Number(invoice.amount_paid ?? 0),
    0
  );
}

export default function RecordPaymentForm() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [loadingInvoices, setLoadingInvoices] =
    useState(true);

  const [invoiceSearch, setInvoiceSearch] =
    useState("");

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [amount, setAmount] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("upi");

  const [paymentDate, setPaymentDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [reference, setReference] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showInvoiceList, setShowInvoiceList] =
    useState(false);

  /*
   * =========================================================
   * LOAD OUTSTANDING INVOICES
   * =========================================================
   */

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoadingInvoices(true);

        const {
          data,
          error,
        } = await supabase
          .from("invoices")
          .select(`
            id,
            invoice_number,
            customer_id,
            total,
            amount_paid,
            balance_due,
            status,
            customers (
              name,
              email,
              phone
            )
          `)
          .gt("balance_due", 0)
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          throw error;
        }

        setInvoices(
          (data ?? []) as unknown as Invoice[]
        );
      } catch (err) {
        console.error(
          "[RecordPayment] Invoice load error:",
          err
        );

        setError(
          "Unable to load outstanding invoices."
        );
      } finally {
        setLoadingInvoices(false);
      }
    }

    loadInvoices();
  }, [supabase]);

  /*
   * =========================================================
   * FILTER INVOICES
   * =========================================================
   */

  const filteredInvoices = useMemo(() => {
    const query =
      invoiceSearch
        .trim()
        .toLowerCase();

    if (!query) {
      return invoices;
    }

    return invoices.filter(
      (invoice) => {
        const invoiceNumber =
          invoice.invoice_number
            ?.toLowerCase() ?? "";

        const customerName =
          invoice.customers?.name
            ?.toLowerCase() ?? "";

        const email =
          invoice.customers?.email
            ?.toLowerCase() ?? "";

        return (
          invoiceNumber.includes(query) ||
          customerName.includes(query) ||
          email.includes(query)
        );
      }
    );
  }, [
    invoiceSearch,
    invoices,
  ]);

  /*
   * =========================================================
   * CURRENT BALANCE
   * =========================================================
   */

  const outstandingBalance =
    selectedInvoice
      ? getBalance(selectedInvoice)
      : 0;

  const numericAmount =
    Number(amount) || 0;

  const remainingBalance =
    Math.max(
      outstandingBalance -
        numericAmount,
      0
    );

  const amountExceedsBalance =
    numericAmount >
    outstandingBalance + 0.01;

  /*
   * =========================================================
   * SELECT INVOICE
   * =========================================================
   */

  function selectInvoice(
    invoice: Invoice
  ) {
    setSelectedInvoice(invoice);
    setInvoiceSearch(
      invoice.invoice_number ??
        invoice.customers?.name ??
        ""
    );
    setShowInvoiceList(false);
    setError("");
    setSuccess(false);
    setAmount("");
  }

  /*
   * =========================================================
   * FULL BALANCE
   * =========================================================
   */

  function useFullBalance() {
    if (!selectedInvoice) return;

    setAmount(
      outstandingBalance.toFixed(2)
    );

    setError("");
  }

  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!selectedInvoice) {
      setError(
        "Please select an invoice."
      );
      return;
    }

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      setError(
        "Enter a valid payment amount."
      );
      return;
    }

    if (amountExceedsBalance) {
      setError(
        "Payment amount cannot exceed the outstanding invoice balance."
      );
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Temporary endpoint contract.
       *
       * We will connect this to the existing
       * payment recording service next.
       */

      const response =
        await fetch(
          "/api/payments/record",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              invoiceId:
                selectedInvoice.id,
              amount:
                numericAmount,
              paymentMethod,
              paymentDate,
              reference:
                reference.trim() ||
                null,
              notes:
                notes.trim() ||
                null,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Unable to record payment."
        );
      }

      setSuccess(true);

      /*
       * Update local invoice state so
       * the UI immediately reflects the
       * newly recorded payment.
       */

      const newBalance =
        remainingBalance;

      setSelectedInvoice(
        (current) =>
          current
            ? {
                ...current,
                amount_paid:
                  Number(
                    current.amount_paid ??
                      0
                  ) +
                  numericAmount,
                balance_due:
                  newBalance,
                status:
                  newBalance <=
                  0.01
                    ? "Paid"
                    : "Partially Paid",
              }
            : current
      );

      setAmount("");
      setReference("");
      setNotes("");

      setInvoices(
        (current) =>
          current
            .map((invoice) =>
              invoice.id ===
              selectedInvoice.id
                ? {
                    ...invoice,
                    amount_paid:
                      Number(
                        invoice.amount_paid ??
                          0
                      ) +
                      numericAmount,
                    balance_due:
                      newBalance,
                    status:
                      newBalance <=
                      0.01
                        ? "Paid"
                        : "Partially Paid",
                  }
                : invoice
            )
            .filter(
              (invoice) =>
                getBalance(
                  invoice
                ) > 0
            )
      );
    } catch (err) {
      console.error(
        "[RecordPayment] Submit error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to record payment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * =========================================================
   * SUCCESS STATE
   * =========================================================
   */

  if (success && selectedInvoice) {
    return (
      <div
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-[#D4AF37]/15
          bg-[#111214]/80
          shadow-[0_30px_100px_rgba(0,0,0,.35)]
          backdrop-blur-2xl
        "
      >
        <div className="px-6 py-12 text-center sm:px-10 sm:py-16">
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              border
              border-[#D4AF37]/20
              bg-[#D4AF37]/10
            "
          >
            <Check
              size={28}
              className="text-[#D4AF37]"
            />
          </div>

          <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
            Payment Recorded
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
            {formatCurrency(
              numericAmount
            )}
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            has been recorded against{" "}
            <span className="text-zinc-300">
              {selectedInvoice.invoice_number ??
                "this invoice"}
            </span>
          </p>

          <div
            className="
              mx-auto
              mt-8
              max-w-md
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              p-5
              text-left
            "
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                Customer
              </span>

              <span className="text-sm font-medium text-white">
                {selectedInvoice
                  .customers
                  ?.name ??
                  "Customer"}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                Remaining balance
              </span>

              <span className="text-sm font-semibold text-[#D4AF37]">
                {formatCurrency(
                  remainingBalance
                )}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setSuccess(false)
              }
              className="
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                px-5
                py-3
                text-sm
                font-medium
                text-zinc-300
                transition
                hover:border-white/15
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              Record Another
            </button>

            <a
              href={`/invoices/${selectedInvoice.id}`}
              className="
                rounded-xl
                bg-[#D4AF37]
                px-5
                py-3
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-[#e1c45a]
              "
            >
              View Invoice
            </a>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * MAIN FORM
   * =========================================================
   */

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      {/* =======================================================
          LEFT
      ======================================================== */}

      <div className="space-y-5">
        {/* SELECT INVOICE */}

        <section
          className="
            rounded-[24px]
            border
            border-white/[0.07]
            bg-[#111214]/80
            p-5
            shadow-[0_20px_70px_rgba(0,0,0,.22)]
            backdrop-blur-2xl
            sm:p-6
          "
        >
          <div className="mb-5 flex items-start gap-4">
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
                border-[#D4AF37]/15
                bg-[#D4AF37]/[0.06]
              "
            >
              <FileText
                size={17}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-600">
                01
              </p>

              <h2 className="mt-1 text-base font-semibold text-white">
                Select Invoice
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Choose the invoice this payment belongs to.
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={17}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-zinc-600
              "
            />

            <input
              value={invoiceSearch}
              onChange={(event) => {
                setInvoiceSearch(
                  event.target.value
                );
                setShowInvoiceList(true);
                setSelectedInvoice(null);
                setSuccess(false);
              }}
              onFocus={() =>
                setShowInvoiceList(true)
              }
              placeholder={
                loadingInvoices
                  ? "Loading invoices..."
                  : "Search invoice or customer..."
              }
              disabled={
                loadingInvoices
              }
              className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                pl-12
                pr-11
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-zinc-700
                focus:border-[#D4AF37]/30
                focus:bg-white/[0.04]
              "
            />

            <ChevronDown
              size={16}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-zinc-600
              "
            />

            {showInvoiceList &&
              !selectedInvoice && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-[calc(100%+8px)]
                    z-30
                    max-h-72
                    overflow-y-auto
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-[#151619]
                    p-2
                    shadow-[0_25px_80px_rgba(0,0,0,.6)]
                  "
                >
                  {filteredInvoices.length >
                  0 ? (
                    filteredInvoices.map(
                      (invoice) => {
                        const balance =
                          getBalance(
                            invoice
                          );

                        return (
                          <button
                            key={
                              invoice.id
                            }
                            type="button"
                            onClick={() =>
                              selectInvoice(
                                invoice
                              )
                            }
                            className="
                              flex
                              w-full
                              items-center
                              justify-between
                              gap-4
                              rounded-xl
                              px-3
                              py-3
                              text-left
                              transition
                              hover:bg-white/[0.05]
                            "
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">
                                {invoice.invoice_number ??
                                  "Invoice"}
                              </p>

                              <p className="mt-1 truncate text-xs text-zinc-600">
                                {invoice
                                  .customers
                                  ?.name ??
                                  "Customer"}
                              </p>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="text-sm font-semibold text-[#D4AF37]">
                                {formatCurrency(
                                  balance
                                )}
                              </p>

                              <p className="mt-1 text-[10px] text-zinc-600">
                                outstanding
                              </p>
                            </div>
                          </button>
                        );
                      }
                    )
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-zinc-500">
                        No outstanding invoices found.
                      </p>
                    </div>
                  )}
                </div>
              )}
          </div>

          {selectedInvoice && (
            <div
              className="
                mt-4
                rounded-2xl
                border
                border-[#D4AF37]/10
                bg-[#D4AF37]/[0.035]
                p-4
              "
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {selectedInvoice.invoice_number ??
                      "Invoice"}
                  </p>

                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {selectedInvoice
                      .customers
                      ?.name ??
                      "Customer"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                    Balance Due
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[#D4AF37]">
                    {formatCurrency(
                      outstandingBalance
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* PAYMENT */}

        <section
          className="
            rounded-[24px]
            border
            border-white/[0.07]
            bg-[#111214]/80
            p-5
            shadow-[0_20px_70px_rgba(0,0,0,.22)]
            backdrop-blur-2xl
            sm:p-6
          "
        >
          <div className="mb-6 flex items-start gap-4">
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
                border-[#D4AF37]/15
                bg-[#D4AF37]/[0.06]
              "
            >
              <CircleDollarSign
                size={18}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-600">
                02
              </p>

              <h2 className="mt-1 text-base font-semibold text-white">
                Payment Details
              </h2>
            </div>
          </div>

          {/* AMOUNT */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-400">
                Amount received
              </label>

              {selectedInvoice && (
                <button
                  type="button"
                  onClick={
                    useFullBalance
                  }
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.15em]
                    text-[#D4AF37]
                    transition
                    hover:text-[#e6ca67]
                  "
                >
                  Full Balance
                </button>
              )}
            </div>

            <div className="relative">
              <span
                className="
                  pointer-events-none
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-xl
                  font-medium
                  text-zinc-600
                "
              >
                ₹
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => {
                  setAmount(
                    event.target.value
                  );
                  setError("");
                }}
                placeholder="0.00"
                className="
                  h-20
                  w-full
                  rounded-2xl
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  pl-12
                  pr-5
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-700
                  focus:border-[#D4AF37]/30
                  focus:bg-white/[0.04]
                "
              />
            </div>

            {selectedInvoice && (
              <div className="mt-2 flex justify-between text-[11px]">
                <span className="text-zinc-600">
                  Outstanding
                </span>

                <span className="text-zinc-400">
                  {formatCurrency(
                    outstandingBalance
                  )}
                </span>
              </div>
            )}
          </div>

          {/* METHODS */}

          <div className="mt-7">
            <label className="mb-3 block text-xs font-medium text-zinc-400">
              Payment method
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {paymentMethods.map(
                (method) => {
                  const Icon =
                    method.icon;

                  const active =
                    paymentMethod ===
                    method.id;

                  return (
                    <button
                      key={
                        method.id
                      }
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          method.id
                        )
                      }
                      className={`
                        rounded-2xl
                        border
                        p-3
                        text-left
                        transition
                        ${
                          active
                            ? "border-[#D4AF37]/30 bg-[#D4AF37]/[0.07]"
                            : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
                        }
                      `}
                    >
                      <Icon
                        size={17}
                        className={
                          active
                            ? "text-[#D4AF37]"
                            : "text-zinc-500"
                        }
                      />

                      <p
                        className={`
                          mt-3
                          text-xs
                          font-medium
                          ${
                            active
                              ? "text-white"
                              : "text-zinc-400"
                          }
                        `}
                      >
                        {
                          method.label
                        }
                      </p>

                      <p className="mt-1 text-[9px] leading-4 text-zinc-700">
                        {
                          method.description
                        }
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* DATE */}

          <div className="mt-7">
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Payment date
            </label>

            <input
              type="date"
              value={paymentDate}
              onChange={(event) =>
                setPaymentDate(
                  event.target.value
                )
              }
              className="
                h-12
                w-full
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-4
                text-sm
                text-white
                outline-none
                transition
                focus:border-[#D4AF37]/30
              "
            />
          </div>

          {/* REFERENCE */}

          <div className="mt-5">
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Transaction reference
              <span className="ml-2 text-zinc-700">
                Optional
              </span>
            </label>

            <input
              type="text"
              value={reference}
              onChange={(event) =>
                setReference(
                  event.target.value
                )
              }
              placeholder={
                paymentMethod ===
                "upi"
                  ? "e.g. UPI transaction ID"
                  : paymentMethod ===
                      "bank_transfer"
                    ? "e.g. UTR number"
                    : "Reference number"
              }
              className="
                h-12
                w-full
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
              "
            />
          </div>

          {/* NOTES */}

          <div className="mt-5">
            <label className="mb-2 block text-xs font-medium text-zinc-400">
              Notes
              <span className="ml-2 text-zinc-700">
                Optional
              </span>
            </label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              rows={3}
              placeholder="Add any useful payment notes..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.025]
                px-4
                py-3
                text-sm
                text-white
                outline-none
                transition
                placeholder:text-zinc-700
                focus:border-[#D4AF37]/30
              "
            />
          </div>
        </section>
      </div>

      {/* =======================================================
          RIGHT SUMMARY
      ======================================================== */}

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div
          className="
            overflow-hidden
            rounded-[24px]
            border
            border-white/[0.07]
            bg-[#111214]/80
            shadow-[0_20px_70px_rgba(0,0,0,.22)]
            backdrop-blur-2xl
          "
        >
          <div className="p-5 sm:p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-600">
              Payment Summary
            </p>

            {selectedInvoice ? (
              <>
                <div className="mt-5">
                  <p className="text-sm font-semibold text-white">
                    {selectedInvoice.invoice_number ??
                      "Invoice"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {selectedInvoice
                      .customers
                      ?.name ??
                      "Customer"}
                  </p>
                </div>

                <div className="my-6 h-px bg-white/[0.06]" />

                <div className="space-y-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-xs text-zinc-600">
                      Balance due
                    </span>

                    <span className="text-sm text-zinc-300">
                      {formatCurrency(
                        outstandingBalance
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-xs text-zinc-600">
                      Recording
                    </span>

                    <span className="text-sm font-medium text-white">
                      {formatCurrency(
                        numericAmount
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-xs text-zinc-600">
                      Method
                    </span>

                    <span className="text-sm capitalize text-zinc-300">
                      {paymentMethod.replace(
                        "_",
                        " "
                      )}
                    </span>
                  </div>
                </div>

                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-[#D4AF37]/10
                    bg-[#D4AF37]/[0.04]
                    p-4
                  "
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                    Remaining
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-[#D4AF37]">
                    {formatCurrency(
                      remainingBalance
                    )}
                  </p>

                  {numericAmount > 0 &&
                    !amountExceedsBalance && (
                      <p className="mt-1 text-[11px] text-zinc-600">
                        {remainingBalance <=
                        0.01
                          ? "Invoice will be fully paid."
                          : "Balance will remain outstanding."}
                      </p>
                    )}
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <CircleDollarSign
                  size={26}
                  className="mx-auto text-zinc-700"
                />

                <p className="mt-4 text-sm text-zinc-500">
                  Select an invoice to see the payment summary.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div
              className="
                border-t
                border-red-500/10
                bg-red-500/[0.04]
                px-5
                py-4
                text-xs
                leading-5
                text-red-300
                sm:px-6
              "
            >
              {error}
            </div>
          )}

          <div className="border-t border-white/[0.06] p-5 sm:p-6">
            <button
              type="submit"
              disabled={
                submitting ||
                !selectedInvoice ||
                !numericAmount ||
                amountExceedsBalance
              }
              className="
                flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#D4AF37]
                px-5
                text-sm
                font-semibold
                text-black
                transition-all
                duration-200
                hover:bg-[#e1c45a]
                disabled:cursor-not-allowed
                disabled:bg-zinc-800
                disabled:text-zinc-600
              "
            >
              {submitting ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Recording...
                </>
              ) : (
                <>
                  <Check
                    size={16}
                  />
                  Record{" "}
                  {numericAmount >
                  0
                    ? formatCurrency(
                        numericAmount
                      )
                    : "Payment"}
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </form>
  );
}