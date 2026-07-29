"use client";

import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface MetricChipProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "default" | "success" | "warning";
}

export default function MetricChip({
  label,
  value,
  icon: Icon,
  accent = "default",
}: MetricChipProps) {
  const styles = {
    default: {
      icon: "text-zinc-300",
      bg: "bg-white/[0.04]",
      border: "border-white/10",
      trend: "text-zinc-400",
    },
    success: {
      icon: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      trend: "text-emerald-400",
    },
    warning: {
      icon: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      trend: "text-amber-300",
    },
  };

  const style = styles[accent];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="
        group
        rounded-[28px]
        border
        border-white/10
        bg-[rgba(24,24,28,0.72)]
        p-6
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-[#D4AF37]/20
        hover:shadow-[0_20px_60px_rgba(0,0,0,.45)]
      "
    >
      <div className="flex items-start justify-between">

        <div className="space-y-4">

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            {label}
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white">
            {value}
          </h2>

          <div className="flex items-center gap-2">

            <ArrowUpRight
              size={14}
              className={style.trend}
            />

            <span
              className={`text-sm font-medium ${style.trend}`}
            >
              +12.6%
            </span>

            <span className="text-sm text-zinc-500">
              this month
            </span>

          </div>

        </div>

        <div
          className={`
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            ${style.border}
            ${style.bg}
          `}
        >
          <Icon
            size={26}
            className={style.icon}
          />
        </div>

      </div>
    </motion.div>
  );
}