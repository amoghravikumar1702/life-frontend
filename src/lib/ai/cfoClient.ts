/*
 * ============================================================
 * DhanarkOS AI CFO — CLIENT SERVICE
 * ============================================================
 *
 * Browser-side service for communicating with the AI CFO API.
 *
 * IMPORTANT:
 *
 * - Never expose OPENAI_API_KEY here.
 * - Never allow the browser to select the OpenAI model.
 * - Never allow the browser to control token limits.
 * - The browser only sends the CFO question.
 * - All financial intelligence is calculated server-side.
 */

export interface CFOFinancialImpact {
  amount: number;
  explanation: string;
}

export interface CFOAnswer {
  answer: string;
  decision: string;
  action: string;

  financialImpact: CFOFinancialImpact;

  confidence: number;
}

export interface CFOAskResponse {
  success: true;

  data: CFOAnswer;

  rateLimit: {
    remaining: number;
  };
}

export interface CFOErrorResponse {
  error: string;

  retryAfterSeconds?: number;
}

/*
 * ============================================================
 * CLIENT ERROR
 * ============================================================
 *
 * A dedicated error class allows the UI to distinguish:
 *
 * - rate limits
 * - validation errors
 * - authentication errors
 * - server failures
 */

export class CFOClientError extends Error {
  status: number;

  retryAfterSeconds?: number;

  constructor(
    message: string,
    status: number,
    retryAfterSeconds?: number
  ) {
    super(message);

    this.name = "CFOClientError";

    this.status = status;

    this.retryAfterSeconds =
      retryAfterSeconds;
  }
}

/*
 * ============================================================
 * QUESTION LIMIT
 * ============================================================
 *
 * Keep this synchronized with the server-side limit.
 *
 * The server remains authoritative.
 */

const MAX_QUESTION_LENGTH = 500;

/*
 * ============================================================
 * ASK CFO
 * ============================================================
 */

export async function askCFO(
  question: string
): Promise<CFOAskResponse> {
  /*
   * ==========================================================
   * 1. LOCAL VALIDATION
   * ==========================================================
   *
   * This prevents unnecessary requests for obviously invalid
   * input.
   *
   * This does NOT replace server-side validation.
   */

  if (
    typeof question !==
    "string"
  ) {
    throw new CFOClientError(
      "Please enter a CFO question.",
      400
    );
  }

  const normalizedQuestion =
    question.trim();

  if (
    !normalizedQuestion
  ) {
    throw new CFOClientError(
      "Please enter a CFO question.",
      400
    );
  }

  if (
    normalizedQuestion.length >
    MAX_QUESTION_LENGTH
  ) {
    throw new CFOClientError(
      `Question must be ${MAX_QUESTION_LENGTH} characters or less.`,
      400
    );
  }

  /*
   * ==========================================================
   * 2. SEND REQUEST
   * ==========================================================
   */

  let response: Response;

  try {
    response = await fetch(
      "/api/ai-cfo/ask",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          question:
            normalizedQuestion,
        }),

        cache: "no-store",
      }
    );
  } catch {
    /*
     * Network failure.
     */

    throw new CFOClientError(
      "Unable to connect to the AI CFO. Please check your connection and try again.",
      0
    );
  }

  /*
   * ==========================================================
   * 3. PARSE RESPONSE
   * ==========================================================
   */

  let payload:
    | CFOAskResponse
    | CFOErrorResponse
    | null = null;

  try {
    payload =
      (await response.json()) as
        | CFOAskResponse
        | CFOErrorResponse;
  } catch {
    /*
     * The server returned something that was not valid JSON.
     */

    throw new CFOClientError(
      "The AI CFO returned an invalid response. Please try again.",
      response.status
    );
  }

  /*
   * ==========================================================
   * 4. HANDLE SERVER ERROR
   * ==========================================================
   */

  if (!response.ok) {
    const errorPayload =
      payload as CFOErrorResponse;

    const message =
      typeof errorPayload?.error ===
      "string"
        ? errorPayload.error
        : "Unable to generate the CFO recommendation.";

    throw new CFOClientError(
      message,
      response.status,
      errorPayload?.retryAfterSeconds
    );
  }

  /*
   * ==========================================================
   * 5. VALIDATE SUCCESS RESPONSE
   * ==========================================================
   */

  const successPayload =
    payload as CFOAskResponse;

  if (
    !successPayload ||
    successPayload.success !==
      true ||
    !successPayload.data
  ) {
    throw new CFOClientError(
      "The AI CFO returned an incomplete response. Please try again.",
      response.status
    );
  }

  /*
   * ==========================================================
   * 6. VALIDATE CFO DATA
   * ==========================================================
   *
   * Never blindly trust data coming from an API.
   */

  const data =
    successPayload.data;

  if (
    typeof data.answer !==
    "string" ||
    typeof data.decision !==
    "string" ||
    typeof data.action !==
    "string"
  ) {
    throw new CFOClientError(
      "The AI CFO response was incomplete. Please try again.",
      502
    );
  }

  /*
   * ==========================================================
   * 7. SANITIZE NUMERIC VALUES
   * ==========================================================
   */

  const financialAmount =
    Number(
      data.financialImpact
        ?.amount
    );

  const confidence =
    Number(
      data.confidence
    );

  /*
   * ==========================================================
   * 8. RETURN NORMALIZED RESPONSE
   * ==========================================================
   */

  return {
    success: true,

    data: {
      answer:
        data.answer.trim(),

      decision:
        data.decision.trim(),

      action:
        data.action.trim(),

      financialImpact: {
        amount:
          Number.isFinite(
            financialAmount
          )
            ? Math.max(
                0,
                financialAmount
              )
            : 0,

        explanation:
          typeof data
            .financialImpact
            ?.explanation ===
          "string"
            ? data.financialImpact
                .explanation
                .trim()
            : "",
      },

      confidence:
        Number.isFinite(
          confidence
        )
          ? Math.min(
              100,
              Math.max(
                0,
                confidence
              )
            )
          : 0,
    },

    rateLimit: {
      remaining:
        Number.isFinite(
          Number(
            successPayload
              .rateLimit
              ?.remaining
          )
        )
          ? Math.max(
              0,
              Number(
                successPayload
                  .rateLimit
                  .remaining
              )
            )
          : 0,
    },
  };
}