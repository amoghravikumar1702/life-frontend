import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/services/invoiceService";

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
}