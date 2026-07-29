"use client";

import { motion } from "framer-motion";

type ActivityStatus =
  | "high-impact"
  | "action-required"
  | "informational"
  | "completed";

interface ActivityItemProps {
  title: string;
  description: string;
  insight?: string;
  time: string;
  status: ActivityStatus;
}

const statusStyles: Record<ActivityStatus, string> = {
  "high-impact":
    "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",

  "action-required":
    "bg-red-500/10 text-red-300 border-red-500/20",

  informational:
    "bg-white/5 text-zinc-300 border-white/10",

  completed:
    "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

const statusLabels: Record<ActivityStatus, string> = {
  "high-impact": "High Impact",
  "action-required": "Action Required",
  informational: "Informational",
  completed: "Completed",
};

export default function ActivityItem({
  title,
  description,
  insight,
  time,
  status,
}: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-white/5 py-6 last:border-none"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-4 flex-1">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
          >
            {statusLabels[status]}
          </span>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {title}
            </h3>

            <p className="mt-2 leading-7 text-zinc-400">
              {description}
            </p>
          </div>

          {insight && (
            <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-300">
                AI Insight
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {insight}
              </p>
            </div>
          )}
        </div>

        <p className="whitespace-nowrap text-sm text-zinc-500">
          {time}
        </p>
      </div>
    </motion.div>
  );
}