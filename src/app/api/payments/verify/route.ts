import crypto from "crypto";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createEvent } from "@/lib/events";
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

    // Verify Razorpay signature
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

    if (
      invoice.status === "Paid" ||
      Number(invoice.balance_due) <= 0
    ) {
      return ApiResponse.success({
        verified: true,
        message: "Invoice already settled",
      });
    }

    const paymentAmount = Number(invoice.balance_due);
    const totalPaid =
      Number(invoice.amount_paid ?? 0) + paymentAmount;

    // Record payment
    const { error: paymentError } =
  await supabaseAdmin
    .from("payments")
    .insert({
      invoice_id: invoice.id,
      owner_id: invoice.owner_id,
      amount: paymentAmount,
      payment_method: "Razorpay",
      payment_reference: razorpay_payment_id,
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
          amount_paid: totalPaid,
          balance_due: 0,
          payment_token: null,
          payment_token_expires_at: null,
        })
        .eq("id", invoice.id);

    if (invoiceUpdateError) {
      throw invoiceUpdateError;
    }

    // Create notification
    // Create notification
    // Create notification
await createNotification({
  ownerId: invoice.owner_id,
  title: "Payment Received",
  message: `Invoice ${invoice.invoice_number} has been paid successfully.`,
  type: "payment",
});

    // Create event (non-blocking)
    try {
      await createEvent({
        ownerId: invoice.owner_id,
        type: "payment_received",
        title: "Payment Received",
        description: `₹${paymentAmount.toLocaleString(
          "en-IN"
        )} received for Invoice ${invoice.invoice_number}.`,
        entityType: "payment",
        entityId: razorpay_payment_id,
        severity: "success",
        metadata: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
          paymentReference: razorpay_payment_id,
          amount: paymentAmount,
        },
      });
    } catch (eventError) {
      console.error(
        "Failed to create payment event:",
        eventError
      );
    }
revalidatePath("/dashboard");
revalidatePath("/invoices");
    return ApiResponse.success({
      verified: true,
      invoiceId: invoice.id,
      paymentId: razorpay_payment_id,
      amount: paymentAmount,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error(
      "========== PAYMENT VERIFY ERROR =========="
    );
    console.error(error);

    return handleApiError(error);
  }
}