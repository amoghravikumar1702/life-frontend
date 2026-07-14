import { useInvoices } from "@/components/Invoice/queries/invoiceQueries";

export function usePendingInvoices() {
  const query = useInvoices();

  return {
    ...query,

    data:
      query.data?.filter(
        (invoice) => Number(invoice.balance_due) > 0
      ) ?? [],
  };
}