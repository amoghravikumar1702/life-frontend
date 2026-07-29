import {
  BusinessRisk,
} from "@/lib/cfo/types";

export function risksPrompt(
  risks: BusinessRisk[]
) {
  return `
You are FINZURA AI CFO.

Analyse ONLY the supplied business risks.

Do not create new risks.

If no risks exist,

say

"No significant risks detected."

Return JSON.

Risks

${JSON.stringify(risks, null, 2)}

{
  "criticalRisks":[
    {
      "title":"",
      "reason":"",
      "recommendation":""
    }
  ],

  "overallRiskLevel":""
}
`;
}