"use client";

import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Activity,
  TrendingUp,
  Wallet,
  Users,
  Receipt,
} from "lucide-react";

interface Snapshot {
  revenue: number;
  cashAvailable: number;
  outstandingReceivables: number;
  customerCount: number;
  healthScore: number;
  trend: "Improving" | "Stable" | "Declining";
}

interface Props {
  snapshot: Snapshot;
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

function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="
        group
        relative
        min-h-[104px]
        border
        border-white/[0.05]
        bg-white/[0.018]
        p-4
        transition-all
        duration-300
        hover:border-[#D4AF37]/10
        hover:bg-white/[0.035]
      "
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.28em]
            text-zinc-600
          "
        >
          {title}
        </p>

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-[11px]
            border
            border-[#D4AF37]/10
            bg-[#D4AF37]/[0.07]
            transition-all
            duration-300
            group-hover:border-[#D4AF37]/20
            group-hover:bg-[#D4AF37]/[0.12]
          "
        >
          <Icon
            size={15}
            strokeWidth={1.8}
            className="text-[#D4AF37]"
          />
        </div>
      </div>

      <p
        className="
          mt-5
          text-[21px]
          font-semibold
          tracking-[-0.03em]
          text-white
        "
      >
        {value}
      </p>
    </motion.div>
  );
}

export default function BusinessPulse({
  snapshot,
}: Props) {
  const score = Math.max(
    0,
    Math.min(100, Number(snapshot.healthScore ?? 0))
  );

  const healthColor =
    score >= 85
      ? "text-emerald-400"
      : score >= 70
        ? "text-[#D4AF37]"
        : score >= 50
          ? "text-amber-400"
          : "text-red-400";

  const healthBarColor =
    score >= 85
      ? "bg-emerald-400"
      : score >= 70
        ? "bg-[#D4AF37]"
        : score >= 50
          ? "bg-amber-400"
          : "bg-red-400";

  const status =
    score >= 85
      ? "Excellent"
      : score >= 70
        ? "Healthy"
        : score >= 50
          ? "Moderate"
          : "Needs Attention";

  const trendColor =
    snapshot.trend === "Improving"
      ? "text-emerald-400"
      : snapshot.trend === "Stable"
        ? "text-zinc-400"
        : "text-red-400";

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/[0.06]
        bg-[#101318]
        transition-all
        duration-300
        hover:border-white/[0.09]
      "
    >
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
          px-6
          py-6
        "
      >
        <div>
          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.34em]
              text-zinc-500
            "
          >
            Business Pulse
          </p>

          <h2
            className="
              mt-3
              text-[22px]
              font-semibold
              tracking-[-0.03em]
              text-white
            "
          >
            Financial Position
          </h2>

          <p className="mt-1 text-xs text-zinc-600">
            Current operating picture
          </p>
        </div>

        <div
          className="
            mt-1
            flex
            shrink-0
            items-center
            gap-2
            rounded-full
            border
            border-white/[0.06]
            bg-white/[0.02]
            px-3
            py-1.5
          "
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              score >= 70
                ? "bg-emerald-400"
                : score >= 50
                  ? "bg-amber-400"
                  : "bg-red-400"
            }`}
          />

          <span
            className={`text-[11px] font-medium ${
              score >= 85
                ? "text-emerald-400"
                : score >= 70
                  ? "text-[#D4AF37]"
                  : score >= 50
                    ? "text-amber-400"
                    : "text-red-400"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* =========================================================
          HEALTH
      ========================================================= */}

      <div className="border-t border-white/[0.05] px-6 py-5">
        <div className="flex items-end justify-between">
          <div>
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.32em]
                text-zinc-600
              "
            >
              Financial Health
            </p>

            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`
                  text-[40px]
                  font-semibold
                  leading-none
                  tracking-[-0.05em]
                  ${healthColor}
                `}
              >
                {score}
              </span>

              <span className="text-xs text-zinc-600">
                / 100
              </span>
            </div>
          </div>

          <div className="text-right">
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.32em]
                text-zinc-600
              "
            >
              Trend
            </p>

            <div className="mt-2 flex items-center justify-end gap-1.5">
              <span
                className={`text-sm font-medium ${trendColor}`}
              >
                {snapshot.trend}
              </span>

              <ArrowUpRight
                size={14}
                className={trendColor}
              />
            </div>
          </div>
        </div>

        {/* HEALTH BAR */}

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${score}%`,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className={`h-full rounded-full ${healthBarColor}`}
          />
        </div>
      </div>

      {/* =========================================================
          KPI GRID
      ========================================================= */}

      <div className="grid grid-cols-3 gap-px bg-white/[0.05]">
        <MetricCard
          title="Revenue"
          value={money(snapshot.revenue)}
          icon={TrendingUp}
        />

        <MetricCard
          title="Expenses"
          value={money(
            Math.max(
              0,
              snapshot.revenue -
                snapshot.cashAvailable
            )
          )}
          icon={Receipt}
        />

        <MetricCard
          title="Profit"
          value={money(snapshot.revenue)}
          icon={Activity}
        />

        <MetricCard
          title="Cash"
          value={money(snapshot.cashAvailable)}
          icon={Wallet}
        />

        <MetricCard
          title="Receivables"
          value={money(
            snapshot.outstandingReceivables
          )}
          icon={Activity}
        />

        <MetricCard
          title="Customers"
          value={snapshot.customerCount.toString()}
          icon={Users}
        />
      </div>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-white/[0.05]
          px-6
          py-4
        "
      >
        <span
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.32em]
            text-zinc-600
          "
        >
          Executive Overview
        </span>

        <ArrowUpRight
          size={15}
          className="
            text-[#D4AF37]
            transition-transform
            duration-300
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
          "
        />
      </div>
    </motion.section>
  );
}