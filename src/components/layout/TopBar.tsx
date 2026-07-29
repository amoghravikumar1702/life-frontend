"use client";

import {
  Bell,
  Building2,
  ChevronDown,
} from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 h-20 border-b border-white/10 bg-[#0B0B0B]/95 backdrop-blur-xl">

      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-8">

        {/* Left */}

        <div className="flex items-center gap-5">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
            <span className="text-xl font-bold text-[#D4AF37]">
              F
            </span>
          </div>

          <div>

            <h1 className="text-xl font-semibold tracking-wide text-white">
              FINZURA
            </h1>

            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Executive Operating System
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-6">

          <button
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              transition
              hover:border-[#D4AF37]/30
            "
          >
            <Bell
              size={18}
              className="text-zinc-400"
            />
          </button>

          <button
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              px-5
              py-3
              transition
              hover:border-[#D4AF37]/30
            "
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">

              <Building2
                size={18}
                className="text-[#D4AF37]"
              />

            </div>

            <div className="text-left">

              <p className="text-sm font-medium text-white">
                Your Company
              </p>

              <p className="text-xs text-zinc-500">
                Executive Workspace
              </p>

            </div>

            <ChevronDown
              size={16}
              className="text-zinc-500"
            />

          </button>

        </div>

      </div>

    </header>
  );
}