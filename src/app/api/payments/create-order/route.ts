import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { razorpay } from "@/lib/server/razorpay";
import { supabaseAdmin } from "@/lib/server/supabase";
import { createClient } from "@/lib/supabase/server";

import {
  MAX_RAZORPAY_PAYMENT_INR,
  MIN_RAZORPAY_PAYMENT_INR,
} from "@/lib/paymentLimits";

export async function POST(request: NextRequest) {
  try {
    /*
     * =========================================================
     * AUTHENTICATE USER
     * =========================================================
     */

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return ApiResponse.error(
        "Authentication required.",
        401
      );
    }

    /*
     * =========================================================
     * READ REQUEST
     * =========================================================
     */

    const body = await request.json();

    const invoiceId = Number(body?.invoiceId);
    const requestedAmount = Number(body?.amount);

    if (
      !Number.isInteger(invoiceId) ||
      invoiceId <= 0
    ) {
      return ApiResponse.error(
        "Valid invoice ID is required.",
        400
      );
    }

    if (
      !Number.isFinite(requestedAmount) ||
      requestedAmount <= 0
    ) {
      return ApiResponse.error(
        "A valid payment amount is required.",
        400
      );
    }

    /*
     * =========================================================
     * FETCH INVOICE
     *
     * Admin client is used for the payment operation,
     * therefore ownership MUST be checked manually.
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
        currency,
        status,
        total,
        balance_due
      `)
      .eq("id", invoiceId)
      .maybeSingle();

    if (invoiceError) {
      console.error(
        "[CREATE ORDER] Invoice lookup failed:",
        invoiceError
      );

      return ApiResponse.error(
        "Failed to find invoice.",
        500
      );
    }

    if (!invoice) {
      return ApiResponse.error(
        "Invoice not found.",
        404
      );
    }

    /*
     * =========================================================
     * OWNERSHIP CHECK
     * =========================================================
     */

    if (invoice.owner_id !== user.id) {
      console.warn(
        "[CREATE ORDER] Unauthorized invoice access:",
        {
          userId: user.id,
          invoiceId,
        }
      );

      return ApiResponse.error(
        "You are not authorized to access this invoice.",
        403
      );
    }

    /*
     * =========================================================
     * PAYMENT VALIDATION
     * =========================================================
     */

    const balanceDue = Number(
      invoice.balance_due ?? 0
    );

    if (
      String(invoice.status ?? "").toLowerCase() ===
        "paid" ||
      balanceDue <= 0
    ) {
      return ApiResponse.error(
        "Invoice is already fully paid.",
        400
      );
    }

    if (
      requestedAmount <
      MIN_RAZORPAY_PAYMENT_INR
    ) {
      return ApiResponse.error(
        `Minimum payment amount is ₹${MIN_RAZORPAY_PAYMENT_INR.toLocaleString(
          "en-IN"
        )}.`,
        400
      );
    }

    if (
      requestedAmount >
      MAX_RAZORPAY_PAYMENT_INR
    ) {
      return ApiResponse.error(
        `Maximum single payment is ₹${MAX_RAZORPAY_PAYMENT_INR.toLocaleString(
          "en-IN"
        )}.`,
        400
      );
    }

    if (requestedAmount > balanceDue) {
      return ApiResponse.error(
        `Payment cannot exceed the outstanding balance of ₹${balanceDue.toLocaleString(
          "en-IN"
        )}.`,
        400
      );
    }

    /*
     * =========================================================
     * CURRENCY
     * =========================================================
     *
     * DhanarkOS currently supports Razorpay INR payments.
     */

    const currency = String(
      invoice.currency ?? "INR"
    ).toUpperCase();

    if (currency !== "INR") {
      return ApiResponse.error(
        "Only INR payments are currently supported.",
        400
      );
    }

    /*
     * =========================================================
     * CREATE RAZORPAY ORDER
     * =========================================================
     */

    const amountInPaise = Math.round(
      requestedAmount * 100
    );

    const order =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `inv_${invoice.id}_${Date.now()}`,
        notes: {
          invoiceId: String(invoice.id),
          invoiceNumber: String(
            invoice.invoice_number ?? ""
          ),
          paymentAmount: String(
            requestedAmount
          ),
          ownerId: user.id,
        },
      });

    /*
     * =========================================================
     * SAVE ORDER
     * =========================================================
     */

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("invoices")
      .update({
        razorpay_order_id: order.id,
      })
      .eq("id", invoice.id)
      .eq("owner_id", user.id);

    if (updateError) {
      console.error(
        "[CREATE ORDER] Failed to save Razorpay order:",
        updateError
      );

      return ApiResponse.error(
        "Failed to save payment order.",
        500
      );
    }

    /*
     * =========================================================
     * RESPONSE
     * =========================================================
     */

    return ApiResponse.success({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      invoiceId: invoice.id,
      invoiceNumber:
        invoice.invoice_number,
      requestedAmount,
      balanceDue,
    });
  } catch (error) {
    console.error(
      "[CREATE ORDER] Unexpected error:",
      error
    );

    return handleApiError(error);
  }
}