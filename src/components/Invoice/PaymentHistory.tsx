"use client";

import { Calendar, CreditCard, CheckCircle2 } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

export type Payment = {
  id: number;
  amount: number;
  payment_method: string;
  payment_reference: string;
  payment_status: string;
  paid_at: string;
};

type PaymentHistoryProps = {
  payments: Payment[];
};

function formatCurrency(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function formatDate(value: string) {
  if (!value) return "Unknown date";

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

export default function PaymentHistory({
  payments,
}: PaymentHistoryProps) {
  return (
    <GlassPanel className="h-full p-6 sm:p-8">

      {/* HEADER */}

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

      {/* PAYMENTS */}

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
              Payments collected against this invoice will appear here.
            </p>
          </div>
        )}

        {payments.map((payment) => {
          const isSuccessful =
            payment.payment_status?.toLowerCase() === "paid" ||
            payment.payment_status?.toLowerCase() === "success" ||
            payment.payment_status?.toLowerCase() === "successful";

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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                {/* LEFT */}

                <div className="min-w-0">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-[#D4AF37]/10
                        bg-[#D4AF37]/[0.05]
                      "
                    >
                      <CreditCard
                        size={15}
                        strokeWidth={1.8}
                        className="text-[#D4AF37]"
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="text-base font-semibold text-white">
                        {formatCurrency(payment.amount)}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">

                        <Calendar size={12} />

                        <span>
                          {formatDate(payment.paid_at)}
                        </span>

                      </div>

                    </div>

                  </div>

                  {payment.payment_reference && (
                    <p className="mt-3 truncate text-[11px] text-zinc-600">
                      Ref: {payment.payment_reference}
                    </p>
                  )}

                </div>

                {/* RIGHT */}

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">

                  <p className="text-xs font-medium capitalize text-zinc-400">
                    {payment.payment_method || "Payment"}
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
                        isSuccessful
                          ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-400"
                          : "border-white/[0.06] bg-white/[0.02] text-zinc-500"
                      }
                    `}
                  >
                    {isSuccessful && (
                      <CheckCircle2 size={11} />
                    )}

                    {payment.payment_status || "Recorded"}
                  </span>

                </div>

              </div>
            </div>
          );
        })}

      </div>

    </GlassPanel>
  );
}