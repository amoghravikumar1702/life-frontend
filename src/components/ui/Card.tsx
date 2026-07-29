import { ReactNode } from "react";
import clsx from "clsx";
import GlassPanel from "./GlassPanel";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className,
}: CardProps) {
  return (
    <GlassPanel
      className={clsx(
        "p-6",
        className
      )}
    >
      {children}
    </GlassPanel>
  );
}