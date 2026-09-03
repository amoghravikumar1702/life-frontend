import { ExecutiveReport } from "@/lib/cfo/types";
import { generateAICFOBrief } from "./openaiCFO";

export async function runExecutiveAnalysis(
  report: ExecutiveReport
) {
  try {
    const brief = await generateAICFOBrief(report);

    return {
      success: true,
      data: {
        executiveSummary: brief.executiveBrief,

        financialAnalysis:
          `Business health: ${brief.health.status}. ${brief.todaysFocus.description}`,

        topPriorities:
          brief.recommendation,

       businessRisks:
  `Current workforce assessment: ${brief.workforce.status}. ${brief.workforce.recommendation}`,

        growthOpportunities:
          `${brief.todaysFocus.title}: ${brief.todaysFocus.impact}`,

        finalRecommendation:
          brief.recommendation,
      },
    };
  } catch (error) {
    console.error(
      "[DhanarkOS AI] OpenAI CFO analysis failed:",
      error
    );

    throw error;
  }
}