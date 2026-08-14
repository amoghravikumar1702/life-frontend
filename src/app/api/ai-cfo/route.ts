// src/app/api/ai-cfo/ask/route.ts

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { buildExecutiveReport } from "@/lib/cfo/report";
import { askAICFO } from "@/lib/ai/openaiCFO";
import { checkRateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request
) {
  try {
    /*
     * ============================================================
     * 1. AUTHENTICATION
     * ============================================================
     */

    const supabase =
      await createClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    /*
     * ============================================================
     * 2. RATE LIMIT
     * ============================================================
     */

    const rateLimit =
      checkRateLimit(
        `ai-cfo-ask:${user.id}`
      );

    if (!rateLimit.allowed) {
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
            "Cache-Control":
              "no-store",
            "Retry-After": String(
              rateLimit.retryAfterSeconds
            ),
          },
        }
      );
    }

    /*
     * ============================================================
     * 3. READ REQUEST
     * ============================================================
     */

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid request body.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("question" in body)
    ) {
      return NextResponse.json(
        {
          error:
            "CFO question is required.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    const questionValue =
      (
        body as {
          question?: unknown;
        }
      ).question;

    if (
      typeof questionValue !==
      "string"
    ) {
      return NextResponse.json(
        {
          error:
            "CFO question must be a string.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    const question =
      questionValue.trim();

    if (!question) {
      return NextResponse.json(
        {
          error:
            "CFO question cannot be empty.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    if (question.length > 1000) {
      return NextResponse.json(
        {
          error:
            "CFO question is too long.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }

    /*
     * ============================================================
     * 4. BUILD LIVE EXECUTIVE REPORT
     * ============================================================
     *
     * The report is generated server-side using the authenticated
     * Supabase user.
     *
     * The browser never supplies financial data.
     */

    const report =
      await buildExecutiveReport();

    /*
     * ============================================================
     * 5. ASK THE AI CFO
     * ============================================================
     */

    const cfoAnswer =
      await askAICFO(
        report,
        question
      );

    /*
     * ============================================================
     * 6. NORMALIZE RESPONSE FOR FRONTEND
     * ============================================================
     *
     * AskYourCFO expects:
     *
     * {
     *   answer,
     *   decision,
     *   action,
     *   financialImpact: {
     *     amount,
     *     explanation
     *   },
     *   confidence
     * }
     *
     * askAICFO currently returns:
     *
     * {
     *   answer,
     *   nextStep,
     *   financialImpact: string,
     *   confidence
     * }
     *
     * Therefore we translate the server-side CFO response here.
     */

    const financialImpactText =
      typeof cfoAnswer.financialImpact ===
      "string"
        ? cfoAnswer.financialImpact
        : "";

    /*
     * Try to extract a rupee amount from the
     * financial-impact explanation.
     *
     * If no reliable amount exists, return 0.
     */

    let financialImpactAmount = 0;

    const amountMatch =
      financialImpactText.match(
        /₹\s*([\d,]+(?:\.\d+)?)/i
      );

    if (amountMatch?.[1]) {
      const parsedAmount =
        Number(
          amountMatch[1].replace(
            /,/g,
            ""
          )
        );

      if (
        Number.isFinite(
          parsedAmount
        )
      ) {
        financialImpactAmount =
          parsedAmount;
      }
    }

    /*
     * ============================================================
     * 7. RETURN CFO RESPONSE
     * ============================================================
     */

    return NextResponse.json(
      {
        success: true,

        data: {
          answer:
            cfoAnswer.answer,

          decision:
            cfoAnswer.answer,

          action:
            cfoAnswer.nextStep,

          financialImpact: {
            amount:
              financialImpactAmount,

            explanation:
              financialImpactText,
          },

          confidence:
            Number.isFinite(
              Number(
                cfoAnswer.confidence
              )
            )
              ? Math.min(
                  100,
                  Math.max(
                    0,
                    Number(
                      cfoAnswer.confidence
                    )
                  )
                )
              : 0,
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

          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
  } catch (error) {
    /*
     * ============================================================
     * 8. SERVER-SIDE ERROR HANDLING
     * ============================================================
     *
     * Never expose OpenAI/Supabase internals to the browser.
     */

    console.error(
      "[ArkenOne Ask CFO API]",
      error instanceof Error
        ? error.message
        : error
    );

    return NextResponse.json(
      {
        error:
          "Unable to reach your CFO right now. Please try again.",
      },
      {
        status: 500,

        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  }
}