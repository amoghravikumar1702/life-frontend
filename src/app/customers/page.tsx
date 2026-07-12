import CustomerList from "@/components/Customer/CustomerList";

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-[#030712] p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <CustomerList />
      </div>
    </main>
  );
}