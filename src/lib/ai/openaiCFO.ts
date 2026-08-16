// src/lib/ai/openaiCFO.ts

import OpenAI from "openai";
import { ExecutiveReport } from "@/lib/cfo/types";
import { getCFOContext } from "@/lib/cfo/getCFOContext";

/*
 * ============================================================
 * ARKENONE AI CFO — OPENAI ENGINE
 * ============================================================
 */

const DEFAULT_CFO_MODEL = "gpt-5.6-terra";

function getCFOModel(): string {
  const configuredModel =
    process.env.OPENAI_CFO_MODEL?.trim();

  console.log(
    "[DEBUG] Raw OPENAI_CFO_MODEL value:",
    JSON.stringify(configuredModel)
  );

  return configuredModel || DEFAULT_CFO_MODEL;
}

function getOpenAIClient(): OpenAI {
  const apiKey =
    process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add your OpenAI API key to .env.local and restart the Next.js server."
    );
  }

  return new OpenAI({
    apiKey,
  });
}

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

  /*
   * WORKFORCE
   *
   * IMPORTANT:
   *
   * The AI CFO receives the actual employee count.
   *
   * It does NOT produce a hardcoded recommended employee
   * count anymore.
   *
   * Workforce decisions belong to the AI CFO's reasoning.
   */

  workforce: {
    currentEmployees: number;
    status: string;
    recommendation: string;
  };
}

export interface AICFOAnswer {
  answer: string;

  decision: string;

  action: string;

  financialImpact: {
    amount: number;
    explanation: string;
  };

  confidence: number;
}

/*
 * ============================================================
 * ASK CFO CONTEXT
 * ============================================================
 */

type CFOAskContext =
  Awaited<
    ReturnType<typeof getCFOContext>
  >;

/*
 * ============================================================
 * SAFE HELPERS
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

  return Math.max(
    0,
    parsed
  );
}

function safeString(
  value: unknown,
  fallback: string
): string {
  if (
    typeof value === "string" &&
    value.trim().length > 0
  ) {
    return value.trim();
  }

  return fallback;
}

function getReportEmployees(
  report: ExecutiveReport
): number {
  return safeInteger(
    report.company?.employees
  );
}

/*
 * ============================================================
 * RESPONSE TEXT
 * ============================================================
 */

function extractResponseText(
  response: OpenAI.Responses.Response
): string {
  if (
    typeof response.output_text === "string" &&
    response.output_text.trim().length > 0
  ) {
    return response.output_text.trim();
  }

  for (
    const item of response.output ?? []
  ) {
    if (
      item.type !== "message"
    ) {
      continue;
    }

    for (
      const content of item.content ?? []
    ) {
      if (
        content.type === "output_text" &&
        typeof content.text === "string" &&
        content.text.trim().length > 0
      ) {
        return content.text.trim();
      }
    }
  }

  return "";
}

/*
 * ============================================================
 * OPENAI ERROR NORMALIZATION
 * ============================================================
 */

function createOpenAIError(
  error: unknown,
  model: string
): Error {
  const possibleError =
    error as {
      status?: number;
      message?: string;
      code?: string;
      type?: string;
      error?: {
        message?: string;
        code?: string;
        type?: string;
      };
    };

  const status =
    possibleError?.status;

  const message =
    possibleError?.error?.message ??
    possibleError?.message ??
    "Unknown OpenAI error.";

  if (
    status === 401 ||
    possibleError?.code === "invalid_api_key"
  ) {
    return new Error(
      "ArkenOne AI CFO: OpenAI API key is invalid or missing."
    );
  }

  if (status === 403) {
    return new Error(
      `ArkenOne AI CFO: OpenAI project does not have access to model "${model}".`
    );
  }

  if (status === 404) {
    return new Error(
      `ArkenOne AI CFO: model "${model}" was not found or is unavailable to this API project.`
    );
  }

  if (status === 429) {
    return new Error(
      "ArkenOne AI CFO: OpenAI rate limit or quota limit reached."
    );
  }

  return new Error(
    `ArkenOne AI CFO OpenAI error (${status ?? "unknown"}): ${message}`
  );
}

/*
 * ============================================================
 * DAILY AI CFO BRIEF
 * ============================================================
 */

