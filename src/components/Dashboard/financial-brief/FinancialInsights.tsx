"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";

import type { FinancialInsight } from "./types";

interface FinancialInsightsProps {
  insight: FinancialInsight;
}

export default function FinancialInsights({
  insight,
}: FinancialInsightsProps) {
  const config = {
    low: {
      icon: CheckCircle2,
      accent: "text-emerald-400",
      border: "border-emerald-500/20",
      background: "bg-emerald-500/5",
      badge: "Healthy",
    },
    medium: {
      icon: Info,
      accent: "text-[#D4AF37]",
      border: "border-[#D4AF37]/20",
      background: "bg-[#D4AF37]/5",
      badge: "Monitor",
    },
    high: {
      icon: AlertTriangle,
      accent: "text-red-400",
      border: "border-red-500/20",
      background: "bg-red-500/5",
      badge: "Action Required",
    },
  };

  const style = config[insight.priority];
  const Icon = style.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`
        relative
        overflow-hidden
        rounded-[30px]
        border
        ${style.border}
        ${style.background}
        backdrop-blur-3xl
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />

      <div className="relative z-10 p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-6">
            <div
              className={`
                flex
                h-16
                w-16
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-black/20
                ${style.accent}
              `}
            >
              <Icon size={28} />
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                  AI Recommendation
                </span>

                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    ${style.background}
                    ${style.accent}
                  `}
                >
                  {style.badge}
                </span>
              </div>

              <h3 className="font-editorial text-[30px] leading-tight tracking-[-0.03em] text-white">
                {insight.title}
              </h3>

              <p className="mt-5 max-w-4xl text-[17px] leading-8 text-[#A8A8AD]">
                {insight.description}
              </p>
            </div>
          </div>

          <button
            className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-xl
              border
              border-white/10
              bg-white/[0.04]
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition-all
              hover:border-[#D4AF37]/30
              hover:bg-white/[0.06]
            "
          >
            View Insights
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.section>
  );
}