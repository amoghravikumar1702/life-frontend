"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  Receipt,
} from "lucide-react";

interface ExecutiveKPIRibbonProps {
  revenue: number;
  profit: number;
  cash: number;
  receivables: number;
}

const formatMoney = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;

export default function ExecutiveKPIRibbon({
  revenue,
  profit,
  cash,
  receivables,
}: ExecutiveKPIRibbonProps) {
  const cards = [
    {
      title: "Revenue",
      value: formatMoney(revenue),
      subtitle: "Total Revenue",
      icon: TrendingUp,
    },
    {
      title: "Profit",
      value: formatMoney(profit),
      subtitle: "Net Profit",
      icon: PiggyBank,
    },
    {
      title: "Cash",
      value: formatMoney(cash),
      subtitle: "Available Cash",
      icon: Wallet,
    },
    {
      title: "Receivables",
      value: formatMoney(receivables),
      subtitle: "Outstanding",
      icon: Receipt,
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card, index) => {

        const Icon = card.icon;

        return (

          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: index * 0.08,
            }}
            className="
              rounded-[28px]
              border
              border-white/10
              bg-[#111111]
              p-6
            "
          >

            <div className="flex items-center justify-between">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#D4AF37]/10
                "
              >

                <Icon
                  size={20}
                  className="text-[#D4AF37]"
                />

              </div>

              <span
                className="
                  rounded-full
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  px-3
                  py-1
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-emerald-400
                "
              >
                Live
              </span>

            </div>

            <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
              {card.title}
            </p>

            <h2 className="finzura-gold mt-3 text-4xl font-bold">
              {card.value}
            </h2>

            <p className="mt-3 text-sm text-zinc-500">
              {card.subtitle}
            </p>

          </motion.div>

        );

      })}

    </section>
  );
}