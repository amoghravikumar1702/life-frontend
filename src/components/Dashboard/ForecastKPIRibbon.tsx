import {
  TrendingUp,
  Landmark,
  Wallet,
  ShieldCheck,
} from "lucide-react";

interface ForecastKPIRibbonProps {
  projectedRevenue: number;
  projectedProfit: number;
  cashRunway: number;
  growthConfidence: number;
}

const money = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;

export default function ForecastKPIRibbon({
  projectedRevenue,
  projectedProfit,
  cashRunway,
  growthConfidence,
}: ForecastKPIRibbonProps) {
  const cards = [
    {
      label: "Projected Revenue",
      value: money(projectedRevenue),
      icon: TrendingUp,
      color: "text-[#D4AF37]",
      bg: "bg-[#D4AF37]/10",
    },
    {
      label: "Projected Profit",
      value: money(projectedProfit),
      icon: Landmark,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Cash Runway",
      value: `${cashRunway.toFixed(1)} Months`,
      icon: Wallet,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      label: "Growth Confidence",
      value: `${growthConfidence}%`,
      icon: ShieldCheck,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-4">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.label}
            className="rounded-[28px] border border-white/10 bg-[#111111] p-6 transition-all duration-300 hover:border-[#D4AF37]/25 hover:-translate-y-1"
          >

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg}`}
            >

              <Icon
                size={22}
                className={card.color}
              />

            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-zinc-500">
              {card.label}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              {card.value}
            </h2>

          </div>

        );

      })}

    </section>
  );
}