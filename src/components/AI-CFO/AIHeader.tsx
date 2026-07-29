"use client";

import {
  Sparkles,
  CalendarDays,
  Activity,
} from "lucide-react";

export default function AIHeader() {
  const now = new Date();

  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 17
      ? "Good Afternoon"
      : "Good Evening";

  const today = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className="
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        bg-gradient-to-br
        from-[#151515]
        via-[#101010]
        to-[#090909]
        p-10
      "
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT */}

        <div>

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-[#D4AF37]/10
              "
            >
              <Sparkles
                size={28}
                className="text-[#D4AF37]"
              />
            </div>

            <div>

              <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
                FINZURA Intelligence
              </p>

              <h1 className="mt-2 text-5xl font-bold text-white">
                {greeting}
              </h1>

            </div>

          </div>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-zinc-300">
            Here's your business today.
            We've analysed your financial performance,
            identified the highest priority action and
            prepared an executive briefing to help you
            make faster business decisions.
          </p>

        </div>

        {/* RIGHT */}

        <div className="flex flex-col gap-5">

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              px-6
              py-5
            "
          >

            <div className="flex items-center gap-3">

              <CalendarDays
                size={18}
                className="text-[#D4AF37]"
              />

              <span className="text-sm text-zinc-400">
                {today}
              </span>

            </div>

          </div>

          <div
            className="
              rounded-2xl
              border
              border-emerald-500/20
              bg-emerald-500/10
              px-6
              py-5
            "
          >

            <div className="flex items-center gap-3">

              <Activity
                size={18}
                className="text-emerald-400"
              />

              <div>

                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Intelligence Confidence
                </p>

                <p className="mt-1 text-xl font-semibold text-emerald-400">
                  96%
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}