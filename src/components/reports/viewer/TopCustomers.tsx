import { formatCurrency } from "@/lib/utils/formatCurrency";

interface Customer {
  customer: string;
  revenue: number;
  invoices: number;
}

interface Props {
  customers: Customer[];
}

export default function TopCustomers({
  customers,
}: Props) {
  return (
    <section className="rounded-[34px] border border-white/[0.08] bg-[#101214] p-8">

      <div className="mb-8">

        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
          Customers
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
          Top Customers
        </h2>

      </div>

      <div className="space-y-4">

        {customers.length === 0 && (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-zinc-500">
            No customer data available.
          </div>
        )}

        {customers.map((customer, index) => (
          <div
            key={customer.customer}
            className="flex items-center justify-between rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-white/[0.10]"
          >
            <div className="flex items-center gap-5">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-lg font-semibold text-[#D4AF37]">
                {index + 1}
              </div>

              <div>

                <h3 className="text-lg font-medium text-white">
                  {customer.customer}
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  {customer.invoices} invoice{customer.invoices !== 1 ? "s" : ""}
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-2xl font-semibold text-white">
                {formatCurrency(customer.revenue)}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Total Revenue
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}