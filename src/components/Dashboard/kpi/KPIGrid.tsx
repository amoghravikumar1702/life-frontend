"use client";

import KPICard from "./KPICard";

type Props = {
  revenue: number;
  outstanding: number;
  customers: number;
  invoices: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function KPIGrid({
  revenue,
  outstanding,
  customers,
  invoices,
}: Props) {
  return (
    <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Revenue"
        value={formatCurrency(revenue)}
        href="/payments"
        subtitle="Payments received"
      />

      <KPICard
        title="Outstanding"
        value={formatCurrency(outstanding)}
        href="/invoices"
        subtitle="Pending collections"
      />

      <KPICard
        title="Customers"
        value={customers.toString()}
        href="/customers"
        subtitle="Active customers"
      />

      <KPICard
        title="Invoices"
        value={invoices.toString()}
        href="/invoices"
        subtitle="Total invoices"
      />
    </section>
  );
}