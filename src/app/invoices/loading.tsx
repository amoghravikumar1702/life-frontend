export default function InvoicesLoading() {
  return (
    <main className="min-h-screen min-w-0 bg-[#030712] px-3 pb-6 pt-2 text-white sm:px-4 sm:pb-8 sm:pt-3 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl min-w-0">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-9 w-40 animate-pulse rounded-xl bg-white/[0.06]" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded-lg bg-white/[0.04]" />
          </div>

          <div className="h-11 w-36 animate-pulse rounded-2xl bg-white/[0.06]" />
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-white/[0.06] bg-[#101214] p-5"
            >
              <div className="h-3 w-24 animate-pulse rounded bg-white/[0.05]" />

              <div className="mt-4 h-8 w-28 animate-pulse rounded-lg bg-white/[0.07]" />

              <div className="mt-3 h-3 w-20 animate-pulse rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>

        {/* Filters / search */}
        <div className="mb-6 rounded-[24px] border border-white/[0.06] bg-[#101214] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="h-11 w-full max-w-md animate-pulse rounded-2xl bg-white/[0.04]" />

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-11 w-full animate-pulse rounded-2xl bg-white/[0.04] sm:w-32" />
              <div className="h-11 w-full animate-pulse rounded-2xl bg-white/[0.04] sm:w-36" />
            </div>

          </div>
        </div>

        {/* Invoice list */}
        <div className="overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#101214]">

          {/* Table header */}
          <div className="hidden border-b border-white/[0.06] px-6 py-4 md:grid md:grid-cols-6 md:gap-4">
            <div className="h-3 w-20 animate-pulse rounded bg-white/[0.05]" />
            <div className="h-3 w-24 animate-pulse rounded bg-white/[0.05]" />
            <div className="h-3 w-20 animate-pulse rounded bg-white/[0.05]" />
            <div className="h-3 w-20 animate-pulse rounded bg-white/[0.05]" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.05]">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="px-5 py-5 sm:px-6"
              >
                {/* Desktop */}
                <div className="hidden items-center md:grid md:grid-cols-6 md:gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-white/[0.06]" />
                    <div className="h-3 w-20 animate-pulse rounded bg-white/[0.04]" />
                  </div>

                  <div className="h-4 w-32 animate-pulse rounded bg-white/[0.05]" />

                  <div className="h-4 w-24 animate-pulse rounded bg-white/[0.05]" />

                  <div className="h-4 w-24 animate-pulse rounded bg-white/[0.05]" />

                  <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.05]" />

                  <div className="flex justify-end gap-2">
                    <div className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.05]" />
                    <div className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.05]" />
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-4 md:hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-28 animate-pulse rounded bg-white/[0.06]" />
                      <div className="h-3 w-36 animate-pulse rounded bg-white/[0.04]" />
                    </div>

                    <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.05]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.04]" />
                      <div className="h-4 w-24 animate-pulse rounded bg-white/[0.05]" />
                    </div>

                    <div className="space-y-2">
                      <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.04]" />
                      <div className="h-4 w-24 animate-pulse rounded bg-white/[0.05]" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="h-9 flex-1 animate-pulse rounded-xl bg-white/[0.05]" />
                    <div className="h-9 flex-1 animate-pulse rounded-xl bg-white/[0.05]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}