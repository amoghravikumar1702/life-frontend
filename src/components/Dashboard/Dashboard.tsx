"use client";

import FinancialBrief from "./financial-brief/FinancialBrief";
import AttentionSection from "./attention/AttentionSection";
import ActivitySection from "./activity/ActivitySection";

import { useDashboard } from "./queries/dashboardQueries";

interface DashboardProps {
  user: {
    name: string;
    email: string;
  };
}

export default function Dashboard({
  user,
}: DashboardProps) {
  const {
    data: stats,
    isLoading,
    error,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <h2 className="text-lg text-[#8A8A8F]">
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <h2 className="text-lg text-red-400">
          Failed to load dashboard.
        </h2>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[700px] w-[700px] rounded-full bg-[#D4AF37]/8 blur-[180px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_65%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-8">
        <FinancialBrief
          data={stats.financialBrief}
        />

        <AttentionSection
          items={stats.attentionItems}
        />

        <ActivitySection
          activities={stats.activities}
        />
      </div>
    </div>
  );
}