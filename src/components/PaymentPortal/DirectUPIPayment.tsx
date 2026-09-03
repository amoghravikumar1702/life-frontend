"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Check,
  Copy,
  ExternalLink,
  Smartphone,
} from "lucide-react";

interface DirectUPIPaymentProps {
  invoiceId: number;
  invoiceNumber: string;
  amount: number;
  businessName: string;
  upiId: string;
  paymentToken: string;
}

export default function DirectUPIPayment({
  invoiceNumber,
  amount,
  businessName,
  upiId,
  paymentToken,
}: DirectUPIPaymentProps) {
  const [copied, setCopied] =
    useState(false);

  const [confirming, setConfirming] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const formattedAmount =
    amount.toFixed(2);

  /*
   * =========================================================
   * UPI PAYMENT URL
   * =========================================================
   */

  const upiUrl = useMemo(() => {
    const params =
      new URLSearchParams({
        pa: upiId,
        pn: businessName,
        am: formattedAmount,
        cu: "INR",
        tn: `Invoice ${invoiceNumber}`,
      });

    return `upi://pay?${params.toString()}`;
  }, [
    upiId,
    businessName,
    formattedAmount,
    invoiceNumber,
  ]);

  /*
   * =========================================================
   * COPY UPI ID
   * =========================================================
   */

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(
        upiId
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy UPI ID:",
        error
      );
    }
  }

  /*
   * =========================================================
   * CONFIRM PAYMENT
   * =========================================================
   */

  async function handlePaidConfirmation() {
    if (
      confirming ||
      submitted
    ) {
      return;
    }

    setConfirming(true);

    try {
      const response =
        await fetch(
          "/api/payments/upi/confirm",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              paymentToken,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Unable to submit payment confirmation."
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error(
        "UPI confirmation error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to submit payment confirmation."
      );
    } finally {
      setConfirming(false);
    }
  }

  /*
   * =========================================================
   * SUBMITTED STATE
   * =========================================================
   */

  if (submitted) {
    return (
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <Check
            size={28}
            className="text-amber-600"
            strokeWidth={2.5}
          />
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Payment Confirmation Submitted
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your payment confirmation has
          been sent to the business.
        </p>

        <div className="mt-5 rounded-xl bg-white p-4">
          <p className="text-xs text-slate-400">
            Amount
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            ₹
            {amount.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>

          <p className="mt-2 text-xs text-amber-600">
            Awaiting business confirmation
          </p>
        </div>

        <p className="mt-5 text-[11px] leading-5 text-slate-400">
          The invoice will be marked as
          paid only after the business
          confirms receipt.
        </p>
      </div>
    );
  }

  /*
   * =========================================================
   * PAYMENT UI
   * =========================================================
   */

  return (
    <div className="mt-8">

      {/* HEADER */}

      <div className="rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] p-5">
        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
            <Smartphone
              size={19}
              className="text-[#B08D22]"
              strokeWidth={1.8}
            />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Pay directly with UPI
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Your payment goes directly to{" "}
              <span className="font-medium text-slate-700">
                {businessName}
              </span>
              .
            </p>
          </div>

        </div>
      </div>

      {/* QR CODE */}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">

        <div className="text-center">

          <p className="text-sm font-semibold text-slate-900">
            Scan to Pay
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Open GPay, PhonePe, Paytm or
            another UPI app
          </p>

        </div>

        <div className="mx-auto mt-5 flex w-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <QRCodeSVG
            value={upiUrl}
            size={220}
            bgColor="#ffffff"
            fgColor="#111111"
            level="M"
            includeMargin
          />

        </div>

        <div className="mt-5 text-center">

          <p className="text-xs text-slate-400">
            Amount
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            ₹
            {amount.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>

        </div>

      </div>

      {/* MOBILE UPI BUTTON */}

      <a
        href={upiUrl}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-4 text-base font-bold text-[#090909] transition hover:brightness-105 active:scale-[0.98]"
      >
        <Smartphone size={19} />

        Pay with UPI App

        <ExternalLink size={17} />
      </a>

      {/* UPI ID */}

      <div className="mt-4 rounded-xl bg-slate-50 p-4">

        <p className="text-xs text-slate-500">
          Or pay using UPI ID
        </p>

        <div className="mt-2 flex items-center justify-between gap-3">

          <p className="min-w-0 truncate font-semibold text-slate-900">
            {upiId}
          </p>

          <button
            type="button"
            onClick={copyUpiId}
            className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copied ? (
              <>
                <Check
                  size={15}
                  className="text-green-600"
                />

                Copied
              </>
            ) : (
              <>
                <Copy size={15} />

                Copy
              </>
            )}
          </button>

        </div>

      </div>

      {/* CONFIRM PAYMENT */}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">

        <p className="text-sm font-semibold text-slate-900">
          Already completed the payment?
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Confirm below after completing
          your UPI payment. The business
          will verify the payment before
          the invoice is marked as paid.
        </p>

        <button
          type="button"
          onClick={
            handlePaidConfirmation
          }
          disabled={confirming}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition ${
            confirming
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {confirming ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              Submitting...
            </>
          ) : (
            <>
              <Check size={17} />

              I've Paid
            </>
          )}
        </button>

      </div>

      {/* HOW TO PAY */}

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">

        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
          How to pay
        </p>

        <ol className="mt-3 space-y-2 text-xs leading-5 text-slate-600">

          <li>
            <span className="font-semibold text-slate-900">
              1.
            </span>{" "}
            Scan the QR code using your
            UPI app.
          </li>

          <li>
            <span className="font-semibold text-slate-900">
              2.
            </span>{" "}
            Confirm the amount and
            recipient.
          </li>

          <li>
            <span className="font-semibold text-slate-900">
              3.
            </span>{" "}
            Complete the payment in your
            UPI app.
          </li>

          <li>
            <span className="font-semibold text-slate-900">
              4.
            </span>{" "}
            Return here and tap "I've Paid".
          </li>

        </ol>

      </div>

      {/* DISCLAIMER */}

      <div className="mt-4 text-center">

        <p className="text-[11px] leading-5 text-slate-400">
          Payment is made directly to the
          business's UPI account. DhanarkOS
          does not hold your funds.
        </p>

      </div>

    </div>
  );
}