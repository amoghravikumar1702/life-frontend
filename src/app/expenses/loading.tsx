export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070809] px-6 py-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-8 w-48 rounded bg-white/10" />
          </div>

          <div className="h-10 w-32 rounded-xl bg-white/10" />
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 rounded-2xl border border-white/5 bg-white/[0.02]" />
          <div className="h-28 rounded-2xl border border-white/5 bg-white/[0.02]" />
          <div className="h-28 rounded-2xl border border-white/5 bg-white/[0.02]" />
        </div>

        {/* Expense table */}
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="h-12 border-b border-white/5 bg-white/[0.02]" />

          <div className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="flex h-16 items-center gap-6 px-6"
              >
                <div className="h-3 w-28 rounded bg-white/10" />
                <div className="h-3 w-32 rounded bg-white/10" />
                <div className="h-3 w-20 rounded bg-white/10" />
                <div className="ml-auto h-3 w-24 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}