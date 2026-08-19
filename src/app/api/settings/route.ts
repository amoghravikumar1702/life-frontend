import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabase";

const DEFAULT_SETTINGS = {
  currency: "INR",
  date_format: "DD MMM YYYY",
  payment_received: true,
  payment_pending: true,
  invoice_reminders: true,
  ai_cfo_insights: true,
  system_updates: true,
};

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    let { data, error } = await supabaseAdmin
      .from("user_settings")
      .select(`
        currency,
        date_format,
        payment_received,
        payment_pending,
        invoice_reminders,
        ai_cfo_insights,
        system_updates
      `)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "[Settings] Load error:",
        error
      );

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    /*
     * First-time user:
     * create their default settings automatically.
     */
    if (!data) {
      const { data: created, error: createError } =
        await supabaseAdmin
          .from("user_settings")
          .insert({
            user_id: user.id,
            ...DEFAULT_SETTINGS,
          })
          .select(`
            currency,
            date_format,
            payment_received,
            payment_pending,
            invoice_reminders,
            ai_cfo_insights,
            system_updates
          `)
          .single();

      if (createError) {
        console.error(
          "[Settings] Create error:",
          createError
        );

        return NextResponse.json(
          { error: createError.message },
          { status: 500 }
        );
      }

      data = created;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "[Settings] GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load settings.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const allowedUpdates: Record<
      string,
      unknown
    > = {};

    if (
      typeof body.currency === "string" &&
      ["INR", "USD", "EUR", "GBP"].includes(
        body.currency
      )
    ) {
      allowedUpdates.currency =
        body.currency;
    }

    if (
      typeof body.date_format ===
      "string" &&
      [
        "DD MMM YYYY",
        "DD/MM/YYYY",
        "MM/DD/YYYY",
      ].includes(body.date_format)
    ) {
      allowedUpdates.date_format =
        body.date_format;
    }

    const booleanFields = [
      "payment_received",
      "payment_pending",
      "invoice_reminders",
      "ai_cfo_insights",
      "system_updates",
    ];

    for (const field of booleanFields) {
      if (
        typeof body[field] === "boolean"
      ) {
        allowedUpdates[field] =
          body[field];
      }
    }

    if (
      Object.keys(allowedUpdates).length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "No valid settings were provided.",
        },
        { status: 400 }
      );
    }

    allowedUpdates.updated_at =
      new Date().toISOString();

    const { data, error } =
      await supabaseAdmin
        .from("user_settings")
        .upsert(
          {
            user_id: user.id,
            ...allowedUpdates,
          },
          {
            onConflict: "user_id",
          }
        )
        .select(`
          currency,
          date_format,
          payment_received,
          payment_pending,
          invoice_reminders,
          ai_cfo_insights,
          system_updates
        `)
        .single();

    if (error) {
      console.error(
        "[Settings] Save error:",
        error
      );

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "[Settings] PATCH error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save settings.",
      },
      { status: 500 }
    );
  }
}