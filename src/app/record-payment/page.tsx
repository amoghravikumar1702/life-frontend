"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowDownLeft,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  FileText,
  Loader2,
  Search,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Customer = {
  id: string;
  name?: string | null;
  company_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

type Invoice = {
  id: string;
  invoice_number?: string | null;
  customer_id?: string | null;
  customerId?: string | null;
  total?: number | string | null;
  amount_paid?: number | string | null;
  balance_due?: number | string | null;
  status?: string | null;
  due_date?: string | null;
  created_at?: string | null;
};

type PaymentMethod =
  | "upi"
  | "bank_transfer"
  | "cash"
  | "other";

const PAYMENT_METHODS = [
  {
    id: "upi" as const,
    label: "UPI",
    description: "UPI payment",
    icon: Smartphone,
  },
  {
    id: "bank_transfer" as const,
    label: "Bank Transfer",
    description: "NEFT / RTGS / IMPS",
    icon: Building2,
  },
  {
    id: "cash" as const,
    label: "Cash",
    description: "Cash received",
    icon: Wallet,
  },
  {
    id: "other" as const,
    label: "Other",
    description: "Other payment method",
    icon: CircleDollarSign,
  },
];

function money(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function numberValue(
  value: number | string | null | undefined
) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function customerName(customer?: Customer) {
  if (!customer) return "Unknown customer";

  return (
    customer.company_name ||
    customer.name ||
    "Unnamed customer"
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RecordPaymentPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const selectorRef =
    useRef<HTMLDivElement>(null);

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [invoiceSearch, setInvoiceSearch] =
    useState("");

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [amount, setAmount] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("upi");

  const [paymentDate, setPaymentDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [reference, setReference] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  /*
   * ============================================================
   * LOAD OUTSTANDING INVOICES
   * ============================================================
   */

  async function loadInvoices() {
    try {
      setLoading(true);
      setLoadError(null);

      /*
       * Load invoices without relying on a Supabase
       * relationship. This keeps the page compatible
       * with the existing ArkenOne schema.
       */

      const {
        data: invoiceData,
        error: invoiceError,
      } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (invoiceError) {
        console.error(
          "[RecordPayment] Invoice load error:",
          {
            message: invoiceError.message,
            details: invoiceError.details,
            hint: invoiceError.hint,
            code: invoiceError.code,
          }
        );

        throw new Error(
          invoiceError.message ||
            "Unable to load invoices."
        );
      }

      /*
       * Keep only invoices with money outstanding.
       *
       * We intentionally calculate this from the
       * financial fields instead of trusting only
       * the status column.
       */

      const outstanding = (
        (invoiceData ?? []) as Invoice[]
      ).filter((invoice) => {
        const balance =
          numberValue(invoice.balance_due);

        if (balance > 0.01) {
          return true;
        }

        const total =
          numberValue(invoice.total);

        const paid =
          numberValue(invoice.amount_paid);

        return total - paid > 0.01;
      });

      setInvoices(outstanding);

      /*
       * Load customers separately.
       */

      const {
        data: customerData,
        error: customerError,
      } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (customerError) {
        console.error(
          "[RecordPayment] Customer load error:",
          {
            message: customerError.message,
            details: customerError.details,
            hint: customerError.hint,
            code: customerError.code,
          }
        );

        /*
         * Customers are useful for display but aren't
         * required to render invoices, so don't fail
         * the whole page if this query fails.
         */
        setCustomers([]);
      } else {
        setCustomers(
          (customerData ?? []) as Customer[]
        );
      }
    } catch (error) {
      console.error(
        "[RecordPayment] Failed to load payment data:",
        error
      );

      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load outstanding invoices."
      );

      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadInvoices();
  }, []);

  /*
   * ============================================================
   * CLOSE DROPDOWN WHEN CLICKING OUTSIDE
   * ============================================================
   */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(
          event.target as Node
        )
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /*
   * ============================================================
   * CUSTOMER MAP
   * ============================================================
   */

  const customerMap = useMemo(() => {
    const map = new Map<
      string,
      Customer
    >();

    customers.forEach((customer) => {
      map.set(customer.id, customer);
    });

    return map;
  }, [customers]);

  /*
   * ============================================================
   * INVOICE CUSTOMER
   * ============================================================
   */

  function getInvoiceCustomer(
    invoice: Invoice
  ) {
    const customerId =
      invoice.customer_id ||
      invoice.customerId;

    if (!customerId) {
      return undefined;
    }

    return customerMap.get(customerId);
  }

  /*
   * ============================================================
   * FILTERED INVOICES
   * ============================================================
   */

  const filteredInvoices =
    useMemo(() => {
      const query =
        invoiceSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return invoices;
      }

      return invoices.filter(
        (invoice) => {
          const customer =
            getInvoiceCustomer(
              invoice
            );

          const invoiceNumber =
            invoice.invoice_number ||
            "";

          const name =
            customerName(customer);

          const email =
            customer?.email || "";

          return (
            invoiceNumber
              .toLowerCase()
              .includes(query) ||
            name
              .toLowerCase()
              .includes(query) ||
            email
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [
      invoices,
      invoiceSearch,
      customerMap,
    ]);

  /*
   * ============================================================
   * SELECT INVOICE
   * ============================================================
   */

  function selectInvoice(
    invoice: Invoice
  ) {
    setSelectedInvoice(invoice);
    setDropdownOpen(false);
    setInvoiceSearch("");

    const balance =
      numberValue(
        invoice.balance_due
      );

    const total =
      numberValue(invoice.total);

    const paid =
      numberValue(
        invoice.amount_paid
      );

    const calculatedBalance =
      Math.max(
        total - paid,
        0
      );

    const available =
      balance > 0
        ? balance
        : calculatedBalance;

    setAmount(
      available > 0
        ? available.toFixed(2)
        : ""
    );

    setSubmitError(null);
    setSuccessMessage(null);
  }

  /*
   * ============================================================
   * PAYMENT CALCULATIONS
   * ============================================================
   */

  const invoiceTotal =
    selectedInvoice
      ? numberValue(
          selectedInvoice.total
        )
      : 0;

  const previousPaid =
    selectedInvoice
      ? numberValue(
          selectedInvoice.amount_paid
        )
      : 0;

  const existingBalance =
    selectedInvoice
      ? numberValue(
          selectedInvoice.balance_due
        )
      : 0;

  const calculatedBalance =
    Math.max(
      invoiceTotal -
        previousPaid,
      0
    );

  const outstandingBalance =
    existingBalance > 0
      ? existingBalance
      : calculatedBalance;

  const paymentAmount =
    numberValue(amount);

  const remainingBalance =
    Math.max(
      outstandingBalance -
        paymentAmount,
      0
    );

  const paymentIsValid =
    Boolean(
      selectedInvoice &&
        paymentAmount > 0 &&
        paymentAmount <=
          outstandingBalance + 0.01
    );

  /*
   * ============================================================
   * RECORD PAYMENT
   * ============================================================
   */

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setSubmitError(null);
    setSuccessMessage(null);

    if (!selectedInvoice) {
      setSubmitError(
        "Please select an invoice."
      );
      return;
    }

    if (paymentAmount <= 0) {
      setSubmitError(
        "Enter a payment amount."
      );
      return;
    }

    if (
      paymentAmount >
      outstandingBalance + 0.01
    ) {
      setSubmitError(
        `Payment cannot exceed the outstanding balance of ${money(
          outstandingBalance
        )}.`
      );
      return;
    }

    try {
      setSubmitting(true);

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
                paymentAmount,

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
            result?.message ||
            "Unable to record payment."
        );
      }

      setSuccessMessage(
        `Payment of ${money(
          paymentAmount
        )} recorded successfully.`
      );

      setAmount("");
      setReference("");
      setNotes("");

      await loadInvoices();

      const refreshedInvoice =
        invoices.find(
          (invoice) =>
            invoice.id ===
            selectedInvoice.id
        );

      if (!refreshedInvoice) {
        setSelectedInvoice(null);
      }
    } catch (error) {
      console.error(
        "[RecordPayment] Payment recording error:",
        error
      );

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to record payment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selectedCustomer =
    selectedInvoice
      ? getInvoiceCustomer(
          selectedInvoice
        )
      : undefined;

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <main className="min-h-full px-4 pb-12 pt-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {/* ======================================================
            HEADER
        ======================================================= */}

        <div className="mb-7">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.32em] text-[#D4AF37]">
            Payments
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Record Payment
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-[15px]">
            Record money your business has
            already received and keep your
            invoice balances accurate.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_390px]"
        >
          {/* ====================================================
              LEFT COLUMN
          ===================================================== */}

          <div className="space-y-5">
            {/* ==================================================
                INVOICE SELECTOR
            =================================================== */}

            <section
              ref={selectorRef}
              className="
                relative
                z-40
                overflow-visible
                rounded-[24px]
                border
                border-white/[0.09]
                bg-[#101112]
                p-6
                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                sm:p-7
              "
            >
              <div className="mb-5 flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[#D4AF37]/15
                    bg-[#D4AF37]/[0.07]
                  "
                >
                  <FileText
                    size={19}
                    className="text-[#D4AF37]"
                  />
                </div>

                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-[0.24em] text-zinc-600">
                    01
                  </p>

                  <h2 className="text-[16px] font-semibold text-white">
                    Select Invoice
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Choose the invoice this
                    payment belongs to.
                  </p>
                </div>
              </div>

              {/* ==================================================
                  SELECT CONTROL
              =================================================== */}

              <button
                type="button"
                onClick={() =>
                  setDropdownOpen(
                    (open) => !open
                  )
                }
                className="
                  relative
                  z-50
                  flex
                  min-h-[62px]
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/[0.09]
                  bg-white/[0.025]
                  px-4
                  text-left
                  transition-all
                  duration-200
                  hover:border-[#D4AF37]/30
                  hover:bg-white/[0.04]
                  focus:border-[#D4AF37]/40
                  focus:outline-none
                "
              >
                <Search
                  size={18}
                  className="shrink-0 text-zinc-600"
                />

                <div className="min-w-0 flex-1">
                  {selectedInvoice ? (
                    <>
                      <p className="truncate text-sm font-medium text-white">
                        {selectedInvoice.invoice_number ||
                          "Invoice"}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-zinc-600">
                        {customerName(
                          selectedCustomer
                        )}
                        {" · "}
                        {money(
                          outstandingBalance
                        )}{" "}
                        outstanding
                      </p>
                    </>
                  ) : (
                    <span className="text-sm text-zinc-600">
                      Search invoice or customer...
                    </span>
                  )}
                </div>

                <ChevronDown
                  size={17}
                  className={`
                    shrink-0
                    text-zinc-600
                    transition-transform
                    ${
                      dropdownOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* ==================================================
                  DROPDOWN
              =================================================== */}

              {dropdownOpen && (
                <div
                  className="
                    absolute
                    left-6
                    right-6
                    top-[calc(100%-1px)]
                    z-[200]
                    mt-2
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/[0.10]
                    bg-[#151617]
                    shadow-[0_30px_90px_rgba(0,0,0,0.65)]
                    ring-1
                    ring-black/50
                  "
                >
                  <div className="border-b border-white/[0.07] p-3">
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-3">
                      <Search
                        size={16}
                        className="text-zinc-600"
                      />

                      <input
                        autoFocus
                        value={invoiceSearch}
                        onChange={(event) =>
                          setInvoiceSearch(
                            event.target
                              .value
                          )
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key ===
                            "Escape"
                          ) {
                            setDropdownOpen(
                              false
                            );
                          }
                        }}
                        placeholder="Search invoice or customer..."
                        className="
                          h-11
                          min-w-0
                          flex-1
                          bg-transparent
                          text-sm
                          text-white
                          outline-none
                          placeholder:text-zinc-700
                        "
                      />

                      {invoiceSearch && (
                        <button
                          type="button"
                          onClick={() =>
                            setInvoiceSearch(
                              ""
                            )
                          }
                          className="text-zinc-600 transition hover:text-white"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[330px] overflow-y-auto p-2">
                    {loading ? (
                      <div className="flex items-center justify-center gap-3 px-4 py-12 text-sm text-zinc-600">
                        <Loader2
                          size={18}
                          className="animate-spin text-[#D4AF37]"
                        />
                        Loading invoices...
                      </div>
                    ) : filteredInvoices.length ===
                      0 ? (
                      <div className="px-5 py-12 text-center">
                        <FileText
                          size={24}
                          className="mx-auto text-zinc-700"
                        />

                        <p className="mt-4 text-sm font-medium text-zinc-400">
                          {invoiceSearch
                            ? "No matching invoices"
                            : "No outstanding invoices"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-700">
                          {invoiceSearch
                            ? "Try another invoice number or customer."
                            : "All customer invoices appear to be settled."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredInvoices.map(
                          (invoice) => {
                            const customer =
                              getInvoiceCustomer(
                                invoice
                              );

                            const balance =
                              numberValue(
                                invoice.balance_due
                              ) ||
                              Math.max(
                                numberValue(
                                  invoice.total
                                ) -
                                  numberValue(
                                    invoice.amount_paid
                                  ),
                                0
                              );

                            const selected =
                              selectedInvoice?.id ===
                              invoice.id;

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
                                className={`
                                  flex
                                  w-full
                                  items-center
                                  gap-3
                                  rounded-xl
                                  px-3
                                  py-3
                                  text-left
                                  transition
                                  ${
                                    selected
                                      ? "bg-[#D4AF37]/[0.08] ring-1 ring-[#D4AF37]/20"
                                      : "hover:bg-white/[0.04]"
                                  }
                                `}
                              >
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
                                    border-white/[0.07]
                                    bg-white/[0.025]
                                  "
                                >
                                  <FileText
                                    size={16}
                                    className={
                                      selected
                                        ? "text-[#D4AF37]"
                                        : "text-zinc-600"
                                    }
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-medium text-white">
                                      {invoice.invoice_number ||
                                        "Invoice"}
                                    </p>

                                    {selected && (
                                      <Check
                                        size={14}
                                        className="shrink-0 text-[#D4AF37]"
                                      />
                                    )}
                                  </div>

                                  <p className="mt-0.5 truncate text-[11px] text-zinc-600">
                                    {customerName(
                                      customer
                                    )}
                                  </p>
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="text-sm font-medium text-white">
                                    {money(
                                      balance
                                    )}
                                  </p>

                                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-700">
                                    Due
                                  </p>
                                </div>
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {loadError && (
                <div className="mt-3 flex items-start gap-3 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-4 py-3">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-red-400"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-red-300">
                      Unable to load outstanding
                      invoices.
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-red-400/60">
                      {loadError}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void loadInvoices()
                    }
                    className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-red-300 hover:text-white"
                  >
                    Retry
                  </button>
                </div>
              )}
            </section>

            {/* ==================================================
                PAYMENT DETAILS
            =================================================== */}

            <section
              className="
                relative
                z-10
                rounded-[24px]
                border
                border-white/[0.09]
                bg-[#101112]
                p-6
                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                sm:p-7
              "
            >
              <div className="mb-6 flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[#D4AF37]/15
                    bg-[#D4AF37]/[0.07]
                  "
                >
                  <CircleDollarSign
                    size={19}
                    className="text-[#D4AF37]"
                  />
                </div>

                <div>
                  <p className="mb-1 text-[9px] uppercase tracking-[0.24em] text-zinc-600">
                    02
                  </p>

                  <h2 className="text-[16px] font-semibold text-white">
                    Payment Details
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Enter how the money was
                    received.
                  </p>
                </div>
              </div>

              {/* Amount */}

              <div className="mb-7">
                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Amount received
                </label>

                <div
                  className="
                    flex
                    h-[88px]
                    items-center
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-white/[0.02]
                    px-5
                    transition
                    focus-within:border-[#D4AF37]/30
                  "
                >
                  <span className="mr-3 text-lg text-zinc-600">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target
                          .value
                      )
                    }
                    disabled={
                      !selectedInvoice
                    }
                    placeholder="0.00"
                    className="
                      w-full
                      bg-transparent
                      text-3xl
                      font-medium
                      tracking-tight
                      text-white
                      outline-none
                      placeholder:text-zinc-800
                    "
                  />
                </div>

                {selectedInvoice && (
                  <div className="mt-2 flex justify-between px-1 text-[11px]">
                    <span className="text-zinc-600">
                      Outstanding balance
                    </span>

                    <span className="font-medium text-zinc-400">
                      {money(
                        outstandingBalance
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Method */}

              <div className="mb-7">
                <label className="mb-3 block text-xs font-medium text-zinc-400">
                  Payment method
                </label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PAYMENT_METHODS.map(
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
                            min-h-[92px]
                            rounded-2xl
                            border
                            p-4
                            text-left
                            transition-all
                            ${
                              active
                                ? "border-[#D4AF37]/40 bg-[#D4AF37]/[0.07]"
                                : "border-white/[0.07] bg-white/[0.015] hover:border-white/[0.13] hover:bg-white/[0.03]"
                            }
                          `}
                        >
                          <Icon
                            size={17}
                            className={
                              active
                                ? "text-[#D4AF37]"
                                : "text-zinc-600"
                            }
                          />

                          <p
                            className={`mt-3 text-xs font-medium ${
                              active
                                ? "text-white"
                                : "text-zinc-400"
                            }`}
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

              {/* Date + Reference */}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-400">
                    Payment date
                  </label>

                  <input
                    type="date"
                    value={
                      paymentDate
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentDate(
                        event.target
                          .value
                      )
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.02]
                      px-4
                      text-sm
                      text-white
                      outline-none
                      transition
                      focus:border-[#D4AF37]/30
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-400">
                    Reference / transaction ID
                    <span className="ml-1 text-zinc-700">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={reference}
                    onChange={(
                      event
                    ) =>
                      setReference(
                        event.target
                          .value
                      )
                    }
                    placeholder="e.g. UPI123456"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.02]
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
              </div>

              {/* Notes */}

              <div className="mt-5">
                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Notes
                  <span className="ml-1 text-zinc-700">
                    Optional
                  </span>
                </label>

                <textarea
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target
                        .value
                    )
                  }
                  placeholder="Add any useful payment notes..."
                  rows={3}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.02]
                    px-4
                    py-3
                    text-sm
                    leading-6
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

          {/* ====================================================
              RIGHT SUMMARY
          ===================================================== */}

          <aside
            className="
              relative
              z-10
              lg:sticky
              lg:top-6
            "
          >
            <section
              className="
                overflow-hidden
                rounded-[24px]
                border
                border-white/[0.09]
                bg-[#101112]
                shadow-[0_20px_60px_rgba(0,0,0,0.22)]
              "
            >
              <div className="p-6">
                <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-zinc-600">
                  Payment Summary
                </p>

                {!selectedInvoice ? (
                  <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-white/[0.02]
                      "
                    >
                      <CircleDollarSign
                        size={23}
                        className="text-zinc-700"
                      />
                    </div>

                    <p className="mt-5 text-sm font-medium text-zinc-500">
                      Select an invoice
                    </p>

                    <p className="mt-1 max-w-[230px] text-xs leading-5 text-zinc-700">
                      Choose an outstanding
                      invoice to see the
                      payment summary.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Invoice */}

                    <div className="mt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-700">
                            Invoice
                          </p>

                          <p className="mt-1 truncate text-base font-semibold text-white">
                            {selectedInvoice.invoice_number ||
                              "Invoice"}
                          </p>

                          <p className="mt-1 truncate text-xs text-zinc-600">
                            {customerName(
                              selectedCustomer
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoice(
                              null
                            );
                            setAmount("");
                          }}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          <X
                            size={15}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="my-6 h-px bg-white/[0.06]" />

                    {/* Numbers */}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-600">
                          Invoice total
                        </span>

                        <span className="text-sm text-zinc-300">
                          {money(
                            invoiceTotal
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-600">
                          Previously paid
                        </span>

                        <span className="text-sm text-zinc-300">
                          {money(
                            previousPaid
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          Outstanding
                        </span>

                        <span className="text-sm font-medium text-white">
                          {money(
                            outstandingBalance
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="my-6 h-px bg-white/[0.06]" />

                    {/* Payment */}

                    <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.04] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">
                          This payment
                        </span>

                        <span className="text-lg font-semibold text-[#D4AF37]">
                          {money(
                            paymentAmount
                          )}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-600">
                          Remaining balance
                        </span>

                        <span
                          className={`text-xs font-medium ${
                            remainingBalance <=
                            0.01
                              ? "text-emerald-400"
                              : "text-zinc-300"
                          }`}
                        >
                          {money(
                            remainingBalance
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                          Settlement
                        </span>

                        <span className="text-[10px] text-zinc-600">
                          {outstandingBalance >
                          0
                            ? `${Math.min(
                                Math.round(
                                  (paymentAmount /
                                    outstandingBalance) *
                                    100
                                ),
                                100
                              )}%`
                            : "100%"}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="
                            h-full
                            rounded-full
                            bg-[#D4AF37]
                            transition-all
                            duration-500
                          "
                          style={{
                            width: `${Math.min(
                              outstandingBalance >
                                0
                                ? (paymentAmount /
                                    outstandingBalance) *
                                    100
                                : 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Error */}

              {submitError && (
                <div className="border-y border-red-500/10 bg-red-500/[0.04] px-6 py-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <p className="text-xs leading-5 text-red-300">
                      {submitError}
                    </p>
                  </div>
                </div>
              )}

              {/* Success */}

              {successMessage && (
                <div className="border-y border-emerald-500/10 bg-emerald-500/[0.04] px-6 py-4">
                  <div className="flex items-start gap-3">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <p className="text-xs leading-5 text-emerald-300">
                      {
                        successMessage
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Action */}

              <div className="p-6">
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !paymentIsValid
                  }
                  className="
                    flex
                    h-13
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[#D4AF37]
                    px-5
                    text-sm
                    font-semibold
                    text-black
                    transition-all
                    duration-200
                    hover:bg-[#e0bd4c]
                    disabled:cursor-not-allowed
                    disabled:bg-white/[0.08]
                    disabled:text-zinc-600
                  "
                >
                  {submitting ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Recording...
                    </>
                  ) : (
                    <>
                      <ArrowDownLeft
                        size={17}
                      />
                      Record Payment
                    </>
                  )}
                </button>

                {!selectedInvoice && (
                  <p className="mt-3 text-center text-[10px] text-zinc-700">
                    Select an invoice to
                    continue
                  </p>
                )}

                {selectedInvoice &&
                  paymentAmount >
                    outstandingBalance && (
                    <p className="mt-3 text-center text-[10px] text-red-400/70">
                      Amount exceeds the
                      outstanding balance.
                    </p>
                  )}
              </div>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}