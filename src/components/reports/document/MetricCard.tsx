import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

interface Props {
  label: string;
  value: string;

  change?: number;

  subtitle?: string;
}

export default function MetricCard({
  label,
  value,
  change,
  subtitle,
}: Props) {
  const positive =
    change !== undefined && change >= 0;

  return (
    <div
      className="
        group
        rounded-[30px]
        border
        border-white/[0.06]
        bg-[#101418]
        p-8
        transition-all
        duration-300
        hover:border-white/[0.10]
        hover:bg-[#131920]
      "
    >
      <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
        {label}
      </p>

      <div className="mt-5 flex items-end justify-between">

        <h3 className="text-[44px] font-semibold tracking-[-0.05em] text-white">
          {value}
        </h3>

        {change !== undefined && (
          <div
            className={`
              flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium
              ${
                positive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }
            `}
          >
            {change === 0 ? (
              <Minus size={14} />
            ) : positive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}

            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      <div className="mt-6 h-px bg-white/[0.05]" />

      <p className="mt-4 text-sm text-zinc-500">
        {subtitle ?? "Current reporting period"}
      </p>
    </div>
  );
}