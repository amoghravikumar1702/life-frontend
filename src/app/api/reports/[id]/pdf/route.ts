import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

import { createClient } from "@/lib/supabase/server";
import ExecutiveReportPDF from "@/components/reports/ExecutiveReportPDF";

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
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Resolve the authenticated user's company.
     */
    const { data: company, error: companyError } =
      await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (companyError || !company) {
      return NextResponse.json(
        {
          error: "Company not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Fetch only the requested report belonging
     * to the authenticated user's company.
     */
    const { data: report, error: reportError } =
      await supabase
        .from("reports")
        .select(
          `
            id,
            title,
            report_type,
            period_start,
            period_end,
            status,
            metadata,
            report_data,
            created_at
          `
        )
        .eq("id", id)
        .eq("company_id", company.id)
        .single();

    if (reportError || !report) {
      return NextResponse.json(
        {
          error: "Report not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Generate the ArkenOne PDF.
     *
     * The component is explicitly cast to the
     * React-PDF Document element type so that
     * renderToBuffer accepts the custom report props.
     */
    const pdfDocument = React.createElement(
      ExecutiveReportPDF,
      {
        report,
      }
    ) as React.ReactElement;

    const pdfBuffer = await renderToBuffer(pdfDocument as any);

    const safeTitle =
      report.title
        ?.replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase() ||
      "arkenone-executive-report";

    const filename = `${safeTitle}.pdf`;

    return new NextResponse(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error(
      "[ExecutiveReportPDF] Failed to generate PDF:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to generate PDF.",
      },
      {
        status: 500,
      }
    );
  }
}