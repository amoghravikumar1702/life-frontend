import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

interface Props {
  recommendations: string[];
}

export default function Recommendations({
  recommendations,
}: Props) {
  return (
    <section className="rounded-[34px] border border-white/[0.08] bg-[#101214] p-8">

      <div className="mb-8">

        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
          Executive Actions
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">
          Recommendations
        </h2>

      </div>

      <div className="space-y-5">

        {recommendations.length === 0 ? (

          <div className="flex items-start gap-4 rounded-[24px] border border-emerald-500/10 bg-emerald-500/[0.04] p-6">

            <div className="mt-1 rounded-full bg-emerald-500/10 p-2">

              <CheckCircle2
                size={18}
                className="text-emerald-400"
              />

            </div>

            <div>

              <h3 className="font-medium text-white">
                No Immediate Action Required
              </h3>

              <p className="mt-2 leading-7 text-zinc-400">
                Your financial indicators remain healthy.
                Continue monitoring performance and
                generate reports regularly.
              </p>

            </div>

          </div>

        ) : (

          recommendations.map(
            (
              recommendation,
              index
            ) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-white/[0.10]"
              >

                <div className="mt-1 rounded-full bg-[#D4AF37]/10 p-2">

                  {index === 0 ? (
                    <AlertTriangle
                      size={18}
                      className="text-[#D4AF37]"
                    />
                  ) : (
                    <TrendingUp
                      size={18}
                      className="text-emerald-400"
                    />
                  )}

                </div>

                <div>

                  <h3 className="font-medium text-white">
                    Recommendation {index + 1}
                  </h3>

                  <p className="mt-2 leading-7 text-zinc-400">
                    {recommendation}
                  </p>

                </div>

              </div>
            )
          )

        )}

      </div>

    </section>
  );
}