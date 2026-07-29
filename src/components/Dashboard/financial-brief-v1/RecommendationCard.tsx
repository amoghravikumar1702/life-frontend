type RecommendationCardProps = {
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
};

const priorityStyles = {
  high: {
    badge: "bg-red-500/15 text-red-300 border-red-500/20",
    label: "High Priority",
  },
  medium: {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    label: "Medium Priority",
  },
  low: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    label: "Low Priority",
  },
};

export default function RecommendationCard({
  title,
  description,
  priority = "medium",
}: RecommendationCardProps) {
  const style = priorityStyles[priority];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${style.badge}`}
        >
          {style.label}
        </span>
      </div>

      <p className="leading-7 text-sm text-gray-400">
        {description}
      </p>
    </div>
  );
}