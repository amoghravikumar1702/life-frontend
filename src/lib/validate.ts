import { ZodSchema } from "zod";
import { AppError } from "./errors";

export function validate<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new AppError(
      result.error.issues[0].message,
      400
    );
  }

  return result.data;
}