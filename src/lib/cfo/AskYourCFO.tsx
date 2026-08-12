"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  askCFO,
  CFOAnswer,
  CFOClientError,
} from "@/lib/ai/cfoClient";

import {
  ArrowUp,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

/*
 * ============================================================
 * ARKENONE — ASK YOUR CFO
 * ============================================================
 *
 * Primary conversational entry point for the AI CFO.
 *
 * The component intentionally stays focused:
 *
 * - Ask one financial question
 * - Receive one CFO recommendation
 * - Show the decision
 * - Show the next action
 * - Show financial impact
 * - Show confidence
 *
 * Conversation history is intentionally NOT implemented here.
 *
 * Every question is an independent CFO analysis.
 */

const MAX_QUESTION_LENGTH = 500;

const SUGGESTED_QUESTIONS = [
  "Can I afford to hire another employee?",
  "What should I focus on financially right now?",
  "Which customer should I follow up with first?",
  "Can I safely increase my spending?",
];

/*
 * ============================================================
 * PROPS
 * ============================================================
 */

interface AskYourCFOProps {
  compact?: boolean;
}

/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export default function AskYourCFO({
  compact = false,
}: AskYourCFOProps) {
  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState<CFOAnswer | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [retryAfter, setRetryAfter] =
    useState<number | null>(null);

  /*
   * ==========================================================
   * ASK CFO
   * ==========================================================
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalized =
      question.trim();

    if (!normalized) {
      setError(
        "Ask your CFO a financial question first."
      );

      return;
    }

    if (
      normalized.length >
      MAX_QUESTION_LENGTH
    ) {
      setError(
        `Keep your question under ${MAX_QUESTION_LENGTH} characters.`
      );

      return;
    }

    setLoading(true);
    setError("");
    setRetryAfter(null);
    setAnswer(null);

    try {
      const response =
        await askCFO(
          normalized
        );

      setAnswer(
        response.data
      );
    } catch (error) {
      if (
        error instanceof
        CFOClientError
      ) {
        setError(
          error.message
        );

        if (
          typeof error.retryAfterSeconds ===
          "number"
        ) {
          setRetryAfter(
            error.retryAfterSeconds
          );
        }
      } else {
        setError(
          "Unable to generate the CFO recommendation. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================================
   * SUGGESTED QUESTION
   * ==========================================================
   */

  function useSuggestedQuestion(
    value: string
  ) {
    setQuestion(value);
    setAnswer(null);
    setError("");
    setRetryAfter(null);
  }

  /*
   * ==========================================================
   * FORMAT MONEY
   * ==========================================================
   */

  function formatCurrency(
    amount: number
  ) {
    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return "—";
    }

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(amount);
  }

  /*
   * ==========================================================
   * CONFIDENCE LABEL
   * ==========================================================
   */

  function getConfidenceLabel(
    confidence: number
  ) {
    if (confidence >= 85) {
      return "High confidence";
    }

    if (confidence >= 70) {
      return "Good confidence";
    }

    if (confidence >= 50) {
      return "Moderate confidence";
    }

    return "Limited confidence";
  }

  return (
    <section
      className={[
        "relative overflow-hidden rounded-[30px]",
        "border border-white/[0.08]",
        "bg-[#101214]",
        "shadow-[0_20px_70px_rgba(0,0,0,0.22)]",
        compact
          ? "p-5"
          : "p-6 sm:p-8",
      ].join(" ")}
    >
      {/* ======================================================
          SUBTLE BACKGROUND DETAIL
          ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-56
          w-56
          rounded-full
          bg-[#D4AF37]/[0.04]
          blur-3xl
        "
      />

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="relative">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-2xl
              border
              border-[#D4AF37]/20
              bg-[#D4AF37]/[0.07]
            "
          >
            <Sparkles
              size={18}
              strokeWidth={1.7}
              className="text-[#D4AF37]"
            />
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#D4AF37]">
              ArkenOne Intelligence
            </p>

            <h2 className="mt-1 text-xl font-medium tracking-tight text-white">
              Ask Your CFO
            </h2>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
          Ask a financial question and ArkenOne
          will evaluate it against your current
          business data.
        </p>
      </div>

      {/* ======================================================
          QUESTION FORM
          ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="relative mt-6"
      >
        <div
          className="
            rounded-[22px]
            border
            border-white/[0.09]
            bg-[#0b0d0f]
            p-2
            transition
            focus-within:border-[#D4AF37]/30
            focus-within:ring-1
            focus-within:ring-[#D4AF37]/10
          "
        >
          <textarea
            value={question}
            onChange={(event) => {
              setQuestion(
                event.target.value
              );

              if (error) {
                setError("");
              }

              if (answer) {
                setAnswer(null);
              }

              if (retryAfter !== null) {
                setRetryAfter(null);
              }
            }}
            placeholder="Ask your CFO anything about your business..."
            maxLength={
              MAX_QUESTION_LENGTH
            }
            rows={compact ? 3 : 4}
            disabled={loading}
            className="
              min-h-[90px]
              w-full
              resize-none
              bg-transparent
              px-4
              py-3
              text-sm
              leading-6
              text-white
              outline-none
              placeholder:text-zinc-600
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />

          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <span className="text-[11px] text-zinc-600">
              {question.length}/
              {MAX_QUESTION_LENGTH}
            </span>

            <button
              type="submit"
              disabled={
                loading ||
                !question.trim()
              }
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-xl
                bg-[#D4AF37]
                px-4
                text-sm
                font-medium
                text-black
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />

                  <span>
                    Thinking
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Ask CFO
                  </span>

                  <ArrowUp
                    size={15}
                    strokeWidth={2}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ======================================================
          SUGGESTED QUESTIONS
          ====================================================== */}

      {!answer &&
        !loading &&
        !error && (
          <div className="relative mt-5">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Try asking
            </p>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      useSuggestedQuestion(
                        suggestion
                      )
                    }
                    className="
                      rounded-full
                      border
                      border-white/[0.07]
                      bg-white/[0.02]
                      px-3
                      py-2
                      text-left
                      text-xs
                      text-zinc-400
                      transition
                      hover:border-[#D4AF37]/20
                      hover:bg-[#D4AF37]/[0.04]
                      hover:text-zinc-200
                    "
                  >
                    {suggestion}
                  </button>
                )
              )}
            </div>
          </div>
        )}

      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (
        <div
          className="
            mt-5
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-red-500/10
            bg-red-500/[0.04]
            p-4
          "
        >
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-red-400"
          />

          <div>
            <p className="text-sm text-red-300">
              {error}
            </p>

            {retryAfter !== null && (
              <p className="mt-1 text-xs text-zinc-600">
                Try again in{" "}
                {retryAfter >= 60
                  ? `${Math.ceil(
                      retryAfter / 60
                    )} minute${
                      Math.ceil(
                        retryAfter / 60
                      ) === 1
                        ? ""
                        : "s"
                    }`
                  : `${retryAfter} second${
                      retryAfter === 1
                        ? ""
                        : "s"
                    }`}
                .
              </p>
            )}
          </div>
        </div>
      )}

      {/* ======================================================
          LOADING STATE
          ====================================================== */}

      {loading && (
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-white/[0.06]
            bg-white/[0.015]
            p-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-[#D4AF37]/[0.06]
              "
            >
              <Loader2
                size={16}
                className="animate-spin text-[#D4AF37]"
              />
            </div>

            <div>
              <p className="text-sm text-zinc-300">
                Your CFO is analyzing the
                business.
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Reviewing your financial position
                and available data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          CFO ANSWER
          ====================================================== */}

      {answer && !loading && (
        <div
          className="
            relative
            mt-6
            overflow-hidden
            rounded-[24px]
            border
            border-[#D4AF37]/15
            bg-[#0b0d0f]
          "
        >
          {/* -----------------------------------------------
              ANSWER HEADER
              ----------------------------------------------- */}

          <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="text-[#D4AF37]"
                  strokeWidth={1.8}
                />

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#D4AF37]">
                  CFO Recommendation
                </span>
              </div>

              <span className="text-[11px] text-zinc-600">
                {getConfidenceLabel(
                  answer.confidence
                )}
              </span>
            </div>
          </div>

          {/* -----------------------------------------------
              MAIN ANSWER
              ----------------------------------------------- */}

          <div className="px-5 py-6 sm:px-6">
            <p className="text-[15px] leading-7 text-zinc-200">
              {answer.answer}
            </p>

            {/* ---------------------------------------------
                DECISION
                --------------------------------------------- */}

            <div className="mt-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Decision
              </p>

              <p className="mt-2 text-sm leading-6 text-white">
                {answer.decision}
              </p>
            </div>

            {/* ---------------------------------------------
                ACTION
                --------------------------------------------- */}

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.02]
                p-4
              "
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Next action
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {answer.action}
              </p>
            </div>

            {/* ---------------------------------------------
                FINANCIAL IMPACT
                --------------------------------------------- */}

            {answer.financialImpact
              .amount > 0 && (
              <div
                className="
                  mt-5
                  grid
                  gap-3
                  sm:grid-cols-[auto_1fr]
                  sm:items-center
                "
              >
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                    Financial impact
                  </p>

                  <p className="mt-1 text-xl font-medium tracking-tight text-white">
                    {formatCurrency(
                      answer
                        .financialImpact
                        .amount
                    )}
                  </p>
                </div>

                {answer.financialImpact
                  .explanation && (
                  <p className="text-xs leading-5 text-zinc-500">
                    {
                      answer
                        .financialImpact
                        .explanation
                    }
                  </p>
                )}
              </div>
            )}

            {/* ---------------------------------------------
                CONFIDENCE
                --------------------------------------------- */}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  CFO confidence
                </span>

                <span className="text-xs text-zinc-400">
                  {Math.round(
                    answer.confidence
                  )}
                  %
                </span>
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#D4AF37]
                    transition-all
                    duration-700
                  "
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        answer.confidence
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* -----------------------------------------------
              ASK ANOTHER
              ----------------------------------------------- */}

          <div className="border-t border-white/[0.06] px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => {
                setAnswer(null);
                setQuestion("");
                setError("");
              }}
              className="
                text-xs
                text-zinc-500
                transition
                hover:text-[#D4AF37]
              "
            >
              Ask another question →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}