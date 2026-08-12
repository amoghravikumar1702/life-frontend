import { BarChart3 } from "lucide-react";

import PageContainer from "@/components/ui/PageContainer";
import ExecutiveKPIRibbon from "@/components/Dashboard/ExecutiveKPIRibbon";
import ExecutiveComparisonChart from "@/components/charts/ExecutiveComparisonChart";
import FinancialInsights from "@/components/Dashboard/FinancialInsights";

import { getFinancialSnapshot } from "@/lib/finance";
import { buildFinancialAnalysis } from "@/lib/intelligence/financial-analysis";

export default async function FinancialAnalysisPage() {
  const snapshot = await getFinancialSnapshot();

  const analysis = await buildFinancialAnalysis();

  const comparisonData = [
    {
      month: "Current",
      revenue: analysis.revenue,
      expenses: analysis.expenses,
      profit: analysis.profit,
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-8">

        {/* Executive Header */}

        <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

              <BarChart3
                size={28}
                className="text-[#D4AF37]"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Intelligence
              </p>

              <h1 className="ArkenOne-gold mt-2 text-5xl font-bold">
                Financial Analysis
              </h1>

            </div>

          </div>

          <p className="mt-8 max-w-4xl text-lg leading-8 text-zinc-400">
            Understand how revenue becomes profit,
            identify cost drivers, monitor margins,
            and make informed financial decisions
            using executive-level financial intelligence.
          </p>

        </section>

        {/* Executive KPI Ribbon */}

        <ExecutiveKPIRibbon
          revenue={snapshot.revenue}
          profit={snapshot.profit}
          cash={snapshot.cashAvailable}
          receivables={snapshot.outstandingReceivables}
        />

        {/* Revenue vs Expenses */}

        <ExecutiveComparisonChart
          data={comparisonData}
        />

        {/* Financial Insights */}

        <FinancialInsights
          strengths={analysis.strengths}
          risks={analysis.risks}
          recommendations={analysis.recommendations}
        />

      </div>
    </PageContainer>
  );
}