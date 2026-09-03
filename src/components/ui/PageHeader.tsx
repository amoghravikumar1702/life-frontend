// src/components/ui/PageHeader.tsx

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-[#D4AF37]">
          DhanarkOS
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}