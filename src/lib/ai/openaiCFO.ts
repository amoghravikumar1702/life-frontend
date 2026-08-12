// src/lib/ai/openaiCFO.ts

import OpenAI from "openai";
import { ExecutiveReport } from "@/lib/cfo/types";

/*
 * ============================================================
 * OPENAI CLIENT
 * ============================================================
 *
 * This file is SERVER ONLY.
 *
 * Never expose OPENAI_API_KEY to the browser.
 */

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "OPENAI_API_KEY is not configured."
  );
}

const openai = new OpenAI({
  apiKey,
});

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

export interface AICFOBrief {
  greeting: string;

  executiveBrief: string;

  health: {
    score: number;
    status: string;
  };

  todaysFocus: {
    title: string;
    description: string;
    amount: number;
    impact: string;
  };

  recommendation: string;

  milestone: {
    title: string;
    current: number;
    target: number;
    remaining: number;
    progress: number;
  };

  capacity: {
    title: string;
    status: string;
    currentEmployees: number;
    recommendedEmployees: number;
    difference: number;
    recommendation: string;
  };
}

export interface AICFOAnswer {
  answer: string;
  nextStep: string;
  financialImpact: string;
  confidence: number;
}

/*
 * ============================================================
 * SANITIZATION HELPERS
 * ============================================================
 */

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(
    max,
    Math.max(min, value)
  );
}

function safeNumber(
  value: unknown,
  fallback = 0
): number {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function safeInteger(
  value: unknown,
  fallback = 0
): number {
  const parsed = Math.floor(
    safeNumber(value, fallback)
  );

  return Math.max(0, parsed);
}

function safeString(
  value: unknown,
  fallback: string
): string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  )
    ? value.trim()
    : fallback;
}

/*
 * ============================================================
 * DAILY AI CFO BRIEF
 * ============================================================
 */

