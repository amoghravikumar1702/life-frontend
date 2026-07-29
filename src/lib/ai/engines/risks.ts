import { BusinessRisk } from "@/lib/cfo/types";

import { askGemini } from "../providers/gemini";
import { risksPrompt } from "../prompts/risks";

export async function riskEngine(
  risks: BusinessRisk[]
) {
  return askGemini({
    systemPrompt:
      "You are FINZURA Risk Analysis Engine.",

    userPrompt: risksPrompt(risks),

    temperature: 0.1,
  });
}