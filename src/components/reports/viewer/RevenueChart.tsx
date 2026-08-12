"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils/formatCurrency";

interface Point {
  date: string;
  revenue: number;
}

interface Props {
  data: Point[];
}

export default function RevenueChart({
  data,
}: Props) {
  return (
    <section className="rounded-[34px] border border-white/[0.08] bg-[#101214] p-8">

      <div className="mb-8">

        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
          Revenue Trend
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
          Revenue Performance
        </h2>

      </div>

      <div className="h-[380px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid
              stroke="rgba(255,255,255,.05)"
              vertical={false}
            />

           <XAxis
  dataKey="date"
  stroke="#71717A"
  tickFormatter={(value) =>
    new Date(value).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    )
  }
/>
            <YAxis
              stroke="#71717A"
              tickFormatter={(value) =>
                formatCurrency(Number(value))
              }
            />

            <Tooltip
  contentStyle={{
    background: "#FFFFFF",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "16px",
    color: "#090909",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
  }}
  labelStyle={{
    color: "#090909",
    fontWeight: 600,
  }}
  itemStyle={{
    color: "#090909",
    fontWeight: 500,
  }}
  formatter={(value) =>
    formatCurrency(Number(value))
  }
  labelFormatter={(label) =>
    (() => {
      if (!label) return "";
      const date = new Date(String(label));
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
      });
    })()
  }
/>

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#D4AF37"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#D4AF37",
              }}
              activeDot={{
                r: 6,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </section>
  );
}