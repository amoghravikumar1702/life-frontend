import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type BusinessGoals = {
  monthly_revenue_goal: number;
  yearly_revenue_goal: number;
  monthly_profit_goal: number;
  yearly_profit_goal: number;
};

export async function getBusinessGoals(): Promise<BusinessGoals | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No authenticated user found.");
  }

  const { data, error } = await supabase
    .from("business_goals")
    .select(
      "monthly_revenue_goal, yearly_revenue_goal, monthly_profit_goal, yearly_profit_goal"
    )
    .eq("owner_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Get Business Goals Error:", error);
    throw error;
  }

  return data;
}

export async function saveBusinessGoals(
  goals: BusinessGoals
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No authenticated user found.");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("business_goals")
    .select("id")
    .eq("owner_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (fetchError) {
    console.error("Check Existing Goals Error:", fetchError);
    throw fetchError;
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from("business_goals")
      .update({
        ...goals,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Update Business Goals Error:", updateError);
      throw updateError;
    }
  } else {
    const { error: insertError } = await supabase
      .from("business_goals")
      .insert({
        owner_id: user.id,
        ...goals,
      });

    if (insertError) {
      console.error("Insert Business Goals Error:", insertError);
      throw insertError;
    }
  }
}