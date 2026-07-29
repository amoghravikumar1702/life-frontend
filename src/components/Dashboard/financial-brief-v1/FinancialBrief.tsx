"use client";

import BriefHeader from "./BriefHeader";
import MetricChip from "./MetricChip";

import {
  IndianRupee,
  Landmark,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function FinancialBrief() {
  return (
    <section
      className="
        w-full
        rounded-[32px]
        border
        border-white/10
        bg-[rgba(18,18,20,0.72)]
        p-5
        backdrop-blur-2xl
        sm:p-6
        lg:p-8
        xl:p-10
      "
    >
      <div className="space-y-8">

        <BriefHeader />

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          <MetricChip
            label="Revenue"
            value="₹4.20L"
            icon={TrendingUp}
            accent="success"
          />

          <MetricChip
            label="Collections"
            value="₹48K"
            icon={IndianRupee}
          />

          <MetricChip
            label="Expenses"
            value="₹1.80L"
            icon={Wallet}
            accent="warning"
          />

          <MetricChip
            label="Cash Health"
            value="Healthy"
            icon={Landmark}
            accent="success"
          />
        </div>

      </div>
    </section>
  );
}