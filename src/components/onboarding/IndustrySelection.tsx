"use client";

import { useState, useTransition } from "react";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Hotel,
  Factory,
  Dumbbell,
  Landmark,
  Store,
} from "lucide-react";
import { saveIndustry } from "@/app/onboarding/actions";

const industries = [
  {
    id: "retail",
    title: "Retail & E-commerce",
    icon: Store,
  },
  {
    id: "services",
    title: "Professional Services",
    icon: Briefcase,
  },
  {
    id: "education",
    title: "Education",
    icon: GraduationCap,
  },
  {
    id: "healthcare",
    title: "Healthcare",
    icon: HeartPulse,
  },
  {
    id: "hospitality",
    title: "Hospitality",
    icon: Hotel,
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    icon: Factory,
  },
  {
    id: "fitness",
    title: "Fitness & Wellness",
    icon: Dumbbell,
  },
  {
    id: "nonprofit",
    title: "Non-Profit",
    icon: Landmark,
  },
];

export default function IndustrySelection() {
  const [selected, setSelected] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="w-full max-w-5xl rounded-[32px] border border-white/10 bg-[#121214] p-10 shadow-2xl">
      <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
        FINZURA Setup
      </p>

      <h1 className="mt-6 text-5xl font-semibold text-white">
        Select Your Industry
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
        FINZURA will tailor terminology, financial insights and workflows
        according to your business sector.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {industries.map((industry) => {
          const Icon = industry.icon;

          const active = selected === industry.id;

          return (
            <button
              type="button"
              key={industry.id}
              onClick={() => setSelected(industry.id)}
              className={`flex items-center gap-5 rounded-2xl border p-6 text-left transition-all duration-300 ${
                active
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
              }`}
            >
              <div
                className={`rounded-xl p-3 ${
                  active ? "bg-yellow-500/20" : "bg-white/5"
                }`}
              >
                <Icon
                  size={24}
                  className={active ? "text-yellow-300" : "text-zinc-400"}
                />
              </div>

              <span className="text-lg font-medium text-white">
                {industry.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-12 flex justify-end">
        <button
          type="button"
          disabled={!selected || isPending}
          onClick={() =>
            startTransition(async () => {
              await saveIndustry(selected);
            })
          }
          className="flex items-center gap-3 rounded-xl bg-yellow-500 px-7 py-4 font-medium text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Continue Setup"}

          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}