import { ExecutiveReport } from "@/lib/cfo/types";

import { executiveEngine } from "./engines/executive";
import { buildFallbackExecutiveAnalysis } from "./fallback";

export async function runExecutiveAnalysis(
  report: ExecutiveReport
) {
  try {
    const result = await executiveEngine(report);

    if (!result.success) {
      return buildFallbackExecutiveAnalysis(report);
    }

    return result;
  } catch (error) {
    console.error(
      "[FINZURA AI] Falling back to intelligence engine:",
      error
    );

    return buildFallbackExecutiveAnalysis(report);
  }
}