import InvoiceRow from "./InvoiceRow";
import { Invoice } from "@/types/invoice";

type Props = {
  invoices: Invoice[];
  formatCurrency: (amount: number) => string;
  onView: (id: number) => void;
  onPDF: (id: number) => void;
  onPrint: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function InvoiceTable({
  invoices,
  formatCurrency,
  onView,
  onPDF,
  onPrint,
  onEdit,
  onDelete,
}: Props) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111827] p-12 text-center text-gray-400">
        No invoices found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full">

        <thead className="bg-white/5">
          <tr className="text-left text-gray-400">
            <th className="px-6 py-4">Invoice</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice) => (
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
              formatCurrency={formatCurrency}
              onView={onView}
              onPDF={onPDF}
              onPrint={onPrint}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>

      </table>
    </div>
  );
}