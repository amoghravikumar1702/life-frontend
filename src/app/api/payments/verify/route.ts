import crypto from "crypto";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

import { createEvent } from "@/lib/events";
import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { supabaseAdmin } from "@/lib/server/supabase";
import { razorpay } from "@/lib/server/razorpay";
import { createNotification } from "@/services/notificationServerService";

function verifySignature(
  orderId: string,
  paymentId: string,
  receivedSignature: string,
  secret: string
) {
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expected = Buffer.from(
    generatedSignature,
    "utf8"
  );

  const received = Buffer.from(
    receivedSignature,
    "utf8"
  );

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    expected,
    received
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const razorpayOrderId =
      typeof body?.razorpay_order_id === "string"
        ? body.razorpay_order_id.trim()
        : "";

    const razorpayPaymentId =
      typeof body?.razorpay_payment_id === "string"
        ? body.razorpay_payment_id.trim()
        : "";

    const razorpaySignature =
      typeof body?.razorpay_signature === "string"
        ? body.razorpay_signature.trim()
        : "";

    /*
     * =========================================================
     * 1. VALIDATE INPUT
     * =========================================================
     */

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
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

    const secret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error(
        "RAZORPAY_KEY_SECRET is not configured."
      );
    }

    if (
      !verifySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        secret
      )
    ) {
      return ApiResponse.error(
        "Invalid payment signature",
        400
      );
    }

    /*
     * =========================================================
     * 3. FETCH RAZORPAY PAYMENT
     * =========================================================
     *
     * Never trust amount/status/method from the browser.
     */

    const razorpayPayment =
      await razorpay.payments.fetch(
        razorpayPaymentId
      );

    if (!razorpayPayment) {
      return ApiResponse.error(
        "Razorpay payment could not be found.",
        404
      );
    }

    /*
     * Payment must belong to the exact order.
     */

    if (
      razorpayPayment.order_id !==
      razorpayOrderId
    ) {
      return ApiResponse.error(
        "Payment does not belong to this order.",
        400
      );
    }

    /*
     * Only captured payments can change
     * invoice financial state.
     */

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
     * 4. FETCH RAZORPAY ORDER
     * =========================================================
     */

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpayOrderId
      );

    if (!razorpayOrder) {
      return ApiResponse.error(
        "Razorpay order could not be found.",
        404
      );
    }

    /*
     * Currency must match.
     */

    if (
      razorpayPayment.currency !==
      razorpayOrder.currency
    ) {
      return ApiResponse.error(
        "Payment currency does not match the order.",
        400
      );
    }

    /*
     * Payment amount must equal the order amount.
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
      !Number.isInteger(
        paymentAmountInPaise
      ) ||
      !Number.isInteger(
        orderAmountInPaise
      ) ||
      paymentAmountInPaise !==
        orderAmountInPaise
    ) {
      console.error(
        "[PAYMENT VERIFY] Amount mismatch",
        {
          razorpayPaymentId,
          razorpayOrderId,
          paymentAmountInPaise,
          orderAmountInPaise,
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
     * 5. FIND INVOICE USING RAZORPAY ORDER
     * =========================================================
     *
     * The browser cannot choose the invoice.
     */

    const {
      data: invoice,
      error: invoiceError,
    } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq(
        "razorpay_order_id",
        razorpayOrderId
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
     * 6. VERIFY ORDER METADATA
     * =========================================================
     *
     * This provides another server-side binding between
     * Razorpay and the invoice.
     */

    const orderNotes =
      razorpayOrder.notes ?? {};

    if (
      String(
        orderNotes.invoiceId ?? ""
      ) !== String(invoice.id)
    ) {
      console.error(
        "[PAYMENT VERIFY] Order/invoice mismatch",
        {
          orderId: razorpayOrderId,
          invoiceId: invoice.id,
          noteInvoiceId:
            orderNotes.invoiceId,
        }
      );

      return ApiResponse.error(
        "Payment order is not associated with this invoice.",
        400
      );
    }

    /*
     * =========================================================
     * 7. IDEMPOTENCY CHECK
     * =========================================================
     */

    const {
      data: existingPayment,
      error: duplicateError,
    } = await supabaseAdmin
      .from("payments")
      .select(
        "id, amount, invoice_id, payment_status"
      )
      .eq(
        "payment_reference",
        razorpayPaymentId
      )
      .maybeSingle();

    if (duplicateError) {
      throw duplicateError;
    }

    if (existingPayment) {
      /*
       * Do NOT create another payment or modify
       * the invoice again.
       */

      return ApiResponse.success({
        verified: true,
        alreadyProcessed: true,
        paymentId:
          existingPayment.id,
        invoiceId:
          existingPayment.invoice_id,
        amount:
          Number(
            existingPayment.amount
          ),
        message:
          "Payment already processed.",
      });
    }

    /*
     * =========================================================
     * 8. VERIFY CURRENT INVOICE STATE
     * =========================================================
     */

    const currentBalance =
      Number(
        invoice.balance_due ?? 0
      );

    if (
      !Number.isFinite(
        currentBalance
      ) ||
      currentBalance <= 0
    ) {
      return ApiResponse.success({
        verified: true,
        alreadySettled: true,
        invoiceId:
          invoice.id,
        amount:
          paymentAmount,
        message:
          "Invoice is already settled.",
      });
    }

    /*
     * Razorpay order amount must never exceed
     * the invoice balance.
     */

    if (
      paymentAmount >
      currentBalance + 0.01
    ) {
      console.error(
        "[PAYMENT VERIFY] Payment exceeds balance",
        {
          invoiceId:
            invoice.id,
          paymentAmount,
          currentBalance,
        }
      );

      return ApiResponse.error(
        "Payment exceeds the invoice balance.",
        400
      );
    }

    /*
     * =========================================================
     * 9. CALCULATE FINANCIAL STATE
     * =========================================================
     */

    const previousAmountPaid =
      Number(
        invoice.amount_paid ?? 0
      );

    const invoiceTotal =
      Number(
        invoice.total ?? 0
      );

    const newAmountPaid =
      previousAmountPaid +
      paymentAmount;

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
          razorpayPayment.method ??
          "Razorpay",

        payment_reference:
          razorpayPaymentId,

        payment_status:
          "Completed",

        razorpay_order_id:
          razorpayOrderId,

        paid_at:
          new Date().toISOString(),
      })
      .select("id")
      .single();

    if (paymentError) {
      /*
       * If another request already inserted the same
       * Razorpay payment, return success instead of
       * double-processing it.
       */

      if (
        paymentError.code ===
        "23505"
      ) {
        const {
          data: duplicatePayment,
        } = await supabaseAdmin
          .from("payments")
          .select(
            "id, amount, invoice_id"
          )
          .eq(
            "payment_reference",
            razorpayPaymentId
          )
          .maybeSingle();

        return ApiResponse.success({
          verified: true,
          alreadyProcessed: true,
          paymentId:
            duplicatePayment?.id ??
            null,
          invoiceId:
            duplicatePayment?.invoice_id ??
            invoice.id,
          amount:
            Number(
              duplicatePayment?.amount ??
                paymentAmount
            ),
          message:
            "Payment already processed.",
        });
      }

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
      status:
        newStatus,

      amount_paid:
        newAmountPaid,

      balance_due:
        newBalanceDue,
    };

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
      )
      .eq(
        "razorpay_order_id",
        razorpayOrderId
      );

    if (invoiceUpdateError) {
      /*
       * IMPORTANT:
       * The payment already exists in the database.
       * Do not create another payment if the client retries.
       *
       * This should ideally be replaced with a database
       * transaction/RPC for completely atomic reconciliation.
       */

      throw invoiceUpdateError;
    }

    /*
     * =========================================================
     * 12. NOTIFICATION
     * =========================================================
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
      console.error(
        "[PAYMENT VERIFY] Notification failed:",
        notificationError
      );
    }

    /*
     * =========================================================
     * 13. EVENT
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
          )} received for Invoice ${
            invoice.invoice_number
          }.`,

        entityType:
          "payment",

        entityId:
          razorpayPaymentId,

        severity:
          "success",

        metadata: {
          invoiceId:
            invoice.id,

          invoiceNumber:
            invoice.invoice_number,

          paymentReference:
            razorpayPaymentId,

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
        "[PAYMENT VERIFY] Event failed:",
        eventError
      );
    }

    /*
     * =========================================================
     * 14. REVALIDATE
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
     * 15. SUCCESS
     * =========================================================
     */

    return ApiResponse.success({
      verified: true,

      invoiceId:
        invoice.id,

      paymentId:
        payment.id,

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