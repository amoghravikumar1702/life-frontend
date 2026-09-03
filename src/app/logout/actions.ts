"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logout(): Promise<never> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[Logout] Sign-out failed:", error);
    throw new Error("Unable to sign out.");
  }

  redirect("/login");
}