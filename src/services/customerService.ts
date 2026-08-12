import { createClient } from "@/lib/supabase/client";
import { Customer } from "@/types/customer";

// Initialize supabase client
const supabase = createClient();


// ============================
// CREATE CUSTOMER
// ============================
export async function createCustomer(customer: Customer) {
  // Check browser session
  const sessionResult = await supabase.auth.getSession();

  console.log("=================================");
  console.log("SESSION:", sessionResult.data.session);
  console.log("SESSION ERROR:", sessionResult.error);
  console.log("=================================");

  // Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("USER:", user);
  console.log("USER ERROR:", userError);

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  const payload = {
    ...customer,
    owner_id: user.id,
  };

  console.log("INSERT PAYLOAD:", payload);

  const { data, error } = await supabase
    .from("customers")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("SUPABASE INSERT ERROR:", error);
    throw error;
  }

  console.log("CUSTOMER CREATED:", data);

  return data;
}

// ============================
// GET ALL CUSTOMERS
// ============================
export async function getCustomers() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  console.log("GET CUSTOMERS SESSION:", session);
  console.log("GET CUSTOMERS SESSION ERROR:", sessionError);

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error("No active session found.");
  }

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("owner_id", session.user.id)
    .order("created_at", { ascending: false });

  console.log("CUSTOMERS DATA:", data);
  console.log("CUSTOMERS ERROR:", error);

  if (error) {
    throw error;
  }

  return data;
}
// ============================
// GET CUSTOMER BY ID
// ============================
export async function getCustomerById(id: number) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("GET CUSTOMER ERROR:", error);
    throw error;
  }

  return data;
}

// ============================
// UPDATE CUSTOMER
// ============================
export async function updateCustomer(
  id: number,
  customer: Partial<Customer>
) {
  const { data, error } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE CUSTOMER ERROR:", error);
    throw error;
  }

  return data;
}

// ============================
// DELETE CUSTOMER
// ============================
export async function deleteCustomer(id: number) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE CUSTOMER ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    if (
      error.message.includes("violates foreign key constraint")
    ) {
      throw new Error(
        "This customer has existing invoices and cannot be deleted. Delete the invoices first or archive the customer."
      );
    }

    throw new Error(
      error.message || "Failed to delete customer."
    );
  }
}