"use client";
type Props = {
  customer: string;
  setCustomer: (value: string) => void;

  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;

  invoiceDate: string;
  setInvoiceDate: (value: string) => void;

  dueDate: string;
  setDueDate: (value: string) => void;
};

export default function InvoiceDetails({
  customer,
  setCustomer,
  invoiceNumber,
  setInvoiceNumber,
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
}: Props) {
  return (
    <>
      <h2 className="mb-8 text-2xl font-bold">
        Invoice Details
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <input
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          placeholder="Invoice Number"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

      </div>
    </>
  );
}