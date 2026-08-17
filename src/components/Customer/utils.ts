import { Customer } from "@/types/customer";
import { Invoice } from "@/types/invoice";

export interface CustomerMetrics {
  invoiceCount: number;
  revenue: number;
  outstanding: number;
  collected: number;
}

export function buildCustomerMetrics(
  customerId: number,
  invoices: Invoice[]
): CustomerMetrics {
  const customerInvoices = invoices.filter(
    (invoice) => invoice.customer_id === customerId
  );

  const revenue = customerInvoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.total || 0),
    0
  );

  const outstanding = customerInvoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.balance_due || 0),
    0
  );

  const collected = customerInvoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.amount_paid || 0),
    0
  );

  return {
    invoiceCount: customerInvoices.length,
    revenue,
    outstanding,
    collected,
  };
}

export function customerMatchesSearch(
  customer: Customer,
  search: string
): boolean {
  const query = search.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchableFields = [
    customer.customer_name,
    customer.business_name,
    customer.email,
    customer.phone,
    customer.gst_number,
    customer.address,
  ];

  return searchableFields.some((field) =>
    String(field ?? "")
      .toLowerCase()
      .includes(query)
  );
}