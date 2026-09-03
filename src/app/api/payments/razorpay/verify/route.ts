import { NextRequest } from "next/server";
import crypto from "crypto";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { supabaseAdmin } from "@/lib/server/supabase";

type VerifyBody = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ============================================================
     * 1. READ REQUEST
     * ============================================================
     */

    let body: VerifyBody;

    try {
      body =
        (await request.json()) as VerifyBody;
    } catch {
      return ApiResponse.error(
        "Invalid payment verification request.",
        400
      );
    }

    const orderId =
      typeof body.razorpay_order_id === "string"
        ? body.razorpay_order_id.trim()
        : "";

    const paymentId =
      typeof body.razorpay_payment_id === "string"
        ? body.razorpay_payment_id.trim()
        : "";

    const signature =
      typeof body.razorpay_signature === "string"
        ? body.razorpay_signature.trim()
        : "";

    if (
      !orderId ||
      !paymentId ||
      !signature
    ) {
      return ApiResponse.error(
        "Missing Razorpay payment verification details.",
        400
      );
    }

    /*
     * ============================================================
     * 2. RAZORPAY SECRET
     * ============================================================
     */

    const secret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error(
        "[Razorpay Verify] RAZORPAY_KEY_SECRET is missing."
      );

      return ApiResponse.error(
        "Payment verification is not configured correctly.",
        500
      );
    }

    /*
     * ============================================================
     * 3. VERIFY SIGNATURE
     * ============================================================
     */

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          secret
        )
        .update(
          `${orderId}|${paymentId}`
        )
        .digest("hex");

    const expectedBuffer =
      Buffer.from(
        expectedSignature,
        "utf8"
      );

    const receivedBuffer =
      Buffer.from(
        signature,
        "utf8"
      );

    if (
      expectedBuffer.length !==
      receivedBuffer.length
    ) {
      return ApiResponse.error(
        "Invalid payment signature.",
        400
      );
    }

    const signatureValid =
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );

    if (!signatureValid) {
      console.error(
        "[Razorpay Verify] Invalid signature.",
        {
          orderId,
          paymentId,
        }
      );

      return ApiResponse.error(
        "Invalid payment signature.",
        400
      );
    }

    /*
     * ============================================================
     * 4. FIND PAYMENT
     * ============================================================
     *
     * If this payment has already been recorded, return success
     * without creating another payment record.
     */

    const {
      data: existingPayment,
      error: existingPaymentError,
    } = await supabaseAdmin
      .from("payments")
      .select(
        `
          id,
          invoice_id,
          owner_id,
          amount,
          payment_method,
          payment_reference,
          payment_status,
          razorpay_order_id
        `
      )
      .eq(
        "payment_reference",
        paymentId
      )
      .maybeSingle();

    if (existingPaymentError) {
      console.error(
        "[Razorpay Verify] Existing payment lookup failed:",
        existingPaymentError
      );

      return handleApiError(
        existingPaymentError
      );
    }

    if (existingPayment) {
      return ApiResponse.success({
        verified: true,
        alreadyProcessed: true,
        paymentId:
          existingPayment.id,
        invoiceId:
          existingPayment.invoice_id,
        amount:
          Number(
            existingPayment.amount ?? 0
          ),
        status:
          existingPayment.payment_status,
        message:
          "Payment has already been verified.",
      });
    }

    /*
     * ============================================================
     * 5. FIND RAZORPAY ORDER
     * ============================================================
     *
     * This route is intended as the lightweight Razorpay
     * verification endpoint.
     *
     * The canonical invoice reconciliation remains handled by:
     *
     * /api/payments/verify
     *
     * Therefore we do not duplicate invoice accounting here.
     * ============================================================
     */

    const {
      data: invoice,
      error: invoiceError,
    } = await supabaseAdmin
      .from("invoices")
      .select(
        `
          id,
          owner_id,
          balance_due,
          razorpay_order_id
        `
      )
      .eq(
        "razorpay_order_id",
        orderId
      )
      .maybeSingle();

    if (invoiceError) {
      console.error(
        "[Razorpay Verify] Invoice lookup failed:",
        invoiceError
      );

      return handleApiError(
        invoiceError
      );
    }

    if (!invoice) {
      return ApiResponse.error(
        "Invoice not found for this Razorpay order.",
        404
      );
    }

    /*
     * ============================================================
     * 6. SUCCESS
     * ============================================================
     *
     * Signature verification succeeded and the order belongs to
     * a DhanarkOS invoice.
     *
     * The frontend can now call the canonical:
     *
     * /api/payments/verify
     *
     * endpoint to perform the actual Razorpay payment fetch,
     * amount verification, payment recording and invoice update.
     * ============================================================
     */

    return ApiResponse.success({
      verified: true,

      orderId,

      paymentId,

      invoiceId:
        invoice.id,

      message:
        "Razorpay payment signature verified successfully.",
    });
  } catch (error) {
    console.error(
      "========== RAZORPAY VERIFY ERROR =========="
    );

    console.error(error);

    return handleApiError(
      error
    );
  }
}