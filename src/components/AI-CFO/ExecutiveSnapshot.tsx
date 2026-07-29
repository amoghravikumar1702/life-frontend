import {
  Activity,
  Wallet,
  TrendingUp,
  Users,
  Clock3,
  ArrowUpRight,
} from "lucide-react";

type Props = {
  healthScore: number;
  cashAvailable: number;
  revenue: number;
  receivables: number;
  customers: number;
};

const money = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN").format(value)}`;

export default function ExecutiveSnapshot({
  healthScore,
  cashAvailable,
  revenue,
  receivables,
  customers,
}: Props) {

  const healthColor =
    healthScore >= 85
      ? "text-emerald-400"
      : healthScore >= 70
      ? "text-[#D4AF37]"
      : "text-red-400";

  const healthStatus =
    healthScore >= 85
      ? "Excellent"
      : healthScore >= 70
      ? "Healthy"
      : "Needs Attention";

  const cards = [
    {
      icon: Wallet,
      title: "Cash Position",
      value: money(cashAvailable),
    },
    {
      icon: TrendingUp,
      title: "Revenue",
      value: money(revenue),
    },
    {
      icon: Clock3,
      title: "Receivables",
      value: money(receivables),
    },
    {
      icon: Users,
      title: "Customers",
      value: customers.toLocaleString("en-IN"),
    },
  ];

  return (
    <section className="rounded-[32px] border border-white/10 bg-[#121214] p-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[11px] uppercase tracking-[0.35em] text-zinc-500">
            Executive Snapshot
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-white">
            Current Business Position
          </h2>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-center">

          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Health Score
          </p>

          <div className="mt-3 flex items-center justify-center gap-3">

            <Activity
              size={22}
              className={healthColor}
            />

            <span className={`text-5xl font-bold ${healthColor}`}>
              {healthScore}
            </span>

          </div>

          <p className={`mt-3 text-sm font-medium ${healthColor}`}>
            {healthStatus}
          </p>

        </div>

      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => {

          const Icon = card.icon;

          return (

            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-[#D4AF37]/30"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">

                  <Icon
                    size={18}
                    className="text-[#D4AF37]"
                  />

                </div>

                <ArrowUpRight
                  size={16}
                  className="text-zinc-600"
                />

              </div>

              <p className="mt-5 text-xs uppercase tracking-[0.25em] text-zinc-500">
                {card.title}
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-white">
                {card.value}
              </h3>

            </div>

          );

        })}

      </div>

    </section>
  );
}