"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface SectionProps {
  title?: string;

  subtitle?: string;

  action?: ReactNode;

  children: ReactNode;

  className?: string;

  contentClassName?: string;
}

export default function Section({
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <motion.section
      layout
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className={clsx("space-y-6", className)}
    >
      {(title || action) && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div className="flex items-center gap-3">
              {action}
            </div>
          )}
        </div>
      )}

      <div className={clsx(contentClassName)}>
        {children}
      </div>
    </motion.section>
  );
}