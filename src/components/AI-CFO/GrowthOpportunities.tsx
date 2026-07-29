import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import { PageSection } from "@/components/ui";

interface Opportunity {
  title: string;
  description: string;
  expectedImpact: string;
  confidence?: number;
}

interface Props {
  opportunities: Opportunity[];
}

export default function GrowthOpportunities({
  opportunities,
}: Props) {
  return (
    <PageSection
      title="Growth Strategy"
      subtitle="High-impact opportunities identified by FINZURA"
    >
      <div className="grid gap-6 lg:grid-cols-2">

        {opportunities.map((opportunity, index) => (

          <div
            key={index}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition hover:border-[#D4AF37]/30"
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                  <TrendingUp
                    size={20}
                    className="text-[#D4AF37]"
                  />

                </div>

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    {opportunity.title}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Growth Opportunity
                  </p>

                </div>

              </div>

              <ArrowUpRight
                size={18}
                className="text-zinc-600"
              />

            </div>

            <p className="mt-6 leading-8 text-zinc-400">
              {opportunity.description}
            </p>

            <div className="mt-7 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-5">

              <div className="flex items-center gap-2">

                <Sparkles
                  size={16}
                  className="text-[#D4AF37]"
                />

                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Expected Business Impact
                </span>

              </div>

              <p className="mt-4 text-white">
                {opportunity.expectedImpact}
              </p>

            </div>

            <div className="mt-5 flex items-center justify-between">

              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Confidence
              </span>

              <span className="font-semibold text-emerald-400">
                {opportunity.confidence
                  ? `${opportunity.confidence}%`
                  : "92%"}
              </span>

            </div>

          </div>

        ))}

      </div>
    </PageSection>
  );
}