// src/app/api/ai-cfo/ask/route.ts

import { NextResponse } from "next/server";

import { getCFOContext } from "@/lib/cfo/getCFOContext";
import { askAICFO } from "@/lib/ai/openaiCFO";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const question =
      typeof body?.question === "string"
        ? body.question.trim()
        : "";

    if (!question) {
      return NextResponse.json(
        {
          error: "Please provide a financial question.",
        },
        { status: 400 }
      );
    }

    if (question.length > 2000) {
      return NextResponse.json(
        {
          error: "Question is too long.",
        },
        { status: 400 }
      );
    }

    const context =
      await getCFOContext();

    const result =
      await askAICFO(
        context,
        question
      );

    return NextResponse.json(
      {
        data: result,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
  } catch (error) {
    console.error(
      "[ArkenOne CFO] Request failed:",
      error instanceof Error
        ? error.message
        : error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to get a CFO response right now.",
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