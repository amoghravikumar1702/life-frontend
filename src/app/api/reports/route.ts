import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch reports.",
      },
      {
        status: 500,
      }
    );
  }
}