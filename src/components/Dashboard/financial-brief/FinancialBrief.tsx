"use client";

import FinancialSummary from "./FinancialSummary";
import FinancialMetrics from "./FinancialMetrics";
import FinancialInsights from "./FinancialInsights";

import type { FinancialBriefData } from "./types";

interface FinancialBriefProps {
  data: FinancialBriefData;
}

export default function FinancialBrief({
  data,
}: FinancialBriefProps) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        bg-[rgba(18,18,20,0.45)]
        backdrop-blur-[55px]
        shadow-[0_40px_120px_rgba(0,0,0,0.75)]
      "
    >
      <div className="pointer-events-none absolute inset-[1px] rounded-[35px] border border-white/[0.05]" />

      <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/[0.08] via-white/[0.015] to-transparent" />

      <div className="pointer-events-none absolute -top-36 -right-28 h-[420px] w-[420px] rounded-full bg-[#D4AF37]/10 blur-[180px]" />

      <div className="pointer-events-none absolute -bottom-44 -left-24 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-[180px]" />

      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative z-10 px-12 pb-12 pt-9">
        <FinancialSummary
          generatedAt={data.generatedAt}
          summary={data.summary} user={{
            name: "",
            email: ""
          }}        />

        <div className="mt-14">
          <FinancialMetrics
            metrics={data.metrics}
          />
        </div>

        <div className="my-12 h-px bg-white/[0.05]" />

      </div>
    </section>
  );
}