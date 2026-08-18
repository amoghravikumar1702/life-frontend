"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Clock3,
  CreditCard,
  X,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type PendingPayment = {
  id: number;
  invoice_id: number;
  amount: number;
  payment_method: string;
  payment_reference: string | null;
  payment_status: string;
  created_at: string | null;
  invoice_number: string;
};

export default function PendingPaymentPopup() {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  /*
   * =========================================================
   * GET AUTH TOKEN
   * =========================================================
   */

  async function getAccessToken() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error(
        "[PendingPaymentPopup] Session error:",
        error
      );

      return null;
    }

    if (!session?.access_token) {
      console.error(
        "[PendingPaymentPopup] No active access token."
      );

      return null;
    }

    return session.access_token;
  }

  /*
   * =========================================================
   * LOAD PENDING PAYMENTS
   * =========================================================
   */

  async function loadPendingPayments() {
    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        setPayments([]);
        return;
      }

      const response = await fetch(
        "/api/payments/pending",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error(
          "[PendingPaymentPopup] Pending API error:",
          {
            status: response.status,
            result,
          }
        );

        throw new Error(
          result?.error ||
            result?.message ||
            `Unable to load pending payments. (${response.status})`
        );
      }

      /*
       * Support both:
       *
       * { payments: [...] }
       *
       * and
       *
       * { data: { payments: [...] } }
       */

      const pendingPayments = Array.isArray(
        result?.payments
      )
        ? result.payments
        : Array.isArray(
            result?.data?.payments
          )
        ? result.data.payments
        : [];

      setPayments(
        pendingPayments as PendingPayment[]
      );
    } catch (error) {
      console.error(
        "[PendingPaymentPopup] Load error:",
        error
      );

      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * INITIAL LOAD + POLLING
   * =========================================================
   */

  useEffect(() => {
    loadPendingPayments();

    const interval = window.setInterval(() => {
      loadPendingPayments();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /*
   * =========================================================
   * ACCEPT / REJECT PAYMENT
   * =========================================================
   */

  async function reviewPayment(
    paymentId: number,
    action: "accept" | "reject"
  ) {
    if (processingId !== null) {
      return;
    }

    setProcessingId(paymentId);

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      const response = await fetch(
        "/api/payments/upi/review",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            paymentId,
            action,
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        console.error(
          "[PendingPaymentPopup] Review API error:",
          {
            status: response.status,
            result,
          }
        );

        throw new Error(
          result?.error ||
            result?.message ||
            `Unable to ${
              action === "accept"
                ? "accept"
                : "reject"
            } payment.`
        );
      }

      /*
       * Remove the payment from
       * the popup immediately.
       */

      setPayments((current) =>
        current.filter(
          (payment) =>
            payment.id !== paymentId
        )
      );

      /*
       * Tell other components that
       * a payment was reviewed.
       */

      window.dispatchEvent(
        new CustomEvent(
          "arkenone-payment-reviewed"
        )
      );

      /*
       * Refresh the page so invoice
       * totals/status update immediately.
       */

      window.setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (error) {
      console.error(
        "[PendingPaymentPopup] Review error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to review payment."
      );
    } finally {
      setProcessingId(null);
    }
  }

  /*
   * =========================================================
   * HIDE WHILE LOADING / NOTHING PENDING
   * =========================================================
   */

  if (loading || payments.length === 0) {
    return null;
  }

  /*
   * =========================================================
   * SHOW FIRST PENDING PAYMENT
   * =========================================================
   */

  const payment = payments[0];

  const remaining = payments.length - 1;

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <div
      className="
        fixed
        right-5
        top-5
        z-[9999]
        w-[min(420px,calc(100vw-40px))]
      "
    >
      <div
        className="
          overflow-hidden
          rounded-[24px]
          border
          border-[#D4AF37]/20
          bg-[#111318]
          shadow-[0_24px_80px_rgba(0,0,0,0.55)]
        "
      >
        {/* TOP ACCENT */}

        <div
          className="
            h-[2px]
            w-full
            bg-[#D4AF37]
          "
        />

        <div className="p-5">
          {/* HEADER */}

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#D4AF37]/15
                  bg-[#D4AF37]/[0.06]
                "
              >
                <CreditCard
                  size={18}
                  className="text-[#D4AF37]"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-[#D4AF37]
                  "
                >
                  Payment Approval
                </p>

                <h3
                  className="
                    mt-1
                    text-base
                    font-semibold
                    text-white
                  "
                >
                  Payment reported
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setPayments((current) =>
                  current.slice(1)
                )
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-zinc-600
                transition
                hover:bg-white/[0.05]
                hover:text-zinc-300
              "
              title="Dismiss"
            >
              <X size={15} />
            </button>
          </div>

          {/* PAYMENT DETAILS */}

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-white/[0.06]
              bg-white/[0.02]
              p-4
            "
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Amount
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                  ₹
                  {Number(
                    payment.amount ?? 0
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-amber-400/10
                  bg-amber-400/[0.05]
                "
              >
                <Clock3
                  size={17}
                  className="text-amber-400"
                  strokeWidth={1.8}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between gap-4">
                <span className="text-xs text-zinc-600">
                  Invoice
                </span>

                <span className="text-xs font-medium text-zinc-300">
                  {payment.invoice_number}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-xs text-zinc-600">
                  Method
                </span>

                <span className="text-xs font-medium text-zinc-300">
                  {payment.payment_method ||
                    "UPI"}
                </span>
              </div>

              {payment.payment_reference && (
                <div className="flex justify-between gap-4">
                  <span className="text-xs text-zinc-600">
                    Reference
                  </span>

                  <span className="max-w-[210px] truncate text-xs font-medium text-zinc-300">
                    {payment.payment_reference}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* WARNING */}

          <div
            className="
              mt-4
              rounded-xl
              border
              border-amber-400/10
              bg-amber-400/[0.025]
              px-3
              py-2.5
            "
          >
            <p className="text-[11px] leading-5 text-amber-400/80">
              The customer says they completed
              the payment. Verify the payment in
              your bank or UPI app before accepting.
            </p>
          </div>

          {/* ACTIONS */}

          <div className="mt-5 grid grid-cols-2 gap-3">
            {/* REJECT */}

            <button
              type="button"
              disabled={
                processingId !== null
              }
              onClick={() =>
                reviewPayment(
                  payment.id,
                  "reject"
                )
              }
              className="
                flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-400/15
                bg-red-400/[0.04]
                text-xs
                font-semibold
                text-red-400
                transition
                hover:bg-red-400/[0.08]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <XCircle size={15} />

              {processingId === payment.id
                ? "Processing..."
                : "Reject"}
            </button>

            {/* ACCEPT */}

            <button
              type="button"
              disabled={
                processingId !== null
              }
              onClick={() =>
                reviewPayment(
                  payment.id,
                  "accept"
                )
              }
              className="
                flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#D4AF37]
                text-xs
                font-semibold
                text-[#090909]
                transition
                hover:brightness-105
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Check size={15} />

              {processingId === payment.id
                ? "Processing..."
                : "Accept Payment"}
            </button>
          </div>

          {/* MORE PENDING */}

          {remaining > 0 && (
            <p className="mt-3 text-center text-[10px] text-zinc-600">
              +{remaining} more payment
              {remaining === 1
                ? ""
                : "s"} awaiting approval
            </p>
          )}
        </div>
      </div>
    </div>
  );
}