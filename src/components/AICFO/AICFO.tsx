import {
  Wallet,
  TriangleAlert,
  TrendingUp,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

export default function AICFO() {
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0F172A] to-[#111827] p-8 shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            AI CFO
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Today's Briefing
          </h2>

          <p className="mt-2 text-gray-400">
            Your AI analyzed today's finances.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2">

          <BrainCircuit
            size={18}
            className="text-cyan-400"
          />

          <span className="text-sm font-medium text-cyan-300">
            Live
          </span>

        </div>

      </div>

      {/* Tasks */}

      <div className="mt-8 space-y-4">

        <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-cyan-400/30">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-green-500/10 p-3">
              <Wallet className="text-green-400" size={22} />
            </div>

            <div>
              <h3 className="font-semibold">
                Collect ₹48,000
              </h3>

              <p className="text-sm text-gray-400">
                ABC Ltd • Due Today
              </p>
            </div>

          </div>

          <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300">
            +19%
          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-orange-400/30">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-orange-500/10 p-3">
              <TriangleAlert
                className="text-orange-400"
                size={22}
              />
            </div>

            <div>
              <h3 className="font-semibold">
                Bills Due
              </h3>

              <p className="text-sm text-gray-400">
                ₹48,000 due in 3 days
              </p>
            </div>

          </div>

          <span className="rounded-full bg-orange-500/20 px-3 py-1 text-sm text-orange-300">
            Medium
          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-cyan-400/30">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-cyan-500/10 p-3">
              <TrendingUp
                className="text-cyan-400"
                size={22}
              />
            </div>

            <div>
              <h3 className="font-semibold">
                Cash Reserve
              </h3>

              <p className="text-sm text-gray-400">
                Expected to grow by 12%
              </p>
            </div>

          </div>

          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">
            AI
          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-white/5 p-4">

          <p className="text-sm text-gray-400">
            Risk Level
          </p>

          <div className="mt-2 flex items-center gap-2">

            <ShieldCheck
              className="text-green-400"
              size={20}
            />

            <span className="text-xl font-bold text-green-400">
              LOW
            </span>

          </div>

        </div>

        <div className="rounded-2xl bg-white/5 p-4">

          <p className="text-sm text-gray-400">
            AI Confidence
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            94%
          </h3>

        </div>

      </div>

    </section>
  );
}