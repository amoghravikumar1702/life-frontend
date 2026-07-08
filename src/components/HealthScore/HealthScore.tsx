import {
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export default function HealthScore() {
  return (
    <section className="rounded-3xl border border-green-500/20 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.25em] font-semibold text-green-400">
            Business Health
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Healthy Business
          </h2>

        </div>

        <div className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-green-400 bg-green-500/10">

          <div className="text-center">

            <h2 className="text-3xl font-bold">
              82
            </h2>

            <p className="text-xs text-gray-400">
              Score
            </p>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="mt-8 space-y-4">

        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">

          <div className="flex items-center gap-3">

            <Activity
              size={20}
              className="text-green-400"
            />

            <span className="text-gray-300">
              Cash Flow
            </span>

          </div>

          <span className="font-semibold text-green-400">
            +19%
          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">

          <div className="flex items-center gap-3">

            <Wallet
              size={20}
              className="text-cyan-400"
            />

            <span className="text-gray-300">
              Collections
            </span>

          </div>

          <span className="font-semibold">
            ₹2.45L
          </span>

        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">

          <div className="flex items-center gap-3">

            <ShieldCheck
              size={20}
              className="text-green-400"
            />

            <span className="text-gray-300">
              Financial Risk
            </span>

          </div>

          <span className="font-semibold text-green-400">
            LOW
          </span>

        </div>

      </div>

      {/* AI Verdict */}

      <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">

        <div className="flex items-center gap-3">

          <ArrowUpRight
            size={20}
            className="text-green-400"
          />

          <div>

            <h3 className="font-semibold">
              AI Verdict
            </h3>

            <p className="text-sm text-green-300 mt-1">
              Your business is financially stable with
              strong cash flow and low operational risk.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}