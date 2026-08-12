import BentoCard from "@/components/ui/BentoCard";

interface Props {
  title: string;
  description: string;
}

export default function ExecutiveInsightCard({
  title,
  description,
}: Props) {
  return (
    <BentoCard
      glow="purple"
      hover
      className="p-8"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
        Executive Insight
      </p>

      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      <p className="mt-5 leading-8 text-zinc-400">
        {description}
      </p>
    </BentoCard>
  );
}