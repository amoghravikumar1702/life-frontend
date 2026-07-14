import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { razorpay } from "@/lib/server/razorpay";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { invoiceId } = await request.json();

    if (!invoiceId) {
      return ApiResponse.error("Invoice ID is required", 400);
    }

    // Fetch invoice
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return ApiResponse.error("Invoice not found", 404);
    }

    if (Number(invoice.balance_due) <= 0) {
      return ApiResponse.error(
        "Invoice is already fully paid",
        400
      );
    }

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: Math.round(Number(invoice.balance_due) * 100),
      currency: "INR",
      receipt: `invoice_${invoice.id}`,
      notes: {
        invoiceId: invoice.id.toString(),
        customer: invoice.customer,
      },
    });

    return ApiResponse.success(order);
  } catch (error) {
    return handleApiError(error);
  }
}