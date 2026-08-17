import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { razorpay } from "@/lib/server/razorpay";
import { supabaseAdmin } from "@/lib/server/supabase";
import {
  MAX_RAZORPAY_PAYMENT_INR,
  MIN_RAZORPAY_PAYMENT_INR,
} from "@/lib/paymentLimits";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const invoiceId = Number(body.invoiceId);
    const requestedAmount = Number(body.amount);

    if (!invoiceId) {
      return ApiResponse.error(
        "Invoice ID is required",
        400
      );
    }

    if (
      !Number.isFinite(requestedAmount) ||
      requestedAmount <= 0
    ) {
      return ApiResponse.error(
        "A valid payment amount is required",
        400
      );
    }

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
        "Invoice lookup failed:",
        invoiceError
      );

      return ApiResponse.error(
        "Failed to find invoice",
        500
      );
    }

    if (!invoice) {
      return ApiResponse.error(
        "Invoice not found",
        404
      );
    }

    const balanceDue = Number(
      invoice.balance_due ?? 0
    );

    if (
      invoice.status === "Paid" ||
      balanceDue <= 0
    ) {
      return ApiResponse.error(
        "Invoice is already fully paid",
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

    const amountInPaise = Math.round(
      requestedAmount * 100
    );

    const currency =
      invoice.currency ?? "INR";

    /**
     * A new Razorpay Order is intentionally created
     * for every payment attempt.
     *
     * This allows:
     *
     * ₹58,997 invoice
     *       ↓
     * ₹50,000 order
     *       ↓
     * ₹8,997.64 order
     *
     * Each payment gets its own Razorpay order.
     */
    const order =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: `inv_${invoice.id}_${Date.now()}`,
        notes: {
          invoiceId: String(invoice.id),
          invoiceNumber: String(
            invoice.invoice_number
          ),
          paymentAmount: String(
            requestedAmount
          ),
        },
      });

    /**
     * Save the latest Razorpay order against
     * the invoice.
     *
     * IMPORTANT:
     * This field represents the latest payment attempt.
     * Historical payments remain safely stored
     * inside the payments table.
     */
    const {
      error: updateError,
    } = await supabaseAdmin
      .from("invoices")
      .update({
        razorpay_order_id: order.id,
      })
      .eq("id", invoice.id);

    if (updateError) {
      console.error(
        "Failed to save Razorpay order:",
        updateError
      );

      return ApiResponse.error(
        "Failed to save payment order",
        500
      );
    }

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
      "CREATE ORDER ERROR:",
      error
    );

    return handleApiError(error);
  }
}