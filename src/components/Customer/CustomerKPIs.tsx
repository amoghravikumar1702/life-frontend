"use client";

import { Users, UserCheck, IndianRupee, Wallet } from "lucide-react";

import MetricCard from "@/components/ui/MetricCard";

interface CustomerKPIsProps {
  totalCustomers: number;
  activeCustomers: number;
  totalRevenue: number;
  outstanding: number;
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function CustomerKPIs({
  totalCustomers,
  activeCustomers,
  totalRevenue,
  outstanding,
}: CustomerKPIsProps) {
  return (
    <section className="mb-10">
      <div className="flex gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-4">

        <div className="min-w-[260px] lg:min-w-0">
          <MetricCard
            title="Customers"
            value={totalCustomers}
            subtitle="Total client portfolio"
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        <div className="min-w-[260px] lg:min-w-0">
          <MetricCard
            title="Active"
            value={activeCustomers}
            subtitle="Customers with invoices"
            icon={<UserCheck className="h-5 w-5" />}
          />
        </div>

        <div className="min-w-[260px] lg:min-w-0">
          <MetricCard
            title="Revenue"
            value={formatCompactCurrency(totalRevenue)}
            subtitle="Total invoiced"
            icon={<IndianRupee className="h-5 w-5" />}
            accent
          />
        </div>

        <div className="min-w-[260px] lg:min-w-0">
          <MetricCard
            title="Outstanding"
            value={formatCompactCurrency(outstanding)}
            subtitle="Awaiting payment"
            icon={<Wallet className="h-5 w-5" />}
          />
        </div>

      </div>
    </section>
  );
}