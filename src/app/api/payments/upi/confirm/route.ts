import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const paymentToken =
      typeof body?.paymentToken === "string"
        ? body.paymentToken.trim()
        : "";

    if (!paymentToken) {
      return NextResponse.json(
        {
          error: "Payment token is required.",
        },
        { status: 400 }
      );
    }

    /*
     * =========================================================
     * FIND INVOICE
     * =========================================================
     */

    const { data: invoice, error: invoiceError } =
      await supabaseAdmin
        .from("invoices")
        .select(`
          id,
          owner_id,
          invoice_number,
          total,
          amount_paid,
          balance_due,
          status,
          payment_token,
          payment_token_expires_at
        `)
        .eq("payment_token", paymentToken)
        .maybeSingle();

    if (invoiceError) {
      console.error(
        "[UPI CONFIRM] Invoice lookup error:",
        invoiceError
      );

      return NextResponse.json(
        {
          error: "Unable to find invoice.",
        },
        { status: 500 }
      );
    }

    if (!invoice) {
      return NextResponse.json(
        {
          error: "Payment link is invalid or expired.",
        },
        { status: 404 }
      );
    }

    /*
     * =========================================================
     * TOKEN EXPIRY
     * =========================================================
     */

    if (invoice.payment_token_expires_at) {
      const expiresAt = new Date(
        invoice.payment_token_expires_at
      ).getTime();

      if (
        Number.isFinite(expiresAt) &&
        expiresAt < Date.now()
      ) {
        return NextResponse.json(
          {
            error: "This payment link has expired.",
          },
          { status: 410 }
        );
      }
    }

    /*
     * =========================================================
     * INVOICE ALREADY PAID
     * =========================================================
     */

    if (
      Number(invoice.balance_due ?? 0) <= 0 ||
      String(invoice.status ?? "")
        .toLowerCase() === "paid"
    ) {
      return NextResponse.json(
        {
          error: "This invoice has already been paid.",
        },
        { status: 409 }
      );
    }

    /*
     * =========================================================
     * CHECK FOR EXISTING PENDING PAYMENT
     * =========================================================
     *
     * Prevents the customer from clicking "I've Paid"
     * repeatedly and creating multiple pending requests.
     */

    const { data: existingPayment, error: existingError } =
      await supabaseAdmin
        .from("payments")
        .select(`
          id,
          amount,
          payment_status,
          payment_method,
          payment_reference,
          created_at
        `)
        .eq("invoice_id", invoice.id)
        .eq("owner_id", invoice.owner_id)
        .in("payment_status", [
          "pending",
          "Pending",
        ])
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (existingError) {
      console.error(
        "[UPI CONFIRM] Existing payment lookup error:",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check existing payment requests.",
        },
        { status: 500 }
      );
    }

    if (existingPayment) {
      return NextResponse.json({
        success: true,
        alreadySubmitted: true,
        paymentId: existingPayment.id,
        status: "pending",
        message:
          "Payment confirmation is already awaiting business approval.",
      });
    }

    /*
     * =========================================================
     * CREATE PENDING PAYMENT
     * =========================================================
     */

    const paymentAmount = Number(
      invoice.balance_due ?? 0
    );

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid invoice balance.",
        },
        { status: 400 }
      );
    }

    const { data: payment, error: paymentError } =
      await supabaseAdmin
        .from("payments")
        .insert({
          invoice_id: invoice.id,
          owner_id: invoice.owner_id,
          amount: paymentAmount,
          payment_method: "UPI",
          payment_reference:
            "Customer reported payment",
          payment_status: "pending",
          paid_at: null,
        })
        .select()
        .single();

    if (paymentError) {
      console.error(
        "[UPI CONFIRM] Payment insert error:",
        paymentError
      );

      return NextResponse.json(
        {
          error:
            "Unable to submit payment confirmation.",
        },
        { status: 500 }
      );
    }

    /*
     * IMPORTANT:
     *
     * We intentionally DO NOT update the invoice here.
     *
     * The business must approve the payment first.
     */

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_number,
      amount: paymentAmount,
      status: "pending",
      message:
        "Payment confirmation submitted. Awaiting business approval.",
    });
  } catch (error) {
    console.error(
      "[UPI CONFIRM] Unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit payment confirmation.",
      },
      { status: 500 }
    );
  }
}