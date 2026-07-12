import HeroSection from "../HeroSection/HeroSection";
import AICFO from "../AICFO/AICFO";
import HealthScore from "../HealthScore/HealthScore";
import CashFlow from "../CashFlow/CashFlow";
import QuickActions from "../QuickActions/QuickActions";
import TodayTasks from "../TodayTasks/TodayTasks";
import StatCard from "./StatCard";

import { getDashboardStats } from "@/services/dashboardService";

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <main className="min-h-screen bg-[#030712] px-8 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Hero */}
        <HeroSection />

        {/* KPI Cards */}
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

        {/* Quick Actions */}
        <QuickActions />

        {/* AI CFO + Health */}
        <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <AICFO />
          <HealthScore />
        </section>

        {/* Cash Flow + Today's Tasks */}
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