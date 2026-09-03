"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
} from "lucide-react";

import DhanarkLogo from "@/components/brand/DhanarkLogo";

const STORAGE_KEY =
  "DhanarkOS_dashboard_tutorial_completed";

const steps = [
  {
    eyebrow: "01 · COMMAND CENTER",
    title: "Welcome to DhanarkOS.",
    description:
      "This is your financial command center. DhanarkOS brings your business finances, customers, invoices, payments, expenses, and intelligence together in one workspace.",
  },
  {
    eyebrow: "02 · FINANCIAL POSITION",
    title: "Understand your business at a glance.",
    description:
      "Your Business Pulse gives you the numbers that matter first — revenue, expenses, profit, cash position, receivables, customers, and overall financial health.",
  },
  {
    eyebrow: "03 · AI CFO",
    title: "Your financial intelligence layer.",
    description:
      "The AI CFO helps turn your financial data into useful insights, risks, opportunities, and actions so you can make decisions with more clarity.",
  },
  {
    eyebrow: "04 · OPERATIONS",
    title: "Run the financial side of your business.",
    description:
      "Customers, invoices, payments, and expenses are connected so you can manage the operational side of your finances without constantly switching between tools.",
  },
  {
    eyebrow: "05 · ANALYSIS",
    title: "Go deeper when you need to.",
    description:
      "Financial Analysis and Executive Reports give you deeper visibility when the high-level dashboard isn't enough.",
  },
  {
    eyebrow: "06 · DhanarkOS",
    title: "One financial operating system.",
    description:
      "The goal is simple: give you one clear financial picture of your business and help you act on it.",
  },
];

export default function DashboardTutorial() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const completed =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!completed) {
      setOpen(true);
    }
  }, []);

  function closeTutorial() {
    window.localStorage.setItem(
      STORAGE_KEY,
      "true"
    );

    setOpen(false);
    setStep(0);
  }

  function next() {
    if (step >= steps.length - 1) {
      closeTutorial();
      return;
    }

    setStep((current) => current + 1);
  }

  function previous() {
    setStep((current) =>
      Math.max(0, current - 1)
    );
  }

  if (!open) {
    return null;
  }

  const current = steps[step];

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        backdrop-blur-md
      "
    >
      <div
        className="
          w-full
          max-w-xl
          overflow-hidden
          rounded-[28px]
          border
          border-white/[0.08]
          bg-[#111214]
          shadow-[0_40px_120px_rgba(0,0,0,0.55)]
        "
      >
        {/* PROGRESS */}

        <div className="flex gap-1.5 px-6 pt-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className="
                h-1
                flex-1
                overflow-hidden
                rounded-full
                bg-white/[0.06]
              "
            >
              <div
                className={`
                  h-full
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    index <= step
                      ? "bg-[#D4AF37]"
                      : "bg-transparent"
                  }
                `}
              />
            </div>
          ))}
        </div>

        {/* CONTENT */}

        <div className="px-6 pb-7 pt-10 sm:px-8 sm:pb-8">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              border
              border-[#D4AF37]/20
              bg-[#D4AF37]/[0.07]
            "
          >
            <DhanarkLogo
              variant="mark"
              href=""
              className="h-8 w-8"
            />
          </div>

          <p
            className="
              mt-7
              text-[10px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-[#D4AF37]
            "
          >
            {current.eyebrow}
          </p>

          <h2
            className="
              mt-3
              text-2xl
              font-semibold
              tracking-tight
              text-white
              sm:text-3xl
            "
          >
            {current.title}
          </h2>

          <p
            className="
              mt-4
              max-w-lg
              text-sm
              leading-7
              text-zinc-500
            "
          >
            {current.description}
          </p>

          <div className="mt-7 flex items-center gap-2">
            <span className="text-[10px] text-zinc-500">
              {String(step + 1).padStart(2, "0")}
            </span>

            <span className="text-[10px] text-zinc-800">
              /
            </span>

            <span className="text-[10px] text-zinc-700">
              {String(steps.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-white/[0.06]
            px-6
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
          "
        >
          <button
            type="button"
            onClick={closeTutorial}
            className="
              min-h-10
              px-1
              text-xs
              font-medium
              text-zinc-600
              transition
              hover:text-zinc-300
            "
          >
            Skip walkthrough
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={previous}
                className="
                  flex
                  min-h-10
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-white/[0.08]
                  px-4
                  text-xs
                  font-medium
                  text-zinc-400
                  transition
                  hover:bg-white/[0.04]
                  hover:text-white
                "
              >
                <ChevronLeft size={14} />
                Back
              </button>
            )}

            <button
              type="button"
              onClick={next}
              className="
                flex
                min-h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#D4AF37]
                px-5
                text-xs
                font-semibold
                text-black
                transition
                hover:bg-[#E2C04A]
              "
            >
              {step === steps.length - 1
                ? "Enter DhanarkOS"
                : "Next"}

              {step === steps.length - 1 ? (
                <Check size={14} />
              ) : (
                <ArrowRight size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}