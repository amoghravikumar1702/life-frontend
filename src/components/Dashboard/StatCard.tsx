"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet,
  FileText,
  Landmark,
  TriangleAlert,
} from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  href?: string;
};

const cardData = {
  "Money to Collect": {
    icon: Wallet,
    trend: "+12%",
    trendColor: "text-green-400",
    bg: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
  },

  "Bills Due": {
    icon: FileText,
    trend: "-5%",
    trendColor: "text-orange-400",
    bg: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },

  "Cash Position": {
    icon: Landmark,
    trend: "+8%",
    trendColor: "text-green-400",
    bg: "bg-green-500/10",
    iconColor: "text-green-400",
  },

  Alerts: {
    icon: TriangleAlert,
    trend: "3 Active",
    trendColor: "text-red-400",
    bg: "bg-red-500/10",
    iconColor: "text-red-400",
  },
};

export default function StatCard({
  title,
  value,
  href = "#",
}: StatCardProps) {
  const data =
    cardData[title as keyof typeof cardData];

  const Icon = data.icon;

  return (
    <Link href={href} className="block">
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
        }}
        whileTap={{
          scale: 0.98,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
        }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] via-[#0B1220] to-[#070B14] p-6 shadow-[0_10px_50px_rgba(0,0,0,0.35)] duration-500 hover:border-cyan-400/40 hover:shadow-[0_0_45px_rgba(34,211,238,0.20)]"
      >
        {/* Ambient Glow */}

        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/5 to-cyan-500/0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        {/* Floating Blur */}

        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition-all duration-700 group-hover:scale-150" />

        <div className="relative z-10">

          <div className="flex items-center justify-between">

            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.08,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
              }}
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${data.bg}`}
            >
              <Icon
                size={30}
                className={data.iconColor}
              />
            </motion.div>

            <span
              className={`rounded-full bg-white/5 px-4 py-1 text-sm font-semibold backdrop-blur ${data.trendColor}`}
            >
              {data.trend}
            </span>

          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-gray-400">
            {title}
          </p>

          <motion.h2
            layout
            className="mt-3 text-4xl font-bold tracking-tight"
          >
            {value}
          </motion.h2>

          <div className="mt-8 h-[3px] overflow-hidden rounded-full bg-white/10">

            <motion.div
              initial={{
                width: "25%",
              }}
              whileHover={{
                width: "100%",
              }}
              transition={{
                duration: 0.6,
              }}
              className="h-full rounded-full bg-cyan-400"
            />

          </div>

        </div>
      </motion.div>
    </Link>
  );
}