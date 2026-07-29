import { createClient } from "@/lib/supabase/server";

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export async function getRevenueHistory(): Promise<RevenuePoint[]> {
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
    .eq("payment_status", "Completed")
    .order("paid_at", {
      ascending: true,
    });

  if (error || !data) {
    console.error(error);
    return [];
  }

  const grouped = new Map<
    string,
    number
  >();

  for (const payment of data) {
    if (!payment.paid_at) continue;

    const date = new Date(
      payment.paid_at
    );

    const month =
      date.toLocaleString("en-IN", {
        month: "short",
      });

    grouped.set(
      month,
      (grouped.get(month) ?? 0) +
        Number(payment.amount ?? 0)
    );
  }

  return [...grouped.entries()].map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );
}