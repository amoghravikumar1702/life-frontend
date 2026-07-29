import AIHeader from "@/components/AI-CFO/AIHeader";
import TodaysFocus from "@/components/AI-CFO/TodaysFocus";
import ExecutiveSnapshot from "@/components/AI-CFO/ExecutiveSnapshot";
import ExecutiveSummary from "@/components/AI-CFO/ExecutiveSummary";
import FinancialAnalysis from "@/components/AI-CFO/FinancialAnalysis";
import PriorityList from "@/components/AI-CFO/PriorityList";
import GrowthOpportunities from "@/components/AI-CFO/GrowthOpportunities";
import RiskList from "@/components/AI-CFO/RiskList";
import FinalRecommendation from "@/components/AI-CFO/FinalRecommendation";

import PageContainer from "@/components/ui/PageContainer";

import { buildExecutiveReport } from "@/lib/cfo/report";
import { runIntelligence } from "@/lib/intelligence";

export default async function AICFOPage() {
  const report = await buildExecutiveReport();

  const intelligence = runIntelligence({
    revenue: report.finance.revenue,
    expenses: report.finance.expenses,
    cash: report.finance.cashFlow,
    receivables: report.finance.outstandingReceivables,
    overdueInvoices: 0,
    customerCount: report.customers.totalCustomers,
    invoiceCount: 0,
  });

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">

        {/* Executive Header */}

        <AIHeader />

        {/* Today's Focus */}

        <TodaysFocus
          title="Recover Outstanding Receivables"
          amount={report.finance.outstandingReceivables}
          description="Your highest-impact action today is collecting outstanding customer payments. Recovering these funds will improve liquidity, strengthen cash flow, and reduce financial risk."
          impact={[
            "Improve cash flow",
            "Strengthen working capital",
            "Reduce financial risk",
          ]}
          confidence={96}
        />

        {/* Business Pulse */}

        <ExecutiveSnapshot
          healthScore={intelligence.health.overall}
          cashAvailable={report.finance.cashFlow}
          revenue={report.finance.revenue}
          receivables={report.finance.outstandingReceivables}
          customers={report.customers.totalCustomers}
        />

        {/* Executive Brief */}

        <ExecutiveSummary
          summary={intelligence.reasoning.overall}
        />

        {/* Financial Analysis */}

        <FinancialAnalysis
          analysis={intelligence.analysis.summary}
        />

        {/* Executive Action Plan */}

        <PriorityList
          priorities={intelligence.decisions}
        />

        {/* Growth Strategy */}

        <GrowthOpportunities
          opportunities={intelligence.opportunities}
        />

        {/* Risk Assessment */}

        <RiskList
          risks={intelligence.risk.risks}
        />

        {/* Final Recommendation */}

        <FinalRecommendation
          recommendation={
            intelligence.executiveReport
              .finalRecommendation
          }
        />

      </div>
    </PageContainer>
  );
}