import { redirect } from "next/navigation";

import DashboardV2 from "@/components/Dashboard/DashboardV2";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: company, error } = await supabase
    .from("companies")
    .select("industry")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "[Dashboard] Failed to load company:",
      error
    );

    redirect("/onboarding");
  }

  if (!company?.industry) {
    redirect("/onboarding");
  }

  return <DashboardV2 />;
}