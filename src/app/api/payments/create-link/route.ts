import crypto from "crypto";
import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(request: NextRequest) {
  try {
    /*
     * =========================================================
     * AUTHENTICATION
     * =========================================================
     *
     * The client sends the Supabase access token through:
     *
     * Authorization: Bearer <access_token>
     *
     * We validate that token server-side using Supabase.
     */

    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return ApiResponse.error(
        "Unauthorized",
        401
      );
    }

    const accessToken =
      authorization.substring(7).trim();

    if (!accessToken) {
      return ApiResponse.error(
        "Unauthorized",
        401
      );
    }

    const {
      data: {
        user,
      },
      error: authError,
    } = await supabaseAdmin.auth.getUser(
      accessToken
    );

    if (authError || !user) {
      console.error(
        "Payment link authentication failed:",
        authError
      );

      return ApiResponse.error(
        "Unauthorized",
        401
      );
    }

    /*
     * =========================================================
     * INPUT
     * =========================================================
     */

    const {
      invoiceId,
    } = await request.json();

    const id = Number(invoiceId);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return ApiResponse.error(
        "Invalid invoice ID",
        400
      );
    }

    /*
     * =========================================================
     * LOAD INVOICE
     * =========================================================
     *
     * IMPORTANT:
     * The invoice MUST belong to the authenticated user.
     */

    const {
      data: invoice,
      error,
    } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "Invoice lookup failed:",
        error
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

    /*
     * =========================================================
     * PAYMENT STATE
     * =========================================================
     */

    if (
      invoice.status === "Paid" ||
      Number(invoice.balance_due) <= 0
    ) {
      return ApiResponse.error(
        "Invoice is already fully paid",
        400
      );
    }

    /*
     * =========================================================
     * PAYMENT TOKEN
     * =========================================================
     */

    let token =
      invoice.payment_token;

    const expired =
      invoice.payment_token_expires_at &&
      new Date(
        invoice.payment_token_expires_at
      ) < new Date();

    if (!token || expired) {
      token =
        crypto
          .randomBytes(32)
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
        )
        .eq(
          "owner_id",
          user.id
        );

      if (updateError) {
        console.error(
          "Payment token update failed:",
          updateError
        );

        return ApiResponse.error(
          "Failed to create payment link",
          500
        );
      }
    }

    /*
     * =========================================================
     * PAYMENT URL
     * =========================================================
     */

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