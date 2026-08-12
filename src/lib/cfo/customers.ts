import { createClient } from "@/lib/supabase/server";

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  repeatCustomers: number;

  averageInvoiceValue: number;
  averagePaymentTime: number;
  customerConcentration: number;

  topCustomer: string;
  topCustomerRevenue: number;

  highestOutstandingCustomer: string;
  highestOutstandingAmount: number;
}

export async function getCustomerMetrics(): Promise<CustomerMetrics> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const ownerId = user.id;

  const [
    customersResult,
    invoicesResult,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("*")
      .eq("owner_id", ownerId),

    supabase
      .from("invoices")
      .select("*")
      .eq("owner_id", ownerId),
  ]);

  if (customersResult.error) {
    throw customersResult.error;
  }

  if (invoicesResult.error) {
    throw invoicesResult.error;
  }

  const customers = customersResult.data ?? [];
  const invoices = invoicesResult.data ?? [];

  /*
   * ============================================================
   * CUSTOMER COUNTS
   * ============================================================
   */

  const totalCustomers = customers.length;

  /*
   * For the MVP, a customer is considered active if they have
   * at least one invoice.
   */

  const invoicedCustomerIds = new Set(
    invoices
      .map((invoice) =>
        invoice.customer_id
          ? String(invoice.customer_id)
          : null
      )
      .filter(Boolean)
  );

  const activeCustomers = customers.filter(
    (customer) =>
      customer.id &&
      invoicedCustomerIds.has(
        String(customer.id)
      )
  ).length;

  /*
   * ============================================================
   * CUSTOMER REVENUE MAP
   * ============================================================
   */

  const customerRevenue = new Map<
    string,
    number
  >();

  const customerInvoiceCount = new Map<
    string,
    number
  >();

  const customerOutstanding = new Map<
    string,
    number
  >();

  for (const invoice of invoices) {
    if (!invoice.customer_id) {
      continue;
    }

    const customerId = String(
      invoice.customer_id
    );

    const invoiceTotal =
      Number(invoice.total ?? 0);

    const balanceDue =
      Number(invoice.balance_due ?? 0);

    customerRevenue.set(
      customerId,
      (customerRevenue.get(customerId) ?? 0) +
        invoiceTotal
    );

    customerInvoiceCount.set(
      customerId,
      (customerInvoiceCount.get(customerId) ?? 0) +
        1
    );

    customerOutstanding.set(
      customerId,
      (customerOutstanding.get(customerId) ?? 0) +
        balanceDue
    );
  }

  /*
   * ============================================================
   * REPEAT CUSTOMERS
   *
   * A repeat customer has more than one invoice.
   * ============================================================
   */

  const repeatCustomers = Array.from(
    customerInvoiceCount.values()
  ).filter((count) => count > 1).length;

  /*
   * ============================================================
   * AVERAGE INVOICE VALUE
   * ============================================================
   */

  const averageInvoiceValue =
    invoices.length === 0
      ? 0
      : invoices.reduce(
          (sum, invoice) =>
            sum +
            Number(invoice.total ?? 0),
          0
        ) / invoices.length;

  /*
   * ============================================================
   * CUSTOMER LOOKUP
   * ============================================================
   */

  const customerNameMap = new Map<
    string,
    string
  >();

  for (const customer of customers) {
    if (!customer.id) {
      continue;
    }

    const name =
      customer.name ??
      customer.business_name ??
      customer.company_name ??
      customer.full_name ??
      `Customer ${String(customer.id).slice(
        0,
        8
      )}`;

    customerNameMap.set(
      String(customer.id),
      String(name)
    );
  }

  /*
   * ============================================================
   * TOP CUSTOMER
   * ============================================================
   */

  let topCustomer = "";
  let topCustomerRevenue = 0;

  for (const [
    customerId,
    revenue,
  ] of customerRevenue.entries()) {
    if (revenue > topCustomerRevenue) {
      topCustomerRevenue = revenue;

      topCustomer =
        customerNameMap.get(
          customerId
        ) ?? `Customer ${customerId}`;
    }
  }

  /*
   * ============================================================
   * HIGHEST OUTSTANDING CUSTOMER
   * ============================================================
   */

  let highestOutstandingCustomer = "";
  let highestOutstandingAmount = 0;

  for (const [
    customerId,
    outstanding,
  ] of customerOutstanding.entries()) {
    if (
      outstanding >
      highestOutstandingAmount
    ) {
      highestOutstandingAmount =
        outstanding;

      highestOutstandingCustomer =
        customerNameMap.get(
          customerId
        ) ?? `Customer ${customerId}`;
    }
  }

  /*
   * ============================================================
   * CUSTOMER CONCENTRATION
   *
   * Percentage of total invoiced revenue represented by the
   * largest customer.
   * ============================================================
   */

  const totalCustomerRevenue =
    Array.from(
      customerRevenue.values()
    ).reduce(
      (sum, value) => sum + value,
      0
    );

  const customerConcentration =
    totalCustomerRevenue <= 0 ||
    topCustomerRevenue <= 0
      ? 0
      : (topCustomerRevenue /
          totalCustomerRevenue) *
        100;

  /*
   * ============================================================
   * PAYMENT TIME
   *
   * The current MVP data model has not yet been verified to
   * contain a reliable payment timestamp relationship.
   *
   * Therefore we intentionally do not invent this metric.
   * ============================================================
   */

  const averagePaymentTime = 0;

  /*
   * ============================================================
   * DEBUGGING
   * ============================================================
   */

  console.log(
    "[ArkenOne CFO] Customer Metrics:",
    {
      totalCustomers,
      activeCustomers,
      repeatCustomers,
      averageInvoiceValue,
      customerConcentration,
      topCustomer,
      topCustomerRevenue,
      highestOutstandingCustomer,
      highestOutstandingAmount,
    }
  );

  return {
    totalCustomers,

    activeCustomers,

    repeatCustomers,

    averageInvoiceValue,

    averagePaymentTime,

    customerConcentration,

    topCustomer,

    topCustomerRevenue,

    highestOutstandingCustomer,

    highestOutstandingAmount,
  };
}