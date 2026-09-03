import { redirect } from "next/navigation";

import DashboardV2 from "@/components/Dashboard/DashboardV2";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const {
    data: company,
    error: companyError,
  } =
    await supabase
      .from("companies")
      .select(
        "id, owner_id, industry"
      )
      .eq(
        "owner_id",
        user.id
      )
      .maybeSingle();

  /*
   * A missing company means onboarding
   * has not been completed.
   */

  if (!company) {
    if (companyError) {
      console.error(
        "[Dashboard] Company lookup failed:",
        {
          message:
            companyError.message,
          code:
            companyError.code,
          details:
            companyError.details,
          hint:
            companyError.hint,
        }
      );
    }

    redirect("/onboarding");
  }

  /*
   * The company exists but doesn't have
   * the minimum business information needed
   * by the dashboard.
   */

  if (!company.industry) {
    redirect("/onboarding");
  }

  return <DashboardV2 />;
}