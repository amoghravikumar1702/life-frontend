import { buildRecommendations } from "@/lib/intelligence/buildRecommendations";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  TrendingUp,
} from "lucide-react";

interface Props {
  narrative: string;
  risks: string[];
  opportunities: string[];
  score: number;

  revenue: number;
  outstanding: number;
  customerCount: number;
  invoiceCount: number;
  overdueInvoices: number;
  todaysCollections: number;
}

export default function AICFOAnalysis({
  narrative,
  risks,
  opportunities,
  score,
  revenue,
  outstanding,
  customerCount,
  invoiceCount,
  overdueInvoices,
  todaysCollections,
}: Props) {
const recommendations = buildRecommendations({
  revenue,
  outstanding,
  healthScore: score * 10,
  customerCount,
  invoiceCount,
  overdueInvoices,
  todaysCollections,
});
  return (
    <section className="rounded-[34px] border border-[#D4AF37]/15 bg-gradient-to-br from-[#121518] to-[#0D1014] p-10">

      <div className="mb-10">

        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
          AI CFO
        </p>

        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">
          Executive Analysis
        </h2>

        <p className="mt-4 max-w-4xl text-[17px] leading-9 text-zinc-400">
          {narrative}
        </p>

      </div>

      <div className="grid gap-8 xl:grid-cols-[320px_1fr]">

        <div className="rounded-[28px] border border-[#D4AF37]/10 bg-[#0C1014] p-8">

          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Business Health
          </p>

          <div className="mt-6 flex items-end gap-2">

            <h3 className="text-6xl font-semibold tracking-[-0.05em] text-white">
              {score.toFixed(1)}
            </h3>

            <span className="pb-3 text-xl text-zinc-500">
              /10
            </span>

          </div>

          <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/5">

            <div
              className="h-full rounded-full bg-[#D4AF37]"
              style={{
                width: `${score * 10}%`,
              }}
            />

          </div>

          <p className="mt-6 text-sm leading-7 text-zinc-500">
            Calculated using revenue, collections,
            outstanding receivables and invoice
            performance.
          </p>

        </div>

        <div className="space-y-6">

          <div className="rounded-[28px] border border-white/[0.06] bg-[#0F1318] p-7">

            <div className="flex items-center gap-3">

              <AlertTriangle
                className="text-amber-400"
                size={20}
              />

              <h3 className="text-lg font-semibold text-white">
                Key Risks
              </h3>

            </div>

            <ul className="mt-6 space-y-4">

              {risks.map((risk) => (
                <li
                  key={risk}
                  className="text-zinc-400"
                >
                  • {risk}
                </li>
              ))}

            </ul>

          </div>

          <div className="rounded-[28px] border border-white/[0.06] bg-[#0F1318] p-7">

            <div className="flex items-center gap-3">

              <TrendingUp
                className="text-emerald-400"
                size={20}
              />

              <h3 className="text-lg font-semibold text-white">
                Opportunities
              </h3>

            </div>

            <ul className="mt-6 space-y-4">

              {opportunities.map((item) => (
                <li
                  key={item}
                  className="text-zinc-400"
                >
                  • {item}
                </li>
              ))}

            </ul>

          </div>

          <div className="rounded-[28px] border border-emerald-500/10 bg-emerald-500/[0.04] p-7">

            <div className="flex items-center gap-3">

              <BadgeCheck
                size={20}
                className="text-emerald-400"
              />

              <h3 className="text-lg font-semibold text-white">
                AI CFO Recommendation
              </h3>

            </div>

            <div className="mt-5 space-y-4">
  {recommendations.slice(0, 3).map((item) => (
    <div key={item.title}>
      <p className="font-semibold text-white">
        {item.title}
      </p>

      <p className="mt-1 leading-7 text-zinc-400">
        {item.description}
      </p>
    </div>
  ))}
</div>

          </div>

        </div>

      </div>

    </section>
  );
}