// src/components/ui/MetricCard.tsx

import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accent?: boolean;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  accent = false,
}: MetricCardProps) {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        bg-[#101214]
        p-6
        transition-all
        duration-300
        ${
          accent
            ? "border-[#D4AF37]/12 hover:border-[#D4AF37]/25"
            : "border-white/[0.06] hover:border-white/[0.10]"
        }
      `}
    >
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#D4AF37]/20
          to-transparent
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-zinc-600">
            {title}
          </p>

          <p
            className={`
              mt-4
              truncate
              text-2xl
              font-semibold
              tracking-[-0.04em]
              ${
                accent
                  ? "text-[#D4AF37]"
                  : "text-white"
              }
            `}
          >
            {value}
          </p>

          {subtitle && (
            <p className="mt-2 truncate text-xs text-zinc-600">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              transition-all
              duration-300
              ${
                accent
                  ? "border-[#D4AF37]/15 bg-[#D4AF37]/[0.07] text-[#D4AF37]"
                  : "border-white/[0.06] bg-white/[0.025] text-zinc-500"
              }
            `}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}