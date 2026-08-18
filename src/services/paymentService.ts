"use client";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/* =========================================================
   TYPES
========================================================= */

export type Payment = {
  id: number;
  invoice_id: number;
  owner_id: string;
  amount: number;
  payment_method: string;
  payment_reference: string | null;
  payment_status: string;
  paid_at: string | null;
  created_at?: string;
};

export type RecordPaymentInput = {
  invoiceId: number;
  amount: number;
  paymentMethod: string;
  paymentReference?: string | null;
  paymentStatus?: string;
};

export type CreatePaymentLinkResult = {
  paymentUrl: string;
  paymentToken?: string;
  expiresAt?: string | null;
};

/* =========================================================
   CREATE PAYMENT LINK
========================================================= */

export async function createPaymentLink(
  invoiceId: number
): Promise<CreatePaymentLinkResult> {
  if (!invoiceId || !Number.isInteger(invoiceId)) {
    throw new Error("Invalid invoice ID.");
  }

  const {
    data: {
      session,
    },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error("No active session found.");
  }

  const response = await fetch(
    "/api/payments/create-link",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        invoiceId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error ||
        result?.message ||
        "Unable to create payment link."
    );
  }

  const data =
    result?.data ?? result;

  const paymentUrl =
    data?.paymentUrl ??
    data?.payment_url;

  if (!paymentUrl) {
    throw new Error(
      "Payment link was created but no payment URL was returned."
    );
  }

  return {
    paymentUrl,
    paymentToken:
      data?.paymentToken ??
      data?.payment_token ??
      undefined,
    expiresAt:
      data?.expiresAt ??
      data?.expires_at ??
      null,
  };
}

/* =========================================================
   RECORD MANUAL PAYMENT
========================================================= */

export async function recordPayment(
  input: RecordPaymentInput
): Promise<Payment> {
  const {
    invoiceId,
    amount,
    paymentMethod,
    paymentReference = null,
    paymentStatus = "completed",
  } = input;

  if (
    !invoiceId ||
    !Number.isInteger(invoiceId)
  ) {
    throw new Error("Invalid invoice ID.");
  }

  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Payment amount must be greater than zero."
    );
  }

  if (!paymentMethod?.trim()) {
    throw new Error(
      "Payment method is required."
    );
  }

  /* ---------------------------------------------------------
     AUTH
  --------------------------------------------------------- */

  const {
    data: {
      session,
    },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error("No active session found.");
  }

  /* ---------------------------------------------------------
     LOAD INVOICE
  --------------------------------------------------------- */

  const {
    data: invoice,
    error: invoiceError,
  } = await supabase
    .from("invoices")
    .select(`
      id,
      owner_id,
      total,
      amount_paid,
      balance_due,
      status
    `)
    .eq("id", invoiceId)
    .eq("owner_id", session.user.id)
    .single();

  if (invoiceError) {
    throw invoiceError;
  }

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const total = Number(
    invoice.total ?? 0
  );

  const currentPaid = Number(
    invoice.amount_paid ?? 0
  );

  const currentBalance = Number(
    invoice.balance_due ?? 0
  );

  if (numericAmount > currentBalance + 0.01) {
    throw new Error(
      "Payment amount cannot exceed the invoice balance."
    );
  }

  /* ---------------------------------------------------------
     CALCULATE NEW INVOICE STATE
  --------------------------------------------------------- */

  const newAmountPaid =
    currentPaid + numericAmount;

  const newBalanceDue = Math.max(
    total - newAmountPaid,
    0
  );

  let newInvoiceStatus =
    "Partially Paid";

  if (newBalanceDue <= 0.01) {
    newInvoiceStatus = "Paid";
  }

  /* ---------------------------------------------------------
     INSERT PAYMENT
  --------------------------------------------------------- */

  const {
    data: payment,
    error: paymentError,
  } = await supabase
    .from("payments")
    .insert({
      invoice_id: invoiceId,

      owner_id:
        session.user.id,

      amount:
        numericAmount,

      payment_method:
        paymentMethod.trim(),

      payment_reference:
        paymentReference?.trim() ||
        null,

      payment_status:
        paymentStatus,

      paid_at:
        paymentStatus.toLowerCase() ===
        "completed"
          ? new Date().toISOString()
          : null,
    })
    .select()
    .single();

  if (paymentError) {
    console.error(
      "Record Payment Error:",
      paymentError
    );

    throw paymentError;
  }

  /* ---------------------------------------------------------
     UPDATE INVOICE
  --------------------------------------------------------- */

  const {
    error: invoiceUpdateError,
  } = await supabase
    .from("invoices")
    .update({
      amount_paid:
        newAmountPaid,

      balance_due:
        newBalanceDue,

      status:
        newInvoiceStatus,
    })
    .eq("id", invoiceId)
    .eq("owner_id", session.user.id);

  if (invoiceUpdateError) {
    /*
     * Roll back the payment if
     * invoice update fails.
     */

    await supabase
      .from("payments")
      .delete()
      .eq(
        "id",
        payment.id
      )
      .eq(
        "owner_id",
        session.user.id
      );

    console.error(
      "Invoice Payment Update Error:",
      invoiceUpdateError
    );

    throw invoiceUpdateError;
  }

  return payment as Payment;
}

