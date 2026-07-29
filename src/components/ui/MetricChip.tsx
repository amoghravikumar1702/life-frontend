"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

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
  const accentStyles = {
    default: {
      icon: "text-neutral-600",
      badge: "bg-neutral-100",
    },
    success: {
      icon: "text-emerald-600",
      badge: "bg-emerald-50",
    },
    warning: {
      icon: "text-amber-600",
      badge: "bg-amber-50",
    },
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group rounded-3xl border border-neutral-200/70 bg-white/60 backdrop-blur-md px-6 py-5 transition-all duration-300 hover:border-neutral-300 hover:bg-white/80"
    >
      <div className="flex items-start justify-between">

        <div className="space-y-2">

          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            {label}
          </p>

          <h3 className="text-2xl font-light tracking-tight text-neutral-900">
            {value}
          </h3>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${accentStyles[accent].badge}`}
        >
          <Icon
            size={18}
            className={accentStyles[accent].icon}
          />
        </div>

      </div>
    </motion.div>
  );
}