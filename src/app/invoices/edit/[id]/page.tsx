import InvoiceForm from "@/components/Invoice/InvoiceForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditInvoicePage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#030712] text-white px-8 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Invoices
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Edit Invoice
          </h1>

          <p className="mt-2 text-gray-400">
            Editing Invoice #{id}
          </p>

        </div>

        <InvoiceForm />

      </div>
    </main>
  );
}