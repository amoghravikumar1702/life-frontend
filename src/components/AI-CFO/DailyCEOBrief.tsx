// src/components/AI-CFO/DailyCEOBrief.tsx

"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Finance {
  revenue: number;
  expenses: number;
  profit: number;
  outstandingReceivables: number;
}

interface Props {
  greeting: string;
  executiveBrief: string;
  recommendation: string;
  finance: Finance;
}

function formatCurrency(value: number) {
  const amount = Number(value ?? 0);

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export default function DailyCEOBrief({
  greeting,
  executiveBrief,
  finance,
}: Props) {
  return (
    <section className="mx-auto max-w-7xl space-y-8">

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
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-white/[0.06]
          bg-[#101318]
          px-7
          py-9
          sm:px-10
          sm:py-11
          lg:px-12
          lg:py-12
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            right-[-140px]
            top-[-160px]
            h-[360px]
            w-[360px]
            rounded-full
            bg-[#D4AF37]/[0.035]
            blur-[120px]
          "
        />

        <div className="relative">

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-[#D4AF37]/15
                bg-[#D4AF37]/[0.07]
              "
            >
              <Sparkles
                size={17}
                strokeWidth={1.8}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.38em]
                  text-[#D4AF37]
                "
              >
                AI CFO
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Executive Intelligence
              </p>
            </div>

          </div>

          <h1
            className="
              mt-8
              text-4xl
              font-semibold
              tracking-[-0.045em]
              text-white
              sm:text-5xl
              lg:text-[54px]
            "
          >
            {greeting}
          </h1>

          <div className="mt-6 h-px w-full bg-white/[0.05]" />

          <p
            className="
              mt-7
              max-w-4xl
              text-[16px]
              leading-8
              text-zinc-400
              sm:text-[17px]
            "
          >
            {executiveBrief}
          </p>

        </div>
      </motion.section>

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
          delay: 0.08,
          ease: "easeOut",
        }}
        className="
          overflow-hidden
          rounded-[30px]
          border
          border-white/[0.06]
          bg-[#101318]
        "
      >

        <div
          className="
            flex
            flex-col
            gap-2
            border-b
            border-white/[0.05]
            px-7
            py-6
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
          "
        >

          <div>
            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.38em]
                text-zinc-500
              "
            >
              Financial Position
            </p>

            <h2
              className="
                mt-2
                text-xl
                font-semibold
                tracking-[-0.02em]
                text-white
              "
            >
              Current financial picture
            </h2>
          </div>

          <p className="text-xs text-zinc-600">
            Live business data
          </p>

        </div>

        <div
          className="
            grid
            grid-cols-2
            divide-x
            divide-y
            divide-white/[0.05]
            md:grid-cols-4
            md:divide-y-0
          "
        >

          <div className="min-h-[130px] px-6 py-7 sm:px-8">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              Revenue
            </p>

            <p
              className="
                mt-5
                text-2xl
                font-semibold
                tracking-[-0.03em]
                text-white
              "
            >
              {formatCurrency(finance.revenue)}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Recorded revenue
            </p>
          </div>

          <div className="min-h-[130px] px-6 py-7 sm:px-8">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              Expenses
            </p>

            <p
              className="
                mt-5
                text-2xl
                font-semibold
                tracking-[-0.03em]
                text-white
              "
            >
              {formatCurrency(finance.expenses)}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Recorded expenses
            </p>
          </div>

          <div className="min-h-[130px] px-6 py-7 sm:px-8">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              Profit
            </p>

            <p
              className={`
                mt-5
                text-2xl
                font-semibold
                tracking-[-0.03em]
                ${
                  Number(finance.profit) >= 0
                    ? "text-white"
                    : "text-rose-300"
                }
              `}
            >
              {formatCurrency(finance.profit)}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Revenue less expenses
            </p>
          </div>

          <div className="min-h-[130px] px-6 py-7 sm:px-8">
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              Receivables
            </p>

            <p
              className="
                mt-5
                text-2xl
                font-semibold
                tracking-[-0.03em]
                text-white
              "
            >
              {formatCurrency(
                finance.outstandingReceivables
              )}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Outstanding customer balances
            </p>
          </div>

        </div>
      </motion.section>

    </section>
  );
}