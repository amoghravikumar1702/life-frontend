import { useQuery } from "@tanstack/react-query";

import {
  getInvoices,
  getInvoiceById,
  getInvoiceItems,
} from "@/services/invoiceService";

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
}

export function useInvoice(id: number) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });
}

export function useInvoiceItems(id: number) {
  return useQuery({
    queryKey: ["invoice-items", id],
    queryFn: () => getInvoiceItems(id),
    enabled: !!id,
  });
}