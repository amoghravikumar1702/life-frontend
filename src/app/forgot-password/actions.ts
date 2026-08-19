"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendPasswordReset(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    throw new Error("Please enter your email address.");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo:
        "http://localhost:3000/reset-password",
    }
  );

  if (error) {
    console.error(
      "[Forgot Password] Error:",
      error
    );

    throw new Error(
      "Unable to send password reset email."
    );
  }

  redirect("/forgot-password?sent=true");
}