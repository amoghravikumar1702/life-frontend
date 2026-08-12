import { ReactNode } from "react";

import BentoCard from "./BentoCard";

interface ExecutiveHeroProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function ExecutiveHero({
  title,
  subtitle,
  children,
}: ExecutiveHeroProps) {
  return (
    <BentoCard
      glow="purple"
      hover={false}
      className="p-10"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
        Executive Overview
      </p>

      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
        {title}
      </h1>

      <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
        {subtitle}
      </p>

      <div className="mt-12">
        {children}
      </div>
    </BentoCard>
  );
}