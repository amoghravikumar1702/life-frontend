"use client";

import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Wallet,
  Users,
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

const money = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN").format(value)}`;

export default function BusinessPulse({
  snapshot,
}: Props) {
  const healthColor =
    snapshot.healthScore >= 85
      ? "text-emerald-400"
      : snapshot.healthScore >= 70
      ? "text-[#D4AF37]"
      : "text-red-400";

  const trendColor =
    snapshot.trend === "Improving"
      ? "text-emerald-400"
      : snapshot.trend === "Stable"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[36px] border border-white/10 bg-[#111111] p-8"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Business Pulse
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-white">
            Today's Financial Position
          </h2>

        </div>

        <div className="text-right">

          <p
            className={`text-6xl font-bold ${healthColor}`}
          >
            {snapshot.healthScore}
          </p>

          <p className={`mt-2 ${healthColor}`}>
            {snapshot.healthScore >= 85
              ? "Healthy"
              : snapshot.healthScore >= 70
              ? "Stable"
              : "Needs Attention"}
          </p>

        </div>

      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        <Metric
          icon={TrendingUp}
          title="Total Revenue"
          value={money(snapshot.revenue)}
        />

        <Metric
          icon={Wallet}
          title="Cash Available"
          value={money(snapshot.cashAvailable)}
        />

        <Metric
          icon={Activity}
          title="Outstanding Receivables"
          value={money(snapshot.outstandingReceivables)}
        />

        <Metric
          icon={Users}
          title="Customers"
          value={snapshot.customerCount.toString()}
        />

      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Business Trend
            </p>

            <h3
              className={`mt-3 text-2xl font-semibold ${trendColor}`}
            >
              {snapshot.trend}
            </h3>

          </div>

          <div className="text-right">

            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Last Updated
            </p>

            <p className="mt-3 text-white">
              Just now
            </p>

          </div>

        </div>

      </div>

    </motion.section>
  );
}

interface MetricProps {
  icon: any;
  title: string;
  value: string;
}

function Metric({
  icon: Icon,
  title,
  value,
}: MetricProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6">

      <div>

        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {title}
        </p>

        <h3 className="mt-3 text-3xl font-semibold text-white">
          {value}
        </h3>

      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

        <Icon
          size={20}
          className="text-[#D4AF37]"
        />

      </div>

    </div>
  );
}