import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return ApiResponse.error(
        "Failed to fetch notifications",
        500
      );
    }

    return ApiResponse.success(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await request.json();

    const { error } = await supabase
      .from("notifications")
      .insert({
        title: body.title,
        message: body.message,
        type: body.type,
        is_read: false,
      });

    if (error) {
      return ApiResponse.error(
        "Failed to create notification",
        500
      );
    }

    return ApiResponse.success({
      created: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}