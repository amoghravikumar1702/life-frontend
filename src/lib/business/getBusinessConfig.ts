import { createClient } from "@/lib/supabase/server";
import { getBusinessConfig } from "@/config/business";

export async function getCurrentBusinessConfig() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data: company, error } = await supabase
    .from("companies")
    .select("industry")
    .eq("owner_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return getBusinessConfig(company?.industry);
}