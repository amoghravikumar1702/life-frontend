import HeroSection from "../HeroSection/HeroSection";
import AICFO from "../AICFO/AICFO";
import HealthScore from "../HealthScore/HealthScore";
import CashFlow from "../CashFlow/CashFlow";
import QuickActions from "../QuickActions/QuickActions";
import TodayTasks from "../TodayTasks/TodayTasks";
import StatCard from "./StatCard";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#030712] text-white px-8 py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Hero */}
        <HeroSection />

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Money to Collect" value="₹2,45,000" />
          <StatCard title="Bills Due" value="₹48,000" />
          <StatCard title="Cash Position" value="₹8,72,000" />
          <StatCard title="Alerts" value="3" />
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