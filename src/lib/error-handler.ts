import { ApiResponse } from "./api-response";
import { AppError } from "./errors";

export function handleApiError(error: unknown) {
  console.error(error);

  if (error instanceof AppError) {
    return ApiResponse.error(
      error.message,
      error.statusCode
    );
  }

  return ApiResponse.error(
    "Internal Server Error",
    500
  );
}