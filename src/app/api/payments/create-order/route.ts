import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { razorpay } from "@/lib/server/razorpay";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(request: NextRequest) {
  try {
    const { invoiceId } = await request.json();

    if (!invoiceId) {
      return ApiResponse.error("Invoice ID is required", 400);
    }

    const { data: invoice, error } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("id", Number(invoiceId))
      .maybeSingle();

    if (error || !invoice) {
      console.error("Invoice lookup failed:", error);
      return ApiResponse.error("Invoice not found", 404);
    }

    if (
      invoice.status === "Paid" ||
      Number(invoice.balance_due) <= 0
    ) {
      return ApiResponse.error(
        "Invoice is already fully paid",
        400
      );
    }

    if (
      invoice.payment_token_expires_at &&
      new Date(invoice.payment_token_expires_at) < new Date()
    ) {
      await supabaseAdmin
        .from("invoices")
        .update({
          payment_token: null,
          payment_token_expires_at: null,
        })
        .eq("id", invoice.id);
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(invoice.balance_due) * 100),
      currency: invoice.currency ?? "INR",
      receipt: `invoice_${invoice.id}`,
      notes: {
        invoiceId: String(invoice.id),
        customer: String(invoice.customer),
      },
    });

    const { error: updateError } = await supabaseAdmin
      .from("invoices")
      .update({
        razorpay_order_id: order.id,
      })
      .eq("id", invoice.id);

    if (updateError) {
      console.error(updateError);

      return ApiResponse.error(
        "Failed to save Razorpay order",
        500
      );
    }

    return ApiResponse.success(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return handleApiError(error);
  }
}