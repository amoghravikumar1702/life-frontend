import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function GET() {
  try {
    return ApiResponse.success({
      status: "ok",
      service: "ArkenOne API",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}