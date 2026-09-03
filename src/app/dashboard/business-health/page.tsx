import { Activity } from "lucide-react";

import PageContainer from "@/components/ui/PageContainer";
import ExecutiveLineChart from "@/components/charts/ExecutiveLineChart";
import ExecutiveKPIRibbon from "@/components/Dashboard/ExecutiveKPIRibbon";
import { getRevenueHistory } from "@/lib/intelligence/services/getRevenueHistory";
import { buildBusinessHealth } from "@/lib/intelligence/services/buildBusinessHealth";
import CashPositionChart from "@/components/charts/CashPositionChart";
export default async function BusinessHealthPage() {
  const {
  snapshot,
  metrics,
  health,
} = await buildBusinessHealth();
const revenueHistory =
  await getRevenueHistory();
  const pillars = [
    {
      title: "Liquidity",
      score: health.liquidity.score,
      status: health.liquidity.status,
    },
    {
      title: "Profitability",
      score: health.profitability.score,
      status: health.profitability.status,
    },
    {
      title: "Collections",
      score: health.collections.score,
      status: health.collections.status,
    },
    {
      title: "Efficiency",
      score: health.efficiency.score,
      status: health.efficiency.status,
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-8">

        {/* Header */}

        <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

              <Activity
                className="text-[#D4AF37]"
                size={24}
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Intelligence
              </p>

              <h1 className="DhanarkOS-gold mt-2 text-5xl font-bold">
                Business Health
              </h1>

            </div>

          </div>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
            Monitor your company's financial strength,
            liquidity, profitability, collections and
            operational performance from one executive
            dashboard.
          </p>

        </section>
<ExecutiveKPIRibbon
  revenue={snapshot.revenue}
  profit={snapshot.profit}
  cash={snapshot.cashAvailable}
  receivables={snapshot.outstandingReceivables}
/>
        {/* Overall Score */}

        <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Overall Health
          </p>

          <h2 className="mt-4 text-7xl font-bold text-[#D4AF37]">
            {health.overall}
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
            Overall business health is currently
            rated as{" "}
            <span className="font-semibold text-white">
              {health.liquidity.status}
            </span>.
            Continue monitoring financial performance
            and operational efficiency.
          </p>

        </section>
<ExecutiveLineChart
  title="Business Growth"
  subtitle="Monthly revenue generated from completed customer payments."
  data={revenueHistory}
/>
<CashPositionChart
  cash={snapshot.cashAvailable}
  receivables={snapshot.outstandingReceivables}
/>
        {/* Financial Pillars */}

        <section>

          <h2 className="mb-6 text-3xl font-semibold text-white">
            Financial Pillars
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {pillars.map((pillar) => (

              <div
                key={pillar.title}
                className="rounded-3xl border border-white/10 bg-[#111111] p-6"
              >

                <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                  {pillar.title}
                </p>

                <h3 className="mt-5 text-4xl font-bold text-white">
                  {pillar.score}
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {pillar.status}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* Strengths & Risks */}

        <div className="grid gap-8 xl:grid-cols-2">

          <section className="rounded-3xl border border-emerald-500/20 bg-[#111111] p-8">

            <h2 className="mb-6 text-2xl font-semibold text-white">
              Business Strengths
            </h2>

            <ul className="space-y-4 text-zinc-300">

              {health.strengths.length > 0 ? (
                health.strengths.map(
                  (strength, index) => (
                    <li key={index}>
                      • {strength}
                    </li>
                  )
                )
              ) : (
                <li>No major strengths identified.</li>
              )}

            </ul>

          </section>

          <section className="rounded-3xl border border-red-500/20 bg-[#111111] p-8">

            <h2 className="mb-6 text-2xl font-semibold text-white">
              Business Risks
            </h2>

            <ul className="space-y-4 text-zinc-300">

              {health.weaknesses.length > 0 ? (
                health.weaknesses.map(
                  (weakness, index) => (
                    <li key={index}>
                      • {weakness}
                    </li>
                  )
                )
              ) : (
                <li>No significant risks identified.</li>
              )}

            </ul>

          </section>

        </div>

        {/* AI Recommendations */}

        <section className="rounded-3xl border border-[#D4AF37]/20 bg-[#111111] p-8">

          <h2 className="mb-6 text-2xl font-semibold text-white">
            AI Recommendations
          </h2>

          <div className="space-y-4">

            {health.recommendations.length > 0 ? (
              health.recommendations.map(
                (
                  recommendation,
                  index
                ) => (
                  <p
                    key={index}
                    className="leading-8 text-zinc-300"
                  >
                    • {recommendation}
                  </p>
                )
              )
            ) : (
              <p className="leading-8 text-zinc-300">
                Your business is operating within
                healthy financial benchmarks.
                Continue monitoring performance.
              </p>
            )}

          </div>

        </section>

      </div>
    </PageContainer>
  );
}