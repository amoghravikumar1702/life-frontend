import StatCard from "./StatCard";
import ActionCenter from "../ActionCenter/ActionCenter";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#030712] text-white pt-28 px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">
          Good Evening, Amogh 👋
        </h1>

        <p className="mt-3 text-lg text-gray-400">
          Here's your business today.
        </p>

        {/* KPI Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Money to Collect" value="₹2,45,000" />
          <StatCard title="Bills Due" value="₹48,000" />
          <StatCard title="Cash Position" value="₹8,72,000" />
          <StatCard title="Alerts" value="3" />
        </div>

        {/* Action Center */}
        <div className="mt-10">
          <ActionCenter />
        </div>
      </div>
    </main>
  );
}