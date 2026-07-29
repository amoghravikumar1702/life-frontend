export interface ExecutiveDecision {
  title: string;

  description: string;

  action: string;

  urgency:
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

  financialImpact: number;

  confidence: number;

  score: number;
}