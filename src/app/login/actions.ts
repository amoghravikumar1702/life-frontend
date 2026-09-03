"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(
  formData: FormData
): Promise<void> {
  const supabase = await createClient();

  const email = String(
    formData.get("email") ?? ""
  ).trim();

  const password = String(
    formData.get("password") ?? ""
  );

  const redirectTo = String(
    formData.get("redirect") ?? ""
  ).trim();

  if (!email || !password) {
    throw new Error(
      "Email and password are required."
    );
  }

  /*
   * ============================================================
   * SIGN IN
   * ============================================================
   */

  const {
    data,
    error,
  } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    console.error(
      "[Login] Sign-in failed:",
      error.message
    );

    throw new Error(error.message);
  }

  if (!data.session || !data.user) {
    throw new Error(
      "Login succeeded but no session was created. Please try again."
    );
  }

  const userId = data.user.id;

  console.log(
    "[Login] Successful:",
    userId
  );

  /*
   * ============================================================
   * CHECK EXISTING TRIAL / SUBSCRIPTION
   * ============================================================
   */

  const {
    data: trial,
    error: trialError,
  } =
    await supabase
      .from("dhanarkos_trials")
      .select(
        "id, trial_status, subscription_status, razorpay_subscription_id"
      )
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();

  /*
   * If trial lookup fails, don't destroy a valid login.
   */

  if (trialError) {
    console.error(
      "[Login] Trial lookup failed:",
      trialError
    );

    redirect(
      isSafeRedirect(redirectTo)
        ? redirectTo
        : "/dashboard"
    );
  }

  /*
   * ============================================================
   * EXISTING ACCOUNT
   * ============================================================
   */

  if (trial) {
    console.log(
      "[Login] Existing DhanarkOS trial found."
    );

    redirect(
      isSafeRedirect(redirectTo)
        ? redirectTo
        : "/dashboard"
    );
  }

  /*
   * ============================================================
   * NEW ACCOUNT
   * ============================================================
   */

  console.log(
    "[Login] No DhanarkOS trial found. Sending to pricing."
  );

  redirect("/pricing");
}

/*
 * ============================================================
 * SAFE REDIRECT
 * ============================================================
 *
 * Only allow internal paths.
 * Prevents open-redirect vulnerabilities.
 */

function isSafeRedirect(
  value: string
): boolean {
  if (!value) {
    return false;
  }

  if (!value.startsWith("/")) {
    return false;
  }

  if (value.startsWith("//")) {
    return false;
  }

  if (
    value.startsWith("/login") ||
    value.startsWith("/signup")
  ) {
    return false;
  }

  return true;
}