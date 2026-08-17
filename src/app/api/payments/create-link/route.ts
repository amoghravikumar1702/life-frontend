import crypto from "crypto";
import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(
  request: NextRequest
) {
  try {
    const {
      invoiceId,
    } = await request.json();

    const id =
      Number(invoiceId);

    if (!id) {
      return ApiResponse.error(
        "Invoice ID is required",
        400
      );
    }

    const {
      data: invoice,
      error,
    } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
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
      return ApiResponse.error(
        "Invoice is already fully paid",
        400
      );
    }

    let token =
      invoice.payment_token;

    const expired =
      invoice.payment_token_expires_at &&
      new Date(
        invoice.payment_token_expires_at
      ) < new Date();

    if (!token || expired) {
      token =
        crypto.randomBytes(32)
          .toString("hex");

      const expiresAt =
        new Date(
          Date.now() +
            7 *
              24 *
              60 *
              60 *
              1000
        ).toISOString();

      const {
        error: updateError,
      } = await supabaseAdmin
        .from("invoices")
        .update({
          payment_token:
            token,

          payment_token_expires_at:
            expiresAt,
        })
        .eq(
          "id",
          invoice.id
        );

      if (updateError) {
        throw updateError;
      }
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const paymentUrl =
      `${baseUrl}/pay/${token}`;

    return ApiResponse.success({
      paymentUrl,
      invoiceId:
        invoice.id,
      invoiceNumber:
        invoice.invoice_number,
      balanceDue:
        Number(
          invoice.balance_due
        ),
    });
  } catch (error) {
    console.error(
      "CREATE PAYMENT LINK ERROR:",
      error
    );

    return handleApiError(
      error
    );
  }
}