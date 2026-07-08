import { supabase } from "@/lib/supabase";
import { Invoice } from "@/types/invoice";

export type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

export async function createInvoice(
  invoice: Invoice,
  items: InvoiceItem[]
) {
  // Save Invoice
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .insert([invoice])
    .select()
    .single();

  if (invoiceError) {
    throw invoiceError;
  }

  // Save Invoice Items
  if (items.length > 0) {
    const invoiceItems = items.map((item) => ({
      invoice_id: invoiceData.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(invoiceItems);

    if (itemsError) {
      throw itemsError;
    }
  }

  return invoiceData;
}

export async function getInvoices() {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getInvoiceById(id: number) {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getInvoiceItems(invoiceId: number) {
  const { data, error } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId);

  if (error) throw error;

  return data;
}

export async function updateInvoice(
  id: number,
  invoice: Partial<Invoice>
) {
  const { data, error } = await supabase
    .from("invoices")
    .update(invoice)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteInvoice(id: number) {
  // invoice_items are deleted automatically
  // because of ON DELETE CASCADE

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) throw error;
}