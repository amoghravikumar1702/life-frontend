import { FinancialMetrics } from "@/lib/cfo/types";

import { askGemini } from "../providers/gemini";
import { financePrompt } from "../prompts/finance";

export async function financeEngine(
  finance: FinancialMetrics
) {
  return askGemini({
    systemPrompt:
      "You are FINZURA Financial Analysis Engine.",

    userPrompt: financePrompt(finance),

    temperature: 0.1,
  });
}