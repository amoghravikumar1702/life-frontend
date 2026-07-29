import {
  Lightbulb,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { PageSection } from "@/components/ui";

interface Props {
  recommendation: string;
}

export default function FinalRecommendation({
  recommendation,
}: Props) {
  return (
    <PageSection
      title="Executive Recommendation"
      subtitle="FINZURA Executive Decision"
    >
      <div className="rounded-[32px] border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent p-8">

        <div className="flex items-start gap-6">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

            <Lightbulb
              size={24}
              className="text-[#D4AF37]"
            />

          </div>

          <div className="flex-1">

            <div className="flex items-center gap-3">

              <h3 className="text-2xl font-semibold text-white">
                CEO Recommendation
              </h3>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Executive Decision
              </span>

            </div>

            <p className="mt-2 text-zinc-500">
              Consolidated recommendation generated from
              FINZURA's Intelligence Engine.
            </p>

            <div className="mt-8 space-y-5">

              {recommendation
                .split("\n")
                .filter(
                  (paragraph) =>
                    paragraph.trim().length > 0
                )
                .map((paragraph, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-4"
                  >

                    <CheckCircle2
                      size={18}
                      className="mt-1 text-[#D4AF37]"
                    />

                    <p className="leading-8 text-zinc-300">
                      {paragraph}
                    </p>

                  </div>

                ))}

            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[#D4AF37]">

              <ArrowRight size={16} />

              Review this recommendation before making major financial decisions.

            </div>

          </div>

        </div>

      </div>
    </PageSection>
  );
}