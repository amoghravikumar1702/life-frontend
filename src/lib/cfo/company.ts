// src/lib/cfo/company.ts

import { createClient } from "@/lib/supabase/server";

/*
 * ============================================================
 * DhanarkOS AI CFO — COMPANY PROFILE
 * ============================================================
 *
 * IMPORTANT:
 *
 * This file only queries columns that currently exist in the
 * `companies` table.
 *
 * Current companies table:
 *
 * id
 * company_name
 * owner_name
 * email
 * phone
 * website
 * address
 * gst_number
 * bank_name
 * account_number
 * ifsc_code
 * upi_id
 * logo_url
 * created_at
 * owner_id
 * industry
 * employee_count
 * starting_revenue
 * onboarding_completed_at
 *
 * Do NOT request columns that do not exist in the database.
 * ============================================================
 */

export type CompanyProfile = {
  id: string;

  name: string;

  industry: string;

  businessModel: string;

  yearsInBusiness: number;

  employees: number;

  annualRevenue: number;

  monthlyRevenue: number;

  monthlyExpenses: number;

  businessGoal: string;

  growthStage: string;

  riskAppetite: string;
};

/*
 * ============================================================
 * SAFE NUMBER
 * ============================================================
 */

function safeNumber(
  value: unknown,
  fallback = 0
): number {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

/*
 * ============================================================
 * SAFE TEXT
 * ============================================================
 */

function safeText(
  value: unknown,
  fallback = ""
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed || fallback;
}

/*
 * ============================================================
 * GET COMPANY PROFILE
 * ============================================================
 */

export async function getCompanyProfile(): Promise<CompanyProfile> {
  const supabase = await createClient();

  /*
   * ==========================================================
   * AUTHENTICATION
   * ==========================================================
   */

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error(
      "[AI CFO] Auth error:",
      authError
    );

    throw new Error(
      "Unable to verify your account."
    );
  }

  if (!user) {
    throw new Error(
      "Unauthorized."
    );
  }

  /*
   * ==========================================================
   * LOAD COMPANY
   * ==========================================================
   *
   * IMPORTANT:
   *
   * These are ONLY columns that exist in the current
   * `companies` table.
   */

  const {
    data: company,
    error: companyError,
  } = await supabase
    .from("companies")
    .select(`
      id,
      company_name,
      industry,
      employee_count,
      starting_revenue,
      owner_id,
      onboarding_completed_at
    `)
    .eq("owner_id", user.id)
    .maybeSingle();

  /*
   * ==========================================================
   * DATABASE ERROR
   * ==========================================================
   */

  if (companyError) {
    console.error(
      "[AI CFO] Company query failed:",
      {
        userId: user.id,
        code: companyError.code,
        message: companyError.message,
        details: companyError.details,
        hint: companyError.hint,
      }
    );

    throw new Error(
      "Unable to load your business profile."
    );
  }

  /*
   * ==========================================================
   * COMPANY NOT FOUND
   * ==========================================================
   */

  if (!company) {
    console.error(
      "[AI CFO] No company found for authenticated user:",
      user.id
    );

    throw new Error(
      "Company profile not found. Please complete onboarding."
    );
  }

  /*
   * ==========================================================
   * COMPANY NAME
   * ==========================================================
   */

  const companyName =
    safeText(
      company.company_name,
      "Your Business"
    );

  /*
   * ==========================================================
   * INDUSTRY
   * ==========================================================
   */

  const industry =
    safeText(
      company.industry,
      "General"
    );

  /*
   * ==========================================================
   * EMPLOYEES
   * ==========================================================
   */

  const employees =
    Math.max(
      0,
      Math.floor(
        safeNumber(
          company.employee_count,
          0
        )
      )
    );

  /*
   * ==========================================================
   * STARTING / ANNUAL REVENUE
   * ==========================================================
   *
   * The current database calls this `starting_revenue`.
   *
   * Until a dedicated annual revenue field exists, this is
   * exposed to the CFO as the company's recorded starting
   * revenue.
   */

  const annualRevenue =
    Math.max(
      0,
      safeNumber(
        company.starting_revenue,
        0
      )
    );

  /*
   * ==========================================================
   * RETURN NORMALIZED COMPANY PROFILE
   * ==========================================================
   *
   * Fields that are NOT currently stored in the companies
   * table receive safe defaults.
   *
   * This keeps the AI CFO compatible with the existing
   * ExecutiveReport type without pretending those fields
   * exist in the database.
   */

  return {
    id: String(company.id),

    name: companyName,

    industry,

    businessModel:
      "Unknown",

    yearsInBusiness:
      0,

    employees,

    annualRevenue,

    monthlyRevenue:
      0,

    monthlyExpenses:
      0,

    businessGoal:
      "Grow Revenue",

    growthStage:
      "Startup",

    riskAppetite:
      "Medium",
  };
}