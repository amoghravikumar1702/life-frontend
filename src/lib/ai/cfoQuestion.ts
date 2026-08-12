export interface CFOQuestionRequest {
  question: string;
}

export interface CFOQuestionResponse {
  answer: string;

  decision: string;

  action: string;

  financialImpact: {
    amount: number;
    explanation: string;
  };

  confidence: number;
}