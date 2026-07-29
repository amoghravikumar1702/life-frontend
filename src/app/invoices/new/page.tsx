import InvoiceForm from "@/components/Invoice/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <main className="mx-auto max-w-7xl px-8 py-10">
      <InvoiceForm mode="create" />
    </main>
  );
}