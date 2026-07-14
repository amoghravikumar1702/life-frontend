import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email().optional(),
  phone: z.string().optional(),
});