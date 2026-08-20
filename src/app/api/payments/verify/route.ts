import crypto from "crypto";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { createEvent } from "@/lib/events";
import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { supabaseAdmin } from "@/lib/server/supabase";
import { razorpay } from "@/lib/server/razorpay";
import { getNotifications } from "@/services/notificationService";
import { createNotification } from "@/services/notificationServerService";

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    /*
     * =========================================================
     * 1. VALIDATE REQUEST
     * =========================================================
     */

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

    /*
     * =========================================================
     * 2. VERIFY RAZORPAY SIGNATURE
     * =========================================================
     */

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error(
        "RAZORPAY_KEY_SECRET is not configured."
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const generatedBuffer = Buffer.from(
      generatedSignature,
      "utf8"
    );

    const receivedBuffer = Buffer.from(
      razorpay_signature,
      "utf8"
    );

    if (
      generatedBuffer.length !==
      receivedBuffer.length
    ) {
      return ApiResponse.error(
        "Invalid payment signature",
        400
      );
    }

    const signaturesMatch = crypto.timingSafeEqual(
      generatedBuffer,
      receivedBuffer
    );

    if (!signaturesMatch) {
      return ApiResponse.error(
        "Invalid payment signature",
        400
      );
    }

    /*
     * =========================================================
     * 3. PREVENT DUPLICATE RECONCILIATION
     * =========================================================
     */

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
        amount: Number(
          existingPayment.amount
        ),
        message:
          "Payment already processed.",
      });
    }

    /*
     * =========================================================
     * 4. FETCH PAYMENT FROM RAZORPAY
     * =========================================================
     */

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

    /*
     * =========================================================
     * 5. FETCH RAZORPAY ORDER
     * =========================================================
     */

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

    /*
     * =========================================================
     * 6. VERIFY PAYMENT AMOUNT
     * =========================================================
     */

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

    /*
     * =========================================================
     * 7. FIND ARKENONE INVOICE
     * =========================================================
     */

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

    /*
     * =========================================================
     * 8. VALIDATE CURRENT BALANCE
     * =========================================================
     */

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

    /*
     * =========================================================
     * 9. CALCULATE NEW FINANCIAL STATE
     * =========================================================
     */

    const previousAmountPaid =
      Number(
        invoice.amount_paid ?? 0
      );

    const newAmountPaid =
      previousAmountPaid +
      paymentAmount;

    const invoiceTotal =
      Number(
        invoice.total ?? 0
      );

    const newBalanceDue =
      Math.max(
        invoiceTotal -
          newAmountPaid,
        0
      );

    const newStatus =
      newBalanceDue <= 0.01
        ? "Paid"
        : "Partially Paid";

    /*
     * =========================================================
     * 10. RECORD PAYMENT
     * =========================================================
     */

    const {
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
          razorpayPayment.method ??
          "Razorpay",

        payment_reference:
          razorpay_payment_id,

        payment_status:
          "Completed",

        razorpay_order_id,

        paid_at:
          new Date().toISOString(),
      });

    if (paymentError) {
      throw paymentError;
    }

    /*
     * =========================================================
     * 11. UPDATE INVOICE
     * =========================================================
     */

    const invoiceUpdate: Record<
      string,
      unknown
    > = {
      status: newStatus,
      amount_paid:
        newAmountPaid,
      balance_due:
        newBalanceDue,
    };

    /*
     * Remove payment token only when
     * invoice is completely paid.
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
      .update(
        invoiceUpdate
      )
      .eq(
        "id",
        invoice.id
      );

    if (invoiceUpdateError) {
      throw invoiceUpdateError;
    }

    /*
     * =========================================================
     * 12. CREATE NOTIFICATION
     * =========================================================
     *
     * IMPORTANT:
     * createNotification is intentionally called
     * with userId because the notification service
     * accepts userId as its canonical field.
     *
     * invoice.owner_id is the authenticated workspace
     * owner receiving the notification.
     */

    try {
      await createNotification({
        userId:
          invoice.owner_id,

        title:
          newStatus === "Paid"
            ? "Invoice Paid"
            : "Partial Payment Received",

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
          "payment_received",

        link:
          `/invoices/${invoice.id}`,
      });
    } catch (notificationError) {
      /*
       * Notification failure must NEVER
       * cause a successful payment to fail.
       */

      console.error(
        "Failed to create payment notification:",
        notificationError
      );
    }

    /*
     * =========================================================
     * 13. CREATE PAYMENT EVENT
     * =========================================================
     */

    try {
      await createEvent({
        ownerId:
          invoice.owner_id,

        type:
          "payment_received",

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
      /*
       * Event creation is supplementary.
       * Never fail a successful payment because
       * the event system has an issue.
       */

      console.error(
        "Failed to create payment event:",
        eventError
      );
    }

    /*
     * =========================================================
     * 14. REVALIDATE ARKENONE PAGES
     * =========================================================
     */

    revalidatePath(
      "/dashboard"
    );

    revalidatePath(
      "/invoices"
    );

    revalidatePath(
      `/invoices/${invoice.id}`
    );

    /*
     * =========================================================
     * 15. SUCCESS RESPONSE
     * =========================================================
     */

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