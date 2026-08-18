import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    /*
     * =========================================================
     * AUTHENTICATE OWNER
     * =========================================================
     */

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        { status: 401 }
      );
    }

    /*
     * =========================================================
     * REQUEST
     * =========================================================
     */

    const body = await request.json();

    const paymentId = Number(body?.paymentId);

    const action =
      typeof body?.action === "string"
        ? body.action.trim().toLowerCase()
        : "";

    if (
      !Number.isInteger(paymentId) ||
      paymentId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Valid payment ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      action !== "accept" &&
      action !== "reject"
    ) {
      return NextResponse.json(
        {
          error:
            "Action must be accept or reject.",
        },
        { status: 400 }
      );
    }

    /*
     * =========================================================
     * LOAD PAYMENT
     * =========================================================
     */

    const {
      data: payment,
      error: paymentError,
    } = await supabaseAdmin
      .from("payments")
      .select(`
        id,
        invoice_id,
        owner_id,
        amount,
        payment_method,
        payment_reference,
        payment_status,
        paid_at
      `)
      .eq("id", paymentId)
      .maybeSingle();

    if (paymentError) {
      throw paymentError;
    }

    if (!payment) {
      return NextResponse.json(
        {
          error: "Payment request not found.",
        },
        { status: 404 }
      );
    }

    /*
     * =========================================================
     * OWNERSHIP
     * =========================================================
     */

    if (payment.owner_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to review this payment.",
        },
        { status: 403 }
      );
    }

    /*
     * =========================================================
     * PAYMENT MUST BE PENDING
     * =========================================================
     */

    const normalizedStatus =
      String(
        payment.payment_status ?? ""
      )
        .trim()
        .toLowerCase();

    if (normalizedStatus !== "pending") {
      return NextResponse.json(
        {
          error:
            "This payment is no longer awaiting approval.",
        },
        { status: 409 }
      );
    }

    /*
     * =========================================================
     * REJECT
     * =========================================================
     */

    if (action === "reject") {
      const {
        data: rejectedPayment,
        error: rejectError,
      } = await supabaseAdmin
        .from("payments")
        .update({
          payment_status: "rejected",
          paid_at: null,
        })
        .eq("id", payment.id)
        .eq("owner_id", user.id)
        .eq("payment_status", "pending")
        .select()
        .maybeSingle();

      if (rejectError) {
        throw rejectError;
      }

      if (!rejectedPayment) {
        return NextResponse.json(
          {
            error:
              "Payment was already reviewed.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        action: "rejected",
        paymentId: payment.id,
        invoiceId: payment.invoice_id,
        message:
          "Payment confirmation rejected.",
      });
    }

    /*
     * =========================================================
     * LOAD INVOICE
     * =========================================================
     */

    const {
      data: invoice,
      error: invoiceError,
    } = await supabaseAdmin
      .from("invoices")
      .select(`
        id,
        owner_id,
        invoice_number,
        total,
        amount_paid,
        balance_due,
        status
      `)
      .eq("id", payment.invoice_id)
      .maybeSingle();

    if (invoiceError) {
      throw invoiceError;
    }

    if (!invoice) {
      return NextResponse.json(
        {
          error: "Invoice not found.",
        },
        { status: 404 }
      );
    }

    if (invoice.owner_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "You are not authorized to update this invoice.",
        },
        { status: 403 }
      );
    }

    /*
     * =========================================================
     * VALIDATE AMOUNT
     * =========================================================
     */

    const paymentAmount = Number(
      payment.amount ?? 0
    );

    const total = Number(
      invoice.total ?? 0
    );

    const currentAmountPaid = Number(
      invoice.amount_paid ?? 0
    );

    const currentBalanceDue = Number(
      invoice.balance_due ?? 0
    );

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment amount.",
        },
        { status: 400 }
      );
    }

    if (
      paymentAmount >
      currentBalanceDue + 0.01
    ) {
      return NextResponse.json(
        {
          error:
            "Payment exceeds the current invoice balance.",
        },
        { status: 400 }
      );
    }

    /*
     * =========================================================
     * CALCULATE NEW INVOICE STATE
     * =========================================================
     */

    const newAmountPaid =
      currentAmountPaid +
      paymentAmount;

    const newBalanceDue = Math.max(
      total - newAmountPaid,
      0
    );

    const newStatus =
      newBalanceDue <= 0.01
        ? "Paid"
        : newAmountPaid > 0
        ? "Partially Paid"
        : "Pending";

    /*
     * =========================================================
     * ACCEPT PAYMENT
     * =========================================================
     */

    const {
      data: acceptedPayment,
      error: acceptError,
    } = await supabaseAdmin
      .from("payments")
      .update({
        payment_status: "completed",
        paid_at: new Date().toISOString(),
      })
      .eq("id", payment.id)
      .eq("owner_id", user.id)
      .eq("payment_status", "pending")
      .select()
      .maybeSingle();

    if (acceptError) {
      throw acceptError;
    }

    if (!acceptedPayment) {
      return NextResponse.json(
        {
          error:
            "Payment was already reviewed.",
        },
        { status: 409 }
      );
    }

    /*
     * =========================================================
     * UPDATE INVOICE
     * =========================================================
     */

    const {
      error: updateInvoiceError,
    } = await supabaseAdmin
      .from("invoices")
      .update({
        amount_paid: newAmountPaid,
        balance_due: newBalanceDue,
        status: newStatus,
        ...(newBalanceDue <= 0.01
          ? {
              payment_token: null,
              payment_token_expires_at: null,
            }
          : {}),
      })
      .eq("id", invoice.id)
      .eq("owner_id", user.id);

    if (updateInvoiceError) {
      /*
       * Roll payment back if invoice update fails.
       */

      await supabaseAdmin
        .from("payments")
        .update({
          payment_status: "pending",
          paid_at: null,
        })
        .eq("id", payment.id)
        .eq("owner_id", user.id);

      throw updateInvoiceError;
    }

    /*
     * =========================================================
     * SUCCESS
     * =========================================================
     */

    return NextResponse.json({
      success: true,
      action: "accepted",
      paymentId: payment.id,
      invoiceId: invoice.id,
      invoiceNumber:
        invoice.invoice_number,
      amount: paymentAmount,
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue,
      invoiceStatus: newStatus,
      message:
        "Payment accepted and invoice updated.",
    });
  } catch (error) {
    console.error(
      "[UPI PAYMENT REVIEW] Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to review payment.",
      },
      { status: 500 }
    );
  }
}