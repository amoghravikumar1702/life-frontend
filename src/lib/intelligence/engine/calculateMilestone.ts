import {
  BusinessAnalysis,
  Milestone,
} from "./types";

export function calculateMilestone(
  analysis: BusinessAnalysis
): Milestone {
  const revenue =
    analysis.snapshot.revenue;

  // Revenue goal increments:
  // 1L → 2L → 3L → 5L → 10L → 20L ...

  let target = 100000;

  if (revenue >= 100000)
    target = 200000;

  if (revenue >= 200000)
    target = 300000;

  if (revenue >= 300000)
    target = 500000;

  if (revenue >= 500000)
    target = 1000000;

  if (revenue >= 1000000)
    target = 2000000;

  const remaining = Math.max(
    0,
    target - revenue
  );

  const progress =
    target === 0
      ? 0
      : Math.round(
          (revenue / target) * 100
        );

  return {
    title: "Next Revenue Milestone",

    current: revenue,

    target,

    remaining,

    progress,
  };
}