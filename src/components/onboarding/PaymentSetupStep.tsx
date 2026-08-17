"use client";

import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  Check,
  CreditCard,
  Smartphone,
} from "lucide-react";

type PaymentMethod =
  | "razorpay"
  | "upi"
  | "bank_transfer";

export interface PaymentSetupData {
  paymentMethod: PaymentMethod;
  paymentDisplayName: string;
  paymentPhone: string;
  paymentUpiId: string;
  paymentBankName: string;
  paymentBankAccountName: string;
  paymentBankAccountNumber: string;
  paymentBankIfsc: string;
  paymentRazorpayAccountId: string;
}

interface PaymentSetupStepProps {
  initialData?: PaymentSetupData;
  onContinue: (
    data: PaymentSetupData
  ) => void;
}

const defaultData: PaymentSetupData = {
  paymentMethod: "upi",
  paymentDisplayName: "",
  paymentPhone: "",
  paymentUpiId: "",
  paymentBankName: "",
  paymentBankAccountName: "",
  paymentBankAccountNumber: "",
  paymentBankIfsc: "",
  paymentRazorpayAccountId: "",
};

const paymentMethods = [
  {
    id: "upi" as const,
    title: "UPI",
    description:
      "Let customers pay directly to your UPI ID.",
    icon: Smartphone,
  },
  {
    id: "razorpay" as const,
    title: "Razorpay",
    description:
      "Use your own Razorpay account to accept online payments.",
    icon: CreditCard,
  },
  {
    id: "bank_transfer" as const,
    title: "Bank Transfer",
    description:
      "Give customers your bank details for direct transfer.",
    icon: Banknote,
  },
];

