import InvoiceRow from "./InvoiceRow";
import InvoiceCard from "./InvoiceCard";
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
      <div className="rounded-[26px] border border-dashed border-white/[0.08] bg-[#101214] px-6 py-16 text-center sm:px-10 sm:py-20">
        <h3 className="text-xl font-semibold text-white">
          No invoices yet
        </h3>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
          Your invoices will appear here once you create your first invoice.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}

      <div className="hidden overflow-hidden rounded-[26px] border border-white/[0.06] bg-[#0E1013] shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse">
            <thead className="border-b border-white/[0.06] bg-[#14171B]">
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                <th className="px-8 py-5 font-medium">
                  Invoice
                </th>

                <th className="px-8 py-5 font-medium">
                  Customer
                </th>

                <th className="px-8 py-5 font-medium">
                  Amount
                </th>

                <th className="px-8 py-5 font-medium">
                  Status
                </th>

                <th className="px-8 py-5 font-medium">
                  Actions
                </th>

                <th className="px-8 py-5 font-medium">
                  Payment
                </th>
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
      </div>

      {/* Mobile */}

      <div className="space-y-3 md:hidden">
        {invoices.map((invoice) => (
          <InvoiceCard
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
      </div>
    </>
  );
}