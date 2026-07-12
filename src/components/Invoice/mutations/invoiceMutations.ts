import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "@/services/invoiceService";

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoice,
      items,
    }: {
      invoice: any;
      items: any[];
    }) => createInvoice(invoice, items),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      invoice,
      items,
    }: {
      id: number;
      invoice: any;
      items: any[];
    }) =>
      updateInvoice(id, invoice, items),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      deleteInvoice(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}