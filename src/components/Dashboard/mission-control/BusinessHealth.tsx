"use client";

import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Wallet,
  Receipt,
  Users,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import { calculateHealthScore } from "@/lib/intelligence";

interface Snapshot {
  revenue: number;
  expenses: number;
  outstandingReceivables: number;
  overdueInvoices: number;
  customerCount: number;
  invoiceCount: number;
  paymentCount: number;
}

interface BusinessHealthProps {
  snapshot: Snapshot;
}

function money(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export default function BusinessHealth({
  snapshot,
}: BusinessHealthProps) {
  const score = calculateHealthScore(snapshot);

  const scoreColor =
    score >= 85
      ? "text-emerald-400"
      : score >= 70
      ? "text-yellow-400"
      : "text-red-400";

  const status =
    score >= 85
      ? "Excellent"
      : score >= 70
      ? "Healthy"
      : "Needs Attention";

  const metrics = [
    {
      icon: TrendingUp,
      title: "Revenue",
      value: money(snapshot.revenue),
    },
    {
      icon: Wallet,
      title: "Receivables",
      value: money(snapshot.outstandingReceivables),
    },
    {
      icon: Users,
      title: "Customers",
      value: snapshot.customerCount.toString(),
    },
    {
      icon: Receipt,
      title: "Invoices",
      value: snapshot.invoiceCount.toString(),
    },
  ];

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: .45,
      }}
      className="
        rounded-[32px]
        border
        border-white/10
        bg-[#121214]
        p-7
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[11px] uppercase tracking-[0.35em] text-zinc-500">
            Business Health
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-white">
            Financial Position
          </h2>

        </div>

        <div
          className="
            flex
            items-center
            gap-3
            rounded-full
            border
            border-emerald-500/20
            bg-emerald-500/10
            px-4
            py-2
          "
        >

          <ShieldCheck
            size={16}
            className={scoreColor}
          />

          <span
            className={`text-sm font-medium ${scoreColor}`}
          >
            {status}
          </span>

        </div>

      </div>

      {/* Score Card */}

      <div
        className="
          mt-7
          rounded-3xl
          border
          border-white/10
          bg-[#171719]
          p-7
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Financial Health Score
            </p>

            <motion.h2
              initial={{
                opacity: 0,
                scale: .95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className={`mt-2 text-7xl font-bold tracking-tight ${scoreColor}`}
            >
              {score}
            </motion.h2>

          </div>

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-white/5
            "
          >

            <Activity
              size={28}
              className={scoreColor}
            />

          </div>

        </div>

        <div className="mt-6 h-2.5 rounded-full bg-white/10">

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${score}%`,
            }}
            transition={{
              duration: 1,
            }}
                        className={`h-full rounded-full ${
              score >= 85
                ? "bg-emerald-400"
                : score >= 70
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
          />

        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-zinc-500">

          <span>Critical</span>

          <span>Moderate</span>

          <span>Excellent</span>

        </div>

      </div>

      {/* Metrics */}

      <div
        className="
          mt-7
          grid
          grid-cols-2
          gap-4
        "
      >

        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <motion.div
              key={metric.title}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.02]
                p-5
              "
            >

              <div className="flex items-center justify-between">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/5
                  "
                >

                  <Icon
                    size={18}
                    className="text-[#D4AF37]"
                  />

                </div>

                <ArrowUpRight
                  size={16}
                  className="text-zinc-600"
                />

              </div>

              <p className="mt-5 text-xs uppercase tracking-[0.25em] text-zinc-500">
                {metric.title}
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-white">
                {metric.value}
              </h3>

            </motion.div>
          );
        })}

      </div>

      {/* Footer */}
            <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.25,
        }}
        className="
          mt-7
          rounded-3xl
          border
          border-[#D4AF37]/15
          bg-gradient-to-br
          from-[#D4AF37]/5
          via-transparent
          to-transparent
          p-6
        "
      >

        <div className="flex items-start justify-between gap-6">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Executive Summary
            </p>

            <h3 className="mt-3 text-xl font-semibold text-white">
              {status}
            </h3>

            <p className="mt-4 max-w-xl leading-8 text-zinc-400">
              Revenue generation remains healthy while current receivables
              should be monitored closely. Continue prioritising customer
              collections to strengthen cash availability and maintain a
              strong financial position.
            </p>

          </div>

          <div
            className="
              rounded-2xl
              border
              border-emerald-500/20
              bg-emerald-500/10
              px-5
              py-4
              text-center
            "
          >

            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Overall Score
            </p>

            <p className={`mt-2 text-4xl font-bold ${scoreColor}`}>
              {score}
            </p>

          </div>

        </div>

      </motion.div>

    </motion.section>
  );
}