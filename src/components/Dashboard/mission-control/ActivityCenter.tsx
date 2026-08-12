"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
} from "lucide-react";

import BentoCard from "@/components/ui/BentoCard";

interface Activity {
  id: string;
  type: "payment" | "invoice" | "customer";
  title: string;
  description: string;
  createdAt: string;
}

interface ActivityCenterProps {
  activity: Activity[];
}

function getIcon(type: Activity["type"]) {
  switch (type) {
    case "payment":
      return CheckCircle2;
    case "invoice":
      return FileText;
    case "customer":
      return Building2;
    default:
      return CheckCircle2;
  }
}

function getColor(type: Activity["type"]) {
  switch (type) {
    case "payment":
      return "bg-emerald-500/10 text-emerald-400";
    case "invoice":
      return "bg-[#D4AF37]/10 text-[#D4AF37]";
    case "customer":
      return "bg-sky-500/10 text-sky-400";
    default:
      return "bg-white/10 text-white";
  }
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function ActivityCenter({
  activity,
}: ActivityCenterProps) {
  const recent = activity.slice(0, 5);

  return (
    <section className="h-full">

      <div className="mb-5 flex items-end justify-between">

        <div>

          <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
            Executive Timeline
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Latest Activity
          </h2>

        </div>

        <Link
          href="/dashboard/reports"
          className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          View All

          <ArrowRight
            size={15}
            className="text-[#D4AF37]"
          />
        </Link>

      </div>

      <BentoCard
        hover={false}
        className="h-[410px] overflow-hidden p-6"
      >

        <div className="relative h-full overflow-y-auto pr-2">

          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-white/10" />

          <div className="space-y-6">

            {recent.length === 0 ? (

              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 text-zinc-500">
                No recent activity.
              </div>

            ) : (

              recent.map((item, index) => {
                const Icon = getIcon(item.type);

                return (
                  <motion.div
                    key={item.id}
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
                    className="relative flex gap-4"
                  >

                    <div
                      className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 ${getColor(
                        item.type
                      )}`}
                    >
                      <Icon size={15} />
                    </div>

                    <div className="flex-1">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h3 className="text-[15px] font-semibold text-white">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-zinc-400">
                            {item.description}
                          </p>

                        </div>

                        <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-500">
                          {formatTime(item.createdAt)}
                        </span>

                      </div>

                    </div>

                  </motion.div>
                );
              })

            )}

          </div>

        </div>

      </BentoCard>

    </section>
  );
}