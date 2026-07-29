"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function RecommendationCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-[#121214] to-[#121214] p-6"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-yellow-500/15 p-3">
          <Sparkles className="h-5 w-5 text-yellow-400" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            AI Recommendation
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Highest Impact Opportunity
          </h2>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <div>
          <p className="text-2xl font-semibold leading-relaxed text-white">
            Recovering overdue invoices this week could unlock approximately
            ₹2.84L in working capital.
          </p>

          <p className="mt-4 text-zinc-400 leading-7">
            Based on recent payment behaviour and customer history, collecting
            these invoices now is likely to improve your cash runway while
            reducing outstanding receivables.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Estimated Impact
            </p>

            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-emerald-400">
              <TrendingUp size={18} />
              +18% Cash Runway
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              AI Confidence
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              98%
            </p>
          </div>
        </div>

        <button className="mt-4 flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.02]">
          Take Action
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.section>
  );
}