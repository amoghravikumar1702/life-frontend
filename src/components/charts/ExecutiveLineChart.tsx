"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";

export interface ExecutiveLinePoint {
  month: string;
  revenue: number;
}

interface ExecutiveLineChartProps {
  title: string;
  subtitle?: string;
  data: ExecutiveLinePoint[];
}

const formatCurrency = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;

export default function ExecutiveLineChart({
  title,
  subtitle,
  data,
}: ExecutiveLineChartProps) {
  const totalRevenue = data.reduce(
    (sum, point) => sum + point.revenue,
    0
  );

  const bestMonth =
    data.length > 0
      ? data.reduce((a, b) =>
          a.revenue > b.revenue ? a : b
        ).month
      : "--";

  const latestRevenue =
    data[data.length - 1]?.revenue ?? 0;

  return (
    <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">

      {/* Header */}

      <div className="mb-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Intelligence
          </p>

          <h2 className="ArkenOne-gold mt-2 text-4xl font-bold">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
              {subtitle}
            </p>
          )}

        </div>

        {/* KPI Chips */}

        <div className="flex flex-wrap gap-4">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">

            <div className="flex items-center gap-2">

              <TrendingUp
                size={15}
                className="text-[#D4AF37]"
              />

              <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Revenue
              </span>

            </div>

            <p className="mt-2 text-2xl font-bold text-white">
              {formatCurrency(totalRevenue)}
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">

            <div className="flex items-center gap-2">

              <Calendar
                size={15}
                className="text-[#D4AF37]"
              />

              <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Best Month
              </span>

            </div>

            <p className="mt-2 text-2xl font-bold text-white">
              {bestMonth}
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">

            <div className="flex items-center gap-2">

              <BarChart3
                size={15}
                className="text-[#D4AF37]"
              />

              <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Latest
              </span>

            </div>

            <p className="mt-2 text-2xl font-bold text-white">
              {formatCurrency(latestRevenue)}
            </p>

          </div>

        </div>

      </div>

      {/* Empty State */}

      {data.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center rounded-3xl border border-dashed border-white/10">

          <div className="text-center">

            <h3 className="text-xl font-semibold text-white">
              No Revenue History Yet
            </h3>

            <p className="mt-3 text-zinc-500">
              Completed payments will automatically
              appear here.
            </p>

          </div>

        </div>
      ) : (
        <div className="h-[360px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >

              <defs>

                <linearGradient
                  id="goldGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#D4AF37"
                    stopOpacity={0.28}
                  />

                  <stop
                    offset="100%"
                    stopColor="#D4AF37"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,.05)"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#8A8A8A",
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tickFormatter={formatCurrency}
                tick={{
                  fill: "#8A8A8A",
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={{
                  stroke: "#D4AF37",
                  strokeOpacity: 0.15,
                }}
                contentStyle={{
                  background: "#181818",
                  border:
                    "1px solid rgba(255,255,255,.08)",
                  borderRadius: 18,
                  color: "#fff",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,.35)",
                }}
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Revenue",
                ]}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                fill="url(#goldGradient)"
                stroke="none"
                animationDuration={1500}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#D4AF37"
                strokeWidth={3}
                dot={{
                  r: 3,
                  fill: "#D4AF37",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 6,
                  fill: "#D4AF37",
                }}
                animationDuration={1800}
                animationEasing="ease-in-out"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>
      )}

      {/* Footer */}

      <div className="mt-8 rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/5 p-5">

        <p className="text-sm leading-7 text-zinc-300">

          Revenue history is generated from completed
          customer payments. As new payments are
          received, this chart updates automatically,
          giving you a live view of your business growth.

        </p>

      </div>

    </section>
  );
}