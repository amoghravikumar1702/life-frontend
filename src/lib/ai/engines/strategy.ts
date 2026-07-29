import { ExecutiveReport } from "@/lib/cfo/types";

import { askGemini } from "../providers/gemini";
import { strategyPrompt } from "../prompts/strategy";

export async function strategyEngine(
  report: ExecutiveReport
) {
  return askGemini({
    systemPrompt:
      "You are FINZURA Strategy Engine.",

    userPrompt: strategyPrompt(report),

    temperature: 0.2,
  });
}