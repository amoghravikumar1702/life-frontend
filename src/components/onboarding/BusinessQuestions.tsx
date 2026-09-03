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
    <section
      className="
        relative
        mx-auto
        flex
        w-full
        max-w-3xl
        justify-center
        overflow-hidden
        rounded-[28px]
        border
        border-white/[0.07]
        bg-[#101318]
        shadow-[0_30px_100px_rgba(0,0,0,0.28)]
        sm:rounded-[32px]
      "
    >
      {/* Ambient glow */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-180px]
          h-[360px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-[#D4AF37]/[0.04]
          blur-[120px]
        "
      />

      <div
        className="
          relative
          w-full
          px-5
          py-7
          sm:px-10
          sm:py-9
          lg:px-12
          lg:py-10
        "
      >
        {/* HEADER */}

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
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
                border-[#D4AF37]/20
                bg-[#D4AF37]/[0.07]
                sm:h-11
                sm:w-11
                sm:rounded-2xl
              "
            >
              <Sparkles
                size={17}
                className="text-[#D4AF37]"
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#D4AF37]
                  sm:text-[10px]
                  sm:tracking-[0.3em]
                "
              >
                Business Profile
              </p>

              <p className="mt-1 truncate text-xs text-zinc-500 sm:text-sm">
                {industry}
              </p>
            </div>
          </div>

          <span className="shrink-0 text-[11px] text-zinc-600 sm:text-xs">
            {Math.min(
              completedCount + 1,
              questions.length
            )}{" "}
            / {questions.length}
          </span>
        </div>

        {/* PROGRESS */}

        <div className="mt-7">
          <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-[#D4AF37] transition-all duration-300"
              style={{
                width: `${(completedCount / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* QUESTION */}

        <div className="mt-8">
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.26em]
              text-zinc-600
              sm:text-[10px]
              sm:tracking-[0.28em]
            "
          >
            Quick question
          </p>

          <h1
            className="
              mt-3
              max-w-2xl
              text-[25px]
              font-medium
              leading-tight
              tracking-[-0.025em]
              text-white
              sm:text-3xl
            "
          >
            {currentQuestion.label}
          </h1>

          {currentQuestion.description && (
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
              {currentQuestion.description}
            </p>
          )}
        </div>

        {/* ANSWERS */}

        <div className="mt-7">
          {currentQuestion.options ? (
            <div className="grid gap-2.5">
              {currentQuestion.options.map((option) => {
                const selected =
                  answers[currentQuestion.id] === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateAnswer(option)}
                    className={`
                      flex
                      min-h-13
                      w-full
                      items-center
                      rounded-xl
                      border
                      px-4
                      text-left
                      text-sm
                      transition-all
                      duration-200
                      sm:min-h-14
                      sm:px-5
                      ${
                        selected
                          ? "border-[#D4AF37]/40 bg-[#D4AF37]/[0.07] text-[#D4AF37]"
                          : "border-white/[0.06] bg-white/[0.015] text-zinc-400 hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/[0.025] hover:text-zinc-200"
                      }
                    `}
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
              className="
                min-h-14
                w-full
                rounded-xl
                border
                border-white/[0.07]
                bg-black/20
                px-4
                text-base
                text-white
                outline-none
                transition
                placeholder:text-zinc-700
                focus:border-[#D4AF37]/35
                sm:min-h-16
                sm:px-5
                sm:text-lg
              "
            />
          )}
        </div>

        {/* ACTIONS */}

        <div
          className="
            mt-8
            flex
            items-center
            justify-between
            gap-3
            border-t
            border-white/[0.05]
            pt-6
          "
        >
          <button
            type="button"
            onClick={onBack}
            className="
              flex
              min-h-11
              items-center
              gap-2
              rounded-xl
              px-2
              text-sm
              text-zinc-500
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={
              !answers[currentQuestion.id]?.trim()
            }
            className="
              flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#D4AF37]
              px-5
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-[#E2C04A]
              disabled:cursor-not-allowed
              disabled:opacity-35
              sm:px-6
            "
          >
            {activeIndex === questions.length - 1
              ? "Continue"
              : "Next"}

            <ArrowRight
              size={16}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    </section>
  );
}