import { formatCurrency } from "@/lib/utils/formatCurrency";

interface Invoice {
  invoice_number: string;
  customer: string;
  invoice_date: string;
  due_date: string;
  total: number;
  status: string;
}

interface Props {
  invoices: Invoice[];
}

export default function InvoiceTable({
  invoices,
}: Props) {
  return (
    <section className="rounded-[34px] border border-white/[0.08] bg-[#101214] p-8">

      <div className="mb-8">

        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
          Invoice Breakdown
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
          Invoice Register
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-white/[0.08] text-left">

              <th className="pb-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
                Invoice
              </th>

              <th className="pb-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
                Customer
              </th>

              <th className="pb-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
                Date
              </th>

              <th className="pb-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
                Due
              </th>

              <th className="pb-4 text-right text-xs uppercase tracking-[0.25em] text-zinc-500">
                Amount
              </th>

              <th className="pb-4 text-right text-xs uppercase tracking-[0.25em] text-zinc-500">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {invoices.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="py-10 text-center text-zinc-500"
                >
                  No invoices available.
                </td>

              </tr>

            )}

            {invoices.map((invoice) => (

              <tr
                key={invoice.invoice_number}
                className="border-b border-white/[0.05]"
              >

                <td className="py-5 font-medium text-white">
                  {invoice.invoice_number}
                </td>

                <td className="text-zinc-300">
                  {invoice.customer}
                </td>

                <td className="text-zinc-500">
                  {new Date(
                    invoice.invoice_date
                  ).toLocaleDateString("en-IN")}
                </td>

                <td className="text-zinc-500">
                  {new Date(
                    invoice.due_date
                  ).toLocaleDateString("en-IN")}
                </td>

                <td className="text-right font-semibold text-white">
                  {formatCurrency(invoice.total)}
                </td>

                <td className="text-right">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      invoice.status === "Paid"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {invoice.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}