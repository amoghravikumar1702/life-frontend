import {
  Brain,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { PageSection } from "@/components/ui";

interface Props {
  summary: string;
}

export default function ExecutiveSummary({
  summary,
}: Props) {
  return (
    <PageSection
      title="Executive Brief"
      subtitle="DhanarkOS Intelligence Engine"
    >
      <div className="space-y-6">

        {/* Main Brief */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7">

          <div className="flex items-center gap-3">

            <Brain
              size={20}
              className="text-[#D4AF37]"
            />

            <h3 className="text-lg font-semibold text-white">
              Executive Summary
            </h3>

          </div>

          <div className="mt-6 space-y-5">

            {summary
              .split("\n")
              .filter(
                (paragraph) =>
                  paragraph.trim().length > 0
              )
              .map((paragraph, index) => (
                <p
                  key={index}
                  className="leading-8 text-zinc-300"
                >
                  {paragraph}
                </p>
              ))}

          </div>

        </div>

        {/* Bottom Grid */}

        <div className="grid gap-5 lg:grid-cols-2">

          {/* Key Takeaway */}

          <div className="rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">

            <div className="flex items-center gap-3">

              <Sparkles
                size={18}
                className="text-[#D4AF37]"
              />

              <h4 className="font-semibold text-white">
                Key Takeaway
              </h4>

            </div>

            <p className="mt-5 leading-7 text-zinc-300">
              Business performance remains stable.
              Focus on improving cash collections and
              protecting profit margins to strengthen
              overall financial health.
            </p>

          </div>

          {/* Confidence */}

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">

            <div className="flex items-center gap-3">

              <ShieldCheck
                size={18}
                className="text-emerald-400"
              />

              <h4 className="font-semibold text-white">
                Confidence
              </h4>

            </div>

            <div className="mt-6 flex items-end gap-3">

              <span className="text-5xl font-bold text-emerald-400">
                96%
              </span>

              <span className="pb-2 text-sm text-zinc-400">
                Based on current financial data
              </span>

            </div>

            <p className="mt-4 leading-7 text-zinc-400">
              Recommendations are generated using
              DhanarkOS's financial intelligence engine
              and current business metrics.
            </p>

          </div>

        </div>

      </div>
    </PageSection>
  );
}