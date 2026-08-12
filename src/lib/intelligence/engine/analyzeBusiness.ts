import {
  BusinessAnalysis,
  BusinessSnapshot,
} from "./types";

export function analyzeBusiness(
  snapshot: BusinessSnapshot
): BusinessAnalysis {
  // ----------------------------
  // Overall Business Health
  // ----------------------------

  let state: BusinessAnalysis["state"] =
    "healthy";

  if (snapshot.healthScore >= 90) {
    state = "excellent";
  } else if (snapshot.healthScore >= 75) {
    state = "healthy";
  } else if (snapshot.healthScore >= 60) {
    state = "stable";
  } else {
    state = "critical";
  }

  // ----------------------------
  // Biggest Financial Bottleneck
  // ----------------------------

  let biggestProblem = "None";

  if (
    snapshot.receivables >
    snapshot.revenue * 0.5
  ) {
    biggestProblem = "Collections";
  } else if (
    snapshot.customerCount < 5
  ) {
    biggestProblem =
      "Customer Growth";
  } else if (
    snapshot.cash <
    snapshot.revenue * 0.2
  ) {
    biggestProblem = "Cash Flow";
  }

  // ----------------------------
  // Strongest Area
  // ----------------------------

  const strongestArea =
    snapshot.receivables === 0
      ? "Collections"
      : snapshot.revenue > 0
      ? "Revenue"
      : "Business Setup";

  // ----------------------------
  // Weakest Area
  // ----------------------------

  const weakestArea =
    biggestProblem;

  // ----------------------------
  // Cash Flow Rating
  // ----------------------------

  const cashFlow =
    snapshot.cash >
    snapshot.receivables
      ? "excellent"
      : snapshot.cash >
        snapshot.revenue * 0.25
      ? "healthy"
      : "weak";

  // ----------------------------
  // Collection Performance
  // ----------------------------

  const collections =
    snapshot.receivables === 0
      ? "excellent"
      : snapshot.receivables <
        snapshot.revenue * 0.25
      ? "good"
      : "poor";

  // ----------------------------
  // Business Growth
  // ----------------------------

  const growth =
    snapshot.customerCount >= 20
      ? "fast"
      : snapshot.customerCount >= 5
      ? "steady"
      : "slow";

  // ----------------------------
  // Today's Priority
  // ----------------------------

  let priority:
    | "collections"
    | "growth"
    | "cashflow"
    | "healthy";

  switch (biggestProblem) {
    case "Collections":
      priority =
        "collections";
      break;

    case "Customer Growth":
      priority = "growth";
      break;

    case "Cash Flow":
      priority =
        "cashflow";
      break;

    default:
      priority = "healthy";
  }

  // ----------------------------
  // Final Analysis
  // ----------------------------

  return {
    snapshot,

    state,

    confidence: Math.round(
      snapshot.healthScore
    ),

    biggestProblem,

    strongestArea,

    weakestArea,

    cashFlow,

    collections,

    growth,

    priority,
  };
}