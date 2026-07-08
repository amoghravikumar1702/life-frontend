type Props = {
  subtotal: number;
  tax: number;
  total: number;
  formatCurrency: (amount: number) => string;
};

export default function InvoiceSummary({
  subtotal,
  tax,
  total,
  formatCurrency,
}: Props) {
  return (
    <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">

      <div className="flex justify-between py-2">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between py-2">
        <span>GST (18%)</span>
        <span>{formatCurrency(tax)}</span>
      </div>

      <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-2xl font-bold">
        <span>Grand Total</span>

        <span className="text-cyan-400">
          {formatCurrency(total)}
        </span>
      </div>

    </div>
  );
}