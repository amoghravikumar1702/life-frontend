"use client";

import { Invoice } from "@/types/invoice";

type InvoiceItemRow = {
  id?: number;
  invoice_id: number;
  item_name: string;
  quantity: number;
  price: number;
  total: number;
};

type Props = {
  invoice: Invoice;
  items: InvoiceItemRow[];
  formatCurrency: (amount: number) => string;
  onClose: () => void;
};

export default function InvoiceViewModal({
  invoice,
  items,
  formatCurrency,
  onClose,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Invoice {invoice.invoice_number}
            </h2>
            <p className="mt-1 text-gray-400">{invoice.customer}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Invoice Date</p>
            <p className="font-semibold">{invoice.invoice_date}</p>
          </div>
          <div>
            <p className="text-gray-400">Due Date</p>
            <p className="font-semibold">{invoice.due_date}</p>
          </div>
          <div>
            <p className="text-gray-400">Status</p>
            <p className="font-semibold">{invoice.status}</p>
          </div>
          <div>
            <p className="text-gray-400">Total</p>
            <p className="font-semibold text-cyan-300">
              {formatCurrency(invoice.total)}
            </p>
          </div>
        </div>

        <h3 className="mb-3 text-lg font-semibold">Items</h3>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No items on this invoice.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id ?? idx} className="border-t border-white/10">
                    <td className="px-4 py-3">{item.item_name}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3">{formatCurrency(item.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}