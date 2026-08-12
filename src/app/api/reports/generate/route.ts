import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { generateReport } from "@/lib/reports/service";

export async function POST(request: Request) {
  try {
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

    const body = await request.json();

    const {
      reportType,
      periodStart,
      periodEnd,
    } = body;

    const report = await generateReport({
      type: reportType,
      ownerId: user.id,
      start: new Date(periodStart),
      end: new Date(periodEnd),
    });

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

    // Convert report into plain JSON before saving
    const reportSnapshot = JSON.parse(
      JSON.stringify(report)
    );

    const { data: savedReport, error } =
      await supabase
        .from("reports")
        .insert({
          company_id: company.id,
          generated_by: user.id,

          report_type: report.type,
          title: report.title,

          period_start: periodStart,
          period_end: periodEnd,

          status: "completed",

          metadata: reportSnapshot.metadata,

          report_data: reportSnapshot,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      report: reportSnapshot,
      savedReport,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate report.",
      },
      {
        status: 500,
      }
    );
  }
}