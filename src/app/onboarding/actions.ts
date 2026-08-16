"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveOnboardingData(
  industry: string,
  startingRevenue: number
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const cleanIndustry = industry.trim();
  const cleanRevenue = Number(startingRevenue);

  if (!cleanIndustry) {
    throw new Error("Please select your business industry.");
  }

  if (
    !Number.isFinite(cleanRevenue) ||
    cleanRevenue < 0
  ) {
    throw new Error(
      "Please enter a valid starting revenue."
    );
  }

  /*
   * IMPORTANT:
   *
   * This timestamp creates the financial boundary between:
   *
   * 1. Historical revenue entered during onboarding
   * 2. New revenue recorded after onboarding
   *
   * This prevents existing invoices from being blindly
   * added to the starting revenue.
   */

  const onboardingCompletedAt =
    new Date().toISOString();

  const { error } = await supabase
    .from("companies")
    .update({
      industry: cleanIndustry,
      starting_revenue: cleanRevenue,
      onboarding_completed_at:
        onboardingCompletedAt,
    })
    .eq("owner_id", user.id);

  if (error) {
    console.error(
      "[Onboarding] Failed to save business data:",
      error
    );

    throw new Error(
      "Unable to save your business information."
    );
  }

  redirect("/dashboard");
}

/*
 * ============================================================
 * LEGACY COMPATIBILITY
 * ============================================================
 */

export async function saveIndustry(
  industry: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const cleanIndustry = industry.trim();

  if (!cleanIndustry) {
    throw new Error(
      "Please select your business industry."
    );
  }

  const { error } = await supabase
    .from("companies")
    .update({
      industry: cleanIndustry,
    })
    .eq("owner_id", user.id);

  if (error) {
    console.error(
      "[Onboarding] Failed to save industry:",
      error
    );

    throw new Error(
      "Unable to save your business industry."
    );
  }

  redirect("/dashboard");
}