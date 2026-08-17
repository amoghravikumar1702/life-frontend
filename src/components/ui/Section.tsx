// src/components/ui/Section.tsx

import { ReactNode } from "react";

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function Section({
  title,
  subtitle,
  children,
  actions,
}: SectionProps) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[#101214]">
      {(title || subtitle || actions) && (
        <div className="flex flex-col gap-4 border-b border-white/[0.05] px-6 py-6 sm:px-7 sm:py-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            {title && (
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-white">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1.5 text-xs text-zinc-600">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className="p-6 sm:p-7">
        {children}
      </div>
    </section>
  );
}