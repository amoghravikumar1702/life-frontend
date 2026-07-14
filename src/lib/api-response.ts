import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(data: T, message = "Success", status = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  static error(message: string, status = 400, details?: unknown) {
    return NextResponse.json(
      {
        success: false,
        message,
        details: details ?? null,
      },
      { status }
    );
  }
}