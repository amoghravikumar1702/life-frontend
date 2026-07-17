import { NextRequest } from "next/server";
import crypto from "crypto";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { supabaseAdmin } from "@/lib/server/supabase";
import { createNotification } from "@/services/notificationService";

export async function POST(request: NextRequest) {
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
      return ApiResponse.error("Missing payment details", 400);
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return ApiResponse.error(
        "Invalid payment signature",
        400
      );
    }

    // Prevent duplicate reconciliation
    const {
      data: existingPayment,
      error: duplicateError,
    } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("payment_reference", razorpay_payment_id)
      .maybeSingle();

    if (duplicateError) {
      throw duplicateError;
    }

    if (existingPayment) {
      return ApiResponse.success({
        verified: true,
        message: "Payment already processed",
      });
    }

    // Find invoice
    const {
      data: invoice,
      error: invoiceError,
    } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .maybeSingle();

    if (invoiceError) {
      throw invoiceError;
    }

    if (!invoice) {
      return ApiResponse.error(
        "Invoice not found",
        404
      );
    }

    // Insert payment
    const { error: paymentError } =
      await supabaseAdmin
        .from("payments")
        .insert({
          invoice_id: invoice.id,
          amount: invoice.total,
          payment_method: "Razorpay",
          payment_reference:
            razorpay_payment_id,
          payment_status: "Completed",
          razorpay_order_id,
          paid_at: new Date().toISOString(),
        });

    if (paymentError) {
      throw paymentError;
    }

    // Update invoice
    const { error: invoiceUpdateError } =
      await supabaseAdmin
        .from("invoices")
        .update({
          status: "Paid",
          amount_paid: invoice.total,
          balance_due: 0,
        })
        .eq("id", invoice.id);

    if (invoiceUpdateError) {
      throw invoiceUpdateError;
    }

    // Notification
    await createNotification({
      title: "Payment Received",
      message: `Invoice ${invoice.invoice_number} has been paid successfully.`,
      type: "payment",
    });

    return ApiResponse.success({
      verified: true,
      invoiceId: invoice.id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}