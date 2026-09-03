
import PaymentForm from "@/components/Payment/PaymentForm";

export default function NewPaymentPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030712] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <PaymentForm />
      </div>
    </main>
  );
}

