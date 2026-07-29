import {
  AlertTriangle,
  ArrowRight,
  Target,
  ShieldCheck,
} from "lucide-react";

import { PageSection } from "@/components/ui";

interface Priority {
  title: string;
  description: string;
  urgency: string;
  financialImpact?: number;
  confidence?: number;
}

interface Props {
  priorities: Priority[];
}

export default function PriorityList({
  priorities,
}: Props) {
  return (
    <PageSection
      title="Executive Action Plan"
      subtitle="Highest priority recommendations from FINZURA"
    >
      <div className="space-y-6">

        {priorities.map((priority, index) => (

          <div
            key={index}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition hover:border-[#D4AF37]/30"
          >

            <div className="flex items-start justify-between gap-6">

              <div className="flex gap-5">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

                  <Target
                    size={20}
                    className="text-[#D4AF37]"
                  />

                </div>

                <div>

                  <div className="flex items-center gap-3">

                    <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#D4AF37]">
                      Priority #{index + 1}
                    </span>

                    <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                      {priority.urgency}
                    </span>

                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {priority.title}
                  </h3>

                  <p className="mt-4 leading-8 text-zinc-400">
                    {priority.description}
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                <div className="flex items-center gap-2">

                  <ArrowRight
                    size={16}
                    className="text-[#D4AF37]"
                  />

                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Expected Impact
                  </span>

                </div>

                <p className="mt-4 text-white">
                  {priority.financialImpact
                    ? `Impact Score ${priority.financialImpact}`
                    : "Positive financial improvement expected."}
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={16}
                    className="text-emerald-400"
                  />

                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Confidence
                  </span>

                </div>

                <p className="mt-4 text-emerald-400 font-semibold">
                  {priority.confidence
                    ? `${priority.confidence}%`
                    : "95%"}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>
    </PageSection>
  );
}