import { NextResponse } from "next/server";
import { getDashboardStats } from "@/services/dashboardService";

export async function GET() {
  try {
    const stats = await getDashboardStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return NextResponse.json(
      { error: "Failed to load dashboard stats." },
      { status: 500 }
    );
  }
}