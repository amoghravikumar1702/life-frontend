"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  insight?: string;
  icon: LucideIcon;
  color: string;
}

export default function TimelineItem({
  time,
  title,
  description,
  insight,
  icon: Icon,
  color,
}: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex gap-6"
    >
      {/* Time */}

      <div className="w-16 pt-1 text-right">
        <p className="text-xs tracking-wide text-zinc-500">
          {time}
        </p>
      </div>

      {/* Timeline */}

      <div className="flex flex-col items-center">
        <div
          className={`rounded-full border border-white/10 p-2 ${color}`}
        >
          <Icon size={15} />
        </div>

        <div className="mt-3 h-full w-px bg-white/10" />
      </div>

      {/* Content */}

      <div className="flex-1 pb-12">
        <h3 className="text-lg font-medium text-white">
          {title}
        </h3>

        <p className="mt-3 max-w-2xl leading-8 text-zinc-400">
          {description}
        </p>

        {insight && (
          <div className="mt-5 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-sm text-yellow-300">
            {insight}
          </div>
        )}
      </div>
    </motion.div>
  );
}