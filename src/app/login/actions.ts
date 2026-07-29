"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  console.log("========== LOGIN ATTEMPT ==========");
  console.log("Email:", email);

  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("========== LOGIN RESULT ==========");
  console.log("Error:", result.error);
  console.log("Has User:", !!result.data.user);
  console.log("Has Session:", !!result.data.session);

  if (result.data.session) {
    console.log(
      "Access Token Length:",
      result.data.session.access_token.length
    );
  }

  console.log("==================================");

  if (result.error) {
    throw new Error(result.error.message);
  }

  console.log("LOGIN SUCCESS");
  console.log("REDIRECTING TO DASHBOARD...");

  redirect("/dashboard");
}