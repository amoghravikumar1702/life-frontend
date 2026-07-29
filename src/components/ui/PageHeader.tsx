import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-500">
          {subtitle}
        </p>
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}