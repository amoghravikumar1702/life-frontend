"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Building2,
  ArrowRight,
} from "lucide-react";

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
      return "text-emerald-400";
    case "invoice":
      return "text-[#D4AF37]";
    case "customer":
      return "text-sky-400";
    default:
      return "text-white";
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
  const recentActivity = activity.slice(0, 5);

  return (
    <section className="flex h-[620px] flex-col rounded-[32px] border border-white/10 bg-white/[0.02] p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Activity Center
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Recent Activity
        </h2>
      </div>

      <div className="relative mt-8 flex-1 overflow-y-auto pr-2">
        <div className="absolute bottom-2 left-5 top-2 w-px bg-white/10" />

        <div className="space-y-6">
          {recentActivity.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-zinc-500">
              No recent activity.
            </div>
          ) : (
            recentActivity.map((item, index) => {
              const Icon = getIcon(item.type);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex gap-5"
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#171719] ${getColor(
                      item.type
                    )}`}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold text-white">
                        {item.title}
                      </h3>

                      <span className="whitespace-nowrap text-xs text-zinc-500">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="mt-2 leading-6 text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] py-3 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/[0.04] hover:text-white">
        View All Activity

        <ArrowRight
          size={16}
          className="text-[#D4AF37]"
        />
      </button>
    </section>
  );
}