import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { recordPayment } from "@/services/paymentService";

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordPayment,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["invoices"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["payments"],
        }),
      ]);
    },
  });
}