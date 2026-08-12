"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import Card from "./Card";

interface MetricCardProps {
  title: string;

  value: string | number;

  subtitle?: string;

  icon?: ReactNode;

  trend?: number;

  accent?: boolean;

  className?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accent = false,
  className,
}: MetricCardProps) {
  const TrendIcon =
    trend === undefined
      ? Minus
      : trend >= 0
      ? ArrowUpRight
      : ArrowDownRight;

  const trendColor =
    trend === undefined
      ? "text-zinc-500"
      : trend >= 0
      ? "text-emerald-400"
      : "text-red-400";

  return (
    <Card
      hover
      padding="md"
      className={className}
    >
      <div className="flex items-start justify-between">

        <div className="space-y-6">

          <div>

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              {title}
            </p>

            <h2
              className={`mt-3 text-3xl font-semibold tracking-tight ${
                accent
                  ? "text-[#D4AF37]"
                  : "text-white"
              }`}
            >
              {value}
            </h2>

          </div>

          {subtitle && (
            <p className="text-sm text-zinc-500">
              {subtitle}
            </p>
          )}

        </div>

        {icon && (
          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            transition={{
              duration: 0.2,
            }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-[#D4AF37]"
          >
            {icon}
          </motion.div>
        )}

      </div>

      {trend !== undefined && (
        <div className="mt-8 flex items-center gap-2">

          <TrendIcon
            className={`h-4 w-4 ${trendColor}`}
          />

          <span
            className={`text-sm font-medium ${trendColor}`}
          >
            {Math.abs(trend)}%
          </span>

          <span className="text-sm text-zinc-500">
            compared to last month
          </span>

        </div>
      )}
    </Card>
  );
}