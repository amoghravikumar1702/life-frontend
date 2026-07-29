import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DecisionCardProps {
  priority: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
  actionHref: string;
}

function getPriority(priority: number) {
  switch (priority) {
    case 5:
      return {
        label: "Critical",
        color:
          "bg-red-500/10 text-red-400 border-red-500/20",
      };

    case 4:
      return {
        label: "High",
        color:
          "bg-orange-500/10 text-orange-400 border-orange-500/20",
      };

    case 3:
      return {
        label: "Medium",
        color:
          "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
      };

    default:
      return {
        label: "Low",
        color:
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      };
  }
}

export default function DecisionCard({
  priority,
  title,
  description,
  impact,
  actionLabel,
  actionHref,
}: DecisionCardProps) {
  const badge = getPriority(priority);

  return (
    <section className="group rounded-[32px] border border-white/10 bg-[#111111] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/20">

      <div className="flex items-start justify-between gap-8">

        <div className="flex-1">

          <div
            className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${badge.color}`}
          >
            {badge.label}
          </div>

          <h2 className="mt-6 text-3xl font-bold text-white">
            {title}
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
            {description}
          </p>

          <div className="mt-8">

            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Expected Business Impact
            </p>

            <h3 className="mt-3 text-2xl font-semibold text-emerald-400">
              {impact}
            </h3>

          </div>

        </div>

        <div className="flex flex-col items-end justify-between">

          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition-all duration-300 hover:scale-105"
          >
            {actionLabel}

            <ArrowRight size={18} />
          </Link>

        </div>

      </div>

    </section>
  );
}