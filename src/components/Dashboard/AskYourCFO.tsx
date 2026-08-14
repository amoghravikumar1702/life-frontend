"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Loader2, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const suggestions = [
  "What should I do next?",
  "Can I afford a ₹50,000 expense?",
  "Why is my financial health declining?",
  "Which invoices should I collect first?",
];

export default function AskYourCFO() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askCFO(questionToAsk?: string) {
    const value = (questionToAsk ?? question).trim();

    if (!value || loading) return;

    setQuestion(value);
    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch("/api/cfo/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to contact your CFO."
        );
      }

      setAnswer(data.answer);
    } catch (err) {
      console.error("[AskYourCFO]", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askCFO();
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/[0.06]
        bg-[#101318]
      "
    >
      {/* SUBTLE GOLD ATMOSPHERE */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-[-160px]
          h-[360px]
          w-[360px]
          rounded-full
          bg-[#D4AF37]/[0.035]
          blur-[120px]
        "
      />

      <div className="relative">
        {/* HEADER */}

        <div className="px-6 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#D4AF37]/15
                bg-[#D4AF37]/[0.07]
              "
            >
              <Sparkles
                size={17}
                strokeWidth={1.8}
                className="text-[#D4AF37]"
              />
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.38em]
                  text-[#D4AF37]
                "
              >
                ArkenOne Intelligence
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">
                Ask Your CFO
              </h2>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
            Ask anything about your business finances. Your CFO
            analyzes your actual revenue, expenses, cash position,
            receivables, invoices, and customers before answering.
          </p>
        </div>

        {/* QUESTION INPUT */}

        <form
          onSubmit={handleSubmit}
          className="border-t border-white/[0.05] px-6 py-5 sm:px-8"
        >
          <div
            className="
              flex
              flex-col
              gap-3
              rounded-2xl
              border
              border-white/[0.07]
              bg-white/[0.02]
              p-2
              transition
              focus-within:border-[#D4AF37]/20
            "
          >
            <textarea
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
                  askCFO();
                }
              }}
              placeholder="Ask your CFO anything..."
              rows={3}
              maxLength={2000}
              disabled={loading}
              className="
                min-h-[80px]
                w-full
                resize-none
                bg-transparent
                px-3
                py-2
                text-sm
                leading-6
                text-white
                outline-none
                placeholder:text-zinc-700
                disabled:cursor-not-allowed
              "
            />

            <div className="flex items-center justify-between gap-3">
              <span className="px-3 text-[10px] text-zinc-700">
                Press Enter to ask
              </span>

              <button
                type="submit"
                disabled={!question.trim() || loading}
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#D4AF37]
                  px-4
                  text-xs
                  font-semibold
                  text-black
                  transition
                  hover:bg-[#e0bd4b]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                    Thinking
                  </>
                ) : (
                  <>
                    Ask CFO
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SUGGESTIONS */}

          {!answer && !loading && !error && (
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => askCFO(suggestion)}
                  className="
                    rounded-full
                    border
                    border-white/[0.06]
                    bg-white/[0.015]
                    px-3
                    py-2
                    text-[11px]
                    text-zinc-500
                    transition
                    hover:border-[#D4AF37]/15
                    hover:text-zinc-300
                  "
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* LOADING */}

        {loading && (
          <div className="border-t border-white/[0.05] px-6 py-6 sm:px-8">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#D4AF37]/[0.07]
                "
              >
                <Sparkles
                  size={14}
                  className="text-[#D4AF37]"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-zinc-300">
                  Your CFO is analyzing the business...
                </p>

                <p className="mt-1 text-[11px] text-zinc-600">
                  Reviewing financial position and relevant
                  business data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}

        {error && !loading && (
          <div className="border-t border-white/[0.05] px-6 py-5 sm:px-8">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* CFO RESPONSE */}

        {answer && !loading && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="border-t border-white/[0.05]"
          >
            <div className="px-6 py-6 sm:px-8">
              <div className="flex items-start gap-4">
                <div
                  className="
                    mt-0.5
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[#D4AF37]/10
                    bg-[#D4AF37]/[0.06]
                  "
                >
                  <Sparkles
                    size={14}
                    className="text-[#D4AF37]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
                      CFO Recommendation
                    </p>

                    <ArrowUpRight
                      size={13}
                      className="text-[#D4AF37]"
                    />
                  </div>

                  <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                    {answer}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}