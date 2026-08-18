import { createClient } from "@/lib/supabase/client";
import { Invoice } from "@/types/invoice";

const supabase = createClient();

export type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

export type InvoicePayment = {
  id: number;
  amount: number;
  payment_method: string;
  payment_reference: string;
  payment_status: string;
  paid_at: string | null;
  created_at?: string;
};

/*
|--------------------------------------------------------------------------
| CREATE INVOICE
|--------------------------------------------------------------------------
*/

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

  const {
    data: latestInvoice,
    error: latestInvoiceError,
  } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("owner_id", user.id)
    .like("invoice_number", `INV-${year}-%`)
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (latestInvoiceError) {
    throw latestInvoiceError;
  }

  let nextNumber = 1;

  if (latestInvoice?.invoice_number) {
    const parts =
      latestInvoice.invoice_number.split("-");

    const lastNumber = Number(parts.at(-1));

    if (
      Number.isFinite(lastNumber) &&
      lastNumber > 0
    ) {
      nextNumber = lastNumber + 1;
    }
  }

  const generatedInvoiceNumber =
    `INV-${year}-${String(nextNumber).padStart(2, "0")}`;

  const invoiceToSave = {
    ...invoice,
    invoice_number: generatedInvoiceNumber,
    amount_paid: 0,
    balance_due: Number(invoice.total ?? 0),
    owner_id: user.id,
  };

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

  if (items.length > 0) {
    const invoiceItems = items.map((item) => ({
      invoice_id: invoiceData.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
      total:
        Number(item.quantity) *
        Number(item.price),
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

/*
|--------------------------------------------------------------------------
| GET ALL INVOICES
|--------------------------------------------------------------------------
*/

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
    .eq("owner_id", session.user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/*
|--------------------------------------------------------------------------
| GET SINGLE INVOICE
|--------------------------------------------------------------------------
*/

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
    .eq("owner_id", session.user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| GET INVOICE ITEMS
|--------------------------------------------------------------------------
*/

export async function getInvoiceItems(
  invoiceId: number
) {
  const {
    data,
    error,
  } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("id", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/*
|--------------------------------------------------------------------------
| GET INVOICE PAYMENTS
|--------------------------------------------------------------------------
*/

export async function getInvoicePayments(
  invoiceId: number
): Promise<InvoicePayment[]> {
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

  /*
   * First verify that this invoice belongs
   * to the currently authenticated business.
   */

  const {
    data: invoice,
    error: invoiceError,
  } = await supabase
    .from("invoices")
    .select("id")
    .eq("id", invoiceId)
    .eq("owner_id", session.user.id)
    .maybeSingle();

  if (invoiceError) {
    throw invoiceError;
  }

  if (!invoice) {
    throw new Error(
      "Invoice not found or access denied."
    );
  }

  /*
   * Now retrieve payments belonging to
   * this invoice and this business.
   */

  const {
    data,
    error,
  } = await supabase
    .from("payments")
    .select(`
      id,
      amount,
      payment_method,
      payment_reference,
      payment_status,
      paid_at,
      created_at
    `)
    .eq("invoice_id", invoiceId)
    .eq("owner_id", session.user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Get Invoice Payments Error:",
      error
    );

    throw error;
  }

  return (data ?? []) as InvoicePayment[];
}

/*
|--------------------------------------------------------------------------
| UPDATE INVOICE
|--------------------------------------------------------------------------
*/

export async function updateInvoice(
  id: number,
  invoice: Partial<Invoice>,
  items?: InvoiceItem[]
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
    .update(invoice)
    .eq("id", id)
    .eq("owner_id", session.user.id)
    .select()
    .single();

  if (error) {
    console.error(
      "Update Invoice Error:",
      error
    );

    throw error;
  }

  /*
   * Replace invoice items if supplied.
   */

  if (items) {
    const {
      error: deleteError,
    } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", id);

    if (deleteError) {
      console.error(
        "Delete Invoice Items Error:",
        deleteError
      );

      throw deleteError;
    }

    if (items.length > 0) {
      const invoiceItems = items.map((item) => ({
        invoice_id: id,
        item_name: item.name,
        quantity: item.quantity,
        price: item.price,
        total:
          Number(item.quantity) *
          Number(item.price),
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
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| DELETE INVOICE
|--------------------------------------------------------------------------
*/

export async function deleteInvoice(
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

  /*
   * Delete invoice items first.
   */

  const {
    error: itemsError,
  } = await supabase
    .from("invoice_items")
    .delete()
    .eq("invoice_id", id);

  if (itemsError) {
    console.error(
      "Delete Invoice Items Error:",
      itemsError
    );

    throw itemsError;
  }

  /*
   * Delete invoice.
   */

  const {
    error: invoiceError,
  } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("owner_id", session.user.id);

  if (invoiceError) {
    console.error(
      "Delete Invoice Error:",
      invoiceError
    );

    throw invoiceError;
  }
}