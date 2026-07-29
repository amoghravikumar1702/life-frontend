"use client";

import {
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";

import type { FinancialMetric } from "./types";

interface FinancialMetricsProps {
  metrics: FinancialMetric[];
}

function TrendIcon({
  trend,
}: {
  trend: FinancialMetric["trend"];
}) {
  switch (trend) {
    case "up":
      return <TrendingUp size={16} />;

    case "down":
      return <TrendingDown size={16} />;

    default:
      return <Minus size={16} />;
  }
}

export default function FinancialMetrics({
  metrics,
}: FinancialMetricsProps) {
  if (!metrics.length) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: index * 0.08,
            duration: 0.4,
          }}
          className="
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-white/10
            bg-[rgba(22,22,24,0.55)]
            p-7
            backdrop-blur-3xl
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-[#D4AF37]/30
            hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)]
          "
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <p className="font-ui text-xs font-semibold uppercase tracking-[0.22em] text-[#8A8A8F]">
                {metric.label}
              </p>

              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full border
                  ${
                    metric.trend === "up"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : metric.trend === "down"
                      ? "border-red-500/20 bg-red-500/10 text-red-400"
                      : "border-white/10 bg-white/5 text-[#B3B3B8]"
                  }
                `}
              >
                <TrendIcon trend={metric.trend} />
              </div>
            </div>

            <h3 className="mt-8 font-editorial text-[38px] font-medium tracking-[-0.03em] text-white">
              {metric.value}
            </h3>

            <div className="mt-8 h-px bg-white/[0.06]" />

            <div className="mt-5 flex items-center justify-between">
              <span className="font-ui text-sm text-[#8A8A8F]">
                Current Period
              </span>

              <span
                className={`
                  rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]
                  ${
                    metric.trend === "up"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : metric.trend === "down"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-white/5 text-[#B3B3B8]"
                  }
                `}
              >
                {metric.trend === "up"
                  ? "Positive"
                  : metric.trend === "down"
                  ? "Attention"
                  : "Stable"}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}