import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function GET() {
  try {
    /*
     * =========================================================
     * AUTHENTICATE BUSINESS OWNER
     * =========================================================
     */

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    /*
     * =========================================================
     * LOAD PENDING PAYMENTS
     * =========================================================
     */

    const {
      data: payments,
      error: paymentsError,
    } = await supabaseAdmin
      .from("payments")
      .select(`
        id,
        invoice_id,
        owner_id,
        amount,
        payment_method,
        payment_reference,
        payment_status,
        paid_at,
        created_at
      `)
      .eq("owner_id", user.id)
      .in("payment_status", [
        "pending",
        "Pending",
      ])
      .order("created_at", {
        ascending: false,
      });

    if (paymentsError) {
      console.error(
        "[PENDING PAYMENTS] Query error:",
        paymentsError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load pending payments.",
        },
        { status: 500 }
      );
    }

    if (!payments?.length) {
      return NextResponse.json({
        payments: [],
      });
    }

    /*
     * =========================================================
     * LOAD INVOICES
     * =========================================================
     */

    const invoiceIds = [
      ...new Set(
        payments.map(
          (payment) =>
            payment.invoice_id
        )
      ),
    ];

    const {
      data: invoices,
      error: invoicesError,
    } = await supabaseAdmin
      .from("invoices")
      .select(`
        id,
        invoice_number
      `)
      .in("id", invoiceIds)
      .eq("owner_id", user.id);

    if (invoicesError) {
      throw invoicesError;
    }

    const invoiceMap = new Map(
      (invoices ?? []).map(
        (invoice) => [
          invoice.id,
          invoice.invoice_number,
        ]
      )
    );

    const result = payments.map(
      (payment) => ({
        id: payment.id,
        invoice_id:
          payment.invoice_id,
        amount: Number(
          payment.amount ?? 0
        ),
        payment_method:
          payment.payment_method ||
          "UPI",
        payment_reference:
          payment.payment_reference ??
          null,
        payment_status:
          payment.payment_status,
        created_at:
          payment.created_at ?? null,
        invoice_number:
          invoiceMap.get(
            payment.invoice_id
          ) ??
          `Invoice #${payment.invoice_id}`,
      })
    );

    return NextResponse.json({
      payments: result,
    });
  } catch (error) {
    console.error(
      "[PENDING PAYMENTS] Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load pending payments.",
      },
      { status: 500 }
    );
  }
}