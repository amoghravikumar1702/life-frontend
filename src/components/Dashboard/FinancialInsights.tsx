import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface FinancialInsightsProps {
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export default function FinancialInsights({
  strengths,
  risks,
  recommendations,
}: FinancialInsightsProps) {
  return (
    <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">

      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Intelligence
        </p>

        <h2 className="ArkenOne-gold mt-2 text-4xl font-bold">
          Executive Financial Insights
        </h2>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
          AI-powered analysis generated from your
          financial performance and operational metrics.
        </p>

      </div>

      <div className="grid gap-8 xl:grid-cols-3">

        {/* Strengths */}

        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">

          <div className="mb-6 flex items-center gap-3">

            <CheckCircle2
              size={22}
              className="text-emerald-400"
            />

            <h3 className="text-xl font-semibold text-white">
              Strengths
            </h3>

          </div>

          <div className="space-y-4">

            {strengths.length > 0 ? (
              strengths.map((item) => (
                <p
                  key={item}
                  className="leading-7 text-zinc-300"
                >
                  • {item}
                </p>
              ))
            ) : (
              <p className="text-zinc-500">
                No significant strengths detected.
              </p>
            )}

          </div>

        </div>

        {/* Risks */}

        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">

          <div className="mb-6 flex items-center gap-3">

            <AlertTriangle
              size={22}
              className="text-red-400"
            />

            <h3 className="text-xl font-semibold text-white">
              Risks
            </h3>

          </div>

          <div className="space-y-4">

            {risks.length > 0 ? (
              risks.map((item) => (
                <p
                  key={item}
                  className="leading-7 text-zinc-300"
                >
                  • {item}
                </p>
              ))
            ) : (
              <p className="text-zinc-500">
                No major financial risks detected.
              </p>
            )}

          </div>

        </div>

        {/* Recommendations */}

        <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">

          <div className="mb-6 flex items-center gap-3">

            <Lightbulb
              size={22}
              className="text-[#D4AF37]"
            />

            <h3 className="text-xl font-semibold text-white">
              Recommendations
            </h3>

          </div>

          <div className="space-y-4">

            {recommendations.length > 0 ? (
              recommendations.map((item) => (
                <p
                  key={item}
                  className="leading-7 text-zinc-300"
                >
                  • {item}
                </p>
              ))
            ) : (
              <p className="text-zinc-500">
                Continue executing your current financial strategy.
              </p>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}