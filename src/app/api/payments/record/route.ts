import crypto from "crypto";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { ApiResponse } from "@/lib/api-response";
import { supabaseAdmin } from "@/lib/server/supabase";
import { createNotification } from "@/services/notificationService";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const {
      invoiceId,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      notes,
    } = body;

    /* =========================================================
       1. VALIDATE INPUT
    ========================================================= */

    if (!invoiceId) {
      return ApiResponse.error(
        "Invoice is required.",
        400
      );
    }

    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return ApiResponse.error(
        "Enter a valid payment amount.",
        400
      );
    }

    const allowedPaymentMethods = [
      "upi",
      "bank_transfer",
      "cash",
      "other",
    ];

    if (
      !paymentMethod ||
      !allowedPaymentMethods.includes(
        paymentMethod
      )
    ) {
      return ApiResponse.error(
        "Invalid payment method.",
        400
      );
    }

    /* =========================================================
       2. FETCH INVOICE
    ========================================================= */

    const {
      data: invoice,
      error: invoiceError,
    } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .maybeSingle();

    if (invoiceError) {
      console.error(
        "[RecordPayment] Invoice fetch error:",
        invoiceError
      );

      return ApiResponse.error(
        invoiceError.message ||
          "Unable to load invoice.",
        500
      );
    }

    if (!invoice) {
      return ApiResponse.error(
        "Invoice not found.",
        404
      );
    }

    /* =========================================================
       3. CALCULATE CURRENT BALANCE
    ========================================================= */

    const invoiceTotal = Number(
      invoice.total ?? 0
    );

    const previousAmountPaid = Number(
      invoice.amount_paid ?? 0
    );

    const storedBalance = Number(
      invoice.balance_due ?? 0
    );

    const currentBalance =
      storedBalance > 0
        ? storedBalance
        : Math.max(
            invoiceTotal -
              previousAmountPaid,
            0
          );

    if (currentBalance <= 0.01) {
      return ApiResponse.error(
        "This invoice has no outstanding balance.",
        400
      );
    }

    if (
      paymentAmount >
      currentBalance + 0.01
    ) {
      return ApiResponse.error(
        `Payment cannot exceed the outstanding balance of ₹${currentBalance.toLocaleString(
          "en-IN"
        )}.`,
        400
      );
    }

    /* =========================================================
       4. CALCULATE NEW FINANCIAL STATE
    ========================================================= */

    const newAmountPaid =
      previousAmountPaid +
      paymentAmount;

    const newBalanceDue = Math.max(
      invoiceTotal -
        newAmountPaid,
      0
    );

    const newStatus =
      newBalanceDue <= 0.01
        ? "Paid"
        : "Partially Paid";

    /* =========================================================
       5. PAYMENT REFERENCE
       
       The database requires payment_reference to be NOT NULL.
       
       Use the real UTR/reference when supplied.
       Otherwise create an internal DhanarkOS reference.
    ========================================================= */

    const suppliedReference =
      typeof reference === "string"
        ? reference.trim()
        : "";

    const paymentReference =
      suppliedReference ||
      `MANUAL-${paymentMethod.toUpperCase()}-${Date.now()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;

    /* =========================================================
       6. CREATE PAYMENT RECORD
       
       IMPORTANT:
       payment_status MUST be lowercase because the
       database constraint accepts:
       
       pending
       completed
       failed
       cancelled
       confirmed
    ========================================================= */

    const {
      data: payment,
      error: paymentError,
    } = await supabaseAdmin
      .from("payments")
      .insert({
        invoice_id:
          invoice.id,

        owner_id:
          invoice.owner_id,

        amount:
          paymentAmount,

        payment_method:
          paymentMethod,

        payment_reference:
          paymentReference,

        payment_status:
          "completed",

        paid_at:
          paymentDate
            ? new Date(
                `${paymentDate}T12:00:00`
              ).toISOString()
            : new Date().toISOString(),
      })
      .select(
        `
          id,
          invoice_id,
          owner_id,
          amount,
          payment_method,
          payment_reference,
          payment_status,
          paid_at
        `
      )
      .single();

    if (paymentError) {
      console.error(
        "[RecordPayment] Payment insert error:",
        paymentError
      );

      return ApiResponse.error(
        paymentError.message ||
          "Unable to record payment.",
        500
      );
    }

    /* =========================================================
       7. UPDATE INVOICE
    ========================================================= */

    const invoiceUpdate: Record<
      string,
      unknown
    > = {
      status:
        newStatus,

      amount_paid:
        newAmountPaid,

      balance_due:
        newBalanceDue,
    };

    /*
     * Fully paid invoices no longer need
     * an active customer payment link.
     */

    if (
      newBalanceDue <= 0.01
    ) {
      invoiceUpdate.payment_token =
        null;

      invoiceUpdate.payment_token_expires_at =
        null;
    }

    const {
      error: invoiceUpdateError,
    } = await supabaseAdmin
      .from("invoices")
      .update(invoiceUpdate)
      .eq(
        "id",
        invoice.id
      );

    if (invoiceUpdateError) {
      console.error(
        "[RecordPayment] Invoice update error:",
        invoiceUpdateError
      );

      return ApiResponse.error(
        `Payment was recorded, but the invoice could not be updated: ${invoiceUpdateError.message}`,
        500
      );
    }

    /* =========================================================
       8. CREATE NOTIFICATION
    ========================================================= */

    try {
      await createNotification({
        ownerId:
          invoice.owner_id,

        title:
          newStatus === "Paid"
            ? "Invoice Paid"
            : "Payment Recorded",

        message:
          newStatus === "Paid"
            ? `Invoice ${invoice.invoice_number} has been paid in full.`
            : `₹${paymentAmount.toLocaleString(
                "en-IN"
              )} received for Invoice ${
                invoice.invoice_number
              }. ₹${newBalanceDue.toLocaleString(
                "en-IN"
              )} remains due.`,

        type:
          newStatus === "Paid"
            ? "invoice_paid"
            : "payment_received",

        link:
          `/invoices/${invoice.id}`,
      });
    } catch (notificationError) {
      /*
       * Notification failure must never
       * invalidate a successful payment.
       */

      console.error(
        "[RecordPayment] Notification error:",
        notificationError
      );
    }

    /* =========================================================
       9. CREATE EVENT
    ========================================================= */

    try {
      const {
        createEvent,
      } = await import(
        "@/lib/events"
      );

      await createEvent({
        ownerId:
          invoice.owner_id,

        type:
          "payment_received",

        title:
          newStatus === "Paid"
            ? "Invoice Paid"
            : "Payment Recorded",

        description:
          `₹${paymentAmount.toLocaleString(
            "en-IN"
          )} received for Invoice ${
            invoice.invoice_number
          } via ${paymentMethod}.`,

        entityType:
          "payment",

        entityId:
          payment.id,

        severity:
          "success",

        metadata: {
          invoiceId:
            invoice.id,

          invoiceNumber:
            invoice.invoice_number,

          paymentId:
            payment.id,

          paymentMethod,

          paymentReference,

          amount:
            paymentAmount,

          previousAmountPaid,

          newAmountPaid,

          newBalanceDue,

          status:
            newStatus,

          notes:
            typeof notes ===
            "string"
              ? notes.trim()
              : null,
        },
      });
    } catch (eventError) {
      console.error(
        "[RecordPayment] Event error:",
        eventError
      );
    }

    /* =========================================================
       10. REVALIDATE
    ========================================================= */

    revalidatePath(
      "/dashboard"
    );

    revalidatePath(
      "/invoices"
    );

    revalidatePath(
      `/invoices/${invoice.id}`
    );

    revalidatePath(
      "/record-payment"
    );

    /* =========================================================
       11. SUCCESS RESPONSE
    ========================================================= */

    return ApiResponse.success({
      recorded:
        true,

      paymentId:
        payment.id,

      invoiceId:
        invoice.id,

      amount:
        paymentAmount,

      paymentMethod,

      paymentReference,

      previousAmountPaid,

      totalAmountPaid:
        newAmountPaid,

      balanceDue:
        newBalanceDue,

      status:
        newStatus,

      message:
        newStatus === "Paid"
          ? "Payment recorded and invoice fully paid."
          : "Payment recorded successfully.",
    });
  } catch (error) {
    console.error(
      "========== RECORD PAYMENT ERROR =========="
    );

    console.error(error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to record payment.",
      },
      {
        status: 500,
      }
    );
  }
}