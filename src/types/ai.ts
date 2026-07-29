export interface ExecutiveReport {

  executiveSummary: string;

  financialAnalysis: string;

  topPriorities: Priority[];

  businessRisks: Risk[];

  growthOpportunities: Opportunity[];

  finalRecommendation: string;

}

export interface Priority {

  title: string;

  priority: "Critical" | "High" | "Medium" | "Low";

  reason: string;

  action: string;

  impact: string;

}

export interface Risk {

  title: string;

  severity: "Critical" | "High" | "Medium" | "Low";

  description: string;

  recommendation: string;

}

export interface Opportunity {

  title: string;

  description: string;

  expectedImpact: string;

}