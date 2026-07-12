import { supabase } from "@/lib/supabase";
import { Customer } from "@/types/customer";

// Create Customer
export async function createCustomer(customer: Customer) {
  const { data, error } = await supabase
    .from("customers")
    .insert([customer])
    .select()
    .single();

  if (error) {
    console.error("Create Customer Error:", error);
    throw error;
  }

  return data;
}

// Get All Customers
export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get Customers Error:", error);
    throw error;
  }

  return data;
}

// Get Customer By ID
export async function getCustomerById(id: number) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Get Customer Error:", error);
    throw error;
  }

  return data;
}

// Update Customer
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
    console.error("Update Customer Error:", error);
    throw error;
  }

  return data;
}

// Delete Customer
export async function deleteCustomer(id: number) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete Customer Error:", error);
    throw error;
  }
}