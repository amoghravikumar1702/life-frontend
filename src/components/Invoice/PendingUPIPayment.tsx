"use client";

import { useState } from "react";
import {
  Check,
  Clock,
  IndianRupee,
} from "lucide-react";

type PendingUPIPaymentProps = {
  paymentId: number;
  amount: number;
  invoiceNumber: string;
  createdAt?: string;
  onConfirmed?: () => void;
};

export default function PendingUPIPayment({
  paymentId,
  amount,
  invoiceNumber,
  createdAt,
  onConfirmed,
}: PendingUPIPaymentProps) {
  const [loading, setLoading] =
    useState(false);

  const [confirmed, setConfirmed] =
    useState(false);

  async function confirmPayment() {
    if (loading || confirmed) {
      return;
    }

    const shouldConfirm =
      window.confirm(
        `Confirm that ₹${amount.toLocaleString(
          "en-IN"
        )} has actually been received for Invoice ${invoiceNumber}?`
      );

    if (!shouldConfirm) {
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/payments/upi/confirm-received",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              paymentId,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Unable to confirm payment."
        );
      }

      setConfirmed(true);

      onConfirmed?.();
    } catch (error) {
      console.error(
        "Confirm UPI payment error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to confirm payment."
      );
    } finally {
      setLoading(false);
    }
  }

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
            <Check
              size={19}
              className="text-emerald-400"
            />
          </div>

          <div>
            <p className="font-semibold text-white">
              Payment Confirmed
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              ₹
              {amount.toLocaleString(
                "en-IN"
              )}{" "}
              received for Invoice{" "}
              {invoiceNumber}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <Clock
            size={19}
            className="text-amber-400"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white">
            UPI Payment Awaiting Confirmation
          </p>

          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Customer has indicated that they
            completed a UPI payment.
          </p>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <div className="flex items-center gap-2">
              <IndianRupee
                size={16}
                className="text-[#D4AF37]"
              />

              <span className="text-lg font-bold text-white">
                {amount.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            </div>

            <p className="mt-1 text-xs text-zinc-500">
              Invoice {invoiceNumber}
            </p>

            {createdAt && (
              <p className="mt-2 text-[11px] text-zinc-600">
                Submitted{" "}
                {new Date(
                  createdAt
                ).toLocaleString(
                  "en-IN"
                )}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={confirmPayment}
            disabled={loading}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
              loading
                ? "cursor-not-allowed bg-white/10 text-zinc-500"
                : "bg-[#D4AF37] text-[#090909] hover:brightness-105"
            }`}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                Confirming...
              </>
            ) : (
              <>
                <Check size={17} />
                Confirm Payment Received
              </>
            )}
          </button>

          <p className="mt-3 text-center text-[11px] leading-5 text-zinc-600">
            Only confirm after verifying the money
            has actually reached your UPI account.
          </p>
        </div>
      </div>
    </div>
  );
}