"use client";

import { motion } from "framer-motion";

interface FinancialSummaryProps {
  user: {
    name: string;
    email: string;
  };
  generatedAt: string;
  summary: string;
}

export default function FinancialSummary({
  user,
  generatedAt,
  summary,
}: FinancialSummaryProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="space-y-10"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-5">
          <div className="inline-flex items-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2">
            <span className="font-ui text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              AI CFO
            </span>
          </div>

          <div>
            <h1 className="font-editorial text-[42px] leading-tight tracking-[-0.04em] text-white">
              {greeting}, {user.name}.
            </h1>

            <p className="mt-3 max-w-2xl font-ui text-lg leading-8 text-[#A4A4AA]">
              Here's your financial overview for today.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-right backdrop-blur-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#777]">
            Last Updated
          </p>

          <p className="mt-2 font-ui text-sm font-medium text-white">
            {generatedAt}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        <h2 className="font-ui text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
          Executive Summary
        </h2>

        <p className="mt-6 max-w-5xl font-editorial text-[26px] leading-[42px] tracking-[-0.02em] text-[#DDD7CC] text-balance">
          {summary}
        </p>
      </div>
    </motion.div>
  );
}