export async function generateAICFOBrief(
  report: ExecutiveReport
): Promise<AICFOBrief> {
  const currentEmployees =
    safeInteger(
      report.company.employees
    );

  const financiallySustainableEmployees =
    safeInteger(
      report.financiallySustainableEmployees
    );

  const response =
    await openai.responses.create({
      model: "gpt-5.6-terra",

      input: [
        {
          role: "system",

          content: `
You are ArkenOne's AI CFO.

You analyze a company's supplied financial and operational
data and produce concise executive decisions.

You are not a generic chatbot.

You are an executive financial decision engine.

==================================================
CORE PRINCIPLES
==================================================

Use ONLY supplied business data.

Never invent:

- revenue
- expenses
- profit
- cash
- receivables
- customers
- growth
- employees
- workload
- targets
- transactions
- business activity

If information is unavailable, acknowledge the limitation.

Do not repeat numbers without explaining their business meaning.

Prioritize:

1. Financial sustainability
2. Profitability
3. Cash generation
4. Collections
5. Customer economics
6. Sustainable growth

Currency is INR.

All monetary amounts in text must use ₹.

Never use USD or $.

No markdown.

No emojis.

Keep the response concise and executive-level.

==================================================
BUSINESS ANALYSIS
==================================================

Analyze:

- company profile
- revenue
- expenses
- profit
- cash
- cash flow
- receivables
- customers
- active customers
- repeat customers
- customer concentration
- top customer
- outstanding customer balances
- revenue growth
- expense growth
- forecast
- employees
- financially sustainable employees

Identify the most important business issue.

Possible issues:

- weak collections
- excessive expenses
- weak profitability
- negative cash generation
- customer concentration
- weak customer activity
- insufficient revenue
- workforce pressure
- growth opportunity
- no major financial constraint

Choose the issue best supported by the supplied data.

==================================================
TODAY'S FOCUS
==================================================

Give the owner ONE concrete action.

The action should improve:

- revenue
- profit
- cash
- collections
- customer value
- operational efficiency

Do not give generic advice.

If a monetary amount can be supported by the supplied data,
use it.

If not, amount must be 0.

==================================================
EXECUTIVE RECOMMENDATION
==================================================

Explain:

Decision → Financial reason → Business outcome

Do not simply repeat Today's Focus.

==================================================
HEALTH
==================================================

Use finance.healthScore as the primary quantitative signal.

Return a score from 0 to 100.

Do not randomly contradict supplied financial evidence.

==================================================
MILESTONE
==================================================

Create one conservative milestone using supplied data.

Do not invent targets.

If no defensible milestone exists:

current = 0
target = 0
remaining = 0
progress = 0

==================================================
WORKFORCE
==================================================

Current employees are supplied by the application.

Financially sustainable employees are an application-derived
financial baseline.

Evaluate:

- revenue
- expenses
- profit
- cash
- cash flow
- receivables
- customers
- business stage
- growth
- health
- workforce

HIRE only when the business can financially support additional
capacity and the supplied data supports profitable growth.

Prefer currentEmployees + 1 or + 2.

REDUCE only when financial evidence clearly indicates that the
current workforce threatens sustainability.

Use the smallest reasonable reduction.

Never casually recommend firing employees.

RETAIN when the current workforce is financially sustainable
and there is no strong evidence for hiring or reduction.

HOLD only when the supplied information genuinely cannot support
a reasonable workforce decision.

currentEmployees MUST equal supplied company employees.

recommendedEmployees MUST be an integer.

difference MUST equal:

recommendedEmployees - currentEmployees

==================================================
FINAL OUTPUT
==================================================

Return ONLY the requested JSON.

No markdown.

No commentary outside JSON.
`,
        },

        {
          role: "user",

          content: JSON.stringify({
            company: {
              ...report.company,
              employees:
                currentEmployees,
            },

            finance: {
              ...report.finance,
              healthScore:
                safeNumber(
                  report.finance.healthScore
                ),
            },

            customers:
              report.customers,

            risks:
              report.risks,

            forecast:
              report.forecast,

            workforceAnalysis: {
              financiallySustainableEmployees,
              currentEmployees,
            },
          }),
        },
      ],

      text: {
        format: {
          type: "json_schema",

          name: "arkenone_cfo_brief",

          strict: true,

          schema: {
            type: "object",

            additionalProperties: false,

            properties: {
              greeting: {
                type: "string",
              },

              executiveBrief: {
                type: "string",
              },

              health: {
                type: "object",
                additionalProperties: false,

                properties: {
                  score: {
                    type: "number",
                  },

                  status: {
                    type: "string",
                  },
                },

                required: [
                  "score",
                  "status",
                ],
              },

              todaysFocus: {
                type: "object",
                additionalProperties: false,

                properties: {
                  title: {
                    type: "string",
                  },

                  description: {
                    type: "string",
                  },

                  amount: {
                    type: "number",
                  },

                  impact: {
                    type: "string",
                  },
                },

                required: [
                  "title",
                  "description",
                  "amount",
                  "impact",
                ],
              },

              recommendation: {
                type: "string",
              },

              milestone: {
                type: "object",
                additionalProperties: false,

                properties: {
                  title: {
                    type: "string",
                  },

                  current: {
                    type: "number",
                  },

                  target: {
                    type: "number",
                  },

                  remaining: {
                    type: "number",
                  },

                  progress: {
                    type: "number",
                  },
                },

                required: [
                  "title",
                  "current",
                  "target",
                  "remaining",
                  "progress",
                ],
              },

              capacity: {
                type: "object",
                additionalProperties: false,

                properties: {
                  title: {
                    type: "string",
                  },

                  status: {
                    type: "string",
                  },

                  currentEmployees: {
                    type: "number",
                  },

                  recommendedEmployees: {
                    type: "number",
                  },

                  difference: {
                    type: "number",
                  },

                  recommendation: {
                    type: "string",
                  },
                },

                required: [
                  "title",
                  "status",
                  "currentEmployees",
                  "recommendedEmployees",
                  "difference",
                  "recommendation",
                ],
              },
            },

            required: [
              "greeting",
              "executiveBrief",
              "health",
              "todaysFocus",
              "recommendation",
              "milestone",
              "capacity",
            ],
          },
        },
      },

      max_output_tokens: 1800,
    });

  const text =
    response.output_text;

  if (!text) {
    throw new Error(
      "OpenAI returned an empty CFO response."
    );
  }

  try {
    const parsed =
      JSON.parse(text) as AICFOBrief;

    const healthScore =
      clamp(
        safeNumber(
          parsed.health?.score,
          report.finance.healthScore
        ),
        0,
        100
      );

    const validatedCurrentEmployees =
      currentEmployees;

    const recommendedEmployees =
      safeInteger(
        parsed.capacity
          ?.recommendedEmployees,
        validatedCurrentEmployees
      );

    const difference =
      recommendedEmployees -
      validatedCurrentEmployees;

    const milestoneCurrent =
      safeNumber(
        parsed.milestone?.current
      );

    const milestoneTarget =
      safeNumber(
        parsed.milestone?.target
      );

    const milestoneRemaining =
      Math.max(
        0,
        milestoneTarget -
          milestoneCurrent
      );

    const milestoneProgress =
      milestoneTarget <= 0
        ? 0
        : clamp(
            (
              milestoneCurrent /
              milestoneTarget
            ) *
              100,
            0,
            100
          );

    return {
      greeting:
        safeString(
          parsed.greeting,
          "Good morning."
        ),

      executiveBrief:
        safeString(
          parsed.executiveBrief,
          "ArkenOne has reviewed the available business data."
        ),

      health: {
        score:
          healthScore,

        status:
          safeString(
            parsed.health?.status,
            "Financial assessment"
          ),
      },

      todaysFocus: {
        title:
          safeString(
            parsed.todaysFocus?.title,
            "Review today's financial priority"
          ),

        description:
          safeString(
            parsed.todaysFocus?.description,
            "Review the available financial data and act on the highest-priority opportunity."
          ),

        amount:
          Math.max(
            0,
            safeNumber(
              parsed.todaysFocus?.amount
            )
          ),

        impact:
          safeString(
            parsed.todaysFocus?.impact,
            "Protect financial performance."
          ),
      },

      recommendation:
        safeString(
          parsed.recommendation,
          "Review the latest financial performance before making major business decisions."
        ),

      milestone: {
        title:
          safeString(
            parsed.milestone?.title,
            "Financial milestone"
          ),

        current:
          milestoneCurrent,

        target:
          milestoneTarget,

        remaining:
          milestoneRemaining,

        progress:
          milestoneProgress,
      },

      capacity: {
        title:
          safeString(
            parsed.capacity?.title,
            "Team Capacity"
          ),

        status:
          safeString(
            parsed.capacity?.status,
            "Workforce assessment"
          ),

        currentEmployees:
          validatedCurrentEmployees,

        recommendedEmployees,

        difference,

        recommendation:
          safeString(
            parsed.capacity?.recommendation,
            "Review workforce capacity against the company's financial performance."
          ),
      },
    };
  } catch (error) {
    console.error(
      "[ArkenOne AI CFO] Invalid JSON:",
      text,
      error
    );

    throw new Error(
      "OpenAI returned an invalid CFO response."
    );
  }
}

