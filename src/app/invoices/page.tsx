import InvoiceList from "@/components/Invoices/InvoiceList";

export default function InvoicesPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <InvoiceList />
      </div>
    </main>
  );
}