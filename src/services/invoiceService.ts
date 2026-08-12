import { createClient } from "@/lib/supabase/client";
import { Invoice } from "@/types/invoice";

const supabase = createClient();

export type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

export async function createInvoice(
  invoice: Invoice,
  items: InvoiceItem[]
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No authenticated user found.");
  }

  const year = new Date().getFullYear();

  const { data: latestInvoice } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("owner_id", user.id)
    .like(
      "invoice_number",
      `INV-${year}-%`
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  let nextNumber = 1;

if (latestInvoice?.invoice_number) {
  const parts =
    latestInvoice.invoice_number.split("-");

  const lastNumber =
    Number(parts.at(-1));

  if (!Number.isNaN(lastNumber)) {
    nextNumber = lastNumber + 1;
  }
}

  const generatedInvoiceNumber =
    `INV-${year}-${String(
      nextNumber
    ).padStart(2, "0")}`;

  const invoiceToSave = {
    ...invoice,

    invoice_number:
      generatedInvoiceNumber,

    amount_paid: 0,

    balance_due:
      invoice.total,

    owner_id:
      user.id,
  };
    // Save Invoice
  const {
    data: invoiceData,
    error: invoiceError,
  } = await supabase
    .from("invoices")
    .insert([invoiceToSave])
    .select()
    .single();

  if (invoiceError) {
    console.error(
      "Invoice Error:",
      invoiceError
    );
    throw invoiceError;
  }

  // Save Invoice Items
  if (items.length > 0) {

    const invoiceItems =
      items.map((item) => ({
        invoice_id:
          invoiceData.id,

        item_name:
          item.name,

        quantity:
          item.quantity,

        price:
          item.price,

        total:
          item.quantity *
          item.price,
      }));

    const {
      error: itemsError,
    } = await supabase
      .from("invoice_items")
      .insert(invoiceItems);

    if (itemsError) {
      console.error(
        "Invoice Items Error:",
        itemsError
      );

      throw itemsError;
    }
  }

  return invoiceData;
}

export async function getInvoices() {
  const {
    data: { session },
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
    .from("invoices")
    .select("*")
    .eq(
      "owner_id",
      session.user.id
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}
export async function getInvoiceById(
  id: number
) {
  const {
    data: { session },
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
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getInvoiceItems(
  invoiceId: number
) {
  const {
    data,
    error,
  } = await supabase
    .from("invoice_items")
    .select("*")
    .eq(
      "invoice_id",
      invoiceId
    );

  if (error) {
    throw error;
  }

  return data;
}

export async function updateInvoice(
  id: number,
  invoice: Partial<Invoice>,
  items?: InvoiceItem[]
) {
  const {
    data,
    error,
  } = await supabase
    .from("invoices")
    .update(invoice)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    alert(
      "REAL UPDATE ERROR: " +
        String(error?.message) +
        " | code: " +
        String(error?.code) +
        " | details: " +
        String(error?.details)
    );

    console.error(
      "Update Invoice Error:",
      error
    );

    throw error;
  }

  if (items) {
    const {
      error: deleteError,
    } = await supabase
      .from("invoice_items")
      .delete()
      .eq(
        "invoice_id",
        id
      );

    if (deleteError) {
      console.error(
        "Delete Invoice Items Error:",
        deleteError
      );

      throw deleteError;
    }

    const invoiceItems =
      items.map((item) => ({
        invoice_id: id,

        item_name:
          item.name,

        quantity:
          item.quantity,

        price:
          item.price,

        total:
          item.quantity *
          item.price,
      }));
          const {
      error: insertError,
    } = await supabase
      .from("invoice_items")
      .insert(invoiceItems);

    if (insertError) {
      console.error(
        "Insert Invoice Items Error:",
        insertError
      );

      throw insertError;
    }
  }

  return data;
}
export async function deleteInvoice(
  id: number
) {

  // Delete all invoice items first
  const {
    error: itemsError,
  } = await supabase
    .from("invoice_items")
    .delete()
    .eq(
      "invoice_id",
      id
    );

  if (itemsError) {
    console.error(
      "Delete Invoice Items Error:",
      itemsError
    );

    throw itemsError;
  }

  // Delete the invoice
  const {
    error: invoiceError,
  } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (invoiceError) {
    console.error(
      "Delete Invoice Error:",
      invoiceError
    );

    throw invoiceError;
  }
}
