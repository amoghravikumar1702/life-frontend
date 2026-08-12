import { analyzeBusiness } from "./engine/analyzeBusiness";
import { buildNarrative } from "./engine/buildNarrative";
import { determineMission } from "./engine/determineMission";
import { generateRecommendation } from "./engine/generateRecommendation";
import { calculateMilestone } from "./engine/calculateMilestone";
import { BusinessSnapshot } from "./engine/types";

export interface DailyBrief {
  greeting: string;

  executiveBrief: string;

  health: {
    score: number;
    status: string;
  };

  todaysFocus: {
    title: string;
    description: string;
    amount: number;
    impact: string;
  };

  recommendation: string;

  milestone: {
    title: string;
    current: number;
    target: number;
    remaining: number;
    progress: number;
  };
}

export function generateDailyBrief(
  snapshot: BusinessSnapshot
): DailyBrief {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const analysis =
    analyzeBusiness(snapshot);

  const narrative =
    buildNarrative(analysis);

  const mission =
    determineMission(analysis);

  const recommendation =
    generateRecommendation(
      analysis
    );

  const milestone =
    calculateMilestone(
      analysis
    );

  return {
    greeting,

    executiveBrief: narrative,

    health: {
      score: snapshot.healthScore,

      status:
        analysis.state.charAt(0).toUpperCase() +
        analysis.state.slice(1),
    },

    todaysFocus: {
      title: mission.title,

      description:
        mission.description,

      amount: mission.amount,

      impact: mission.impact,
    },

    recommendation,

    milestone,
  };
}