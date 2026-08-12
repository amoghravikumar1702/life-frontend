"use client";

import {
  ArrowUpRight,
  Clock3,
  Target,
} from "lucide-react";

import AnimatedNumber from "@/components/ui/AnimatedNumber";

interface Props {
  receivables: number;
}

export default function TodaysFocus({
  receivables,
}: Props) {
  return (
    <section
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-[26px]
        border
        border-white/[0.06]
        bg-[#101318]
        p-5
        transition-all
        duration-300
        hover:border-white/[0.09]
        sm:p-6
      "
    >
      {/* SUBTLE GOLD VISUAL */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-100px]
          top-[-120px]
          h-[220px]
          w-[220px]
          rounded-full
          bg-[#D4AF37]/[0.025]
          blur-[90px]
        "
      />

      <div className="relative">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-[14px]
                border
                border-[#D4AF37]/15
                bg-[#D4AF37]/[0.07]
              "
            >
              <Target
                size={18}
                strokeWidth={1.8}
                className="text-[#D4AF37]"
              />
            </div>

            <div className="min-w-0">

              <p
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.34em]
                  text-zinc-500
                "
              >
                Today's Focus
              </p>

              <h2
                className="
                  mt-1
                  truncate
                  text-[20px]
                  font-semibold
                  tracking-[-0.035em]
                  text-white
                "
              >
                Collect Payments
              </h2>

            </div>
          </div>

          <ArrowUpRight
            size={17}
            strokeWidth={1.7}
            className="
              mt-1
              shrink-0
              text-zinc-600
              transition-all
              duration-300
              group-hover:-translate-y-0.5
              group-hover:translate-x-0.5
              group-hover:text-[#D4AF37]
            "
          />

        </div>

        {/* DESCRIPTION */}

        <p
          className="
            mt-7
            max-w-[390px]
            text-[13px]
            leading-6
            text-zinc-500
          "
        >
          Recover outstanding invoices to improve liquidity
          and strengthen working capital.
        </p>

        {/* OUTSTANDING */}

        <div className="mt-7">

          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.32em]
              text-zinc-600
            "
          >
            Outstanding
          </p>

          <div className="mt-2 flex items-end gap-3">

            <div
              className="
                text-[36px]
                font-semibold
                leading-none
                tracking-[-0.05em]
                text-white
              "
            >
              <AnimatedNumber
                value={receivables}
                format="currency"
              />
            </div>

            <span
              className="
                mb-0.5
                text-[11px]
                font-medium
                text-emerald-400
              "
            >
              Recoverable
            </span>

          </div>

        </div>

        {/* DIVIDER */}

        <div className="mt-5 h-px bg-white/[0.05]" />

        {/* FOOTER */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-3
          "
        >

          {/* PRIORITY */}

          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/[0.06]
              bg-white/[0.025]
              px-3
              py-1.5
            "
          >
            <Clock3
              size={12}
              strokeWidth={1.8}
              className="text-zinc-500"
            />

            <span className="text-[10px] text-zinc-400">
              Highest Priority
            </span>
          </div>

          {/* ACTION */}

          <div
            className="
              flex
              items-center
              gap-1.5
              text-[#D4AF37]
            "
          >
            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.3em]
              "
            >
              Action
            </span>

            <ArrowUpRight
              size={13}
              className="
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </div>

        </div>

      </div>
    </section>
  );
}