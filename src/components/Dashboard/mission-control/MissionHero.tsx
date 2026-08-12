"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface Props {
  revenue: number;
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
  receivables,
  healthScore,
}: Props) {
  const greeting = getGreeting();

  const score = Math.max(0, Math.min(100, healthScore ?? 0));

  /*
   * Business performance visual:
   *
   * 85–100  → strong upward trajectory
   * 70–84   → gentle upward trajectory
   * 50–69   → stable / flat trajectory
   * 0–49    → downward trajectory
   */

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
      {/* =========================================================
          SUBTLE EXECUTIVE GLOW
      ========================================================= */}

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

      {/* =========================================================
          SUBTLE PERFORMANCE TRAJECTORY
          Lives ONLY in the empty right-side space.
      ========================================================= */}

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
        {/* Very subtle baseline */}

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

        {/* Very subtle vertical guide */}

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
          {/* Main trajectory */}

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

          {/* Extremely subtle secondary line */}

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

        {/* Endpoint */}

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

      {/* =========================================================
          CONTENT
      ========================================================= */}

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
          in recorded revenue, with{" "}
          <span className="font-semibold text-[#D4AF37]">
            {money(receivables)}
          </span>{" "}
          currently outstanding.
        </p>

        {/* DIVIDER */}

        <div className="mt-8 h-px w-full bg-white/[0.05]" />

        {/* KEY FIGURES */}

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
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
              Recorded Revenue
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

          {/* RECEIVABLES */}

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
              Outstanding Receivables
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
                {money(receivables)}
              </p>

              <ArrowUpRight
                size={18}
                className="mb-1 text-zinc-500"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}