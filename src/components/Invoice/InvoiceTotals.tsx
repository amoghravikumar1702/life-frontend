"use client";

import GlassPanel from "@/components/ui/GlassPanel";

type InvoiceTotalsProps = {
  total: number;
  paid: number;
  balance: number;
};

export default function InvoiceTotals({
  total,
  paid,
  balance,
}: InvoiceTotalsProps) {
  return (
    <GlassPanel className="p-8">

      <h2 className="section-title">
        Financial Summary
      </h2>

      <div className="mt-8 space-y-5">

        <div className="flex justify-between">

          <span className="text-[var(--text-secondary)]">
            Invoice Total
          </span>

          <span className="font-semibold">
            ₹{total.toLocaleString("en-IN")}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-[var(--text-secondary)]">
            Amount Paid
          </span>

          <span className="font-semibold text-green-400">
            ₹{paid.toLocaleString("en-IN")}
          </span>

        </div>

        <div className="border-t border-[var(--border)] pt-5 flex justify-between text-xl font-bold">

          <span>
            Balance Due
          </span>

          <span className="text-[var(--primary)]">
            ₹{balance.toLocaleString("en-IN")}
          </span>

        </div>

      </div>

    </GlassPanel>
  );
}