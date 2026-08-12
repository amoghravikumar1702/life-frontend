import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(request: NextRequest) {
  try {
    const { invoiceId } = await request.json();

    if (!invoiceId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice ID is required.",
        },
        { status: 400 }
      );
    }

    const token = randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: invoice, error } = await supabaseAdmin
      .from("invoices")
      .update({
        payment_token: token,
        payment_token_expires_at: expiresAt.toISOString(),
      })
      .eq("id", invoiceId)
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl: `${baseUrl}/pay/${token}`,
        token,
        invoice,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create payment link.",
      },
      { status: 500 }
    );
  }
}