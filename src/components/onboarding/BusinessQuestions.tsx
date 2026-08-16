"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface BusinessQuestionsProps {
  industry: string;
  initialAnswers?: Record<string, string>;
  onBack: () => void;
  onContinue: (answers: Record<string, string>) => void;
}

interface Question {
  id: string;
  label: string;
  description?: string;
  placeholder?: string;
  type?: "text" | "number";
  options?: string[];
}

const QUESTION_SETS: Record<string, Question[]> = {
  Retail: [
    {
      id: "revenue_model",
      label: "How do you mainly make money?",
      options: ["Product sales", "Wholesale", "Both"],
    },
    {
      id: "customer_type",
      label: "Who do you mainly sell to?",
      options: ["Consumers", "Businesses", "Both"],
    },
    {
      id: "inventory_managed",
      label: "Do you keep inventory?",
      options: ["Yes", "No"],
    },
  ],

  "E-commerce": [
    {
      id: "sales_channels",
      label: "Where do you mainly sell?",
      options: ["Website", "Marketplace", "Both"],
    },
    {
      id: "customer_type",
      label: "Who do you mainly sell to?",
      options: ["Consumers", "Businesses", "Both"],
    },
    {
      id: "inventory_managed",
      label: "Do you hold your own inventory?",
      options: ["Yes", "No", "Dropshipping"],
    },
  ],

  "Food & Restaurant": [
    {
      id: "business_model",
      label: "What best describes your business?",
      options: ["Restaurant", "Cafe", "Cloud Kitchen", "Catering"],
    },
    {
      id: "sales_channels",
      label: "How do customers usually order?",
      options: ["Dine-in", "Delivery", "Both"],
    },
    {
      id: "staff_size",
      label: "Approximately how many staff do you have?",
      type: "number",
      placeholder: "e.g. 8",
    },
  ],

  "Professional Services": [
    {
      id: "revenue_model",
      label: "How do you usually charge clients?",
      options: ["Projects", "Hourly", "Retainers", "Mixed"],
    },
    {
      id: "client_type",
      label: "Who are your main clients?",
      options: ["Individuals", "Businesses", "Both"],
    },
    {
      id: "active_clients",
      label: "How many active clients do you currently have?",
      type: "number",
      placeholder: "e.g. 12",
    },
  ],

  Agency: [
    {
      id: "revenue_model",
      label: "How does your agency mainly earn?",
      options: ["Monthly retainers", "Projects", "Both"],
    },
    {
      id: "active_clients",
      label: "How many active clients do you have?",
      type: "number",
      placeholder: "e.g. 10",
    },
    {
      id: "team_size",
      label: "How large is your current team?",
      type: "number",
      placeholder: "e.g. 5",
    },
  ],

  Manufacturing: [
    {
      id: "sales_model",
      label: "How do you mainly sell?",
      options: ["Direct", "Wholesale", "Both"],
    },
    {
      id: "inventory_managed",
      label: "Do you maintain raw-material inventory?",
      options: ["Yes", "No"],
    },
    {
      id: "team_size",
      label: "Approximately how many employees do you have?",
      type: "number",
      placeholder: "e.g. 25",
    },
  ],

  Construction: [
    {
      id: "revenue_model",
      label: "How do you mainly earn?",
      options: ["Fixed contracts", "Milestone payments", "Both"],
    },
    {
      id: "active_projects",
      label: "How many active projects are you managing?",
      type: "number",
      placeholder: "e.g. 4",
    },
    {
      id: "client_type",
      label: "Who are your main clients?",
      options: ["Individuals", "Businesses", "Both"],
    },
  ],

  Technology: [
    {
      id: "revenue_model",
      label: "How does your business mainly earn?",
      options: ["Subscriptions", "Projects", "Licensing", "Mixed"],
    },
    {
      id: "customer_type",
      label: "Who are your main customers?",
      options: ["Consumers", "Businesses", "Both"],
    },
    {
      id: "team_size",
      label: "How large is your current team?",
      type: "number",
      placeholder: "e.g. 6",
    },
  ],

  Healthcare: [
    {
      id: "business_model",
      label: "What best describes your business?",
      options: ["Clinic", "Practice", "Healthcare Services", "Other"],
    },
    {
      id: "revenue_model",
      label: "How do you mainly earn?",
      options: ["Appointments", "Packages", "Subscriptions", "Mixed"],
    },
    {
      id: "staff_size",
      label: "Approximately how many staff do you have?",
      type: "number",
      placeholder: "e.g. 8",
    },
  ],

  Education: [
    {
      id: "business_model",
      label: "What type of education business is this?",
      options: ["School", "Coaching", "Training", "Online Education"],
    },
    {
      id: "revenue_model",
      label: "How do students usually pay?",
      options: ["Monthly", "Per course", "Term-based", "Mixed"],
    },
    {
      id: "student_count",
      label: "Approximately how many active students do you have?",
      type: "number",
      placeholder: "e.g. 100",
    },
  ],

  "Real Estate": [
    {
      id: "revenue_model",
      label: "How do you mainly earn?",
      options: ["Sales", "Rentals", "Commissions", "Mixed"],
    },
    {
      id: "property_type",
      label: "What do you mainly deal with?",
      options: ["Residential", "Commercial", "Both"],
    },
    {
      id: "active_deals",
      label: "How many active deals do you currently have?",
      type: "number",
      placeholder: "e.g. 6",
    },
  ],

  Other: [
    {
      id: "revenue_model",
      label: "How does your business mainly earn?",
      options: ["Products", "Services", "Subscriptions", "Mixed"],
    },
    {
      id: "customer_type",
      label: "Who are your main customers?",
      options: ["Consumers", "Businesses", "Both"],
    },
    {
      id: "team_size",
      label: "How large is your current team?",
      type: "number",
      placeholder: "e.g. 5",
    },
  ],
};

