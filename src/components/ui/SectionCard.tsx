import { ReactNode } from "react";
import clsx from "clsx";

interface SectionCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  title,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={clsx(
        "rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition-all duration-300",
        className
      )}
    >
      {title && (
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}