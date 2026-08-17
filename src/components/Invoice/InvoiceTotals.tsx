"use client";

import { Receipt, Wallet, ArrowDownRight } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

type InvoiceTotalsProps = {
  total: number;
  paid: number;
  balance: number;
};

function formatCurrency(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

export default function InvoiceTotals({
  total,
  paid,
  balance,
}: InvoiceTotalsProps) {
  const collectionRate =
    total > 0
      ? Math.min(100, Math.round((paid / total) * 100))
      : 0;

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
            Financial Summary
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
            Invoice Position
          </h2>
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
            border-[#D4AF37]/10
            bg-[#D4AF37]/[0.05]
          "
        >
          <Receipt
            size={17}
            strokeWidth={1.8}
            className="text-[#D4AF37]"
          />
        </div>

      </div>

      {/* METRICS */}

      <div className="mt-7 space-y-1">

        {/* TOTAL */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            rounded-xl
            px-2
            py-3
          "
        >
          <div className="flex items-center gap-3">

            <Receipt
              size={15}
              strokeWidth={1.7}
              className="text-zinc-600"
            />

            <span className="text-sm text-zinc-500">
              Invoice Total
            </span>

          </div>

          <span className="text-sm font-semibold text-white">
            {formatCurrency(total)}
          </span>

        </div>

        {/* PAID */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            rounded-xl
            px-2
            py-3
          "
        >
          <div className="flex items-center gap-3">

            <Wallet
              size={15}
              strokeWidth={1.7}
              className="text-zinc-600"
            />

            <span className="text-sm text-zinc-500">
              Amount Paid
            </span>

          </div>

          <span className="text-sm font-semibold text-emerald-400">
            {formatCurrency(paid)}
          </span>

        </div>

      </div>

      {/* COLLECTION */}

      <div className="mt-5 border-t border-white/[0.05] pt-5">

        <div className="flex items-center justify-between">

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-zinc-600
            "
          >
            Collection
          </span>

          <span className="text-xs font-medium text-zinc-400">
            {collectionRate}%
          </span>

        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">

          <div
            className="
              h-full
              rounded-full
              bg-[#D4AF37]
              transition-all
              duration-500
            "
            style={{
              width: `${collectionRate}%`,
            }}
          />

        </div>

      </div>

      {/* BALANCE */}

      <div
        className="
          mt-6
          rounded-2xl
          border
          border-[#D4AF37]/10
          bg-[#D4AF37]/[0.035]
          p-4
        "
      >

        <div className="flex items-center justify-between gap-4">

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
                bg-[#D4AF37]/[0.06]
              "
            >
              <ArrowDownRight
                size={16}
                strokeWidth={1.8}
                className="text-[#D4AF37]"
              />
            </div>

            <div>

              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.22em]
                  text-zinc-600
                "
              >
                Balance Due
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Remaining to collect
              </p>

            </div>

          </div>

          <span
            className={`
              text-xl
              font-semibold
              tracking-[-0.03em]
              ${
                balance > 0
                  ? "text-[#D4AF37]"
                  : "text-emerald-400"
              }
            `}
          >
            {formatCurrency(balance)}
          </span>

        </div>

      </div>

    </GlassPanel>
  );
}