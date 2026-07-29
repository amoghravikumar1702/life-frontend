import {
  ArrowUpRight,
  Sparkles,
  Target,
} from "lucide-react";

interface Props {
  revenue: number;
  receivables: number;
}

const money = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN").format(value)}`;

export default function MissionHero({
  revenue,
  receivables,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#151515] via-[#111111] to-[#090909] p-10">

      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">

        {/* LEFT */}

        <div className="max-w-3xl">

          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 shadow-[0_0_35px_rgba(212,175,55,0.18)]">

              <Sparkles
                size={28}
                className="text-[#D4AF37]"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Mission Control
              </p>

              <h1 className="finzura-gold mt-2 text-5xl font-bold tracking-tight">
                Good Morning
              </h1>

            </div>

          </div>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-zinc-300">
            Your business is running smoothly.
            Here's what deserves your attention today.
          </p>

        </div>

        {/* RIGHT */}

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8">

          <p className="text-xs uppercase tracking-[0.30em] text-zinc-500">
            Total Revenue
          </p>

          <h2 className="mt-4 text-5xl font-bold text-white">
            {money(revenue)}
          </h2>

          <div className="mt-8 flex items-center gap-3">

            <Target
              size={18}
              className="text-[#D4AF37]"
            />

            <span className="text-zinc-400">
              Today's Focus
            </span>

          </div>

          <p className="mt-3 text-lg font-medium text-white">
            Recover {money(receivables)}
          </p>

          <div className="mt-8 flex items-center gap-2 text-[#D4AF37]">

            <ArrowUpRight size={16} />

            <span className="text-sm font-medium">
              Highest-impact action today
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}