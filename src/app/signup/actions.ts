// src/app/signup/actions.ts

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(
  formData: FormData
): Promise<void> {
  const supabase =
    await createClient();

  const email = String(
    formData.get("email") ?? ""
  )
    .trim()
    .toLowerCase();

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

  const {
    data: authData,
    error: authError,
  } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (authError) {
    console.error(
      "[Signup] Auth signup failed:",
      authError
    );

    throw new Error(
      authError.message
    );
  }

  const user =
    authData.user;

  if (!user) {
    throw new Error(
      "Unable to create your account."
    );
  }

  /*
   * ------------------------------------------------------------
   * IMPORTANT
   * ------------------------------------------------------------
   *
   * We do NOT create a trial here.
   *
   * Trial creation only happens after:
   *
   * 1. Business onboarding
   * 2. Phone verification
   * 3. Trial eligibility check
   *
   * This prevents multiple emails from automatically
   * receiving multiple trials.
   */

  const {
    error: companyError,
  } =
    await supabase
      .from("companies")
      .insert({
        owner_id:
          user.id,

        company_name:
          "My Company",

        industry:
          null,

        starting_revenue:
          0,

        employee_count:
          0,
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

  redirect("/onboarding");
}