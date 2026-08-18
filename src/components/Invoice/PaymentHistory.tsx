"use client";

import {
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import GlassPanel from "@/components/ui/GlassPanel";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type Payment = {
  id: number;
  invoice_id: number;
  owner_id?: string;
  amount: number;
  payment_method: string;
  payment_reference: string | null;
  payment_status: string;
  paid_at: string | null;
  created_at?: string;
};

type PaymentHistoryProps = {
  payments: Payment[];
  onPaymentConfirmed?: () => void;
};

function formatCurrency(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | null) {
  if (!value) return "Awaiting confirmation";

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

function getStatus(status: string) {
  const normalized = status?.toLowerCase().trim();

  if (
    normalized === "completed" ||
    normalized === "paid" ||
    normalized === "success" ||
    normalized === "successful"
  ) {
    return "completed";
  }

  if (
    normalized === "pending" ||
    normalized === "processing"
  ) {
    return "pending";
  }

  if (
    normalized === "failed" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "failed";
  }

  return "other";
}

export default function PaymentHistory({
  payments,
  onPaymentConfirmed,
}: PaymentHistoryProps) {
  const [confirmingPaymentId, setConfirmingPaymentId] =
    useState<number | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  async function handleConfirmPayment(
    paymentId: number
  ) {
    if (!paymentId) {
      return;
    }

    try {
      setConfirmingPaymentId(paymentId);
      setErrorMessage(null);
      setSuccessMessage(null);

      /*
       * =========================================================
       * GET CURRENT SUPABASE SESSION
       * =========================================================
       */

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        throw new Error(
          "Your session has expired. Please log in again."
        );
      }

      /*
       * =========================================================
       * CONFIRM PAYMENT
       * =========================================================
       */

      const response = await fetch(
        "/api/payments/confirm-received",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            paymentId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Unable to confirm payment."
        );
      }

      /*
       * =========================================================
       * SUCCESS
       * =========================================================
       */

      setSuccessMessage(
        "Payment confirmed successfully."
      );

      /*
       * Tell the invoice page to reload
       * invoice + payment information.
       */

      if (onPaymentConfirmed) {
        onPaymentConfirmed();
      }
    } catch (error) {
      console.error(
        "Confirm payment error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to confirm payment."
      );
    } finally {
      setConfirmingPaymentId(null);
    }
  }

  return (
    <GlassPanel className="h-full p-6 sm:p-8">
      {/* =======================================================
          HEADER
      ======================================================= */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-zinc-600
            "
          >
            Transactions
          </p>

          <h2
            className="
              mt-2
              text-xl
              font-semibold
              tracking-[-0.025em]
              text-white
            "
          >
            Payment History
          </h2>

          <p className="mt-1 text-xs text-zinc-600">
            Payment activity for this invoice.
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
            border-white/[0.06]
            bg-white/[0.02]
          "
        >
          <CreditCard
            size={17}
            strokeWidth={1.8}
            className="text-zinc-500"
          />
        </div>
      </div>

      {/* =======================================================
          SUCCESS MESSAGE
      ======================================================= */}

      {successMessage && (
        <div
          className="
            mt-5
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-emerald-400/15
            bg-emerald-400/[0.04]
            px-4
            py-3
          "
        >
          <CheckCircle2
            size={16}
            className="mt-0.5 shrink-0 text-emerald-400"
          />

          <p className="text-xs leading-5 text-emerald-400/90">
            {successMessage}
          </p>
        </div>
      )}

      {/* =======================================================
          ERROR MESSAGE
      ======================================================= */}

      {errorMessage && (
        <div
          className="
            mt-5
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-red-400/15
            bg-red-400/[0.04]
            px-4
            py-3
          "
        >
          <XCircle
            size={16}
            className="mt-0.5 shrink-0 text-red-400"
          />

          <p className="text-xs leading-5 text-red-400/90">
            {errorMessage}
          </p>
        </div>
      )}

      {/* =======================================================
          PAYMENTS
      ======================================================= */}

      <div className="mt-7 space-y-3">
        {payments.length === 0 && (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-white/[0.07]
              bg-white/[0.015]
              px-6
              py-10
              text-center
            "
          >
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.02]
              "
            >
              <CreditCard
                size={18}
                strokeWidth={1.7}
                className="text-zinc-600"
              />
            </div>

            <p className="mt-4 text-sm font-medium text-zinc-400">
              No payments received yet
            </p>

            <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-600">
              Payments collected against this invoice
              will appear here.
            </p>
          </div>
        )}

        {payments.map((payment) => {
          const status = getStatus(
            payment.payment_status
          );

          const isCompleted =
            status === "completed";

          const isPending =
            status === "pending";

          const isFailed =
            status === "failed";

          const isConfirming =
            confirmingPaymentId === payment.id;

          return (
            <div
              key={payment.id}
              className="
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.018]
                p-4
                transition-colors
                duration-200
                hover:border-white/[0.09]
                hover:bg-white/[0.025]
                sm:p-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        ${
                          isCompleted
                            ? "border-emerald-400/10 bg-emerald-400/[0.05]"
                            : isPending
                            ? "border-amber-400/10 bg-amber-400/[0.05]"
                            : isFailed
                            ? "border-red-400/10 bg-red-400/[0.05]"
                            : "border-[#D4AF37]/10 bg-[#D4AF37]/[0.05]"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2
                          size={15}
                          strokeWidth={1.8}
                          className="text-emerald-400"
                        />
                      ) : isPending ? (
                        <Clock3
                          size={15}
                          strokeWidth={1.8}
                          className="text-amber-400"
                        />
                      ) : isFailed ? (
                        <XCircle
                          size={15}
                          strokeWidth={1.8}
                          className="text-red-400"
                        />
                      ) : (
                        <CreditCard
                          size={15}
                          strokeWidth={1.8}
                          className="text-[#D4AF37]"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-base font-semibold text-white">
                        {formatCurrency(
                          payment.amount
                        )}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
                        <Calendar size={12} />

                        <span>
                          {isPending
                            ? "Payment reported"
                            : formatDate(
                                payment.paid_at
                              )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {payment.payment_reference && (
                    <p className="mt-3 truncate text-[11px] text-zinc-600">
                      Ref:{" "}
                      {payment.payment_reference}
                    </p>
                  )}
                </div>

                {/* =================================================
                    RIGHT
                ================================================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    sm:flex-col
                    sm:items-end
                  "
                >
                  <p className="text-xs font-medium capitalize text-zinc-400">
                    {payment.payment_method ||
                      "Payment"}
                  </p>

                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-2.5
                      py-1
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.16em]
                      ${
                        isCompleted
                          ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-400"
                          : isPending
                          ? "border-amber-400/15 bg-amber-400/[0.05] text-amber-400"
                          : isFailed
                          ? "border-red-400/15 bg-red-400/[0.05] text-red-400"
                          : "border-white/[0.06] bg-white/[0.02] text-zinc-500"
                      }
                    `}
                  >
                    {isCompleted && (
                      <CheckCircle2 size={11} />
                    )}

                    {isPending && (
                      <Clock3 size={11} />
                    )}

                    {isFailed && (
                      <XCircle size={11} />
                    )}

                    {payment.payment_status ||
                      "Recorded"}
                  </span>
                </div>
              </div>

              {/* =================================================
                  PENDING PAYMENT
              ================================================= */}

              {isPending && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-amber-400/10
                    bg-amber-400/[0.025]
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="
                          mt-0.5
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-amber-400/10
                          bg-amber-400/[0.04]
                        "
                      >
                        <ShieldCheck
                          size={15}
                          className="text-amber-400"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-amber-400">
                          Payment awaiting confirmation
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                          The customer reported this
                          payment. Confirm that you have
                          received the money before
                          marking it as paid.
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        CONFIRM BUTTON
                    ================================================= */}

                    <button
                      type="button"
                      disabled={isConfirming}
                      onClick={() =>
                        handleConfirmPayment(
                          payment.id
                        )
                      }
                      className="
                        inline-flex
                        h-10
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-emerald-400/20
                        bg-emerald-400/[0.08]
                        px-4
                        text-xs
                        font-medium
                        text-emerald-400
                        transition-all
                        duration-200
                        hover:border-emerald-400/30
                        hover:bg-emerald-400/[0.12]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isConfirming ? (
                        <>
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />

                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle2
                            size={14}
                          />

                          Confirm Payment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  COMPLETED MESSAGE
              ================================================= */}

              {isCompleted && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-emerald-400/10
                    bg-emerald-400/[0.025]
                    px-3
                    py-2.5
                  "
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={13}
                      className="shrink-0 text-emerald-400"
                    />

                    <p className="text-[11px] leading-5 text-emerald-400/80">
                      Payment confirmed and recorded
                      successfully.
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  FAILED MESSAGE
              ================================================= */}

              {isFailed && (
                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-red-400/10
                    bg-red-400/[0.025]
                    px-3
                    py-2.5
                  "
                >
                  <div className="flex items-center gap-2">
                    <XCircle
                      size={13}
                      className="shrink-0 text-red-400"
                    />

                    <p className="text-[11px] leading-5 text-red-400/80">
                      This payment was not completed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}