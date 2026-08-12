"use client";

import { Brain } from "lucide-react";

export default function AIHeader() {
  return (
    <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
          <Brain
            size={28}
            className="text-[#D4AF37]"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Intelligence
          </p>

          <h1 className="ArkenOne-gold mt-2 text-5xl font-bold">
            AI CFO
          </h1>
        </div>
      </div>

      <p className="mt-8 max-w-4xl text-lg leading-8 text-zinc-400">
        Your executive financial advisor. AI CFO analyzes your
        cash flow, revenue, receivables, customer activity, and
        business performance to surface priorities, identify
        risks, and recommend high-impact actions for better
        financial decisions.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
          AI Analysis Ready
        </div>

        <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">
          Executive Intelligence
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
          Live Financial Insights
        </div>
      </div>
    </section>
  );
}