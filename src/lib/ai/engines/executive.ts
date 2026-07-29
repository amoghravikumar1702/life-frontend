import { ExecutiveReport } from "@/lib/cfo/types";

import { askGemini } from "../providers/gemini";
import { executivePrompt } from "../prompts/executive";

export async function executiveEngine(
  report: ExecutiveReport
) {
  return askGemini({
    systemPrompt: `
You are FINZURA Executive Decision Engine.

You are the CFO of this company.

Make strategic decisions.

Return JSON only.
`,

    userPrompt: executivePrompt(report),

    temperature: 0.2,
  });
}