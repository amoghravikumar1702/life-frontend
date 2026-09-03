import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type DhanarkOSAccessReason =
  | "trial"
  | "subscription"
  | "expired"
  | "missing";

export type DhanarkOSAccess = {
  allowed: boolean;
  reason: DhanarkOSAccessReason;
  trialEndsAt: string | null;
};

export async function getDhanarkOSAccess(): Promise<DhanarkOSAccess> {
  const supabase =
    await createClient();

  /*
   * ============================================================
   * AUTHENTICATION
   * ============================================================
   */

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (authError || !user) {
    console.error(
      "[DhanarkOS Access] Authentication failed:",
      authError
    );

    return {
      allowed: false,
      reason: "missing",
      trialEndsAt: null,
    };
  }

  /*
   * ============================================================
   * TRIAL / SUBSCRIPTION LOOKUP
   * ============================================================
   */

  const {
    data: trial,
    error: trialError,
  } =
    await supabase
      .from("dhanarkos_trials")
      .select(
        `
          id,
          user_id,
          trial_status,
          trial_ends_at,
          subscription_status,
          razorpay_subscription_id
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();

  if (trialError) {
    console.error(
      "[DhanarkOS Access] Trial lookup failed:",
      {
        message:
          trialError.message,

        code:
          trialError.code,

        details:
          trialError.details,

        hint:
          trialError.hint,
      }
    );

    throw new Error(
      "Unable to verify DhanarkOS subscription access."
    );
  }

  /*
   * ============================================================
   * NO ACCESS RECORD
   * ============================================================
   *
   * A user who has never started a trial/subscription belongs
   * on pricing.
   *
   * We deliberately do NOT send them to onboarding from here.
   */

  if (!trial) {
    return {
      allowed: false,
      reason: "missing",
      trialEndsAt: null,
    };
  }

  /*
   * ============================================================
   * ACTIVE PAID SUBSCRIPTION
   * ============================================================
   *
   * Paid access always takes priority over trial state.
   */

  if (
    trial.subscription_status ===
    "active"
  ) {
    return {
      allowed: true,
      reason: "subscription",
      trialEndsAt:
        trial.trial_ends_at,
    };
  }

  /*
   * ============================================================
   * ACTIVE FREE TRIAL
   * ============================================================
   */

  const trialEndsAtTimestamp =
    trial.trial_ends_at
      ? new Date(
          trial.trial_ends_at
        ).getTime()
      : NaN;

  const trialIsActive =
    trial.trial_status ===
      "trialing" &&
    Number.isFinite(
      trialEndsAtTimestamp
    ) &&
    trialEndsAtTimestamp >
      Date.now();

  if (trialIsActive) {
    return {
      allowed: true,
      reason: "trial",
      trialEndsAt:
        trial.trial_ends_at,
    };
  }

  /*
   * ============================================================
   * EXPIRED / NO LONGER ACTIVE
   * ============================================================
   */

  return {
    allowed: false,
    reason: "expired",
    trialEndsAt:
      trial.trial_ends_at,
  };
}

export async function requireDhanarkOSAccess() {
  const access =
    await getDhanarkOSAccess();

  /*
   * ============================================================
   * ACCESS GRANTED
   * ============================================================
   */

  if (access.allowed) {
    return access;
  }

  /*
   * ============================================================
   * NO SUBSCRIPTION / NO TRIAL
   * ============================================================
   *
   * Never send this state to onboarding.
   *
   * Correct flow:
   *
   * New account
   *      ↓
   * Pricing
   *      ↓
   * Razorpay
   *      ↓
   * Trial activated
   *      ↓
   * Onboarding
   *      ↓
   * Dashboard
   */

  if (
    access.reason ===
    "missing"
  ) {
    redirect("/pricing");
  }

  /*
   * ============================================================
   * EXPIRED TRIAL
   * ============================================================
   *
   * The user needs to choose a paid plan.
   */

  if (
    access.reason ===
    "expired"
  ) {
    redirect(
      "/billing-required"
    );
  }

  /*
   * ============================================================
   * FALLBACK
   * ============================================================
   */

  redirect("/pricing");
}