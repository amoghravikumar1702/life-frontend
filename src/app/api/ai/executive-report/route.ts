import { NextResponse } from "next/server";

import { buildExecutiveReport } from "@/lib/cfo/report";
import { runExecutiveAnalysis } from "@/lib/ai/orchestrator";

export async function GET() {
  try {
    const report = await buildExecutiveReport();

    const ai = await runExecutiveAnalysis(report) as {
      data: {
        executiveSummary: string;
        financialAnalysis: string;
        topPriorities: string;
        businessRisks: string;
        growthOpportunities: string;
        finalRecommendation: string;
      };
    };

    const healthScore =
      report.finance.healthScore > 0
        ? report.finance.healthScore
        : 75;

    return NextResponse.json({
      healthScore,

      cashAvailable: report.finance.cashFlow,

      revenue: report.finance.revenue,

      receivables:
        report.finance.outstandingReceivables,

      customers:
        report.customers.totalCustomers,

      executiveSummary:
        ai.data.executiveSummary,

      financialAnalysis:
        ai.data.financialAnalysis,

      topPriorities:
        ai.data.topPriorities,

      businessRisks:
        ai.data.businessRisks,

      growthOpportunities:
        ai.data.growthOpportunities,

      finalRecommendation:
        ai.data.finalRecommendation,
    });
  } catch (error) {
    console.error("========== AI ERROR ==========");
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}