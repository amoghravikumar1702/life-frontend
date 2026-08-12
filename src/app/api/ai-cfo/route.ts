// src/app/api/ai-cfo/route.ts

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { buildExecutiveReport } from "@/lib/cfo/report";
import { generateAICFOBrief } from "@/lib/ai/openaiCFO";
import { checkRateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    /*
     * ============================================================
     * 1. AUTHENTICATION
     * ============================================================
     */

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    /*
     * ============================================================
     * 2. RATE LIMIT
     * ============================================================
     *
     * The rate-limit key is tied to the authenticated Supabase
     * user ID.
     *
     * The browser cannot choose another user's identifier.
     */

    const rateLimit = checkRateLimit(`ai-cfo:${user.id}`);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "AI CFO request limit reached. Please try again later.",
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Cache-Control": "no-store",
            "Retry-After": String(
              rateLimit.retryAfterSeconds
            ),
          },
        }
      );
    }

    /*
     * ============================================================
     * 3. BUILD EXECUTIVE REPORT
     * ============================================================
     *
     * buildExecutiveReport() obtains the authenticated user
     * server-side and builds the report from that user's data.
     *
     * No owner_id is accepted from the browser.
     */

    const report = await buildExecutiveReport();

    /*
     * ============================================================
     * 4. GENERATE AI CFO BRIEF
     * ============================================================
     *
     * OpenAI is called exclusively on the server.
     *
     * The API key is therefore never exposed to the browser.
     */

    const aiBrief = await generateAICFOBrief(report);

    /*
     * ============================================================
     * 5. RETURN MINIMAL RESPONSE
     * ============================================================
     *
     * Do not expose the complete ExecutiveReport.
     *
     * Only return information required by the frontend.
     */

    return NextResponse.json(
      {
        success: true,

        data: {
          aiBrief,

          finance: {
            revenue: Number(
              report.finance.revenue ?? 0
            ),

            expenses: Number(
              report.finance.expenses ?? 0
            ),

            profit: Number(
              report.finance.profit ?? 0
            ),

            outstandingReceivables: Number(
              report.finance
                .outstandingReceivables ?? 0
            ),
          },

          workforce: {
            currentEmployees: Number(
              report.workforce
                .currentEmployees ?? 0
            ),

            recommendedEmployees: Number(
              report.workforce
                .recommendedEmployees ?? 0
            ),

            difference: Number(
              report.workforce
                .difference ?? 0
            ),
          },
        },

        rateLimit: {
          remaining: rateLimit.remaining,
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
     * 6. SERVER-SIDE ERROR HANDLING
     * ============================================================
     *
     * Keep detailed errors in the server logs.
     *
     * Never send:
     * - OpenAI errors
     * - Supabase errors
     * - stack traces
     * - environment variables
     * - database details
     * - API keys
     * to the browser.
     */

    console.error(
      "[ArkenOne AI CFO API]",
      error instanceof Error
        ? error.message
        : "Unknown server error"
    );

    return NextResponse.json(
      {
        error:
          "Unable to generate the AI CFO briefing.",
      },
      {
        status: 500,

        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}