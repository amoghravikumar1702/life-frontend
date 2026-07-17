"use client";

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
  customerName,
  customerEmail,
  customerPhone,
}: PayButtonProps) {
  async function handlePayment() {
    try {
      await openRazorpayCheckout({
        invoiceId,
        customerName,
        customerEmail,
        customerPhone,
      });
    } catch (error) {
      console.error(error);

      alert("❌ Failed to open payment gateway.");
    }
  }

  return (
    <button
      onClick={handlePayment}
      className="mt-10 w-full rounded-xl bg-cyan-500 py-4 text-lg font-bold text-black transition hover:bg-cyan-400"
    >
      Pay Securely
    </button>
  );
}