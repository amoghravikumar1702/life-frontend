export interface AIRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  model?: string;
}

export interface AIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIResponse<T = unknown> {
  success: boolean;

  data?: T;

  error?: string;

  usage?: AIUsage;
}