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
    console.error("Invoice Error:", invoiceError);
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
      console.error("Invoice Items Error:", itemsError);
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
  invoice: Partial<Invoice>,
  items?: InvoiceItem[]
) {
  // Update invoice
  const { data, error } = await supabase
    .from("invoices")
    .update(invoice)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update Invoice Error:", error);
    throw error;
  }

  // If items are provided, replace all existing items
  if (items) {
    // Delete old items
    const { error: deleteError } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", id);

    if (deleteError) {
      console.error("Delete Invoice Items Error:", deleteError);
      throw deleteError;
    }

    // Insert new items
    const invoiceItems = items.map((item) => ({
      invoice_id: id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    const { error: insertError } = await supabase
      .from("invoice_items")
      .insert(invoiceItems);

    if (insertError) {
      console.error("Insert Invoice Items Error:", insertError);
      throw insertError;
    }
  }

  return data;
}

export async function deleteInvoice(id: number) {
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) throw error;
}