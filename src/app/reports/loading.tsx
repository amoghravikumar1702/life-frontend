export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070809] px-6 py-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">

        {/* Header */}
        <div className="space-y-3">
          <div className="h-3 w-20 rounded bg-white/10" />
          <div className="h-8 w-44 rounded bg-white/10" />
        </div>

        {/* Report cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((card) => (
            <div
              key={card}
              className="h-40 rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
              <div className="space-y-4">
                <div className="h-3 w-28 rounded bg-white/10" />
                <div className="h-7 w-36 rounded bg-white/10" />
                <div className="h-2.5 w-24 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}