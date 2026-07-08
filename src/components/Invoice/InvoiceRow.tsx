import InvoiceStatus from "./InvoiceStatus";
import { Invoice } from "@/types/invoice";

type Props = {
  invoice: Invoice;
  formatCurrency: (amount: number) => string;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function InvoiceRow({
  invoice,
  formatCurrency,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition">

      <td className="px-6 py-5 font-semibold">
        {invoice.invoice_number}
      </td>

      <td className="px-6 py-5">
        {invoice.customer}
      </td>

      <td className="px-6 py-5 font-semibold text-cyan-300">
        {formatCurrency(invoice.total)}
      </td>

      <td className="px-6 py-5">
        <InvoiceStatus status={invoice.status} />
      </td>

      <td className="px-6 py-5">
        <div className="flex gap-4">

          <button
            onClick={() => onView(invoice.id!)}
            className="text-cyan-400 hover:text-cyan-300"
          >
            View
          </button>

          <button
            onClick={() => onEdit(invoice.id!)}
            className="text-green-400 hover:text-green-300"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(invoice.id!)}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </button>

        </div>
      </td>

    </tr>
  );
}