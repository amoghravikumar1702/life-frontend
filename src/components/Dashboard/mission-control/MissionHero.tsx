"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface Props {
  revenue: number;
  expenses: number;
  profit: number;
  cashAvailable: number;
  receivables: number;
  healthScore: number;
}

function money(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value ?? 0))}`;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MissionHero({
  revenue,
  expenses,
  profit,
  cashAvailable,
  receivables,
  healthScore,
}: Props) {
  const greeting = getGreeting();

  const score = Math.max(
    0,
    Math.min(100, Number(healthScore ?? 0))
  );

  const profitPositive = Number(profit ?? 0) >= 0;

  const linePoints =
    score >= 85
      ? "0,76 35,71 70,64 105,56 140,47 175,37 210,27 245,17"
      : score >= 70
        ? "0,67 35,65 70,62 105,59 140,55 175,51 210,47 245,43"
        : score >= 50
          ? "0,57 35,57 70,58 105,57 140,58 175,57 210,58 245,57"
          : "0,28 35,34 70,40 105,46 140,52 175,59 210,66 245,74";

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
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/[0.06]
        bg-[#101318]
        px-7
        py-8
        sm:px-10
        sm:py-10
        lg:px-12
        lg:py-11
      "
    >
      {/* SUBTLE EXECUTIVE GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-[-160px]
          h-[360px]
          w-[360px]
          rounded-full
          bg-[#D4AF37]/[0.035]
          blur-[120px]
        "
      />

      {/* PERFORMANCE TRAJECTORY */}

      <div
        className="
          pointer-events-none
          absolute
          right-8
          top-1/2
          hidden
          h-[150px]
          w-[290px]
          -translate-y-1/2
          lg:block
        "
      >
        <div
          className="
            absolute
            bottom-[27px]
            left-0
            right-0
            h-px
            bg-white/[0.035]
          "
        />

        <div
          className="
            absolute
            bottom-[27px]
            left-0
            top-0
            w-px
            bg-white/[0.025]
          "
        />

        <svg
          viewBox="0 0 245 90"
          className="
            absolute
            bottom-[28px]
            left-0
            h-[90px]
            w-[245px]
          "
          fill="none"
          preserveAspectRatio="none"
        >
          <motion.polyline
            points={linePoints}
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.22}
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 0.22,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
          />

          <motion.polyline
            points={linePoints}
            stroke="#D4AF37"
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.08}
            initial={{
              pathLength: 0,
            }}
            animate={{
              pathLength: 1,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
          />
        </svg>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 0.4,
            scale: 1,
          }}
          transition={{
            delay: 0.8,
            duration: 0.35,
          }}
          className="
            absolute
            bottom-[43px]
            right-[34px]
            h-1.5
            w-1.5
            rounded-full
            bg-[#D4AF37]
            shadow-[0_0_12px_rgba(212,175,55,0.30)]
          "
        />
      </div>

      {/* CONTENT */}

      <div className="relative">
        {/* LABEL */}

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
              Mission Control
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Executive business overview
            </p>
          </div>
        </div>

        {/* GREETING */}

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
          {greeting},
          <br />
          Amogh.
        </h1>

        {/* DESCRIPTION */}

        <p
          className="
            mt-6
            max-w-3xl
            text-[16px]
            leading-8
            text-zinc-400
            sm:text-[17px]
          "
        >
          Your business has generated{" "}
          <span className="font-semibold text-white">
            {money(revenue)}
          </span>{" "}
          in recorded revenue and incurred{" "}
          <span className="font-semibold text-red-300">
            {money(expenses)}
          </span>{" "}
          in expenses, leaving{" "}
          <span
            className={`font-semibold ${
              profitPositive
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {money(Math.abs(profit))}
          </span>{" "}
          in {profitPositive ? "profit" : "loss"}.
        </p>

        {/* DIVIDER */}

        <div className="mt-8 h-px w-full bg-white/[0.05]" />

        {/* KEY FIGURES */}

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* REVENUE */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.05]
              bg-white/[0.02]
              px-6
              py-5
            "
          >
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

            <div className="mt-3 flex items-end justify-between gap-4">
              <p
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.03em]
                  text-white
                "
              >
                {money(revenue)}
              </p>

              <ArrowUpRight
                size={18}
                className="mb-1 text-[#D4AF37]"
              />
            </div>
          </div>

          {/* EXPENSES */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.05]
              bg-white/[0.02]
              px-6
              py-5
            "
          >
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

            <div className="mt-3 flex items-end justify-between gap-4">
              <p
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.03em]
                  text-red-300
                "
              >
                {money(expenses)}
              </p>

              <ArrowUpRight
                size={18}
                className="mb-1 text-zinc-500"
              />
            </div>
          </div>

          {/* PROFIT */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.05]
              bg-white/[0.02]
              px-6
              py-5
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              {profitPositive ? "Net Profit" : "Net Loss"}
            </p>

            <div className="mt-3 flex items-end justify-between gap-4">
              <p
                className={`
                  text-3xl
                  font-semibold
                  tracking-[-0.03em]
                  ${
                    profitPositive
                      ? "text-emerald-400"
                      : "text-red-400"
                  }
                `}
              >
                {money(Math.abs(profit))}
              </p>

              <ArrowUpRight
                size={18}
                className={
                  profitPositive
                    ? "mb-1 text-emerald-400"
                    : "mb-1 text-red-400"
                }
              />
            </div>
          </div>

          {/* CASH */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.05]
              bg-white/[0.02]
              px-6
              py-5
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              Available Cash
            </p>

            <div className="mt-3 flex items-end justify-between gap-4">
              <p
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.03em]
                  text-white
                "
              >
                {money(cashAvailable)}
              </p>

              <ArrowUpRight
                size={18}
                className="mb-1 text-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* RECEIVABLES + HEALTH */}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div
            className="
              rounded-2xl
              border
              border-[#D4AF37]/10
              bg-[#D4AF37]/[0.025]
              px-6
              py-5
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              Outstanding Receivables
            </p>

            <div className="mt-3 flex items-end justify-between gap-4">
              <p
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.03em]
                  text-[#D4AF37]
                "
              >
                {money(receivables)}
              </p>

              <ArrowUpRight
                size={18}
                className="mb-1 text-[#D4AF37]"
              />
            </div>
          </div>

          <div
            className="
              rounded-2xl
              border
              border-white/[0.05]
              bg-white/[0.02]
              px-6
              py-5
            "
          >
            <div className="flex items-center justify-between">
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-zinc-500
                "
              >
                Financial Health
              </p>

              <span
                className="
                  text-2xl
                  font-semibold
                  text-white
                "
              >
                {Math.round(score)}
                <span className="ml-1 text-xs text-zinc-600">
                  /100
                </span>
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="
                  h-full
                  rounded-full
                  bg-[#D4AF37]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}