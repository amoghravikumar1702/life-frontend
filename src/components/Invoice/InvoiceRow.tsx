import InvoiceStatus from "./InvoiceStatus";
import { Invoice } from "@/types/invoice";
import { collectPayment } from "@/services/collectPaymentService";

type Props = {
  invoice: Invoice;
  formatCurrency: (amount: number) => string;
  onView: (id: number) => void;
  onPDF: (id: number) => void;
  onPrint: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function InvoiceRow({
  invoice,
  formatCurrency,
  onView,
  onPDF,
  onPrint,
  onEdit,
  onDelete,
}: Props) {

  async function handleCollectPayment() {
    try {
      const order = await collectPayment(invoice.id!);

      console.log("Razorpay Order:", order);

      alert("✅ Payment order created successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create payment order.");
    }
  }

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
        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => onView(invoice.id!)}
            className="text-cyan-400 hover:text-cyan-300"
          >
            View
          </button>

          <button
            onClick={() => onPDF(invoice.id!)}
            className="text-purple-400 hover:text-purple-300"
          >
            PDF
          </button>

          <button
            onClick={() => onPrint(invoice.id!)}
            className="text-orange-400 hover:text-orange-300"
          >
            Print
          </button>

          <button
            onClick={() => onEdit(invoice.id!)}
            className="text-green-400 hover:text-green-300"
          >
            Edit
          </button>

          <button
            onClick={handleCollectPayment}
            className="rounded-lg bg-cyan-500 px-3 py-1 text-sm font-semibold text-black hover:bg-cyan-400"
          >
            Collect Payment
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