/*
 * ============================================================
 * ASK YOUR CFO
 * ============================================================
 */

export async function askAICFO(
  report: ExecutiveReport,
  question: string
): Promise<AICFOAnswer> {
  const cleanQuestion =
    question.trim();

  if (!cleanQuestion) {
    throw new Error(
      "CFO question cannot be empty."
    );
  }

  if (cleanQuestion.length > 1000) {
    throw new Error(
      "CFO question is too long."
    );
  }

  const currentEmployees =
    safeInteger(
      report.company.employees
    );

  const financiallySustainableEmployees =
    safeInteger(
      report.financiallySustainableEmployees
    );

  const response =
    await openai.responses.create({
      model: "gpt-5.6-terra",

      input: [
        {
          role: "system",

          content: `
You are ArkenOne's AI CFO.

The business owner is directly asking you a financial or
business decision question.

Answer the actual question using the supplied LIVE business data.

You are not a generic chatbot.

You are the company's financial decision engine.

==================================================
CORE RULE
==================================================

Answer the owner's actual question.

Do not simply summarize the dashboard.

Calculate relationships between supplied numbers when necessary.

Examples:

- revenue vs expenses
- profit margin
- cash vs expenses
- receivables vs revenue
- employee count vs revenue
- sustainable workforce vs current workforce
- forecast revenue vs forecast expenses
- outstanding balances vs cash needs

Use arithmetic when it helps answer the question.

==================================================
DATA RULES
==================================================

Use ONLY supplied business data.

Never invent:

- revenue
- expenses
- profit
- cash
- receivables
- customers
- employees
- costs
- targets
- transactions
- business activity
- future events

If the data is insufficient, say what is missing.

Do not pretend to know unavailable information.

==================================================
DECISION STANDARD
==================================================

Think like a conservative CFO.

Prioritize:

1. Financial sustainability
2. Cash protection
3. Profitability
4. Collections
5. Sustainable growth

Do not recommend spending simply because cash exists.

Do not recommend hiring simply because growth is possible.

Do not recommend reducing employees casually.

==================================================
NEXT STEP
==================================================

Every answer MUST contain one concrete next step.

The next step should be something the owner can actually do.

Good:

"Collect ₹25,000 from the outstanding customer before
committing additional marketing spend."

Bad:

"Improve cash flow."

==================================================
FINANCIAL IMPACT
==================================================

Explain the financial reason behind the recommendation.

If an amount can be calculated from supplied data, use it.

Currency is INR.

Use ₹.

Never use $ or USD.

==================================================
CONFIDENCE
==================================================

Return confidence from 0 to 100.

High confidence means the supplied data directly supports
the conclusion.

Lower confidence means important information is missing.

==================================================
STYLE
==================================================

Professional.

Direct.

Concise.

Executive-level.

No markdown.

No emojis.

==================================================
OUTPUT
==================================================

Return ONLY the required JSON.
`,
        },

        {
          role: "user",

          content: JSON.stringify({
            question:
              cleanQuestion,

            company: {
              ...report.company,
              employees:
                currentEmployees,
            },

            finance:
              report.finance,

            customers:
              report.customers,

            risks:
              report.risks,

            forecast:
              report.forecast,

            workforceAnalysis: {
              financiallySustainableEmployees,
              currentEmployees,
            },
          }),
        },
      ],

      text: {
        format: {
          type: "json_schema",

          name: "arkenone_cfo_answer",

          strict: true,

          schema: {
            type: "object",

            additionalProperties: false,

            properties: {
              answer: {
                type: "string",
              },

              nextStep: {
                type: "string",
              },

              financialImpact: {
                type: "string",
              },

              confidence: {
                type: "number",
              },
            },

            required: [
              "answer",
              "nextStep",
              "financialImpact",
              "confidence",
            ],
          },
        },
      },

      max_output_tokens: 900,
    });

  const text =
    response.output_text;

  if (!text) {
    throw new Error(
      "OpenAI returned an empty CFO answer."
    );
  }

  try {
    const parsed =
      JSON.parse(text) as AICFOAnswer;

    return {
      answer:
        safeString(
          parsed.answer,
          "I could not determine a reliable answer from the available financial data."
        ),

      nextStep:
        safeString(
          parsed.nextStep,
          "Review the current financial position before taking action."
        ),

      financialImpact:
        safeString(
          parsed.financialImpact,
          "The financial impact cannot be determined precisely from the available data."
        ),

      confidence:
        clamp(
          safeNumber(
            parsed.confidence,
            50
          ),
          0,
          100
        ),
    };
  } catch (error) {
    console.error(
      "[ArkenOne AI CFO] Invalid CFO answer:",
      text,
      error
    );

    throw new Error(
      "OpenAI returned an invalid CFO answer."
    );
  }
}

/*
 * ============================================================
 * PROTECTED AI CFO BRIEF
 * ============================================================
 *
 * Kept as an alias for your existing dashboard page if it
 * imports generateProtectedAICFOBrief.
 *
 * Authentication and rate limiting are handled by the API
 * route. The page can continue using this function safely
 * because it executes server-side.
 *
 * ============================================================
 */

export async function generateProtectedAICFOBrief(
  report: ExecutiveReport
): Promise<AICFOBrief> {
  return generateAICFOBrief(
    report
  );
}