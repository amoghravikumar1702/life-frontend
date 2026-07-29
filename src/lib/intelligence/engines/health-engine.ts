import {
  FinancialHealth,
  HealthCategory,
} from "../types";

import {
  BusinessMetrics,
} from "../core/metrics";

import {
  Liquidity,
  Profitability,
} from "../knowledge";

function getStatus(
  score: number
): HealthCategory["status"] {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Healthy";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

export function evaluateFinancialHealth(
  metrics: BusinessMetrics
): FinancialHealth {

  const liquidityKnowledge =
    Liquidity.default;

  const profitabilityKnowledge =
    Profitability.service;

  /* ------------------------------
     LIQUIDITY
  ------------------------------ */

  let liquidityScore = 100;

  if (
    metrics.cashCoverage <
    liquidityKnowledge.critical
  ) {
    liquidityScore = 20;
  } else if (
    metrics.cashCoverage <
    liquidityKnowledge.warning
  ) {
    liquidityScore = 45;
  } else if (
    metrics.cashCoverage <
    liquidityKnowledge.healthy
  ) {
    liquidityScore = 70;
  } else if (
    metrics.cashCoverage <
    liquidityKnowledge.excellent
  ) {
    liquidityScore = 85;
  }

  /* ------------------------------
     PROFITABILITY
  ------------------------------ */

  let profitabilityScore = 100;

  if (
    metrics.profitMargin <
    profitabilityKnowledge.critical
  ) {
    profitabilityScore = 15;
  } else if (
    metrics.profitMargin <
    profitabilityKnowledge.warning
  ) {
    profitabilityScore = 45;
  } else if (
    metrics.profitMargin <
    profitabilityKnowledge.healthy
  ) {
    profitabilityScore = 70;
  } else if (
    metrics.profitMargin <
    profitabilityKnowledge.excellent
  ) {
    profitabilityScore = 85;
  }

  /* ------------------------------
     COLLECTIONS
  ------------------------------ */

  let collectionsScore = 100;

  if (metrics.receivableRatio > 40) {
    collectionsScore = 35;
  } else if (metrics.receivableRatio > 25) {
    collectionsScore = 60;
  } else if (metrics.receivableRatio > 15) {
    collectionsScore = 80;
  }

  /* ------------------------------
     GROWTH
  ------------------------------ */

  let growthScore = 75;

  if (metrics.profit > 0) {
    growthScore = 85;
  }

  /* ------------------------------
     EFFICIENCY
  ------------------------------ */

  let efficiencyScore = 100;

  if (metrics.expenseRatio > 90) {
    efficiencyScore = 20;
  } else if (metrics.expenseRatio > 75) {
    efficiencyScore = 50;
  } else if (metrics.expenseRatio > 60) {
    efficiencyScore = 75;
  }

  /* ------------------------------
     OVERALL
  ------------------------------ */

  const overall = Math.round(
    (
      liquidityScore +
      profitabilityScore +
      collectionsScore +
      growthScore +
      efficiencyScore
    ) / 5
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  /* ------------------------------
     KNOWLEDGE-BASED REASONING
  ------------------------------ */

  if (liquidityScore >= 85) {
    strengths.push(
      "Liquidity is healthy and cash reserves comfortably support operations."
    );
  } else {
    weaknesses.push(
      "Liquidity is below the recommended benchmark."
    );

    recommendations.push(
      liquidityKnowledge.recommendations.warning
    );
  }

  if (profitabilityScore >= 85) {
    strengths.push(
      "Profitability exceeds the expected benchmark."
    );
  } else {
    weaknesses.push(
      "Profit margins are below the desired benchmark."
    );

    recommendations.push(
      profitabilityKnowledge.recommendations.warning
    );
  }

  if (collectionsScore < 70) {
    weaknesses.push(
      "Outstanding receivables are reducing available working capital."
    );

    recommendations.push(
      "Accelerate collections using reminders and payment links."
    );
  }

  if (efficiencyScore < 70) {
    weaknesses.push(
      "Operating expenses are consuming too much revenue."
    );

    recommendations.push(
      "Review discretionary expenses and improve operational efficiency."
    );
  }

  return {

    overall,

    liquidity: {
      score: Math.round(liquidityScore),
      status: getStatus(liquidityScore),
      reasons: [
        `Cash coverage: ${metrics.cashCoverage.toFixed(2)} months`,
      ],
    },

    profitability: {
      score: Math.round(profitabilityScore),
      status: getStatus(profitabilityScore),
      reasons: [
        `Profit margin: ${metrics.profitMargin.toFixed(1)}%`,
      ],
    },

    collections: {
      score: Math.round(collectionsScore),
      status: getStatus(collectionsScore),
      reasons: [
        `Receivables represent ${metrics.receivableRatio.toFixed(1)}% of revenue`,
      ],
    },

    growth: {
      score: Math.round(growthScore),
      status: getStatus(growthScore),
      reasons: [
        "Growth score derived from current profitability.",
      ],
    },

    efficiency: {
      score: Math.round(efficiencyScore),
      status: getStatus(efficiencyScore),
      reasons: [
        `Expense ratio: ${metrics.expenseRatio.toFixed(1)}%`,
      ],
    },

    strengths,

    weaknesses,

    recommendations,

  };
}