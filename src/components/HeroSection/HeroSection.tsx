export default function HeroSection() {
  return (
    <section className="flex items-center justify-between rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-[#0B1220] via-[#0F172A] to-[#111827] p-8">

      <div>
        <p className="text-cyan-400 font-semibold uppercase tracking-widest">
          AI CFO
        </p>

        <h1 className="mt-2 text-5xl font-bold leading-tight">
          Good Morning, Amogh 👋
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          Your AI CFO analyzed today's finances and prepared your business briefing.
        </p>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-4 text-right">
        <p className="text-sm uppercase tracking-wider text-cyan-300">
          Today's Focus
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Collect ₹48,000
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Estimated cash flow improvement
        </p>

        <p className="text-xl font-semibold text-green-400">
          +19%
        </p>
      </div>

    </section>
  );
}