/* =========================================================
   GET PAYMENTS FOR ONE INVOICE
========================================================= */

export async function getPaymentsForInvoice(
  invoiceId: number
): Promise<Payment[]> {
  if (
    !invoiceId ||
    !Number.isInteger(invoiceId)
  ) {
    throw new Error(
      "Invalid invoice ID."
    );
  }

  const {
    data: {
      session,
    },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error(
      "No active session found."
    );
  }

  const {
    data,
    error,
  } = await supabase
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
    .eq(
      "invoice_id",
      invoiceId
    )
    .eq(
      "owner_id",
      session.user.id
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(
      "Get Invoice Payments Error:",
      error
    );

    throw error;
  }

  return (data ?? []) as Payment[];
}

/* =========================================================
   ALIAS
   Keeps older components working.
========================================================= */

export async function getPaymentsByInvoice(
  invoiceId: number
): Promise<Payment[]> {
  return getPaymentsForInvoice(
    invoiceId
  );
}

/* =========================================================
   GET ALL PAYMENTS
========================================================= */

export async function getPayments(): Promise<
  Payment[]
> {
  const {
    data: {
      session,
    },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error(
      "No active session found."
    );
  }

  const {
    data,
    error,
  } = await supabase
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
    .eq(
      "owner_id",
      session.user.id
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    throw error;
  }

  return (data ?? []) as Payment[];
}

/* =========================================================
   DELETE PAYMENT
========================================================= */

export async function deletePayment(
  paymentId: number
) {
  if (
    !paymentId ||
    !Number.isInteger(paymentId)
  ) {
    throw new Error(
      "Invalid payment ID."
    );
  }

  const {
    data: {
      session,
    },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error(
      "No active session found."
    );
  }

  const {
    data: payment,
    error: paymentFetchError,
  } = await supabase
    .from("payments")
    .select(`
      id,
      invoice_id,
      owner_id,
      amount,
      payment_status
    `)
    .eq(
      "id",
      paymentId
    )
    .eq(
      "owner_id",
      session.user.id
    )
    .single();

  if (paymentFetchError) {
    throw paymentFetchError;
  }

  if (!payment) {
    throw new Error(
      "Payment not found."
    );
  }

  /* ---------------------------------------------------------
     DELETE PAYMENT
  --------------------------------------------------------- */

  const {
    error: deleteError,
  } = await supabase
    .from("payments")
    .delete()
    .eq(
      "id",
      paymentId
    )
    .eq(
      "owner_id",
      session.user.id
    );

  if (deleteError) {
    throw deleteError;
  }

  /* ---------------------------------------------------------
     RECALCULATE INVOICE
  --------------------------------------------------------- */

  const {
    data: invoice,
    error: invoiceError,
  } = await supabase
    .from("invoices")
    .select(`
      id,
      total
    `)
    .eq(
      "id",
      payment.invoice_id
    )
    .eq(
      "owner_id",
      session.user.id
    )
    .single();

  if (invoiceError) {
    throw invoiceError;
  }

  const {
    data: remainingPayments,
    error: remainingError,
  } = await supabase
    .from("payments")
    .select("amount")
    .eq(
      "invoice_id",
      payment.invoice_id
    )
    .eq(
      "owner_id",
      session.user.id
    )
    .in(
      "payment_status",
      [
        "completed",
        "Completed",
        "paid",
        "Paid",
        "success",
        "successful",
      ]
    );

  if (remainingError) {
    throw remainingError;
  }

  const amountPaid =
    (remainingPayments ?? []).reduce(
      (
        totalAmount,
        currentPayment
      ) =>
        totalAmount +
        Number(
          currentPayment.amount ?? 0
        ),
      0
    );

  const total = Number(
    invoice.total ?? 0
  );

  const balanceDue = Math.max(
    total - amountPaid,
    0
  );

  const status =
    balanceDue <= 0.01
      ? "Paid"
      : amountPaid > 0
      ? "Partially Paid"
      : "Pending";

  const {
    error: updateError,
  } = await supabase
    .from("invoices")
    .update({
      amount_paid:
        amountPaid,

      balance_due:
        balanceDue,

      status,
    })
    .eq(
      "id",
      payment.invoice_id
    )
    .eq(
      "owner_id",
      session.user.id
    );

  if (updateError) {
    throw updateError;
  }

  return true;
}

/* =========================================================
   CONFIRM CUSTOMER-REPORTED PAYMENT
========================================================= */

export async function confirmPaymentReceived(
  paymentId: number
) {
  if (
    !paymentId ||
    !Number.isInteger(paymentId)
  ) {
    throw new Error(
      "Invalid payment ID."
    );
  }

  const {
    data: {
      session,
    },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error(
      "No active session found."
    );
  }

  const response = await fetch(
    "/api/payments/confirm-received",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        paymentId,
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error ||
        result?.message ||
        "Unable to confirm payment."
    );
  }

  return (
    result?.data ??
    result
  );
}

/* =========================================================
   LEGACY COMPATIBILITY
   Some existing code may call collectPayment()
========================================================= */

export async function collectPayment(
  invoiceId: number
): Promise<CreatePaymentLinkResult> {
  return createPaymentLink(
    invoiceId
  );
}