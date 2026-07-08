const data = [
  { month: "Jan", income: 45 },
  { month: "Feb", income: 60 },
  { month: "Mar", income: 52 },
  { month: "Apr", income: 72 },
  { month: "May", income: 65 },
  { month: "Jun", income: 88 },
];

export default function CashFlow() {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400 font-semibold">
            Cash Flow
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Last 6 Months
          </h2>
        </div>

        <div className="rounded-full bg-green-500/20 px-4 py-2 text-green-300 font-medium">
          +18%
        </div>

      </div>

      <div className="mt-10 flex h-64 items-end justify-between gap-4">

        {data.map((item) => (
          <div
            key={item.month}
            className="flex flex-1 flex-col items-center"
          >
            <div
              className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-600 to-cyan-300 transition-all duration-300 hover:scale-105"
              style={{
                height: `${item.income * 2}px`,
              }}
            />

            <span className="mt-3 text-sm text-gray-400">
              {item.month}
            </span>
          </div>
        ))}

      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm text-gray-400">
            Revenue
          </p>

          <h3 className="mt-2 text-2xl font-bold text-green-400">
            ₹8.2L
          </h3>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm text-gray-400">
            Expenses
          </p>

          <h3 className="mt-2 text-2xl font-bold text-red-400">
            ₹3.7L
          </h3>
        </div>

        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm text-gray-400">
            Profit
          </p>

          <h3 className="mt-2 text-2xl font-bold text-cyan-400">
            ₹4.5L
          </h3>
        </div>

      </div>

    </section>
  );
}