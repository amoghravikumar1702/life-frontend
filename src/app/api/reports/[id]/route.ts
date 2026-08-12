import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the authenticated user's company
    const { data: company, error: companyError } =
      await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Fetch only reports belonging to this company
    const { data, error } = await supabase
      .from("reports")
      .select(`
        id,
        title,
        report_type,
        period_start,
        period_end,
        status,
        metadata,
        report_data,
        created_at
      `)
      .eq("id", id)
      .eq("company_id", company.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch report.",
      },
      {
        status: 500,
      }
    );
  }
}