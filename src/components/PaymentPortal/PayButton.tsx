"use client";

type PayButtonProps = {
  amount: number;
};

export default function PayButton({
  amount,
}: PayButtonProps) {
  function handlePayment() {
    alert(`Razorpay Checkout will open.\n\nAmount: ₹${amount}`);
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