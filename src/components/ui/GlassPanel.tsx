import { ReactNode } from "react";
import clsx from "clsx";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
};

export default function GlassPanel({
  children,
  className,
}: GlassPanelProps) {
  return (
    <section className={clsx("glass-panel", className)}>
      {children}
    </section>
  );
}