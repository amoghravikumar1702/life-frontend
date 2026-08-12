import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";
import { buildExecutiveReport } from "@/lib/cfo/report";
import { buildCFOContext } from "@/lib/ai/cfoContext";
import { buildDecisionContext } from "@/lib/ai/decisionEngine";
import { checkRateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

/*
 * ============================================================
 * ARKENONE AI CFO — PHASE 6
 * DECISION-AWARE CFO COMMUNICATION ENGINE
 * ============================================================
 *
 * Pipeline:
 *
 * User Question
 *      ↓
 * Authentication
 *      ↓
 * Rate Limit
 *      ↓
 * Executive Financial Report
 *      ↓
 * Compact CFO Context
 *      ↓
 * Local Decision Engine
 *      ↓
 * Decision Validation
 *      ↓
 * OpenAI CFO Reasoning
 *      ↓
 * Structured CFO Recommendation
 *      ↓
 * Server Validation
 *      ↓
 * Safe Response
 *
 * IMPORTANT:
 *
 * ArkenOne's local intelligence remains the source of truth
 * for deterministic financial calculations.
 *
 * OpenAI is the reasoning and communication layer.
 *
 * No raw database data is sent directly to OpenAI.
 * No API key is exposed to the browser.
 * No conversation history is sent.
 * No user-controlled model or token settings are accepted.
 */

/*
 * ============================================================
 * SECURITY LIMITS
 * ============================================================
 */

const MAX_QUESTION_LENGTH = 500;

const MAX_OUTPUT_TOKENS = 400;

const MAX_BODY_BYTES = 8_000;

/*
 * ============================================================
 * OPENAI CLIENT
 * ============================================================
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
 * LOCAL QUESTION CLASSIFICATION
 * ============================================================
 *
 * This determines which parts of the CFO context are useful.
 *
 * It costs ZERO OpenAI tokens.
 * ============================================================
 */

function buildRelevantContext(
  context: ReturnType<typeof buildCFOContext>,
  question: string
) {
  const q =
    question
      .toLowerCase()
      .trim();

  const hiringQuestion =
    q.includes("hire") ||
    q.includes("hiring") ||
    q.includes("employee") ||
    q.includes("employees") ||
    q.includes("staff") ||
    q.includes("team") ||
    q.includes("workforce") ||
    q.includes("salary") ||
    q.includes("salaries");

  const customerQuestion =
    q.includes("customer") ||
    q.includes("customers") ||
    q.includes("client") ||
    q.includes("clients") ||
    q.includes("collect") ||
    q.includes("collection") ||
    q.includes("receivable") ||
    q.includes("receivables") ||
    q.includes("outstanding") ||
    q.includes("overdue") ||
    q.includes("unpaid") ||
    q.includes("payment") ||
    q.includes("payments");

  const cashQuestion =
    q.includes("cash") ||
    q.includes("spend") ||
    q.includes("expense") ||
    q.includes("expenses") ||
    q.includes("afford") ||
    q.includes("runway") ||
    q.includes("profit") ||
    q.includes("money") ||
    q.includes("burn") ||
    q.includes("liquidity");

  const growthQuestion =
    q.includes("grow") ||
    q.includes("growth") ||
    q.includes("revenue") ||
    q.includes("sales") ||
    q.includes("price") ||
    q.includes("pricing") ||
    q.includes("increase") ||
    q.includes("scale") ||
    q.includes("scaling");

  const pricingQuestion =
    q.includes("price") ||
    q.includes("pricing") ||
    q.includes("charge") ||
    q.includes("discount");

  const expenseQuestion =
    q.includes("expense") ||
    q.includes("expenses") ||
    q.includes("cost") ||
    q.includes("costs") ||
    q.includes("cut") ||
    q.includes("save");

  const broadQuestion =
    !hiringQuestion &&
    !customerQuestion &&
    !cashQuestion &&
    !growthQuestion &&
    !pricingQuestion &&
    !expenseQuestion;

  /*
   * ==========================================================
   * BROAD CONTEXT
   * ==========================================================
   *
   * Keep this compact.
   */

  if (broadQuestion) {
    return {
      company:
        context.company,

      finance:
        context.finance,

      forecast:
        context.forecast,

      workforce:
        context.workforce,

      customers: {
        total:
          context.customers.total,

        active:
          context.customers.active,

        repeatCustomers:
          context.customers.repeatCustomers,

        averageInvoiceValue:
          context.customers
            .averageInvoiceValue,

        averagePaymentTime:
          context.customers
            .averagePaymentTime,

        customerConcentration:
          context.customers
            .customerConcentration,

        topCustomer:
          context.customers.topCustomer,

        topCustomerRevenue:
          context.customers
            .topCustomerRevenue,

        highestOutstandingCustomer:
          context.customers
            .highestOutstandingCustomer,

        highestOutstandingAmount:
          context.customers
            .highestOutstandingAmount,
      },
    };
  }

  /*
   * ==========================================================
   * COMPANY CONTEXT
   * ==========================================================
   */

  const relevant: Record<
    string,
    unknown
  > = {
    company: {
      name:
        context.company.name,

      industry:
        context.company.industry,

      businessModel:
        context.company.businessModel,

      businessGoal:
        context.company.businessGoal,

      growthStage:
        context.company.growthStage,

      riskAppetite:
        context.company.riskAppetite,
    },
  };

  /*
   * ==========================================================
   * FINANCIAL CONTEXT
   * ==========================================================
   *
   * Financial information is useful for almost every
   * decision, but we keep it compact.
   */

  if (
    cashQuestion ||
    growthQuestion ||
    hiringQuestion ||
    pricingQuestion ||
    expenseQuestion ||
    !customerQuestion
  ) {
    relevant.finance =
      context.finance;
  }

  /*
   * ==========================================================
   * CUSTOMER CONTEXT
   * ==========================================================
   */

  if (
    customerQuestion ||
    pricingQuestion
  ) {
    relevant.customers = {
      total:
        context.customers.total,

      active:
        context.customers.active,

      repeatCustomers:
        context.customers.repeatCustomers,

      averageInvoiceValue:
        context.customers
          .averageInvoiceValue,

      averagePaymentTime:
        context.customers
          .averagePaymentTime,

      customerConcentration:
        context.customers
          .customerConcentration,

      topCustomer:
        context.customers.topCustomer,

      topCustomerRevenue:
        context.customers
          .topCustomerRevenue,

      highestOutstandingCustomer:
        context.customers
          .highestOutstandingCustomer,

      highestOutstandingAmount:
        context.customers
          .highestOutstandingAmount,
    };
  }

  /*
   * ==========================================================
   * FORECAST
   * ==========================================================
   */

  if (
    cashQuestion ||
    growthQuestion ||
    expenseQuestion
  ) {
    relevant.forecast =
      context.forecast;
  }

  /*
   * ==========================================================
   * WORKFORCE
   * ==========================================================
   */

  if (
    hiringQuestion
  ) {
    relevant.workforce =
      context.workforce;
  }

  return relevant;
}

/*
 * ============================================================
 * DECISION CONTEXT SANITIZATION
 * ============================================================
 *
 * The Decision Engine is deterministic, but we still normalize
 * what is passed to OpenAI.
 *
 * This prevents malformed values from propagating into the
 * model prompt.
 * ============================================================
 */

function buildSafeDecisionContext(
  context: ReturnType<
    typeof buildDecisionContext
  >
) {
  return {
    type:
      context.type,

    priority:
      context.priority,

    recommendationBasis:
      Array.isArray(
        context.recommendationBasis
      )
        ? context.recommendationBasis
        : [],

    financialEvidence: {
      availableCash:
        Number.isFinite(
          Number(
            context
              .financialEvidence
              .availableCash
          )
        )
          ? Number(
              context
                .financialEvidence
                .availableCash
            )
          : 0,

      monthlyRevenue:
        Number.isFinite(
          Number(
            context
              .financialEvidence
              .monthlyRevenue
          )
        )
          ? Number(
              context
                .financialEvidence
                .monthlyRevenue
            )
          : 0,

      monthlyExpenses:
        Number.isFinite(
          Number(
            context
              .financialEvidence
              .monthlyExpenses
          )
        )
          ? Number(
              context
                .financialEvidence
                .monthlyExpenses
            )
          : 0,

      monthlyProfit:
        Number.isFinite(
          Number(
            context
              .financialEvidence
              .monthlyProfit
          )
        )
          ? Number(
              context
                .financialEvidence
                .monthlyProfit
            )
          : 0,

      outstandingReceivables:
        Number.isFinite(
          Number(
            context
              .financialEvidence
              .outstandingReceivables
          )
        )
          ? Number(
              context
                .financialEvidence
                .outstandingReceivables
            )
          : 0,

      cashRunwayDays:
        Number.isFinite(
          Number(
            context
              .financialEvidence
              .cashRunwayDays
          )
        )
          ? Number(
              context
                .financialEvidence
                .cashRunwayDays
            )
          : 0,

      revenueGrowth:
        Number.isFinite(
          Number(
            context
              .financialEvidence
              .revenueGrowth
          )
        )
          ? Number(
              context
                .financialEvidence
                .revenueGrowth
            )
          : 0,

      expenseGrowth:
        Number.isFinite(
          Number(
            context
              .financialEvidence
              .expenseGrowth
          )
        )
          ? Number(
              context
                .financialEvidence
                .expenseGrowth
            )
          : 0,

      healthScore:
        Number.isFinite(
          Number(
            context
              .financialEvidence
              .healthScore
          )
        )
          ? Math.min(
              100,
              Math.max(
                0,
                Number(
                  context
                    .financialEvidence
                    .healthScore
                )
              )
            )
          : 0,
    },

    decision: {
      affordable:
        Boolean(
          context.decision
            .affordable
        ),

      amount:
        Number.isFinite(
          Number(
            context.decision.amount
          )
        )
          ? Math.max(
              0,
              Number(
                context.decision.amount
              )
            )
          : 0,

      explanation:
        typeof context
          .decision
          .explanation ===
        "string"
          ? context.decision
              .explanation
              .trim()
          : "",
    },

    nextAction:
      typeof context.nextAction ===
      "string"
        ? context.nextAction.trim()
        : "",
  };
}

/*
 * ============================================================
 * POST
 * ============================================================
 */

export async function POST(
  request: Request
) {
  try {
    /*
     * ==========================================================
     * 1. BODY SIZE PROTECTION
     * ==========================================================
     */

    const contentLength =
      request.headers.get(
        "content-length"
      );

    if (contentLength) {
      const bytes =
        Number(
          contentLength
        );

      if (
        Number.isFinite(bytes) &&
        bytes > MAX_BODY_BYTES
      ) {
        return NextResponse.json(
          {
            error:
              "Request is too large.",
          },
          {
            status: 413,
          }
        );
      }
    }

    /*
     * ==========================================================
     * 2. AUTHENTICATION
     * ==========================================================
     */

    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ==========================================================
     * 3. RATE LIMIT
     * ==========================================================
     */

    const rateLimit =
      checkRateLimit(
        `ai-cfo-ask:${user.id}`
      );

    if (
      !rateLimit.allowed
    ) {
      return NextResponse.json(
        {
          error:
            "AI CFO request limit reached. Please try again later.",

          retryAfterSeconds:
            rateLimit.retryAfterSeconds,
        },
        {
          status: 429,

          headers: {
            "Retry-After":
              String(
                rateLimit.retryAfterSeconds
              ),

            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    /*
     * ==========================================================
     * 4. PARSE REQUEST
     * ==========================================================
     */

    let body: unknown;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          error:
            "A CFO question is required.",
        },
        {
          status: 400,
        }
      );
    }

    const questionValue =
      (
        body as {
          question?: unknown;
        }
      ).question;

    /*
     * ==========================================================
     * 5. QUESTION VALIDATION
     * ==========================================================
     */

    if (
      typeof questionValue !==
      "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Question must be text.",
        },
        {
          status: 400,
        }
      );
    }

    const question =
      questionValue.trim();

    if (!question) {
      return NextResponse.json(
        {
          error:
            "Please enter a CFO question.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      question.length >
      MAX_QUESTION_LENGTH
    ) {
      return NextResponse.json(
        {
          error:
            `Question must be ${MAX_QUESTION_LENGTH} characters or less.`,
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================================
     * 6. BUILD EXECUTIVE REPORT
     * ==========================================================
     *
     * Local processing.
     *
     * No OpenAI credits consumed.
     */

    const report =
      await buildExecutiveReport();

    /*
     * ==========================================================
     * 7. BUILD CFO CONTEXT
     * ==========================================================
     */

    const fullContext =
      buildCFOContext(
        report
      );

    /*
     * ==========================================================
     * 8. LOCAL DECISION ENGINE
     * ==========================================================
     */

    const decisionContext =
      buildDecisionContext(
        fullContext,
        question
      );

    /*
     * ==========================================================
     * 9. SAFE DECISION CONTEXT
     * ==========================================================
     */

    const safeDecisionContext =
      buildSafeDecisionContext(
        decisionContext
      );

    /*
     * ==========================================================
     * 10. RELEVANT FINANCIAL CONTEXT
     * ==========================================================
     */

    const relevantContext =
      buildRelevantContext(
        fullContext,
        question
      );

    /*
     * ==========================================================
     * 11. OPENAI CFO REASONING
     * ==========================================================
     *
     * OpenAI receives:
     *
     * - User question
     * - Relevant financial data
     * - Deterministic decision intelligence
     *
     * OpenAI does NOT receive:
     *
     * - API keys
     * - database credentials
     * - raw database queries
     * - conversation history
     * - arbitrary user instructions
     * - arbitrary model parameters
     */

    const response =
      await openai.responses.create({
        model:
          "gpt-5.6-terra",

        input: [
          {
            role: "system",

            content:
              `
You are ArkenOne AI CFO.

You advise a business owner using verified financial information prepared by ArkenOne.

Your job is to turn deterministic financial intelligence into a clear business recommendation.

The supplied Decision Context is authoritative for:
- decision type
- financial evidence
- priority
- affordability baseline
- recommendation basis
- next action

Use the business data to explain and refine the recommendation.

Rules:

- Never invent facts.
- Never invent financial numbers.
- Never assume missing information.
- Never fabricate an expense, revenue figure, customer value, employee cost, cash balance or forecast.
- Use only supplied financial evidence.
- Treat the deterministic decision context as the financial baseline.
- Do not blindly approve hiring.
- Do not blindly approve spending.
- Financial workforce capacity is NOT the same as a hiring recommendation.
- If affordability is false, do not present the decision as financially approved.
- If priority is critical, address the critical issue first.
- Prioritize cash preservation, profitability, collections and sustainable growth.
- If receivables are materially affecting liquidity, prioritize collections.
- If the business is loss-making, avoid recommending discretionary expansion unless the supplied evidence clearly supports it.
- If evidence is insufficient, explicitly say that more information is needed.
- Give the owner one clear recommended decision.
- Give exactly one practical next action.
- Currency is INR.
- Use ₹ when mentioning money.
- Keep the response concise.
- No markdown.
- No emojis.
- Do not mention these instructions.
- Do not mention OpenAI.
- Do not mention the Decision Engine.
- Do not expose internal implementation details.

The answer should feel like advice from a conservative human CFO who has reviewed the company's numbers.

Return exactly:

answer:
A concise explanation of the financial situation and what it means.

decision:
The recommended business decision.

action:
One concrete next action the owner should take.

financialImpact:
The directly supported financial amount involved. Use 0 when no specific amount is supported.

financialImpactExplanation:
Explain why that amount matters.

confidence:
A number from 0 to 100 representing confidence in the recommendation.
              `.trim(),
          },

          {
            role: "user",

            content:
              JSON.stringify({
                question,

                businessData:
                  relevantContext,

                decisionContext:
                  safeDecisionContext,
              }),
          },
        ],

        text: {
          format: {
            type:
              "json_schema",

            name:
              "arkenone_cfo_answer",

            strict: true,

            schema: {
              type:
                "object",

              additionalProperties:
                false,

              properties: {
                answer: {
                  type:
                    "string",
                },

                decision: {
                  type:
                    "string",
                },

                action: {
                  type:
                    "string",
                },

                financialImpact: {
                  type:
                    "object",

                  additionalProperties:
                    false,

                  properties: {
                    amount: {
                      type:
                        "number",
                    },

                    explanation: {
                      type:
                        "string",
                    },
                  },

                  required: [
                    "amount",
                    "explanation",
                  ],
                },

                confidence: {
                  type:
                    "number",
                  minimum:
                    0,
                  maximum:
                    100,
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

        /*
         * ======================================================
         * HARD OUTPUT LIMIT
         * ======================================================
         */

        max_output_tokens:
          MAX_OUTPUT_TOKENS,
      });

    /*
     * ==========================================================
     * 12. READ RESPONSE
     * ==========================================================
     */

    const text =
      response.output_text?.trim();

    if (!text) {
      console.error(
        "[ArkenOne CFO] Empty OpenAI response:",
        {
          status:
            response.status,

          incompleteDetails:
            response.incomplete_details,
        }
      );

      throw new Error(
        "OpenAI returned an empty response."
      );
    }

    /*
     * ==========================================================
     * 13. PARSE RESPONSE
     * ==========================================================
     */

    let parsed: {
      answer: string;

      decision: string;

      action: string;

      financialImpact: {
        amount: number;

        explanation: string;
      };

      confidence: number;
    };

    try {
      parsed =
        JSON.parse(text);
    } catch {
      console.error(
        "[ArkenOne CFO] Invalid JSON response:",
        {
          text,

          status:
            response.status,

          incompleteDetails:
            response.incomplete_details,
        }
      );

      return NextResponse.json(
        {
          error:
            "The CFO response was incomplete. Please try again.",
        },
        {
          status: 502,
        }
      );
    }

    /*
     * ==========================================================
     * 14. SERVER-SIDE TEXT VALIDATION
     * ==========================================================
     */

    const answer =
      typeof parsed.answer ===
      "string"
        ? parsed.answer.trim()
        : "";

    const decision =
      typeof parsed.decision ===
      "string"
        ? parsed.decision.trim()
        : "";

    const action =
      typeof parsed.action ===
      "string"
        ? parsed.action.trim()
        : "";

    if (
      !answer ||
      !decision ||
      !action
    ) {
      return NextResponse.json(
        {
          error:
            "CFO response was incomplete.",
        },
        {
          status: 502,
        }
      );
    }

    /*
     * ==========================================================
     * 15. FINANCIAL IMPACT SANITIZATION
     * ==========================================================
     */

    const rawFinancialAmount =
      Number(
        parsed
          .financialImpact
          ?.amount
      );

    const financialAmount =
      Number.isFinite(
        rawFinancialAmount
      )
        ? Math.max(
            0,
            rawFinancialAmount
          )
        : 0;

    const financialExplanation =
      typeof parsed
        .financialImpact
        ?.explanation ===
      "string"
        ? parsed
            .financialImpact
            .explanation
            .trim()
        : "";

    /*
     * ==========================================================
     * 16. CONFIDENCE SANITIZATION
     * ==========================================================
     */

    const rawConfidence =
      Number(
        parsed.confidence
      );

    const confidence =
      Number.isFinite(
        rawConfidence
      )
        ? Math.min(
            100,
            Math.max(
              0,
              rawConfidence
            )
          )
        : 0;

    /*
     * ==========================================================
     * 17. RETURN SAFE CFO RESPONSE
     * ==========================================================
     */

    return NextResponse.json(
      {
        success: true,

        data: {
          answer,

          decision,

          action,

          financialImpact: {
            amount:
              financialAmount,

            explanation:
              financialExplanation,
          },

          confidence,

          decisionContext: {
            type:
              decisionContext.type,

            priority:
              decisionContext.priority,

            nextAction:
              decisionContext.nextAction,

            affordable:
              decisionContext
                .decision
                .affordable,
          },
        },

        rateLimit: {
          remaining:
            rateLimit.remaining,
        },
      },

      {
        status: 200,

        headers: {
          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    /*
     * ==========================================================
     * NEVER EXPOSE INTERNAL ERRORS
     * ==========================================================
     */

    console.error(
      "[ArkenOne CFO Ask API]",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to generate the CFO recommendation.",
      },
      {
        status: 500,
      }
    );
  }
}