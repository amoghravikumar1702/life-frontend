import { createClient } from "@/lib/supabase/server";

export interface ActivityItem {
  id: string;
  type:
    | "payment"
    | "invoice"
    | "customer"
    | "reminder";

  title: string;
  description: string;
  createdAt: string;
}

export async function getLatestEvents(): Promise<ActivityItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !data) {
    return [];
  }

  return data.map((event) => ({
    id: event.id,

    type:
      event.type.startsWith("payment")
        ? "payment"
        : event.type.startsWith("invoice")
        ? "invoice"
        : event.type.startsWith("customer")
        ? "customer"
        : "reminder",

    title: event.title,

    description: event.description ?? "",

    createdAt: event.created_at,
  }));
}