export default function PaymentSetupStep({
  initialData,
  onContinue,
}: PaymentSetupStepProps) {
  const [form, setForm] =
    useState<PaymentSetupData>(
      initialData ?? defaultData
    );

  const [errors, setErrors] =
    useState<string[]>([]);

  function updateField(
    field: keyof PaymentSetupData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors([]);
  }

  function selectMethod(
    method: PaymentMethod
  ) {
    setForm((current) => ({
      ...current,
      paymentMethod: method,
    }));

    setErrors([]);
  }

  function validate(): boolean {
    const nextErrors: string[] = [];

    if (!form.paymentDisplayName.trim()) {
      nextErrors.push(
        "Enter the name customers should see when paying."
      );
    }

    if (!form.paymentPhone.trim()) {
      nextErrors.push(
        "Enter the phone number associated with payments."
      );
    }

    if (
      form.paymentMethod === "upi" &&
      !form.paymentUpiId.trim()
    ) {
      nextErrors.push(
        "Enter your UPI ID."
      );
    }

    if (
      form.paymentMethod ===
      "razorpay" &&
      !form.paymentRazorpayAccountId.trim()
    ) {
      nextErrors.push(
        "Enter your Razorpay account ID."
      );
    }

    if (
      form.paymentMethod ===
      "bank_transfer"
    ) {
      if (!form.paymentBankName.trim()) {
        nextErrors.push(
          "Enter your bank name."
        );
      }

      if (
        !form.paymentBankAccountName.trim()
      ) {
        nextErrors.push(
          "Enter the account holder name."
        );
      }

      if (
        !form.paymentBankAccountNumber.trim()
      ) {
        nextErrors.push(
          "Enter your bank account number."
        );
      }

      if (!form.paymentBankIfsc.trim()) {
        nextErrors.push(
          "Enter your IFSC code."
        );
      }
    }

    setErrors(nextErrors);

    return nextErrors.length === 0;
  }

  function handleContinue() {
    if (!validate()) {
      return;
    }

    onContinue({
      ...form,

      paymentDisplayName:
        form.paymentDisplayName.trim(),

      paymentPhone:
        form.paymentPhone.trim(),

      paymentUpiId:
        form.paymentUpiId.trim(),

      paymentBankName:
        form.paymentBankName.trim(),

      paymentBankAccountName:
        form.paymentBankAccountName.trim(),

      paymentBankAccountNumber:
        form.paymentBankAccountNumber.trim(),

      paymentBankIfsc:
        form.paymentBankIfsc
          .trim()
          .toUpperCase(),

      paymentRazorpayAccountId:
        form.paymentRazorpayAccountId.trim(),
    });
  }

  return (
    <section className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-[#D4AF37]/15 bg-[#101318] sm:rounded-[32px]">
      {/* Ambient light */}

      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[360px] w-[600px] max-w-[150vw] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.045] blur-[120px]" />

      <div className="relative px-5 py-7 sm:px-10 sm:py-10">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
            <CreditCard
              size={18}
              className="text-[#D4AF37]"
              strokeWidth={1.7}
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Payment Setup
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Choose how customers will pay you
            </p>
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-8 max-w-2xl">
          <h1 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
            How would you like to collect payments?
          </h1>

          <p className="mt-3 text-sm leading-7 text-zinc-500">
            ArkenOne will use your own payment details
            when generating payment links. Customer
            payments go directly to you — not to ArkenOne.
          </p>
        </div>

        {/* PAYMENT METHODS */}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {paymentMethods.map(
            ({
              id,
              title,
              description,
              icon: Icon,
            }) => {
              const selected =
                form.paymentMethod === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    selectMethod(id)
                  }
                  className={`relative min-h-[132px] rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                    selected
                      ? "border-[#D4AF37]/45 bg-[#D4AF37]/[0.08]"
                      : "border-white/[0.07] bg-white/[0.015] hover:border-[#D4AF37]/20 hover:bg-white/[0.025]"
                  }`}
                >
                  {selected && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37]">
                      <Check
                        size={12}
                        className="text-black"
                        strokeWidth={2.5}
                      />
                    </div>
                  )}

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                      selected
                        ? "border-[#D4AF37]/25 bg-[#D4AF37]/[0.08]"
                        : "border-white/[0.07] bg-white/[0.025]"
                    }`}
                  >
                    <Icon
                      size={17}
                      className={
                        selected
                          ? "text-[#D4AF37]"
                          : "text-zinc-500"
                      }
                      strokeWidth={1.7}
                    />
                  </div>

                  <p
                    className={`mt-4 text-sm font-medium ${
                      selected
                        ? "text-[#D4AF37]"
                        : "text-zinc-300"
                    }`}
                  >
                    {title}
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-zinc-600">
                    {description}
                  </p>
                </button>
              );
            }
          )}
        </div>

        {/* SECURITY / OWNERSHIP NOTE */}

        <div className="mt-6 rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.025] p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
            Important
          </p>

          <p className="mt-2 text-xs leading-6 text-zinc-500">
            The payment method you choose must belong
            to your business. ArkenOne only uses these
            details to generate the payment experience
            for your customers.
          </p>
        </div>

        {/* COMMON PAYMENT DETAILS */}

        <div className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="payment-display-name"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600"
            >
              Customer-facing name
            </label>

            <input
              id="payment-display-name"
              type="text"
              value={
                form.paymentDisplayName
              }
              onChange={(event) =>
                updateField(
                  "paymentDisplayName",
                  event.target.value
                )
              }
              placeholder="ArkenOne"
              className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/35"
            />

            <p className="mt-2 text-[11px] text-zinc-700">
              This is the business name customers
              will see while paying.
            </p>
          </div>

          <div>
            <label
              htmlFor="payment-phone"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600"
            >
              Payment phone number
            </label>

            <input
              id="payment-phone"
              type="tel"
              inputMode="tel"
              value={
                form.paymentPhone
              }
              onChange={(event) =>
                updateField(
                  "paymentPhone",
                  event.target.value
                )
              }
              placeholder="+91 98765 43210"
              className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/35"
            />
          </div>
        </div>

        {/* UPI */}

        {form.paymentMethod ===
          "upi" && (
          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
                <Smartphone
                  size={17}
                  className="text-[#D4AF37]"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-200">
                  UPI details
                </p>

                <p className="text-[11px] text-zinc-600">
                  Payments will be directed to this UPI ID.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="payment-upi"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600"
              >
                UPI ID
              </label>

              <input
                id="payment-upi"
                type="text"
                value={
                  form.paymentUpiId
                }
                onChange={(event) =>
                  updateField(
                    "paymentUpiId",
                    event.target.value
                  )
                }
                placeholder="business@upi"
                autoComplete="off"
                className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/35"
              />

              <p className="mt-2 text-[11px] text-zinc-700">
                Example: business@oksbi,
                company@paytm, shop@ybl
              </p>
            </div>
          </div>
        )}

        {/* RAZORPAY */}

        {form.paymentMethod ===
          "razorpay" && (
          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
                <CreditCard
                  size={17}
                  className="text-[#D4AF37]"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Razorpay account
                </p>

                <p className="text-[11px] text-zinc-600">
                  Use your own Razorpay account for collections.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="razorpay-account"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600"
              >
                Razorpay Account ID
              </label>

              <input
                id="razorpay-account"
                type="text"
                value={
                  form.paymentRazorpayAccountId
                }
                onChange={(event) =>
                  updateField(
                    "paymentRazorpayAccountId",
                    event.target.value
                  )
                }
                placeholder="Your Razorpay account ID"
                autoComplete="off"
                className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/35"
              />

              <p className="mt-2 text-[11px] leading-5 text-zinc-700">
                This should be your business's Razorpay
                account. ArkenOne does not use its own
                Razorpay account for your collections.
              </p>
            </div>
          </div>
        )}

        {/* BANK TRANSFER */}

        {form.paymentMethod ===
          "bank_transfer" && (
          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
                <Banknote
                  size={17}
                  className="text-[#D4AF37]"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Bank details
                </p>

                <p className="text-[11px] text-zinc-600">
                  Customers will receive these details for bank transfers.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="bank-name"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600"
                >
                  Bank name
                </label>

                <input
                  id="bank-name"
                  type="text"
                  value={
                    form.paymentBankName
                  }
                  onChange={(event) =>
                    updateField(
                      "paymentBankName",
                      event.target.value
                    )
                  }
                  placeholder="HDFC Bank"
                  className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/35"
                />
              </div>

              <div>
                <label
                  htmlFor="bank-account-name"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600"
                >
                  Account holder
                </label>

                <input
                  id="bank-account-name"
                  type="text"
                  value={
                    form.paymentBankAccountName
                  }
                  onChange={(event) =>
                    updateField(
                      "paymentBankAccountName",
                      event.target.value
                    )
                  }
                  placeholder="Account holder name"
                  className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/35"
                />
              </div>

              <div>
                <label
                  htmlFor="bank-account-number"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600"
                >
                  Account number
                </label>

                <input
                  id="bank-account-number"
                  type="text"
                  inputMode="numeric"
                  value={
                    form.paymentBankAccountNumber
                  }
                  onChange={(event) =>
                    updateField(
                      "paymentBankAccountNumber",
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="Account number"
                  autoComplete="off"
                  className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/35"
                />
              </div>

              <div>
                <label
                  htmlFor="bank-ifsc"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600"
                >
                  IFSC code
                </label>

                <input
                  id="bank-ifsc"
                  type="text"
                  value={
                    form.paymentBankIfsc
                  }
                  onChange={(event) =>
                    updateField(
                      "paymentBankIfsc",
                      event.target.value
                        .toUpperCase()
                    )
                  }
                  placeholder="HDFC0001234"
                  autoComplete="off"
                  className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/35"
                />
              </div>
            </div>
          </div>
        )}

        {/* ERRORS */}

        {errors.length > 0 && (
          <div className="mt-6 rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-4">
            <p className="text-xs font-medium text-red-300">
              Please complete the following:
            </p>

            <ul className="mt-2 space-y-1">
              {errors.map(
                (error) => (
                  <li
                    key={error}
                    className="text-xs leading-5 text-red-400/70"
                  >
                    • {error}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* ACTION */}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={
              handleContinue
            }
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.995] sm:w-auto"
          >
            Finish Setup

            <ArrowRight
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] leading-5 text-zinc-700 sm:text-right">
          Your payment details are used to generate
          customer payment instructions for your business.
        </p>
      </div>
    </section>
  );
}