export default function BusinessQuestions({
  industry,
  initialAnswers = {},
  onBack,
  onContinue,
}: BusinessQuestionsProps) {
  const questions = useMemo(
    () => QUESTION_SETS[industry] ?? QUESTION_SETS.Other,
    [industry]
  );

  const [answers, setAnswers] =
    useState<Record<string, string>>(initialAnswers);

  const currentIndex = questions.findIndex(
    (question) => !answers[question.id]?.trim()
  );

  const activeIndex =
    currentIndex === -1 ? questions.length - 1 : currentIndex;

  const currentQuestion = questions[activeIndex];

  const completedCount = questions.filter(
    (question) => answers[question.id]?.trim()
  ).length;

  function updateAnswer(value: string) {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
  }

  function handleContinue() {
    if (!answers[currentQuestion.id]?.trim()) {
      return;
    }

    if (activeIndex < questions.length - 1) {
      const nextQuestion = questions[activeIndex + 1];

      setAnswers((previous) => ({
        ...previous,
        [nextQuestion.id]: previous[nextQuestion.id] ?? "",
      }));

      return;
    }

    onContinue(answers);
  }

  return (
    <section className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-[#D4AF37]/15 bg-[#101318]">
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[360px] w-[600px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.045] blur-[120px]" />

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
              <Sparkles
                size={18}
                className="text-[#D4AF37]"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                Business Profile
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {industry}
              </p>
            </div>
          </div>

          <span className="text-xs text-zinc-600">
            {Math.min(completedCount + 1, questions.length)} /{" "}
            {questions.length}
          </span>
        </div>

        <div className="mt-10">
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-[#D4AF37] transition-all duration-300"
              style={{
                width: `${(completedCount / questions.length) * 100}%`,
              }}
            />
          </div>

          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-600">
            Quick question
          </p>

          <h1 className="mt-3 text-2xl font-medium tracking-tight text-white sm:text-3xl">
            {currentQuestion.label}
          </h1>

          {currentQuestion.description && (
            <p className="mt-3 text-sm leading-7 text-zinc-500">
              {currentQuestion.description}
            </p>
          )}
        </div>

        <div className="mt-8">
          {currentQuestion.options ? (
            <div className="grid gap-3">
              {currentQuestion.options.map((option) => {
                const selected =
                  answers[currentQuestion.id] === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateAnswer(option)}
                    className={`min-h-14 rounded-2xl border px-5 text-left text-sm transition ${
                      selected
                        ? "border-[#D4AF37]/45 bg-[#D4AF37]/[0.08] text-[#D4AF37]"
                        : "border-white/[0.06] bg-white/[0.015] text-zinc-400 hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/[0.03] hover:text-zinc-200"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              autoFocus
              type={currentQuestion.type ?? "text"}
              inputMode={
                currentQuestion.type === "number"
                  ? "numeric"
                  : "text"
              }
              value={answers[currentQuestion.id] ?? ""}
              onChange={(event) =>
                updateAnswer(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleContinue();
                }
              }}
              placeholder={currentQuestion.placeholder}
              className="min-h-16 w-full rounded-2xl border border-white/[0.07] bg-black/25 px-5 text-xl text-white outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/35"
            />
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-12 items-center gap-2 rounded-xl px-4 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!answers[currentQuestion.id]?.trim()}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {activeIndex === questions.length - 1
              ? "Continue"
              : "Next"}

            <ArrowRight
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    </section>
  );
}