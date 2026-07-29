import { NextResponse } from "next/server";
import { getFinancialSnapshot } from "@/lib/finance";

export async function GET() {
  try {
    const snapshot = await getFinancialSnapshot();
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}