export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 animate-pulse rounded-lg bg-white/[0.06]" />
            <div className="h-4 w-56 animate-pulse rounded-lg bg-white/[0.04]" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.06]" />
        </div>

        {/* Hero */}
        <div className="mb-8 rounded-[28px] border border-white/[0.06] bg-[#101214] p-7 md:p-9">
          <div className="space-y-4">
            <div className="h-3 w-24 animate-pulse rounded bg-white/[0.05]" />
            <div className="h-10 w-72 animate-pulse rounded-xl bg-white/[0.07]" />
            <div className="h-4 w-96 max-w-full animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>

        {/* Financial cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-white/[0.06] bg-[#101214] p-6"
            >
              <div className="mb-5 h-3 w-24 animate-pulse rounded bg-white/[0.05]" />

              <div className="h-9 w-32 animate-pulse rounded-lg bg-white/[0.07]" />

              <div className="mt-4 h-3 w-20 animate-pulse rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>

        {/* Main dashboard area */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Financial brief */}
          <div className="rounded-[28px] border border-white/[0.06] bg-[#101214] p-7 xl:col-span-2">
            <div className="mb-7 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 w-32 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-3 w-52 animate-pulse rounded bg-white/[0.04]" />
              </div>

              <div className="h-8 w-20 animate-pulse rounded-xl bg-white/[0.05]" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-white/[0.04] bg-white/[0.02] px-5 py-4"
                >
                  <div className="space-y-2">
                    <div className="h-3 w-28 animate-pulse rounded bg-white/[0.05]" />
                    <div className="h-4 w-40 animate-pulse rounded bg-white/[0.06]" />
                  </div>

                  <div className="h-5 w-24 animate-pulse rounded bg-white/[0.06]" />
                </div>
              ))}
            </div>
          </div>

          {/* Action center */}
          <div className="rounded-[28px] border border-white/[0.06] bg-[#101214] p-7">
            <div className="mb-7 space-y-2">
              <div className="h-5 w-32 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-3 w-44 animate-pulse rounded bg-white/[0.04]" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-2xl bg-white/[0.04]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div className="h-64 animate-pulse rounded-[28px] border border-white/[0.06] bg-[#101214]" />

          <div className="h-64 animate-pulse rounded-[28px] border border-white/[0.06] bg-[#101214]" />

        </div>
      </div>
    </main>
  );
}