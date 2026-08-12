import { Invoice } from "@/types/invoice";

import { CustomerMetrics } from "./types";

const formatName = (value?: string | null) =>
  (value ?? "").trim().toLowerCase();

export function getCustomerInvoices(
  customerId: number,
  invoices: Invoice[]
): Invoice[] {
  return invoices.filter(
    (invoice) => invoice.customer_id === customerId
  );
}

export function calculateRevenue(
  invoices: Invoice[]
): number {
  return invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total ?? 0),
    0
  );
}

export function calculateCollected(
  invoices: Invoice[]
): number {
  return invoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.amount_paid ?? 0),
    0
  );
}

export function calculateOutstanding(
  invoices: Invoice[]
): number {
  return invoices.reduce(
    (sum, invoice) =>
      sum + Number(invoice.balance_due ?? 0),
    0
  );
}

export function calculateCollectionRate(
  revenue: number,
  collected: number
): number {
  if (revenue <= 0) return 0;

  return Math.round((collected / revenue) * 100);
}

export function calculateHealth(
  collectionRate: number
): CustomerMetrics["health"] {
  if (collectionRate >= 95) return "Excellent";

  if (collectionRate >= 80) return "Good";

  if (collectionRate >= 60) return "Average";

  return "Attention";
}

export function buildCustomerMetrics(
  customerId: number,
  invoices: Invoice[]
): CustomerMetrics {
  const customerInvoices = getCustomerInvoices(
    customerId,
    invoices
  );

  const revenue = calculateRevenue(customerInvoices);

  const collected =
    calculateCollected(customerInvoices);

  const outstanding =
    calculateOutstanding(customerInvoices);

  const collectionRate =
    calculateCollectionRate(
      revenue,
      collected
    );

  return {
    invoiceCount: customerInvoices.length,

    revenue,

    collected,

    outstanding,

    collectionRate,

    health: calculateHealth(collectionRate),
  };
}

export function formatCompactCurrency(
  amount: number
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatCurrency(
  amount: number
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCustomerInitials(
  customerName: string
): string {
  const words = customerName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "?";

  if (words.length === 1)
    return words[0].slice(0, 2).toUpperCase();

  return (
    words[0][0] + words[1][0]
  ).toUpperCase();
}

export function customerMatchesSearch(
  customer: {
    customer_name: string;
    business_name?: string;
    email?: string;
    phone?: string;
  },
  query: string
): boolean {
  const search = formatName(query);

  if (!search) return true;

  return (
    formatName(customer.customer_name).includes(search) ||
    formatName(customer.business_name).includes(search) ||
    formatName(customer.email).includes(search) ||
    formatName(customer.phone).includes(search)
  );
}