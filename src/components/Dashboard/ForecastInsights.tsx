import {
  Wallet,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface ForecastInsightsProps {
  cashRunway: number;
  growthConfidence: number;
  summary: string;
  recommendations: string[];
}

export default function ForecastInsights({
  cashRunway,
  growthConfidence,
  summary,
  recommendations,
}: ForecastInsightsProps) {
  const runwayStatus =
    cashRunway >= 12
      ? "Healthy"
      : cashRunway >= 6
      ? "Moderate"
      : "Critical";

  const confidenceStatus =
    growthConfidence >= 85
      ? "High"
      : growthConfidence >= 70
      ? "Medium"
      : "Low";

  return (
    <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">

      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Intelligence
        </p>

        <h2 className="DhanarkOS-gold mt-2 text-4xl font-bold">
          Forecast Insights
        </h2>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
          AI-generated financial outlook based on your
          current business performance.
        </p>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center gap-3">

            <Wallet
              size={22}
              className="text-[#D4AF37]"
            />

            <h3 className="text-xl font-semibold text-white">
              Cash Runway
            </h3>

          </div>

          <h2 className="mt-6 DhanarkOS-gold text-5xl font-bold">
            {cashRunway.toFixed(1)}
          </h2>

          <p className="mt-2 text-zinc-400">
            Months of operational runway
          </p>

          <div className="mt-6 inline-flex rounded-full bg-[#D4AF37]/10 px-4 py-2 text-sm text-[#D4AF37]">
            {runwayStatus}
          </div>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex items-center gap-3">

            <ShieldCheck
              size={22}
              className="text-emerald-400"
            />

            <h3 className="text-xl font-semibold text-white">
              Growth Confidence
            </h3>

          </div>

          <h2 className="mt-6 text-5xl font-bold text-white">
            {growthConfidence}%
          </h2>

          <p className="mt-2 text-zinc-400">
            Forecast confidence score
          </p>

          <div className="mt-6 inline-flex rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            {confidenceStatus}
          </div>

        </div>

      </div>

      <div className="mt-8 rounded-3xl border border-[#D4AF37]/15 bg-[#D4AF37]/5 p-6">

        <div className="flex items-center gap-3">

          <Sparkles
            size={22}
            className="text-[#D4AF37]"
          />

          <h3 className="text-xl font-semibold text-white">
            AI Forecast Summary
          </h3>

        </div>

        <p className="mt-5 text-lg leading-8 text-zinc-300">
          {summary}
        </p>

      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex items-center gap-3">

          <ArrowRight
            size={20}
            className="text-[#D4AF37]"
          />

          <h3 className="text-xl font-semibold text-white">
            Executive Recommendations
          </h3>

        </div>

        <div className="mt-6 space-y-4">

          {recommendations.map((item) => (

            <div
              key={item}
              className="rounded-2xl border border-white/5 bg-black/20 p-4 text-zinc-300"
            >
              • {item}
            </div>

          ))}

        </div>

      </div>

    </section>
  );
}