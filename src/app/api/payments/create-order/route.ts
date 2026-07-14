import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return ApiResponse.success({
      message: "Create Order API Working",
      body,
    });

  } catch (error) {
    return handleApiError(error);
  }
}