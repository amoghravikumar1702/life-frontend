import {
  Target,
  ArrowRight,
  TrendingUp,
  Shield,
  Wallet,
} from "lucide-react";

interface Props {
  title: string;
  amount: number;
  description: string;
  impact: string[];
  confidence: number;
}

const formatCurrency = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN").format(value)}`;

export default function TodaysFocus({
  title,
  amount,
  description,
  impact,
  confidence,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[36px] border border-[#D4AF37]/20 bg-gradient-to-br from-[#1A1A1A] via-[#111111] to-[#0B0B0B] p-8">

      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">

        {/* LEFT */}

        <div className="flex-1">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">

              <Target
                size={24}
                className="text-[#D4AF37]"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Today's Focus
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {title}
              </h2>

            </div>

          </div>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            {description}
          </p>

          <div className="mt-10 flex items-center gap-3 text-[#D4AF37]">

            <ArrowRight size={18} />

            <span className="font-medium">
              Highest impact action for today
            </span>

          </div>

        </div>

        {/* RIGHT */}

        <div className="w-full lg:max-w-sm">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Expected Recovery
            </p>

            <h3 className="mt-4 text-5xl font-bold text-white">
              {formatCurrency(amount)}
            </h3>

            <div className="mt-8 space-y-4">

              {impact.map((item, index) => {

                const icons = [
                  Wallet,
                  TrendingUp,
                  Shield,
                ];

                const Icon =
                  icons[index % icons.length];

                return (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <Icon
                      size={18}
                      className="text-[#D4AF37]"
                    />

                    <span className="text-zinc-300">
                      {item}
                    </span>

                  </div>

                );

              })}

            </div>

            <div className="mt-8 border-t border-white/10 pt-6">

              <div className="flex items-center justify-between">

                <span className="text-sm text-zinc-500">
                  Confidence
                </span>

                <span className="font-semibold text-emerald-400">
                  {confidence}%
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}