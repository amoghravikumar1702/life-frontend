// src/app/invoices/page.tsx

import InvoiceList from "@/components/Invoice/InvoiceList";
import PendingPaymentPopup from "@/components/Payment/PendingPaymentPopup";

export default function InvoicesPage() {
  return (
    <main className="min-h-screen min-w-0 bg-[#030712] px-3 pb-6 pt-2 text-white sm:px-4 sm:pb-8 sm:pt-3 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <InvoiceList />
      </div>

      {/* Pending customer payment confirmation popup */}
      <PendingPaymentPopup />
    </main>
  );
}