"use client";

import { Wallet, Receipt } from "lucide-react";

interface CashPositionChartProps {
  cash: number;
  receivables: number;
}

const formatMoney = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;

export default function CashPositionChart({
  cash,
  receivables,
}: CashPositionChartProps) {
  const total = cash + receivables;

  const cashPercentage =
    total > 0 ? (cash / total) * 100 : 0;

  const receivablePercentage =
    total > 0 ? (receivables / total) * 100 : 0;

  return (
    <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">

      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Liquidity
        </p>

        <h2 className="finzura-gold mt-2 text-4xl font-bold">
          Cash Position
        </h2>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
          Compare immediately available cash with
          outstanding receivables to understand your
          current liquidity.
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

              <Wallet
                className="text-[#D4AF37]"
                size={20}
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Cash Available
              </p>

              <h3 className="mt-2 text-3xl font-bold text-white">
                {formatMoney(cash)}
              </h3>

            </div>

          </div>

          <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/5">

            <div
              className="h-full rounded-full bg-[#D4AF37] transition-all duration-1000"
              style={{
                width: `${cashPercentage}%`,
              }}
            />

          </div>

          <p className="mt-3 text-sm text-zinc-500">
            {cashPercentage.toFixed(0)}% of available liquidity
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">

              <Receipt
                className="text-red-400"
                size={20}
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Outstanding Receivables
              </p>

              <h3 className="mt-2 text-3xl font-bold text-white">
                {formatMoney(receivables)}
              </h3>

            </div>

          </div>

          <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/5">

            <div
              className="h-full rounded-full bg-red-500 transition-all duration-1000"
              style={{
                width: `${receivablePercentage}%`,
              }}
            />

          </div>

          <p className="mt-3 text-sm text-zinc-500">
            {receivablePercentage.toFixed(0)}% awaiting collection
          </p>

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/5 p-5">

        <p className="text-sm leading-7 text-zinc-300">

          Healthy businesses maintain a higher proportion
          of immediately available cash than outstanding
          receivables. Continue collecting overdue invoices
          to strengthen liquidity.

        </p>

      </div>

    </section>
  );
}