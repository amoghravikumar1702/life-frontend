import { Compass } from "lucide-react";

import PageContainer from "@/components/ui/PageContainer";
import DecisionCard from "@/components/Dashboard/DecisionCard";

import { buildDecisionCenter } from "@/lib/intelligence/decision-center";

export default async function DecisionCenterPage() {
  const actions = await buildDecisionCenter();

  return (
    <PageContainer>
      <div className="space-y-8">

        {/* Executive Header */}

        <section className="rounded-[34px] border border-white/10 bg-[#111111] p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

              <Compass
                size={28}
                className="text-[#D4AF37]"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Intelligence
              </p>

              <h1 className="DhanarkOS-gold mt-2 text-5xl font-bold">
                Decision Center
              </h1>

            </div>

          </div>

          <p className="mt-8 max-w-4xl text-lg leading-8 text-zinc-400">
            Your executive command center.
            Every recommendation below is ranked
            by potential business impact so you can
            focus on the highest-value work first.
          </p>

        </section>

        {/* Executive Actions */}

        <div className="space-y-6">

          {actions.map((action) => (

            <DecisionCard
              key={action.title}
              priority={action.priority}
              title={action.title}
              description={action.description}
              impact={action.impact}
              actionLabel={action.actionLabel}
              actionHref={action.actionHref}
            />

          ))}

        </div>

      </div>
    </PageContainer>
  );
}