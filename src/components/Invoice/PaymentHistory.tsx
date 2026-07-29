"use client";

import { Calendar, CreditCard } from "lucide-react";
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

export default function PaymentHistory({
  payments,
}: PaymentHistoryProps) {
  return (
    <GlassPanel className="p-8">

      <h2 className="section-title">
        Payment History
      </h2>

      <p className="section-description">
        Payment activity for this invoice.
      </p>

      <div className="mt-8 space-y-4">

        {payments.length === 0 && (
          <div className="rounded-2xl border border-[var(--border)] p-8 text-center text-[var(--text-secondary)]">
            No payments received yet.
          </div>
        )}

        {payments.map((payment) => (
          <div
            key={payment.id}
            className="glass-card p-5 flex items-center justify-between"
          >
            <div>

              <div className="flex items-center gap-2">

                <CreditCard
                  size={18}
                  className="text-[var(--primary)]"
                />

                <span className="font-medium">
                  ₹{payment.amount.toLocaleString("en-IN")}
                </span>

              </div>

              <div className="mt-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">

                <Calendar size={15} />

                {payment.paid_at}

              </div>

            </div>

            <div className="text-right">

              <p className="font-medium">
                {payment.payment_method}
              </p>

              <p className="text-sm text-[var(--text-secondary)]">
                {payment.payment_reference}
              </p>

            </div>

          </div>
        ))}

      </div>

    </GlassPanel>
  );
}