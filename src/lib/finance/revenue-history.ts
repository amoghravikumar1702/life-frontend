import { createClient } from "@/lib/supabase/server";

export interface RevenueHistoryPoint {
  month: string;
  revenue: number;
}

export async function getRevenueHistory(): Promise<
  RevenueHistoryPoint[]
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("payments")
    .select("amount, paid_at")
    .eq("owner_id", user.id)
    .order("paid_at", {
      ascending: true,
    });

  if (error || !data) {
    console.error(error);
    return [];
  }

  const grouped = new Map<string, number>();

  for (const payment of data) {
    if (!payment.paid_at) continue;

    const date = new Date(payment.paid_at);

    const month = date.toLocaleString("en-US", {
      month: "short",
    });

    grouped.set(
      month,
      (grouped.get(month) ?? 0) +
        Number(payment.amount ?? 0)
    );
  }

  return Array.from(grouped.entries()).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );
}