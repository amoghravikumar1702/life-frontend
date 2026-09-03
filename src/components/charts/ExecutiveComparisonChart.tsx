"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  TrendingUp,
  TrendingDown,
  Landmark,
} from "lucide-react";

export interface ComparisonPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface ExecutiveComparisonChartProps {
  data: ComparisonPoint[];
}

const money = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;

export default function ExecutiveComparisonChart({
  data,
}: ExecutiveComparisonChartProps) {

  const latest = data[data.length - 1];

  return (
    <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">

      {/* Header */}

      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Performance
        </p>

        <h2 className="DhanarkOS-gold mt-2 text-4xl font-bold">
          Revenue vs Expenses
        </h2>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
          Understand how efficiently your business
          converts revenue into profit over time.
        </p>

      </div>

      {/* KPI Cards */}

      <div className="mb-10 grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

          <div className="flex items-center gap-3">

            <TrendingUp
              size={18}
              className="text-emerald-400"
            />

            <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Revenue
            </span>

          </div>

          <h3 className="mt-4 text-3xl font-bold text-white">
            {money(latest?.revenue ?? 0)}
          </h3>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

          <div className="flex items-center gap-3">

            <TrendingDown
              size={18}
              className="text-red-400"
            />

            <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Expenses
            </span>

          </div>

          <h3 className="mt-4 text-3xl font-bold text-white">
            {money(latest?.expenses ?? 0)}
          </h3>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

          <div className="flex items-center gap-3">

            <Landmark
              size={18}
              className="text-[#D4AF37]"
            />

            <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Profit
            </span>

          </div>

          <h3 className="mt-4 DhanarkOS-gold text-3xl font-bold">
            {money(latest?.profit ?? 0)}
          </h3>

        </div>

      </div>

      {/* Chart */}

      <div className="h-[380px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

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
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={money}
              tick={{
                fill: "#8A8A8A",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#181818",
                border:
                  "1px solid rgba(255,255,255,.08)",
                borderRadius: 18,
                color: "#fff",
              }}
              formatter={(value: any) => {
                const num = typeof value === "number" ? value : Number(value);
                return money(Number.isFinite(num) ? num : 0);
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#D4AF37"
              strokeWidth={3}
              dot={false}
              animationDuration={1700}
            />

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              animationDuration={1700}
            />

            <Line
              type="monotone"
              dataKey="profit"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
              animationDuration={1700}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* Executive Insight */}

      <div className="mt-8 rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/5 p-5">

        <p className="text-sm leading-7 text-zinc-300">

          Revenue should consistently remain above
          expenses. A widening gap between revenue and
          expenses indicates improving profitability and
          stronger operational efficiency.

        </p>

      </div>

    </section>
  );
}