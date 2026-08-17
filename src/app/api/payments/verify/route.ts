import crypto from "crypto";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { createEvent } from "@/lib/events";
import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { supabaseAdmin } from "@/lib/server/supabase";
import { razorpay } from "@/lib/server/razorpay";
import { createNotification } from "@/services/notificationService";

export async function POST(
  request: NextRequest
) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return ApiResponse.error(
        "Missing payment details",
        400
      );
    }

    /* =========================================================
       1. VERIFY RAZORPAY SIGNATURE
    ========================================================= */

    const secret =
      process.env
        .RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error(
        "RAZORPAY_KEY_SECRET is not configured."
      );
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          secret
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    const signaturesMatch =
      crypto.timingSafeEqual(
        Buffer.from(
          generatedSignature
        ),
        Buffer.from(
          razorpay_signature
        )
      );

    if (!signaturesMatch) {
      return ApiResponse.error(
        "Invalid payment signature",
        400
      );
    }

    /* =========================================================
       2. PREVENT DUPLICATE RECONCILIATION
    ========================================================= */

    const {
      data: existingPayment,
      error: duplicateError,
    } = await supabaseAdmin
      .from("payments")
      .select("id, amount")
      .eq(
        "payment_reference",
        razorpay_payment_id
      )
      .maybeSingle();

    if (duplicateError) {
      throw duplicateError;
    }

    if (existingPayment) {
      return ApiResponse.success({
        verified: true,
        alreadyProcessed: true,
        amount:
          Number(
            existingPayment.amount
          ),
        message:
          "Payment already processed.",
      });
    }

    /* =========================================================
       3. FETCH ACTUAL PAYMENT FROM RAZORPAY
    ========================================================= */

    const razorpayPayment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    if (!razorpayPayment) {
      return ApiResponse.error(
        "Razorpay payment could not be found.",
        404
      );
    }

    if (
      razorpayPayment.order_id !==
      razorpay_order_id
    ) {
      return ApiResponse.error(
        "Payment does not belong to this order.",
        400
      );
    }

    if (
      razorpayPayment.status !==
      "captured"
    ) {
      return ApiResponse.error(
        `Payment is not captured. Current status: ${razorpayPayment.status}`,
        400
      );
    }

    /* =========================================================
       4. FETCH RAZORPAY ORDER
    ========================================================= */

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    if (!razorpayOrder) {
      return ApiResponse.error(
        "Razorpay order could not be found.",
        404
      );
    }

    /* =========================================================
       5. ENSURE PAYMENT AMOUNT MATCHES ORDER
    ========================================================= */

    const paymentAmountInPaise =
      Number(
        razorpayPayment.amount
      );

    const orderAmountInPaise =
      Number(
        razorpayOrder.amount
      );

    if (
      paymentAmountInPaise !==
      orderAmountInPaise
    ) {
      console.error(
        "PAYMENT / ORDER AMOUNT MISMATCH",
        {
          paymentAmountInPaise,
          orderAmountInPaise,
          razorpay_payment_id,
          razorpay_order_id,
        }
      );

      return ApiResponse.error(
        "Payment amount does not match the Razorpay order.",
        400
      );
    }

    const paymentAmount =
      paymentAmountInPaise / 100;

    /* =========================================================
       6. FIND ARKENONE INVOICE
    ========================================================= */

    const {
      data: invoice,
      error: invoiceError,
    } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq(
        "razorpay_order_id",
        razorpay_order_id
      )
      .maybeSingle();

    if (invoiceError) {
      throw invoiceError;
    }

    if (!invoice) {
      return ApiResponse.error(
        "Invoice not found for this payment.",
        404
      );
    }

    /* =========================================================
       7. VALIDATE AGAINST CURRENT BALANCE
    ========================================================= */

    const currentBalance =
      Number(
        invoice.balance_due ?? 0
      );

    if (currentBalance <= 0) {
      return ApiResponse.success({
        verified: true,
        alreadySettled: true,
        invoiceId: invoice.id,
        amount: paymentAmount,
        message:
          "Invoice is already settled.",
      });
    }

    if (
      paymentAmount >
      currentBalance + 0.01
    ) {
      console.error(
        "PAYMENT EXCEEDS INVOICE BALANCE",
        {
          paymentAmount,
          currentBalance,
          invoiceId: invoice.id,
        }
      );

      return ApiResponse.error(
        "Payment exceeds the invoice balance.",
        400
      );
    }

    /* =========================================================
       8. CALCULATE NEW FINANCIAL STATE
    ========================================================= */

    const previousAmountPaid =
      Number(
        invoice.amount_paid ?? 0
      );

    const newAmountPaid =
      previousAmountPaid +
      paymentAmount;

    const newBalanceDue =
      Math.max(
        Number(
          invoice.total ?? 0
        ) - newAmountPaid,
        0
      );

    let newStatus =
      "Partially Paid";

    if (
      newBalanceDue <= 0.01
    ) {
      newStatus = "Paid";
    }

    /* =========================================================
       9. RECORD PAYMENT
    ========================================================= */

    const {
      error: paymentError,
    } = await supabaseAdmin
      .from("payments")
      .insert({
        invoice_id: invoice.id,
        owner_id: invoice.owner_id,
        amount: paymentAmount,
        payment_method:
          razorpayPayment.method ??
          "Razorpay",
        payment_reference:
          razorpay_payment_id,
        payment_status: "Completed",
        razorpay_order_id,
        paid_at:
          new Date().toISOString(),
      });

    if (paymentError) {
      throw paymentError;
    }

    /* =========================================================
       10. UPDATE INVOICE
    ========================================================= */

    const {
      error: invoiceUpdateError,
    } = await supabaseAdmin
      .from("invoices")
      .update({
        status: newStatus,
        amount_paid:
          newAmountPaid,
        balance_due:
          newBalanceDue,

        /**
         * Keep the payment link alive when
         * money is still outstanding.
         *
         * Remove it only after the invoice
         * is completely paid.
         */
        ...(newBalanceDue <= 0.01
          ? {
              payment_token: null,
              payment_token_expires_at:
                null,
            }
          : {}),
      })
      .eq(
        "id",
        invoice.id
      );

    if (invoiceUpdateError) {
      throw invoiceUpdateError;
    }

    /* =========================================================
       11. CREATE NOTIFICATION
    ========================================================= */

    await createNotification({
      ownerId: invoice.owner_id,
      title:
        newStatus === "Paid"
          ? "Invoice Paid"
          : "Partial Payment Received",

      message:
        newStatus === "Paid"
          ? `Invoice ${invoice.invoice_number} has been paid in full.`
          : `₹${paymentAmount.toLocaleString(
              "en-IN"
            )} received for Invoice ${invoice.invoice_number}. ₹${newBalanceDue.toLocaleString(
              "en-IN"
            )} remains due.`,

      type: "payment",
    });

    /* =========================================================
       12. CREATE EVENT
    ========================================================= */

    try {
      await createEvent({
        ownerId:
          invoice.owner_id,

        type:
          newStatus === "Paid"
            ? "payment_received"
            : "payment_received",

        title:
          newStatus === "Paid"
            ? "Invoice Paid"
            : "Partial Payment Received",

        description:
          `₹${paymentAmount.toLocaleString(
            "en-IN"
          )} received for Invoice ${invoice.invoice_number}.`,

        entityType:
          "payment",

        entityId:
          razorpay_payment_id,

        severity:
          "success",

        metadata: {
          invoiceId:
            invoice.id,

          invoiceNumber:
            invoice.invoice_number,

          paymentReference:
            razorpay_payment_id,

          amount:
            paymentAmount,

          previousAmountPaid,

          newAmountPaid,

          newBalanceDue,

          status:
            newStatus,
        },
      });
    } catch (eventError) {
      console.error(
        "Failed to create payment event:",
        eventError
      );
    }

    /* =========================================================
       13. REVALIDATE
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

    /* =========================================================
       14. RESPONSE
    ========================================================= */

    return ApiResponse.success({
      verified: true,

      invoiceId:
        invoice.id,

      paymentId:
        razorpay_payment_id,

      amount:
        paymentAmount,

      previousAmountPaid,

      totalAmountPaid:
        newAmountPaid,

      balanceDue:
        newBalanceDue,

      status:
        newStatus,

      message:
        newStatus === "Paid"
          ? "Payment verified and invoice fully paid."
          : "Payment verified and invoice partially paid.",
    });
  } catch (error) {
    console.error(
      "========== PAYMENT VERIFY ERROR =========="
    );

    console.error(error);

    return handleApiError(
      error
    );
  }
}