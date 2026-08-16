// src/components/onboarding/IndustrySelection.tsx

"use client";

import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
} from "lucide-react";

interface IndustrySelectionProps {
  onContinue: (industry: string) => void;
}

const industries = [
  "Retail",
  "E-commerce",
  "Food & Restaurant",
  "Professional Services",
  "Agency",
  "Manufacturing",
  "Construction",
  "Technology",
  "Healthcare",
  "Education",
  "Real Estate",
  "Other",
];

export default function IndustrySelection({
  onContinue,
}: IndustrySelectionProps) {
  const [industry, setIndustry] = useState("");

  function handleContinue() {
    if (!industry) {
      return;
    }

    onContinue(industry);
  }

  return (
    <section className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-[#D4AF37]/15 bg-[#101318]">
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[360px] w-[600px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.045] blur-[120px]" />

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
            <BriefcaseBusiness
              size={18}
              className="text-[#D4AF37]"
              strokeWidth={1.7}
            />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Business Setup
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Tell ArkenOne what you do
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
            What type of business do you run?
          </h1>

          <p className="mt-3 text-sm leading-7 text-zinc-500">
            This helps ArkenOne use the right financial
            language and recommendations for your business.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((item) => {
            const selected = industry === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setIndustry(item)}
                className={`min-h-14 rounded-2xl border px-4 text-left text-sm transition ${
                  selected
                    ? "border-[#D4AF37]/45 bg-[#D4AF37]/[0.08] text-[#D4AF37]"
                    : "border-white/[0.06] bg-white/[0.015] text-zinc-400 hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/[0.03] hover:text-zinc-200"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!industry}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Continue

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