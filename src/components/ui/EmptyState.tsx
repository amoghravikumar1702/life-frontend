"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

import Card from "./Card";

interface EmptyStateProps {
  title: string;

  description?: string;

  icon?: ReactNode;

  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Card
      padding="lg"
      className="flex min-h-[360px] flex-col items-center justify-center text-center"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.35,
        }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.03] text-[#D4AF37]"
      >
        {icon ?? <Inbox size={34} />}
      </motion.div>

      <h2 className="mt-8 text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-md text-base leading-7 text-zinc-400">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </Card>
  );
}