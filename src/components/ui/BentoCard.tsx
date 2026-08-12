import { ReactNode } from "react";

import GlowCard from "./GlowCard";

interface Props {
  children: ReactNode;

  className?: string;

  glow?: boolean | "purple" | "blue" | "gold" | "green";

  hover?: boolean;
}

export default function BentoCard({
  children,
  className,
  glow = false,
  hover = true,
}: Props) {
  return (
    <GlowCard
      glow={
        glow === true
          ? "purple"
          : glow || "none"
      }
      hover={hover}
      className={className}
    >
      {children}
    </GlowCard>
  );
}