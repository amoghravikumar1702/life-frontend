"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowUpRight,
  Loader2,
  Brain,
  ShieldCheck,
} from "lucide-react";

interface CFOAnswer {
  answer: string;
  decision: string;
  action: string;
  financialImpact: {
    amount: number;
    explanation: string;
  };
  confidence: number;
}

interface Props {
  className?: string;
}

function formatCurrency(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

export default function AskYourCFO({
  className = "",
}: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<CFOAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askCFO() {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) return;

    setLoading(true);
    setError("");
    setAnswer(null);

    try {
      const response = await fetch("/api/ai-cfo/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: cleanQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to reach your CFO."
        );
      }

      if (!data?.data) {
        throw new Error(
          "The CFO returned an empty response."
        );
      }

      const raw = data.data;

      const normalizedAnswer: CFOAnswer = {
        answer:
          typeof raw.answer === "string"
            ? raw.answer
            : "",

        decision:
          typeof raw.decision === "string"
            ? raw.decision
            : "",

        action:
          typeof raw.action === "string"
            ? raw.action
            : "",

        financialImpact: {
          amount: Number.isFinite(
            Number(raw.financialImpact?.amount)
          )
            ? Number(raw.financialImpact.amount)
            : 0,

          explanation:
            typeof raw.financialImpact
              ?.explanation === "string"
              ? raw.financialImpact.explanation
              : "",
        },

        confidence: Number.isFinite(
          Number(raw.confidence)
        )
          ? Math.min(
              100,
              Math.max(0, Number(raw.confidence))
            )
          : 0,
      };

      if (
        !normalizedAnswer.answer ||
        !normalizedAnswer.decision ||
        !normalizedAnswer.action
      ) {
        throw new Error(
          "The CFO returned an incomplete response."
        );
      }

      setAnswer(normalizedAnswer);
      setQuestion("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to reach your CFO."
      );
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "What should I do next?",
    "Can I afford to hire?",
    "How can I improve cash flow?",
    "Who should I collect from first?",
  ];

  return (
    <section
      className={`
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-[#D4AF37]/25
        bg-[#101318]
        shadow-[0_0_80px_rgba(212,175,55,0.07)]
        ${className}
      `}
    >
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-240px]
          h-[460px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-[#D4AF37]/[0.065]
          blur-[130px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-220px]
          right-[-140px]
          h-[360px]
          w-[360px]
          rounded-full
          bg-[#D4AF37]/[0.035]
          blur-[110px]
        "
      />

      <div className="relative">
        <div
          className="
            border-b
            border-[#D4AF37]/10
            px-7
            py-7
            sm:px-10
            sm:py-8
            lg:px-12
            lg:py-9
          "
        >
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#D4AF37]/25
                  bg-[#D4AF37]/[0.09]
                  shadow-[0_0_35px_rgba(212,175,55,0.10)]
                "
              >
                <Sparkles
                  size={20}
                  strokeWidth={1.7}
                  className="text-[#D4AF37]"
                />
              </div>

              <div>
                <p
                  className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.34em]
                    text-[#D4AF37]
                  "
                >
                  DhanarkOS Intelligence Engine
                </p>

                <p className="mt-1.5 text-sm text-zinc-500">
                  Financial decision intelligence
                </p>
              </div>
            </div>

            <div
              className="
                hidden
                items-center
                gap-2
                text-xs
                text-zinc-600
                sm:flex
              "
            >
              <ShieldCheck size={15} strokeWidth={1.7} />
              Private intelligence
            </div>
          </div>
        </div>

        <div
          className="
            px-7
            py-8
            sm:px-10
            sm:py-10
            lg:px-12
            lg:py-11
          "
        >
          <div className="max-w-4xl">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#D4AF37]/20
                bg-[#D4AF37]/[0.055]
                px-3
                py-1.5
              "
            >
              <Sparkles
                size={13}
                strokeWidth={1.8}
                className="text-[#D4AF37]"
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#D4AF37]
                "
              >
                Ask Your CFO
              </span>
            </div>

            <p
              className="
                mt-5
                max-w-2xl
                text-sm
                leading-7
                text-zinc-500
              "
            >
              Ask DhanarkOS to evaluate your
              financial position and determine
              your next move.
            </p>
          </div>

          <div
            className="
              mt-7
              flex
              flex-col
              gap-3
              rounded-2xl
              border
              border-[#D4AF37]/15
              bg-black/25
              p-2
              shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]
              sm:flex-row
            "
          >
            <input
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  void askCFO();
                }
              }}
              maxLength={1000}
              placeholder="What should I do next?"
              className="
                min-h-14
                min-w-0
                flex-1
                bg-transparent
                px-5
                py-4
                text-[15px]
                text-white
                outline-none
                placeholder:text-zinc-600
              "
              disabled={loading}
              aria-label="Ask your CFO"
            />

            <button
              type="button"
              onClick={() => void askCFO()}
              disabled={
                loading || !question.trim()
              }
              className="
                flex
                min-h-14
                items-center
                justify-center
                gap-2.5
                rounded-xl
                bg-[#D4AF37]
                px-7
                text-sm
                font-semibold
                text-black
                transition-all
                duration-200
                hover:brightness-110
                hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-35
                disabled:shadow-none
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Thinking
                </>
              ) : (
                <>
                  Ask CFO
                  <ArrowUpRight
                    size={17}
                    strokeWidth={1.8}
                  />
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() =>
                  setQuestion(suggestion)
                }
                disabled={loading}
                className="
                  rounded-full
                  border
                  border-white/[0.07]
                  bg-white/[0.015]
                  px-3.5
                  py-2
                  text-xs
                  text-zinc-500
                  transition
                  hover:border-[#D4AF37]/25
                  hover:bg-[#D4AF37]/[0.035]
                  hover:text-zinc-300
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {suggestion}
              </button>
            ))}
          </div>

          {error && (
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-rose-400/10
                bg-rose-400/[0.04]
                px-5
                py-4
                text-sm
                leading-6
                text-rose-300
              "
            >
              {error}
            </div>
          )}

          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                mt-8
                overflow-hidden
                rounded-2xl
                border
                border-[#D4AF37]/12
                bg-[#111419]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-white/[0.05]
                  px-6
                  py-5
                "
              >
                <div className="flex items-center gap-3">
                  <Brain
                    size={17}
                    strokeWidth={1.7}
                    className="text-[#D4AF37]"
                  />

                  <p
                    className="
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.32em]
                      text-[#D4AF37]
                    "
                  >
                    CFO Analysis
                  </p>
                </div>

                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-zinc-600
                  "
                >
                  Live analysis
                </span>
              </div>

              <div className="p-6 sm:p-7">
                <p
                  className="
                    text-[16px]
                    leading-8
                    text-zinc-200
                  "
                >
                  {answer.answer}
                </p>
              </div>

              <div
                className="
                  border-t
                  border-white/[0.05]
                  p-6
                  sm:p-7
                "
              >
                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.3em]
                    text-zinc-600
                  "
                >
                  Decision
                </p>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-zinc-300
                  "
                >
                  {answer.decision}
                </p>
              </div>

              <div
                className="
                  grid
                  border-t
                  border-white/[0.05]
                  md:grid-cols-2
                "
              >
                <div
                  className="
                    border-b
                    border-white/[0.05]
                    p-6
                    md:border-b-0
                    md:border-r
                    sm:p-7
                  "
                >
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.3em]
                      text-zinc-600
                    "
                  >
                    Next Action
                  </p>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-7
                      text-zinc-300
                    "
                  >
                    {answer.action}
                  </p>
                </div>

                <div className="p-6 sm:p-7">
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.3em]
                      text-zinc-600
                    "
                  >
                    Financial Impact
                  </p>

                  <p
                    className="
                      mt-3
                      text-lg
                      font-medium
                      leading-7
                      text-zinc-200
                    "
                  >
                    {answer.financialImpact.amount > 0
                      ? formatCurrency(
                          answer.financialImpact.amount
                        )
                      : "No specific amount"}
                  </p>

                  {answer.financialImpact.explanation && (
                    <p
                      className="
                        mt-2
                        text-xs
                        leading-5
                        text-zinc-600
                      "
                    >
                      {
                        answer.financialImpact
                          .explanation
                      }
                    </p>
                  )}
                </div>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/[0.05]
                  px-6
                  py-4
                "
              >
                <span
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.28em]
                    text-zinc-600
                  "
                >
                  CFO confidence
                </span>

                <span
                  className="
                    text-xs
                    font-medium
                    text-[#D4AF37]
                  "
                >
                  {Math.round(answer.confidence)}%
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}