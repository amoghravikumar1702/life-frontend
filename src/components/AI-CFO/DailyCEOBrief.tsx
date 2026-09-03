"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Brain,
} from "lucide-react";

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
  children?: ReactNode;
}

function formatCurrency(value: number) {
  const amount = Number(value ?? 0);

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function getGreetingText(greeting: string) {
  const clean = greeting?.trim();

  if (!clean) {
    return "Good evening.";
  }

  return clean
    .replace(/^good day[!,.]?\s*/i, "")
    .trim();
}

function splitGreeting(greeting: string) {
  const clean = getGreetingText(greeting);

  const match = clean.match(
    /^(Good\s+(?:morning|afternoon|evening)[!,.]?)\s*(.*)$/i
  );

  if (!match) {
    return {
      prefix: clean,
      name: "",
    };
  }

  return {
    prefix: match[1],
    name: match[2],
  };
}

function getMetricDescription(
  type:
    | "revenue"
    | "expenses"
    | "profit"
    | "receivables",
  value: number
) {
  const amount = Number(value ?? 0);

  if (type === "revenue") {
    return amount > 0 ? "Strong activity" : "No revenue yet";
  }

  if (type === "expenses") {
    return amount > 0 ? "Under review" : "No expenses recorded";
  }

  if (type === "profit") {
    if (amount > 0) return "Positive";
    if (amount < 0) return "Needs attention";
    return "Break-even";
  }

  return amount > 0 ? "Needs attention" : "Clear";
}

function MetricCard({
  label,
  value,
  description,
  positive = false,
  attention = false,
}: {
  label: string;
  value: string;
  description: string;
  positive?: boolean;
  attention?: boolean;
}) {
  return (
    <div
      className="
        min-w-0
        rounded-[17px]
        border
        border-white/[0.065]
        bg-[#11151a]/90
        px-4
        py-4
        shadow-[0_12px_35px_rgba(0,0,0,0.18)]
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-[#D4AF37]/15
        hover:bg-[#14181d]
        sm:px-5
        sm:py-[18px]
      "
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className="
            truncate
            text-[9px]
            font-medium
            uppercase
            tracking-[0.24em]
            text-zinc-600
          "
        >
          {label}
        </p>

        <span
          className={`
            flex
            h-5
            w-5
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            ${
              positive
                ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-400"
                : attention
                  ? "border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] text-[#D4AF37]"
                  : "border-white/[0.06] bg-white/[0.025] text-zinc-600"
            }
          `}
        >
          {positive ? (
            <ArrowUpRight
              size={11}
              strokeWidth={1.8}
            />
          ) : attention ? (
            <ArrowDownRight
              size={11}
              strokeWidth={1.8}
            />
          ) : (
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
          )}
        </span>
      </div>

      <p
        className="
          mt-2.5
          whitespace-nowrap
          text-[20px]
          font-semibold
          leading-none
          tracking-[-0.035em]
          text-white
          sm:text-[22px]
        "
      >
        {value}
      </p>

      <div className="mt-2.5 flex items-center gap-1.5">
        <span
          className={`
            h-1.5
            w-1.5
            shrink-0
            rounded-full
            ${
              positive
                ? "bg-emerald-400"
                : attention
                  ? "bg-[#D4AF37]"
                  : "bg-zinc-700"
            }
          `}
        />

        <p className="truncate text-[9px] text-zinc-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function DailyCEOBrief({
  greeting,
  executiveBrief,
  finance,
}: Props) {
  const { prefix, name } = splitGreeting(greeting);

  const revenue = Number(finance.revenue ?? 0);
  const expenses = Number(finance.expenses ?? 0);
  const profit = Number(finance.profit ?? 0);
  const receivables = Number(
    finance.outstandingReceivables ?? 0
  );

  return (
    <section className="mx-auto w-full max-w-[1240px]">
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
          duration: 0.5,
          ease: "easeOut",
        }}
        className="
          relative
          min-h-[570px]
          overflow-hidden
          rounded-[34px]
          border
          border-[#6d561b]/70
          bg-[#090c10]
          shadow-[0_25px_80px_rgba(0,0,0,0.32)]
          sm:min-h-[580px]
          lg:min-h-[570px]
        "
      >
        {/* =====================================================
            CARD AMBIENCE
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[160px]
            -top-[190px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#D4AF37]/[0.045]
            blur-[130px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[-250px]
            right-[100px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#D4AF37]/[0.025]
            blur-[120px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#D4AF37]/30
            to-transparent
          "
        />

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div
          className="
            relative
            z-30
            flex
            min-h-[570px]
            w-full
            flex-col
            px-7
            py-8
            sm:px-9
            sm:py-9
            lg:w-[67%]
            lg:px-11
            lg:py-10
            xl:w-[65%]
            xl:px-11
          "
        >
          {/* AI BRANDING */}

          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-[15px]
                border
                border-[#D4AF37]/25
                bg-[#D4AF37]/[0.055]
                shadow-[0_0_30px_rgba(212,175,55,0.04)]
              "
            >
              <Brain
                size={18}
                strokeWidth={1.5}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.34em]
                  text-[#D4AF37]
                "
              >
                DHAAR / AI CFO
              </p>

              <p className="mt-1 text-[11px] text-zinc-600">
                Executive intelligence
              </p>
            </div>
          </div>

          {/* ===================================================
              GREETING
          =================================================== */}

          <div className="mt-9">
            <h1
              className="
                text-[43px]
                font-light
                leading-[1.04]
                tracking-[-0.045em]
                text-white
                sm:text-[47px]
                lg:text-[49px]
                xl:text-[50px]
              "
            >
              {prefix}

              {name && (
                <>
                  {" "}
                  <span className="font-medium text-[#D4AF37]">
                    {name}
                  </span>
                </>
              )}
            </h1>
          </div>

          {/* ===================================================
              EXECUTIVE BRIEF
          =================================================== */}

          <p
            className="
              mt-6
              max-w-[650px]
              text-[15px]
              leading-[2.15]
              text-zinc-400
              sm:text-[16px]
              lg:text-[16px]
            "
          >
            {executiveBrief}
          </p>

          {/* ===================================================
              METRICS
          =================================================== */}

          <div
            className="
              mt-auto
              grid
              grid-cols-2
              gap-2.5
              sm:grid-cols-4
              lg:max-w-[650px]
            "
          >
            <MetricCard
              label="Revenue"
              value={formatCurrency(revenue)}
              description={getMetricDescription(
                "revenue",
                revenue
              )}
              positive={revenue > 0}
            />

            <MetricCard
              label="Expenses"
              value={formatCurrency(expenses)}
              description={getMetricDescription(
                "expenses",
                expenses
              )}
              attention={expenses > 0}
            />

            <MetricCard
              label="Profit"
              value={formatCurrency(profit)}
              description={getMetricDescription(
                "profit",
                profit
              )}
              positive={profit > 0}
              attention={profit < 0}
            />

            <MetricCard
              label="Receivables"
              value={formatCurrency(receivables)}
              description={getMetricDescription(
                "receivables",
                receivables
              )}
              attention={receivables > 0}
            />
          </div>
        </div>

        {/* =====================================================
            DHAAR / FALCON

            The falcon intentionally extends below the hero
            boundary. The parent overflow-hidden clips the
            bottom naturally at the card edge.
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[-28px]
            right-[-42px]
            z-20
            hidden
            h-[590px]
            w-[50%]
            sm:block
            sm:right-[-34px]
            sm:h-[610px]
            sm:w-[49%]
            lg:right-[-25px]
            lg:h-[625px]
            lg:w-[50%]
            xl:right-[-12px]
            xl:h-[640px]
            xl:w-[50%]
          "
        >
          <Image
            src="/images/dhaar/dhaar-mascot.png"
            alt=""
            fill
            priority
            sizes="
              (max-width: 640px) 0px,
              (max-width: 1024px) 49vw,
              50vw
            "
            className="
              select-none
              object-contain
              object-bottom
            "
          />
        </div>

        {/* =====================================================
            CARD EDGE
        ===================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-40
            rounded-[34px]
            ring-1
            ring-inset
            ring-white/[0.025]
          "
        />
      </motion.section>
    </section>
  );
}