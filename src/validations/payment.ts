import { z } from "zod";

export const paymentSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().positive(),
  paymentMethod: z.enum([
    "Cash",
    "Bank Transfer",
    "UPI",
    "Card",
    "Cheque",
    "Other",
  ]),
});