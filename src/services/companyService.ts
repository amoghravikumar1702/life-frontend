import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
import { Company } from "@/types/company";

// Get the company profile
export async function getCompany(): Promise<Company | null> {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .limit(1)
    .single();

  // If no company exists yet, return null
  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    console.error("Get Company Error:", error);
    throw error;
  }

  return data;
}

// Create company profile
export async function createCompany(
  company: Company
): Promise<Company> {
  const { data, error } = await supabase
    .from("companies")
    .insert([company])
    .select()
    .single();

  if (error) {
   console.error("Create Company Error:", JSON.stringify(error, null, 2));
console.error(error);
   throw new Error(error.message);
  }

  return data;
}

// Update company profile
export async function updateCompany(
  id: number,
  company: Partial<Company>
): Promise<Company> {
  const { data, error } = await supabase
    .from("companies")
    .update(company)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update Company Error:", error);
    throw error;
  }

  return data;
}