import { ReactNode } from "react";

import BentoCard from "@/components/ui/BentoCard";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

interface KPI {
  label: string;
  value: ReactNode;
  change?: string;
}

interface ExecutiveKPIRibbonProps {
  // New API
  items?: KPI[];

  // Legacy API
  revenue?: number;
  profit?: number;
  cash?: number;
  receivables?: number;
}

export default function ExecutiveKPIRibbon({
  items,
  revenue,
  profit,
  cash,
  receivables,
}: ExecutiveKPIRibbonProps) {
  const ribbonItems: KPI[] =
    items ??
    ([
      {
        label: "Revenue",
        value: (
          <AnimatedNumber
            value={revenue ?? 0}
            format="currency"
          />
        ),
      },
      {
        label: "Profit",
        value: (
          <AnimatedNumber
            value={profit ?? 0}
            format="currency"
          />
        ),
      },
      {
        label: "Cash",
        value: (
          <AnimatedNumber
            value={cash ?? 0}
            format="currency"
          />
        ),
      },
      {
        label: "Receivables",
        value: (
          <AnimatedNumber
            value={receivables ?? 0}
            format="currency"
          />
        ),
      },
    ] as KPI[]);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {ribbonItems.map((item) => (
        <BentoCard
          key={item.label}
          className="p-6"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            {item.label}
          </p>

          <div className="mt-4 text-3xl font-semibold tracking-tight text-white">
            {item.value}
          </div>

          {item.change && (
            <p className="mt-3 text-sm text-emerald-400">
              {item.change}
            </p>
          )}
        </BentoCard>
      ))}
    </div>
  );
}