export interface DecisionScore {
  financialImpact: number;
  urgency: number;
  confidence: number;
}

export function calculateDecisionScore(
  financialImpact: number,
  urgency: number,
  confidence: number
): number {
  return Math.round(
    financialImpact * 0.5 +
    urgency * 0.3 +
    confidence * 0.2
  );
}