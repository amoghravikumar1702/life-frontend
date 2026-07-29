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
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!company?.industry) {
    redirect("/onboarding");
  }

  return <DashboardV2 />;
}