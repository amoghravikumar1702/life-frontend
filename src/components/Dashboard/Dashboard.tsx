"use client";

import HeroSection from "../HeroSection/HeroSection";
import AICFO from "../AICFO/AICFO";
import HealthScore from "../HealthScore/HealthScore";
import CashFlow from "../CashFlow/CashFlow";
import QuickActions from "../QuickActions/QuickActions";
import TodayTasks from "../TodayTasks/TodayTasks";
import StatCard from "./StatCard";

import { useDashboard } from "./queries/dashboardQueries";

export default function Dashboard() {
  const {
    data: stats,
    isLoading,
    error,
  } = useDashboard();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#030712] px-8 py-8 text-white flex items-center justify-center">
        <h2 className="text-xl text-gray-400">
          Loading Dashboard...
        </h2>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="min-h-screen bg-[#030712] px-8 py-8 text-white flex items-center justify-center">
        <h2 className="text-xl text-red-400">
          Failed to load dashboard.
        </h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] px-8 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">

        <HeroSection />

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Money to Collect"
            value={stats.formatted.moneyToCollect}
            href="/invoices"
          />

          <StatCard
            title="Bills Due"
            value={`${stats.overdueInvoices}`}
            href="/invoices"
          />

          <StatCard
            title="Cash Position"
            value={stats.formatted.revenue}
            href="/customers"
          />

          <StatCard
            title="Alerts"
            value={`${stats.customerCount}`}
            href="/customers"
          />

        </section>

        <QuickActions />

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <AICFO />
          <HealthScore />
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">

          <div className="xl:col-span-2">
            <CashFlow />
          </div>

          <TodayTasks />

        </section>

      </div>
    </main>
  );
}