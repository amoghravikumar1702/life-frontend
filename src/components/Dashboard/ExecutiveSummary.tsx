"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  revenue: number;
  cashAvailable: number;
  receivables: number;
  healthScore: number;
}

function money(value: number) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `₹${Math.round(value / 100000)}L`;
  }

  if (value >= 1000) {
    return `₹${Math.round(value / 1000)}K`;
  }

  return `₹${Math.round(value)}`;
}

export default function ExecutiveSummary({
  revenue,
  cashAvailable,
  receivables,
  healthScore,
}: Props) {
  const priority =
    receivables > 0
      ? "Improve collections cycle"
      : healthScore < 70
        ? "Strengthen financial position"
        : "Maintain operating momentum";

  const summary =
    receivables > 0
      ? `Cash position remains ${healthScore >= 70 ? "stable" : "under pressure"} with ${money(
          cashAvailable
        )} available. Focus on clearing ${money(
          receivables
        )} in outstanding receivables to strengthen liquidity.`
      : healthScore >= 85
        ? `Financial position remains strong with ${money(
            cashAvailable
          )} available against ${money(
            revenue
          )} in recorded revenue. Maintain the current operating momentum.`
        : `Financial position requires attention. Review cash flow, expenses, and operating performance to improve the current position.`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-white/[0.05]
        bg-[#101318]
      "
    >
      <div className="flex flex-col lg:flex-row">
        {/* SUMMARY */}
        <div className="flex min-w-0 flex-1 items-start gap-4 px-6 py-5">
          <div
            className="
              mt-0.5
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-[#D4AF37]/12
              bg-[#D4AF37]/[0.06]
            "
          >
            <Sparkles
              size={15}
              strokeWidth={1.7}
              className="text-[#D4AF37]"
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.34em]
                text-[#D4AF37]
              "
            >
              Executive Summary
            </p>

            <p
              className="
                mt-2
                max-w-3xl
                text-[13px]
                leading-6
                text-zinc-400
              "
            >
              {summary}
            </p>
          </div>
        </div>

        {/* PRIORITY */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-6
            border-t
            border-white/[0.05]
            px-6
            py-4
            lg:w-[280px]
            lg:border-l
            lg:border-t-0
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-zinc-600
              "
            >
              Key Priority
            </p>

            <p className="mt-2 text-[13px] font-medium text-zinc-200">
              {priority}
            </p>
          </div>

          <ArrowUpRight
            size={16}
            strokeWidth={1.7}
            className="shrink-0 text-[#D4AF37]"
          />
        </div>
      </div>
    </motion.section>
  );
}