export async function generateAICFOBrief(
  report: ExecutiveReport
): Promise<AICFOBrief> {
  const openai =
    getOpenAIClient();

  const model =
    getCFOModel();

  const currentEmployees =
    getReportEmployees(report);

  let response:
    OpenAI.Responses.Response;

  try {
    response =
      await openai.responses.create({
        model,

        instructions: `
You are ArkenOne's AI CFO.

You are an executive financial decision engine.

Analyze ONLY the supplied business information.

Never invent revenue, expenses, profit, cash, receivables,
customers, employees, targets, transactions, growth,
or future events.

============================================================
FINANCIAL DATA
============================================================

Revenue = supplied revenue.

Expenses = recorded business expenses.

Profit = supplied profit.

If profit is not supplied reliably, calculate:

profit = revenue - expenses

Outstanding receivables are NOT available cash.

Do not claim a verified bank balance unless explicitly supplied.

Currency is INR. Always use ₹.

============================================================
PRIORITIES
============================================================

Prioritize:

1. Financial sustainability
2. Profitability
3. Cash generation
4. Collections
5. Customer economics
6. Sustainable growth
7. Workforce sustainability

============================================================
WORKFORCE
============================================================

The supplied employee count is the ACTUAL current workforce.

Do NOT calculate a generic employee quota.

Do NOT use revenue divided by an arbitrary employee amount.

Do NOT produce a hardcoded recommended employee count.

Do NOT assume that more revenue means more employees are required.

When evaluating workforce:

Consider:

- revenue
- expenses
- profit
- cash flow
- runway
- receivables
- business growth
- operational requirements
- actual employee count

Only recommend hiring when the financial and operational
evidence supports it.

Only recommend reducing workforce when the evidence strongly
supports it.

Never casually recommend firing employees.

If the data is insufficient, say so.

============================================================
TODAY'S FOCUS
============================================================

Today's focus must contain ONE concrete action supported by
the supplied financial data.

Use:

Decision → Financial reason → Business outcome

============================================================
MILESTONE
============================================================

Only create a milestone when the supplied data supports one.

Never invent a target.

If no reliable target exists:

title = "Financial milestone"

current = 0

target = 0

remaining = 0

progress = 0

============================================================
WORKFORCE RESPONSE
============================================================

Return:

currentEmployees:
The exact supplied employee count.

status:
A concise workforce assessment.

recommendation:
The AI CFO's reasoning about the current workforce.

This recommendation must be based on actual business data.

Do NOT return a recommended employee number.

============================================================
STYLE
============================================================

Professional.

Direct.

Concise.

Executive-level.

No emojis.

No markdown.

Return ONLY valid JSON matching the supplied schema.
`,

        input: JSON.stringify({
          company: {
            ...report.company,

            employees:
              currentEmployees,
          },

          finance: {
            ...report.finance,

            healthScore:
              safeNumber(
                report.finance?.healthScore
              ),
          },

          customers:
            report.customers,

          risks:
            report.risks,

          forecast:
            report.forecast,

          workforce: {
            currentEmployees,

            rationale:
              report.workforce?.rationale ??
              "",
          },
        }),

        text: {
          format: {
            type: "json_schema",

            name:
              "arkenone_cfo_brief",

            strict: true,

            schema: {
              type: "object",

              additionalProperties:
                false,

              properties: {
                greeting: {
                  type: "string",
                },

                executiveBrief: {
                  type: "string",
                },

                health: {
                  type: "object",

                  additionalProperties:
                    false,

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

                  additionalProperties:
                    false,

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

                  additionalProperties:
                    false,

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

                workforce: {
                  type: "object",

                  additionalProperties:
                    false,

                  properties: {
                    currentEmployees: {
                      type: "number",
                    },

                    status: {
                      type: "string",
                    },

                    recommendation: {
                      type: "string",
                    },
                  },

                  required: [
                    "currentEmployees",
                    "status",
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
                "workforce",
              ],
            },
          },
        },

        max_output_tokens: 1800,
      });
  } catch (error) {
    console.error(
      "[ArkenOne CFO] OpenAI request failed:",
      {
        model,

        status:
          (
            error as {
              status?: number;
            }
          )?.status,
      }
    );

    throw createOpenAIError(
      error,
      model
    );
  }

  /*
   * ==========================================================
   * EXTRACT OUTPUT
   * ==========================================================
   */

  const text =
    extractResponseText(
      response
    );

  if (!text) {
    throw new Error(
      `ArkenOne AI CFO: model "${model}" returned no usable output.`
    );
  }

  /*
   * ==========================================================
   * PARSE
   * ==========================================================
   */

  let parsed:
    Partial<AICFOBrief>;

  try {
    parsed =
      JSON.parse(text) as
        Partial<AICFOBrief>;
  } catch {
    throw new Error(
      "ArkenOne AI CFO: OpenAI returned invalid JSON."
    );
  }

  /*
   * ==========================================================
   * NORMALIZE HEALTH
   * ==========================================================
   */

  const healthScore =
    clamp(
      safeNumber(
        parsed.health?.score,
        safeNumber(
          report.finance?.healthScore
        )
      ),
      0,
      100
    );

  /*
   * ==========================================================
   * NORMALIZE MILESTONE
   * ==========================================================
   */

  const milestoneCurrent =
    Math.max(
      0,
      safeNumber(
        parsed.milestone?.current
      )
    );

  const milestoneTarget =
    Math.max(
      0,
      safeNumber(
        parsed.milestone?.target
      )
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
          ) * 100,
          0,
          100
        );

  /*
   * ==========================================================
   * NORMALIZE WORKFORCE
   * ==========================================================
   *
   * IMPORTANT:
   *
   * currentEmployees comes from the business report.
   *
   * We intentionally ignore any AI-generated employee count.
   */

  const workforceCurrentEmployees =
    currentEmployees;

  /*
   * ==========================================================
   * FINAL BRIEF
   * ==========================================================
   */

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

    workforce: {
      currentEmployees:
        workforceCurrentEmployees,

      status:
        safeString(
          parsed.workforce?.status,
          "Workforce assessment"
        ),

      recommendation:
        safeString(
          parsed.workforce?.recommendation,
          "Review workforce requirements against the company's current financial and operational position."
        ),
    },
  };
}

/*
 * ============================================================
 * ASK YOUR CFO
 * ============================================================
 */

export async function askAICFO(
  context: CFOAskContext,
  question: string
): Promise<AICFOAnswer> {
  const cleanQuestion =
    question.trim();

  if (!cleanQuestion) {
    throw new Error(
      "CFO question cannot be empty."
    );
  }

  if (
    cleanQuestion.length > 2000
  ) {
    throw new Error(
      "CFO question is too long."
    );
  }

  const openai =
    getOpenAIClient();

  const model =
    getCFOModel();

  const financialSummary =
    context.financialSummary;

  const revenue =
    safeNumber(
      financialSummary?.revenue
    );

  const expenses =
    safeNumber(
      financialSummary?.expenses
    );

  const profit =
    safeNumber(
      financialSummary?.profit
    );

  const outstandingReceivables =
    safeNumber(
      financialSummary?.outstandingReceivables
    );

  const invoiceCount =
    safeInteger(
      financialSummary?.invoiceCount
    );

  const expenseCount =
    safeInteger(
      financialSummary?.expenseCount
    );

  const startingRevenue =
    safeNumber(
      context.business?.startingRevenue
    );

  const companyId =
    context.business?.companyId;

  const industry =
    safeString(
      context.business?.industry,
      "Other"
    );

  /*
   * ==========================================================
   * REQUEST
   * ==========================================================
   */

  let response:
    OpenAI.Responses.Response;

  try {
    response =
      await openai.responses.create({
        model,

        instructions: `
You are ArkenOne's AI CFO.

The business owner is directly asking you a financial or
business decision question.

Your job is to behave like a real conservative CFO.

Use ONLY the supplied LIVE business data.

============================================================
DATA INTEGRITY
============================================================

Never invent:

- revenue
- expenses
- profit
- cash
- bank balance
- receivables
- customers
- employees
- costs
- targets
- transactions
- conversions
- future events

If information is missing, explicitly state that it is missing.

Outstanding receivables are NOT available cash.

Never assume a bank balance unless one is explicitly supplied.

============================================================
CALCULATIONS
============================================================

You may calculate relationships between supplied numbers.

Useful calculations include:

- profit = revenue - expenses
- profit margin
- receivables as a percentage of revenue
- expense as a percentage of revenue
- proposed expense as a percentage of revenue
- proposed expense as a percentage of profit
- collection priorities
- affordability estimates

When calculating affordability, clearly distinguish an estimate
from a guaranteed safe spending amount.

============================================================
WORKFORCE
============================================================

The business's actual employee count must come from the supplied
workforce/company data.

Do not use an arbitrary revenue-per-employee formula.

Do not create a generic "recommended employee count".

If the owner asks:

"Should I hire?"

Evaluate:

- current employees
- revenue
- expenses
- profit
- cash flow
- runway
- receivables
- business growth
- operational requirements

If the owner asks:

"Should I remove an employee?"

Do not recommend termination casually.

Explain the financial evidence and operational trade-offs.

If the available data is insufficient, say so.

If the owner asks whether they can afford another employee,
calculate the known financial impact where possible.

Clearly distinguish:

Known financial impact
from
Estimated future affordability.

============================================================
DECISION STANDARD
============================================================

Prioritize:

1. Liquidity
2. Financial sustainability
3. Profitability
4. Collections
5. Cash protection
6. Sustainable growth
7. Workforce sustainability

Do not recommend spending simply because revenue exists.

Do not recommend hiring simply because growth is possible.

Do not recommend reducing employees casually.

============================================================
IMPORTANT LIMITATION
============================================================

The supplied context does NOT automatically contain verified
bank cash.

If the owner asks whether they can afford something and no
cash balance is supplied, say that affordability cannot be
confirmed from accounting data alone.

You may still calculate the immediate accounting impact.

============================================================
ANSWER STRUCTURE
============================================================

Return:

answer:
A concise explanation answering the actual question.

decision:
The CFO's direct decision or recommendation.

action:
ONE concrete next action the business owner should take.

financialImpact:
amount:
A numeric INR amount representing the directly calculable
financial impact.

If no specific amount can be responsibly calculated,
return 0.

explanation:
Explain what that amount means financially.

confidence:
A number from 0 to 100 representing confidence in the
recommendation based on the completeness and quality of data.

============================================================
STYLE
============================================================

Professional.

Direct.

Concise.

Executive-level.

No emojis.

No markdown.

Use ₹ when discussing INR.

Do not use $ or USD.

Do not merely repeat the dashboard.

Lead with the conclusion.

Return ONLY valid JSON matching the supplied schema.
`,

        input: JSON.stringify({
          question:
            cleanQuestion,

          business: {
            companyId,
            industry,
            startingRevenue,

            profile:
              context.business?.profile ??
              {},
          },

          financialSummary: {
            revenue,
            expenses,
            profit,
            outstandingReceivables,
            invoiceCount,
            expenseCount,
          },

          snapshot:
            context.snapshot ??
            null,

          invoices:
            context.invoices ??
            [],

          expenses:
            context.expenses ??
            [],

          customers:
            context.customers ??
            [],

          workforce:
            context.workforce ??
            context.business?.profile?.employees ??
            null,
        }),

        text: {
          format: {
            type: "json_schema",

            name:
              "arkenone_cfo_answer",

            strict: true,

            schema: {
              type: "object",

              additionalProperties:
                false,

              properties: {
                answer: {
                  type: "string",
                },

                decision: {
                  type: "string",
                },

                action: {
                  type: "string",
                },

                financialImpact: {
                  type: "object",

                  additionalProperties:
                    false,

                  properties: {
                    amount: {
                      type: "number",
                    },

                    explanation: {
                      type: "string",
                    },
                  },

                  required: [
                    "amount",
                    "explanation",
                  ],
                },

                confidence: {
                  type: "number",
                },
              },

              required: [
                "answer",
                "decision",
                "action",
                "financialImpact",
                "confidence",
              ],
            },
          },
        },

        max_output_tokens: 1200,
      });
  } catch (error) {
    console.error(
      "[ArkenOne CFO] Ask request failed:",
      {
        model,

        status:
          (
            error as {
              status?: number;
            }
          )?.status,
      }
    );

    throw createOpenAIError(
      error,
      model
    );
  }

  /*
   * ==========================================================
   * EXTRACT OUTPUT
   * ==========================================================
   */

  const text =
    extractResponseText(
      response
    );

  if (!text) {
    console.error(
      "[ArkenOne CFO] Ask returned no output.",
      {
        model,

        responseId:
          response.id,

        status:
          response.status,
      }
    );

    throw new Error(
      `ArkenOne AI CFO: model "${model}" returned no usable answer.`
    );
  }

  /*
   * ==========================================================
   * PARSE
   * ==========================================================
   */

  let parsed:
    Partial<AICFOAnswer>;

  try {
    parsed =
      JSON.parse(text) as
        Partial<AICFOAnswer>;
  } catch {
    console.error(
      "[ArkenOne CFO] Ask returned invalid JSON.",
      {
        model,

        responseId:
          response.id,
      }
    );

    throw new Error(
      "ArkenOne AI CFO: OpenAI returned invalid answer JSON."
    );
  }

  /*
   * ==========================================================
   * NORMALIZE FINANCIAL IMPACT
   * ==========================================================
   */

  const financialImpactAmount =
    Math.max(
      0,
      safeNumber(
        parsed.financialImpact?.amount
      )
    );

  /*
   * ==========================================================
   * FINAL CFO ANSWER
   * ==========================================================
   */

  return {
    answer:
      safeString(
        parsed.answer,
        "I could not determine a reliable answer from the available financial data."
      ),

    decision:
      safeString(
        parsed.decision,
        "No clear decision could be determined from the available data."
      ),

    action:
      safeString(
        parsed.action,
        "Review the current financial position before taking action."
      ),

    financialImpact: {
      amount:
        financialImpactAmount,

      explanation:
        safeString(
          parsed.financialImpact?.explanation,
          "The financial impact cannot be determined precisely from the available data."
        ),
    },

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
}

/*
 * ============================================================
 * PROTECTED AI CFO BRIEF
 * ============================================================
 */

export async function generateProtectedAICFOBrief(
  report: ExecutiveReport
): Promise<AICFOBrief> {
  return generateAICFOBrief(
    report
  );
}