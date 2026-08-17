"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import {
  MAX_RAZORPAY_PAYMENT_INR,
  MIN_RAZORPAY_PAYMENT_INR,
} from "@/lib/paymentLimits";

import { openRazorpayCheckout } from "@/services/paymentCheckoutService";

type PayButtonProps = {
  invoiceId: number;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
};

export default function PayButton({
  invoiceId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
}: PayButtonProps) {
  const queryClient =
    useQueryClient();

  const maxPayable = useMemo(
    () =>
      Math.min(
        amount,
        MAX_RAZORPAY_PAYMENT_INR
      ),
    [amount]
  );

  const [paymentAmount, setPaymentAmount] =
    useState(
      maxPayable.toFixed(2)
    );

  const [loading, setLoading] =
    useState(false);

  const numericAmount =
    Number(paymentAmount);

  const isValidAmount =
    Number.isFinite(
      numericAmount
    ) &&
    numericAmount >=
      MIN_RAZORPAY_PAYMENT_INR &&
    numericAmount <=
      maxPayable;

  function handleAmountChange(
    value: string
  ) {
    if (value === "") {
      setPaymentAmount("");
      return;
    }

    const numberValue =
      Number(value);

    if (
      !Number.isFinite(
        numberValue
      )
    ) {
      return;
    }

    if (
      numberValue >
      maxPayable
    ) {
      setPaymentAmount(
        maxPayable.toFixed(2)
      );
      return;
    }

    setPaymentAmount(value);
  }

  async function handlePayment() {
    if (
      loading ||
      !isValidAmount
    ) {
      return;
    }

    setLoading(true);

    try {
      await openRazorpayCheckout({
        invoiceId,

        amount:
          numericAmount,

        customerName,

        customerEmail,

        customerPhone,

        queryClient,
      });
    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to open payment gateway."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10">
      {/* =====================================================
          PAYMENT AMOUNT
      ====================================================== */}

      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Amount to pay
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Choose an amount up to ₹
              {maxPayable.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          {amount >
            MAX_RAZORPAY_PAYMENT_INR && (
            <span className="text-xs font-medium text-amber-600">
              Partial payment
            </span>
          )}
        </div>

        <div className="relative mt-3">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-slate-400">
            ₹
          </span>

          <input
            type="number"
            min={
              MIN_RAZORPAY_PAYMENT_INR
            }
            max={maxPayable}
            step="0.01"
            value={
              paymentAmount
            }
            onChange={(event) =>
              handleAmountChange(
                event.target.value
              )
            }
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-10 pr-4 text-2xl font-bold text-slate-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 disabled:opacity-60"
          />
        </div>

        {!isValidAmount &&
          paymentAmount !== "" && (
            <p className="mt-2 text-xs font-medium text-red-500">
              Enter an amount between ₹
              {MIN_RAZORPAY_PAYMENT_INR.toLocaleString(
                "en-IN"
              )}{" "}
              and ₹
              {maxPayable.toLocaleString(
                "en-IN"
              )}
              .
            </p>
          )}
      </div>

      {/* =====================================================
          PAYMENT SUMMARY
      ====================================================== */}

      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Invoice balance
          </span>

          <span className="font-semibold text-slate-800">
            ₹
            {amount.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span className="text-slate-500">
            This payment
          </span>

          <span className="font-semibold text-slate-800">
            ₹
            {(
              Number(
                paymentAmount
              ) || 0
            ).toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </span>
        </div>

        <div className="mt-3 border-t border-slate-200 pt-3">
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">
              Remaining after payment
            </span>

            <span className="font-bold text-slate-900">
              ₹
              {Math.max(
                amount -
                  (Number(
                    paymentAmount
                  ) || 0),
                0
              ).toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </span>
          </div>
        </div>
      </div>

      {/* =====================================================
          PAY BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={handlePayment}
        disabled={
          loading ||
          !isValidAmount
        }
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-bold transition ${
          loading ||
          !isValidAmount
            ? "cursor-not-allowed bg-slate-300 text-slate-600"
            : "bg-[#D4AF37] text-[#090909] hover:brightness-105 active:scale-[0.98]"
        }`}
      >
        {loading ? (
          "Opening Payment Gateway..."
        ) : (
          <>
            Pay ₹
            {(
              numericAmount || 0
            ).toLocaleString(
              "en-IN"
            )}

            <ArrowRight
              size={20}
            />
          </>
        )}
      </button>

      {/* =====================================================
          SECURITY
      ====================================================== */}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck
          size={15}
        />

        <span>
          Secure payment powered by
          Razorpay
        </span>
      </div>
    </div>
  );
}