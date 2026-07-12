import CustomerForm from "@/components/Customer/CustomerForm";

export default function NewCustomerPage() {
  return (
    <main className="min-h-screen bg-[#030712] p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <CustomerForm />
      </div>
    </main>
  );
}