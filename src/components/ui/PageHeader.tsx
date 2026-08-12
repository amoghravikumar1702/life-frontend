"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;

  actions?: ReactNode;

  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="mb-10"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

        <div className="max-w-3xl">

          <h1 className="text-4xl font-semibold tracking-tight text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-3 max-w-xl text-base leading-7 text-zinc-400">
              {subtitle}
            </p>
          )}

          {children && (
            <div className="mt-6">
              {children}
            </div>
          )}

        </div>

        {actions && (
          <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
            {actions}
          </div>
        )}

      </div>
    </motion.section>
  );
}