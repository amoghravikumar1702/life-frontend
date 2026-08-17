"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const email = String(
    formData.get("email") ?? ""
  ).trim();

  const password = String(
    formData.get("password") ?? ""
  );

  if (!email || !password) {
    throw new Error(
      "Email and password are required."
    );
  }

  if (password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters."
    );
  }

  /*
   * ============================================================
   * CREATE AUTH USER
   * ============================================================
   */

  const {
    data: authData,
    error: authError,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error(
      "[Signup] Auth signup failed:",
      authError
    );

    throw new Error(authError.message);
  }

  const user = authData.user;

  if (!user) {
    throw new Error(
      "Unable to create your account."
    );
  }

  /*
   * ============================================================
   * CREATE COMPANY
   * ============================================================
   *
   * Every ArkenOne user must have exactly one company.
   *
   * Onboarding will populate the business-specific
   * information later.
   */

  const {
    error: companyError,
  } = await supabase
    .from("companies")
    .insert({
      owner_id: user.id,
      company_name: "My Company",
      industry: null,
      starting_revenue: 0,
      employee_count: 0,
    });

  if (companyError) {
    console.error(
      "[Signup] Failed to create company:",
      companyError
    );

    throw new Error(
      "Account created, but we could not create your business profile."
    );
  }

  /*
   * ============================================================
   * CONTINUE TO ONBOARDING
   * ============================================================
   */

  redirect("/onboarding");
}