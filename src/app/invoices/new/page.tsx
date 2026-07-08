import InvoiceForm from "@/components/Invoice/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white px-8 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Invoices
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Create Invoice
          </h1>

          <p className="mt-2 text-gray-400">
            Create professional invoices for your customers.
          </p>

        </div>

        <InvoiceForm />

      </div>
    </main>
  );
}