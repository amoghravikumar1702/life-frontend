import { supabase } from "@/lib/supabase";
import { Payment } from "@/types/payment";
import { getInvoiceById } from "./invoiceService";

export async function createPayment(payment: Payment) {
  const { data, error } = await supabase
    .from("payments")
    .insert([payment])
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function updateInvoicePaymentStatus(
  invoiceId: number,
  paymentAmount: number
) {
  const invoice = await getInvoiceById(invoiceId);

  const amountPaid =
    Number(invoice.amount_paid) + Number(paymentAmount);

  const balanceDue =
    Number(invoice.total) - amountPaid;

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
      balance_due: Math.max(balanceDue, 0),
      status,
    })
    .eq("id", invoiceId);

  if (error) throw error;
}

export async function recordPayment(payment: Payment) {
  // Save payment
  await createPayment(payment);

  // Update invoice
  await updateInvoicePaymentStatus(
    payment.invoice_id,
    Number(payment.amount)
  );
}

export async function getPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("paid_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getPaymentsByInvoice(
  invoiceId: number
) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("paid_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function deletePayment(id: number) {
  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return {
    success: true,
  };
}