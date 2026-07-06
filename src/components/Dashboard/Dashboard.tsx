export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#030712] text-white pt-28 px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">
          Good Evening, Amogh 👋
        </h1>

        <p className="mt-3 text-lg text-gray-400">
          Here's your business today.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400">Money to Collect</p>
            <h2 className="mt-2 text-3xl font-bold">₹2,45,000</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400">Bills Due</p>
            <h2 className="mt-2 text-3xl font-bold">₹48,000</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400">Cash Position</p>
            <h2 className="mt-2 text-3xl font-bold">₹8,72,000</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-gray-400">Alerts</p>
            <h2 className="mt-2 text-3xl font-bold text-red-400">3</h2>
          </div>
        </div>
      </div>
    </main>
  );
}