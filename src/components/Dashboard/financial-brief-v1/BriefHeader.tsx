"use client";

import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export default function BriefHeader() {
  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Greeting Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

        <div>
          <p className="text-sm font-medium tracking-[0.18em] uppercase text-neutral-500">
            {greeting}
          </p>

          <h1 className="mt-2 text-4xl font-light tracking-tight text-neutral-900">
            Amogh
          </h1>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-4 py-2 backdrop-blur-sm">
          <CalendarDays
            size={16}
            className="text-neutral-500"
          />

          <span className="text-sm text-neutral-600">
            {formattedDate}
          </span>
        </div>

      </div>

      {/* Section Title */}
      <div className="space-y-3">

        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Today's Financial Brief
        </p>

        <p className="max-w-2xl text-[17px] leading-8 font-light text-neutral-700">
          Revenue continues to improve while outstanding collections
          require attention. Cash flow remains healthy and today's
          focus should be on accelerating receivables.
        </p>

      </div>
    </motion.div>
  );
}