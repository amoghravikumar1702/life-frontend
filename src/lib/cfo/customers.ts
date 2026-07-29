import { createClient } from "@/lib/supabase/server";

import { CustomerMetrics } from "./types";

export async function getCustomerMetrics(): Promise<CustomerMetrics> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const ownerId = user.id;

  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .eq("owner_id", ownerId);

  if (error) {
    throw error;
  }

  const customersList = customers ?? [];

  const { data: invoicesData, error: invoicesError } = await supabase
    .from("invoices")
    .select("*")
    .eq("owner_id", ownerId);

  if (invoicesError) {
    throw invoicesError;
  }

  const invoices = invoicesData ?? [];

  const totalCustomers = customersList.length;

  const activeCustomers = customersList.length;

  const repeatCustomers = 0;

  const averageInvoiceValue =
    invoices.length === 0
      ? 0
      : invoices.reduce(
          (sum, invoice) =>
            sum + Number(invoice.total),
          0
        ) / invoices.length;

  let topCustomer = "";

  let topCustomerRevenue = 0;

  let highestOutstandingCustomer = "";

  let highestOutstandingAmount = 0;

  return {
    totalCustomers,

    activeCustomers,

    repeatCustomers,

    averageInvoiceValue,

    averagePaymentTime: 0,

    customerConcentration: 0,

    topCustomer,

    topCustomerRevenue,

    highestOutstandingCustomer,

    highestOutstandingAmount,
  };
}