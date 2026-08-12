import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 flex items-end justify-between gap-8">

      <div>

        {eyebrow && (
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-500">
            {eyebrow}
          </p>
        )}

        <h2 className="text-4xl font-semibold tracking-tight text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-4 max-w-3xl text-[15px] leading-8 text-zinc-400">
            {description}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}