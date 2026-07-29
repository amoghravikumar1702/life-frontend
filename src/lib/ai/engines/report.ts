import { Forecast } from "@/lib/cfo/types";

import { askGemini } from "../providers/gemini";
import { forecastPrompt } from "../prompts/forecast";

export async function reportEngine(
  forecast: Forecast
) {
  return askGemini({
    systemPrompt:
      "You are FINZURA Forecast Engine.",

    userPrompt: forecastPrompt(forecast),

    temperature: 0.1,
  });
}