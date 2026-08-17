"use client";

import { motion } from "framer-motion";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Activity,
  TrendingUp,
  Wallet,
  Users,
  Receipt,
} from "lucide-react";

interface Snapshot {
  revenue: number;
  expenses: number;
  profit: number;
  cashAvailable: number;
  outstandingReceivables: number;
  customerCount: number;
  healthScore: number;
  trend: "Improving" | "Stable" | "Declining";
}

interface Props {
  snapshot: Snapshot;
}

/* =========================================================
   MONEY FORMATTER
========================================================= */

function money(value: number) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }

  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  icon: Icon,
  valueClassName = "text-white",
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  valueClassName?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
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
        sm:p-5
      "
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className="
            min-w-0
            text-[9px]
            font-medium
            uppercase
            tracking-[0.24em]
            text-zinc-600
            sm:tracking-[0.28em]
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
        className={`
          mt-5
          truncate
          text-[20px]
          font-semibold
          tracking-[-0.03em]
          sm:text-[21px]
          ${valueClassName}
        `}
      >
        {value}
      </p>
    </motion.div>
  );
}

/* =========================================================
   BUSINESS PULSE
========================================================= */

export default function BusinessPulse({
  snapshot,
}: Props) {
  const score = Math.max(
    0,
    Math.min(
      100,
      Number(snapshot.healthScore ?? 0)
    )
  );

  const revenue = Number(
    snapshot.revenue ?? 0
  );

  const expenses = Number(
    snapshot.expenses ?? 0
  );

  const profit = Number(
    snapshot.profit ?? 0
  );

  const cashAvailable = Number(
    snapshot.cashAvailable ?? 0
  );

  const receivables = Number(
    snapshot.outstandingReceivables ?? 0
  );

  const customerCount = Number(
    snapshot.customerCount ?? 0
  );

  /* =======================================================
     HEALTH STATUS
  ======================================================= */

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

  /* =======================================================
     TREND
  ======================================================= */

  const trendColor =
    snapshot.trend === "Improving"
      ? "text-emerald-400"
      : snapshot.trend === "Stable"
        ? "text-zinc-400"
        : "text-red-400";

  const TrendIcon =
    snapshot.trend === "Improving"
      ? ArrowUpRight
      : snapshot.trend === "Declining"
        ? ArrowDownRight
        : Minus;

  /* =======================================================
     PROFIT
  ======================================================= */

  const profitColor =
    profit > 0
      ? "text-emerald-400"
      : profit < 0
        ? "text-red-400"
        : "text-zinc-300";

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
        w-full
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.06]
        bg-[#101318]
        transition-all
        duration-300
        hover:border-white/[0.09]
        sm:rounded-[28px]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          px-4
          py-5
          sm:flex-row
          sm:items-start
          sm:justify-between
          sm:px-6
          sm:py-6
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.30em]
              text-zinc-500
              sm:tracking-[0.34em]
            "
          >
            Business Pulse
          </p>

          <h2
            className="
              mt-3
              text-[21px]
              font-semibold
              tracking-[-0.03em]
              text-white
              sm:text-[22px]
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
            flex
            w-fit
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
            className={`text-[11px] font-medium ${healthColor}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* =====================================================
          HEALTH
      ===================================================== */}

      <div className="border-t border-white/[0.05] px-4 py-5 sm:px-6">
        <div className="flex items-end justify-between gap-5">
          <div className="min-w-0">
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.28em]
                text-zinc-600
                sm:tracking-[0.32em]
              "
            >
              Financial Health
            </p>

            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`
                  text-[38px]
                  font-semibold
                  leading-none
                  tracking-[-0.05em]
                  sm:text-[40px]
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

          <div className="shrink-0 text-right">
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.28em]
                text-zinc-600
                sm:tracking-[0.32em]
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

              <TrendIcon
                size={14}
                className={trendColor}
              />
            </div>
          </div>
        </div>

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

      {/* =====================================================
          KPI GRID
      ===================================================== */}

      <div className="grid grid-cols-2 gap-px bg-white/[0.05] sm:grid-cols-3">
        <MetricCard
          title="Revenue"
          value={money(revenue)}
          icon={TrendingUp}
        />

        <MetricCard
          title="Expenses"
          value={money(expenses)}
          icon={Receipt}
          valueClassName={
            expenses > 0
              ? "text-red-300"
              : "text-zinc-300"
          }
        />

        <MetricCard
          title="Profit"
          value={money(profit)}
          icon={Activity}
          valueClassName={profitColor}
        />

        <MetricCard
          title="Cash"
          value={money(cashAvailable)}
          icon={Wallet}
        />

        <MetricCard
          title="Receivables"
          value={money(receivables)}
          icon={Activity}
          valueClassName={
            receivables > 0
              ? "text-amber-300"
              : "text-zinc-300"
          }
        />

        <MetricCard
          title="Customers"
          value={customerCount.toLocaleString(
            "en-IN"
          )}
          icon={Users}
        />
      </div>

      {/* =====================================================
          NET POSITION
      ===================================================== */}

      <div
        className="
          border-t
          border-white/[0.05]
          px-4
          py-4
          sm:px-6
        "
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-zinc-600
                sm:tracking-[0.32em]
              "
            >
              Net Position
            </p>

            <p
              className={`
                mt-1
                truncate
                text-xs
                font-medium
                ${profitColor}
              `}
            >
              {profit > 0
                ? `Operating profit of ${money(
                    profit
                  )}`
                : profit < 0
                  ? `Operating loss of ${money(
                      Math.abs(profit)
                    )}`
                  : "No operating profit recorded yet"}
            </p>
          </div>

          <ArrowUpRight
            size={15}
            className="
              shrink-0
              text-[#D4AF37]
              transition-transform
              duration-300
              group-hover:translate-x-0.5
              group-hover:-translate-y-0.5
            "
          />
        </div>
      </div>
    </motion.section>
  );
}