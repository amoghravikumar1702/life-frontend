"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveIndustry(industry: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("companies")
    .update({
      industry,
    })
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}