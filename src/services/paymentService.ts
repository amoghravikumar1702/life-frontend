import { createClient } from "@/lib/supabase/client";
import { Payment } from "@/types/payment";
import { getInvoiceById } from "./invoiceService";

const supabase = createClient();

export async function createPayment(payment: Payment) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("payments")
    .insert({
      invoice_id: payment.invoice_id,
      amount: payment.amount,
      payment_method: payment.payment_method,
      payment_reference:
        payment.payment_reference ??
        `MAN-${Date.now()}`,
      payment_status:
        payment.payment_status ??
        "Completed",
      paid_at:
        payment.paid_at ??
        new Date().toISOString(),
      razorpay_order_id:
        payment.razorpay_order_id ??
        null,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Payment Insert Error:",
      error
    );
    throw error;
  }

  return data;
}

async function updateInvoicePaymentStatus(
  invoiceId: number,
  paymentAmount: number
) {
  const invoice =
    await getInvoiceById(invoiceId);

  const amountPaid =
    Number(invoice.amount_paid ?? 0) +
    Number(paymentAmount);

  const balanceDue =
    Number(invoice.total ?? 0) -
    amountPaid;

  let status = "Pending";

  if (balanceDue <= 0) {
    status = "Paid";
  } else if (amountPaid > 0) {
    status = "Partially Paid";
  }

  const { error } = await supabase
    .from("invoices")
    .update({
      amount_paid: amountPaid,
      balance_due: Math.max(
        balanceDue,
        0
      ),
      status,
    })
    .eq("id", invoiceId);

  if (error) {
    console.error(
      "Invoice Update Error:",
      error
    );
    throw error;
  }
}
export async function recordPayment(
  payment: Payment
) {
  console.log(
    "Recording payment:",
    payment
  );

  const createdPayment =
    await createPayment(payment);

  console.log(
    "Payment created:",
    createdPayment
  );

  await updateInvoicePaymentStatus(
    payment.invoice_id,
    Number(payment.amount)
  );

  console.log("Invoice updated.");

  return createdPayment;
}

export async function getPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("paid_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function getPaymentsByInvoice(
  invoiceId: number
) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("paid_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function deletePayment(
  id: number
) {
  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}
export async function collectPayment(
  invoiceId: number
) {
  const response = await fetch(
    "/api/payments/create-order",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        invoiceId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
        result.error ??
        "Failed to generate payment link."
    );
  }

  if (
    !result.data ||
    !result.data.paymentUrl
  ) {
    throw new Error(
      "Payment URL was not returned by the server."
    );
  }

  return {
    paymentUrl:
      result.data.paymentUrl,
  };
}