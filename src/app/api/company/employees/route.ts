import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const employeeCount = Number(body.employeeCount);

    if (
      !Number.isInteger(employeeCount) ||
      employeeCount < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Employee count must be a non-negative whole number.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("companies")
      .update({
        employee_count: employeeCount,
      })
      .eq("owner_id", user.id)
      .select("employee_count")
      .single();

    if (error) {
      console.error("[Employees API]", error);

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to update employee count.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      employeeCount: data.employee_count,
    });
  } catch (error) {
    console.error("[Employees API]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}