import { NextRequest } from "next/server";
import crypto from "crypto";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
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

    // Generate secure payment token
    const paymentToken = `fz_${crypto.randomBytes(16).toString("hex")}`;

    // Save token
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        payment_token: paymentToken,
      })
      .eq("id", invoice.id);

    if (updateError) {
      return ApiResponse.error(
        "Failed to generate payment link",
        500
      );
    }

    return ApiResponse.success({
      paymentUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${paymentToken}`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}