// src/app/customers/page.tsx

import CustomerList from "@/components/Customer/CustomerList";

export default function CustomersPage() {
  return (
    <main className="min-h-screen min-w-0 bg-[#030712] px-3 pb-6 sm:px-4 sm:pb-8 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <CustomerList />
      </div>
    </main>
  );
}