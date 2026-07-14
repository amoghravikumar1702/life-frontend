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
export async function recordPayment(payment: Payment) {
  // 1. Save payment
  await createPayment(payment);

  // 2. Read invoice
  const invoice = await getInvoiceById(payment.invoice_id);

  const amountPaid =
    Number(invoice.amount_paid) + Number(payment.amount);

  const balanceDue =
    Number(invoice.total) - amountPaid;

  let status = "Pending";

  if (balanceDue <= 0) {
    status = "Paid";
  } else if (amountPaid > 0) {
    status = "Partially Paid";
  }

  // 3. Update invoice
  const { error } = await supabase
    .from("invoices")
    .update({
      amount_paid: amountPaid,
      balance_due: Math.max(balanceDue, 0),
      status,
    })
    .eq("id", payment.invoice_id);

  if (error) throw error;
}
export async function getPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("payment_date", { ascending: false });

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
    .order("payment_date", {
      ascending: false,
    });

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