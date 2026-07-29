"use client";

import { useState } from "react";

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
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    if (loading) return;

    setLoading(true);

    try {
      await openRazorpayCheckout({
        invoiceId,
        customerName,
        customerEmail,
        customerPhone,
      });
    } catch (error) {
      console.error("Payment Error:", error);

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
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading || amount <= 0}
      className={`mt-10 w-full rounded-xl py-4 text-lg font-bold transition ${
        loading || amount <= 0
          ? "cursor-not-allowed bg-slate-300 text-slate-600"
          : "bg-cyan-500 text-black hover:bg-cyan-400"
      }`}
    >
      {loading
        ? "Opening Payment Gateway..."
        : amount <= 0
        ? "Invoice Paid"
        : "Pay Securely"}
    </button>
  );
}