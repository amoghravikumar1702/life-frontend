import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatNumber } from "@/lib/utils/formatNumber";

interface Metric {
  label: string;
  value: number;
}

interface Props {
  metrics: Metric[];
}

const currencyMetrics = new Set([
  "Revenue",
  "Collected",
  "Outstanding",
  "Average Invoice",
]);

const percentageMetrics = new Set([
  "Collection Rate",
]);

export default function MetricsGrid({
  metrics,
}: Props) {
  return (
    <section className="space-y-5">

      <div>

        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
          Financial Snapshot
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
          Key Financial Metrics
        </h2>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {metrics.map((metric) => {
          let value: string;

          if (currencyMetrics.has(metric.label)) {
            value = formatCurrency(metric.value);
          } else if (
            percentageMetrics.has(metric.label)
          ) {
            value = `${metric.value.toFixed(1)}%`;
          } else {
            value = formatNumber(metric.value);
          }

          return (
            <div
              key={metric.label}
              className="
                rounded-[28px]
                border
                border-white/[0.08]
                bg-[#101214]
                p-7
                transition-all
                duration-300
                hover:border-white/[0.12]
              "
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                {metric.label}
              </p>

              <h3 className="mt-5 text-[38px] font-semibold tracking-[-0.04em] text-white">
                {value}
              </h3>

              <div className="mt-6 h-px bg-white/[0.06]" />

              <p className="mt-4 text-sm text-zinc-500">
                Current reporting period
              </p>
            </div>
          );
        })}

      </div>

    </section>
  );
}