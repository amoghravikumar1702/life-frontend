import PaymentForm from "@/components/Payment/PaymentForm";

export default function NewPaymentPage() {
  return (
    <main className="min-h-screen bg-[#030712] p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <PaymentForm />
      </div>
    </main>
  );
}