import MetricCard from "./MetricCard";

interface Metric {
  label: string;
  value: string;
  change?: number;
  subtitle?: string;
}

interface Props {
  metrics: Metric[];
}

export default function MetricGrid({
  metrics,
}: Props) {
  return (
    <section>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            subtitle={metric.subtitle}
          />
        ))}

      </div>

    </section>
  );
}