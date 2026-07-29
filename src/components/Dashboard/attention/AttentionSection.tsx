"use client";

import AttentionCard from "./AttentionCard";
import { AttentionItem } from "./types";

type Props = {
  items: AttentionItem[];
};

export default function AttentionSection({
  items,
}: Props) {
  if (!items.length) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Action Center
            </span>
          </div>

          <h2 className="mt-5 font-editorial text-[38px] tracking-[-0.03em] text-white">
            Prioritize Today's Work
          </h2>

          <p className="mt-3 max-w-3xl text-[16px] leading-7 text-[#8A8A8F]">
            These actions have the biggest impact on your cash flow and
            collections today.
          </p>
        </div>

        <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 lg:block">
          <p className="text-xs uppercase tracking-[0.18em] text-[#777]">
            Open Actions
          </p>

          <p className="mt-1 text-2xl font-semibold text-white">
            {items.length}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <AttentionCard
            key={item.title}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}