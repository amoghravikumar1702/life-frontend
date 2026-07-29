"use server";
import { createEvent } from "@/lib/events";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Customer } from "@/types/customer";

export async function createCustomerAction(customer: Customer) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const payload = {
    ...customer,
    owner_id: user.id,
  };

  const { data, error } = await supabase
    .from("customers")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
await createEvent({
  ownerId: user.id,

  type: "customer_created",

  title: "Customer Created",

  description: `${data.customer_name} was added to your customer list.`,

  entityType: "customer",

  entityId: data.id,

  severity: "success",

  metadata: {
    customerName: data.customer_name,
    email: data.email,
    phone: data.phone,
  },
});
  revalidatePath("/customers");
  revalidatePath("/dashboard");

  return data;
}