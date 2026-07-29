import { createClient } from "@/lib/supabase/server";
import { CompanyProfile } from "./types";

export async function getCompanyProfile(): Promise<CompanyProfile> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: user.id,

    name: company.company_name ?? "My Company",

    industry: company.industry ?? "General",

    businessModel:
      company.business_model ?? "Unknown",

    yearsInBusiness:
      company.years_in_business ?? 1,

    employees:
      company.employee_count ?? 1,

    annualRevenue:
      company.annual_revenue ?? 0,

    monthlyRevenue: 0,

    monthlyExpenses: 0,

    businessGoal:
      company.business_goal ??
      "Grow Revenue",

    growthStage:
      company.growth_stage ??
      "Startup",

    riskAppetite:
      company.risk_appetite ??
      "Medium",
  };
}