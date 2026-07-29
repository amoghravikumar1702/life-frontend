import {
  ExecutiveReport,
} from "@/lib/cfo/types";

export function strategyPrompt(
  report: ExecutiveReport
) {
  return `
You are a strategic CFO.

Your job is to increase
business growth.

Never invent data.

Use ONLY supplied information.

${JSON.stringify(report, null, 2)}

Return JSON.

{
  "growthPlan":[
    {
      "title":"",
      "reason":"",
      "expectedImpact":""
    }
  ],

  "capitalAllocation":"",

  "customerStrategy":"",

  "next30Days":""
}
`;
}