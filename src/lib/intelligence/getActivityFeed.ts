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

export async function getActivityFeed(): Promise<ActivityItem[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const ownerId = user.id;

  const [
    payments,
    invoices,
    customers,
  ] = await Promise.all([
    supabase
      .from("payments")
      .select("id, amount, created_at")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false })
      .limit(5),

    supabase
      .from("invoices")
      .select(
        "id, invoice_number, created_at"
      )
      .eq("owner_id", ownerId)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),

    supabase
      .from("customers")
      .select(
        "id, customer_name, created_at"
      )
      .eq("owner_id", ownerId)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),
  ]);

  const activity: ActivityItem[] = [];

  payments.data?.forEach((payment) => {
    activity.push({
      id: `payment-${payment.id}`,
      type: "payment",
      title: "Payment received",
      description: `₹${Number(
        payment.amount
      ).toLocaleString("en-IN")} collected.`,
      createdAt: payment.created_at,
    });
  });

  invoices.data?.forEach((invoice) => {
    activity.push({
      id: `invoice-${invoice.id}`,
      type: "invoice",
      title: "Invoice issued",
      description: `Invoice ${invoice.invoice_number} created.`,
      createdAt: invoice.created_at,
    });
  });

  customers.data?.forEach((customer) => {
    activity.push({
      id: `customer-${customer.id}`,
      type: "customer",
      title: "Customer added",
      description: customer.customer_name,
      createdAt: customer.created_at,
    });
  });

  return activity
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 10);
}