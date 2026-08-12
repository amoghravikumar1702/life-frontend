"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

export interface ForecastPoint {
  month: string;
  actual?: number;
  projected?: number;
}

interface ForecastProjectionChartProps {
  data: ForecastPoint[];
}

const money = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;

export default function ForecastProjectionChart({
  data,
}: ForecastProjectionChartProps) {
  return (
    <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">

      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Projection
        </p>

        <h2 className="ArkenOne-gold mt-2 text-4xl font-bold">
          Revenue Forecast
        </h2>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
          Compare historical performance with projected
          revenue to understand where your business is
          heading.
        </p>

      </div>

      <div className="h-[420px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: -20,
              bottom: 10,
            }}
          >

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
              // Accept undefined and other possible arg shapes from recharts
              formatter={(value: any) =>
                value == null ? "" : money(Number(value))
              }
            />

            {/* Today Divider */}

            <ReferenceLine
              x="Today"
              stroke="#666"
              strokeDasharray="5 5"
              label={{
                value: "Today",
                position: "top",
                fill: "#D4AF37",
                fontSize: 12,
              }}
            />

            {/* Historical */}

            <Line
              type="monotone"
              dataKey="actual"
              stroke="#D4AF37"
              strokeWidth={3}
              dot={false}
              animationDuration={1800}
            />

            {/* Forecast */}

            <Line
              type="monotone"
              dataKey="projected"
              stroke="#D4AF37"
              strokeWidth={3}
              strokeDasharray="8 6"
              dot={false}
              animationDuration={2200}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-8 rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/5 p-5">

        <p className="text-sm leading-7 text-zinc-300">

          The solid line represents completed financial
          performance. The dashed line represents the
          projected trajectory based on current business
          trends.

        </p>

      </div>

    </section>
  );
}