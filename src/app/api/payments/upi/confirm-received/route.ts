import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const paymentId = Number(body?.paymentId);

    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return ApiResponse.error(
        "Payment ID is required.",
        400
      );
    }

    /*
     * =========================================================
     * AUTHENTICATE BUSINESS OWNER
     * =========================================================
     */

    const authHeader =
      request.headers.get("Authorization");

    const accessToken =
      authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!accessToken) {
      return ApiResponse.error(
        "Authentication required.",
        401
      );
    }

    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabaseAdmin.auth.getUser(
        accessToken
      );

    if (authError || !user) {
      return ApiResponse.error(
        "Authentication failed.",
        401
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
    } =
      await supabaseAdmin
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
      return ApiResponse.error(
        "Payment not found.",
        404
      );
    }

    /*
     * =========================================================
     * VERIFY OWNERSHIP
     * =========================================================
     */

    if (payment.owner_id !== user.id) {
      return ApiResponse.error(
        "You are not authorized to confirm this payment.",
        403
      );
    }

    /*
     * =========================================================
     * VERIFY PAYMENT METHOD
     * =========================================================
     */

    if (
      payment.payment_method?.toLowerCase() !==
      "upi"
    ) {
      return ApiResponse.error(
        "This payment is not a UPI payment.",
        400
      );
    }

    /*
     * =========================================================
     * VERIFY PAYMENT STATUS
     * =========================================================
     */

    if (
      payment.payment_status ===
      "completed"
    ) {
      return ApiResponse.error(
        "This payment has already been confirmed.",
        400
      );
    }

    if (
      payment.payment_status !==
      "pending"
    ) {
      return ApiResponse.error(
        "This payment is not awaiting confirmation.",
        400
      );
    }

    /*
     * =========================================================
     * LOAD INVOICE
     * =========================================================
     */

    const {
      data: invoice,
      error: invoiceError,
    } =
      await supabaseAdmin
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
      return ApiResponse.error(
        "Invoice not found.",
        404
      );
    }

    /*
     * =========================================================
     * VERIFY INVOICE OWNERSHIP
     * =========================================================
     */

    if (invoice.owner_id !== user.id) {
      return ApiResponse.error(
        "You are not authorized to confirm this payment.",
        403
      );
    }

    /*
     * =========================================================
     * CALCULATE NEW INVOICE TOTALS
     * =========================================================
     */

    const paymentAmount = Number(
      payment.amount ?? 0
    );

    const currentAmountPaid = Number(
      invoice.amount_paid ?? 0
    );

    const totalAmount = Number(
      invoice.total ?? 0
    );

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return ApiResponse.error(
        "Invalid payment amount.",
        400
      );
    }

    const newAmountPaid =
      currentAmountPaid +
      paymentAmount;

    const newBalanceDue = Math.max(
      totalAmount - newAmountPaid,
      0
    );

    let newStatus:
      | "Pending"
      | "Partially Paid"
      | "Paid";

    if (newBalanceDue <= 0) {
      newStatus = "Paid";
    } else if (newAmountPaid > 0) {
      newStatus = "Partially Paid";
    } else {
      newStatus = "Pending";
    }

    /*
     * =========================================================
     * CONFIRM PAYMENT
     * =========================================================
     */

    const {
      data: updatedPayment,
      error: updatePaymentError,
    } =
      await supabaseAdmin
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

    if (updatePaymentError) {
      throw updatePaymentError;
    }

    if (!updatedPayment) {
      return ApiResponse.error(
        "Payment was already processed or could not be confirmed.",
        409
      );
    }

    /*
     * =========================================================
     * UPDATE INVOICE
     * =========================================================
     */

    const {
      error: updateInvoiceError,
    } =
      await supabaseAdmin
        .from("invoices")
        .update({
          amount_paid: newAmountPaid,
          balance_due: newBalanceDue,
          status: newStatus,
        })
        .eq("id", invoice.id)
        .eq("owner_id", user.id);

    if (updateInvoiceError) {
      /*
       * Roll the payment back if
       * invoice update fails.
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

    return ApiResponse.success({
      success: true,

      paymentId: payment.id,

      invoiceId: invoice.id,

      invoiceNumber:
        invoice.invoice_number,

      paymentStatus: "completed",

      invoiceStatus: newStatus,

      paymentAmount,

      amountPaid: newAmountPaid,

      balanceDue: newBalanceDue,

      message:
        "Payment confirmed successfully.",
    });
  } catch (error) {
    console.error(
      "[UPI Confirm Received] Error:",
      error
    );

    return handleApiError(error);
  }
}