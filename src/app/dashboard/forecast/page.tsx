import { TrendingUp } from "lucide-react";

import PageContainer from "@/components/ui/PageContainer";
import ForecastKPIRibbon from "@/components/Dashboard/ForecastKPIRibbon";
import ForecastInsights from "@/components/Dashboard/ForecastInsights";
import ForecastProjectionChart from "@/components/charts/ForecastProjectionChart";

import { buildForecast } from "@/lib/intelligence/forecast";

export default async function ForecastPage() {
  const forecast = await buildForecast();

  return (
    <PageContainer>
      <div className="space-y-8">

        <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

              <TrendingUp
                size={28}
                className="text-[#D4AF37]"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Intelligence
              </p>

              <h1 className="finzura-gold mt-2 text-5xl font-bold">
                Forecast
              </h1>

            </div>

          </div>

          <p className="mt-8 max-w-4xl text-lg leading-8 text-zinc-400">
            Predict future revenue, profitability,
            liquidity and business growth using
            AI-powered financial forecasting.
          </p>

        </section>

        <ForecastKPIRibbon
          projectedRevenue={forecast.projectedRevenue}
          projectedProfit={forecast.projectedProfit}
          cashRunway={forecast.cashRunway}
          growthConfidence={forecast.growthConfidence}
        />

        <ForecastProjectionChart
          data={forecast.chartData}
        />

        <ForecastInsights
          cashRunway={forecast.cashRunway}
          growthConfidence={forecast.growthConfidence}
          summary={forecast.summary}
          recommendations={forecast.recommendations}
        />

      </div>
    </PageContainer>
  );
}