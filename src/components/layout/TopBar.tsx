"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Search,
} from "lucide-react";

export default function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="relative z-50 mb-6">
      <div
        className="
          flex
          h-16
          w-full
          items-center
          justify-between
          rounded-3xl
          border
          border-white/10
          bg-[#101010]/80
          px-7
          backdrop-blur-2xl
          shadow-[0_12px_40px_rgba(0,0,0,0.25)]
        "
      >
        {/* Left */}

        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-[#D4AF37]/20
              bg-[#D4AF37]/10
            "
          >
            <span className="text-lg font-semibold text-[#D4AF37]">
              F
            </span>
          </div>

          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-white">
              ArkenOne
            </h1>

            <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Executive Operating System
            </p>
          </div>
        </div>

        {/* Spacer */}

        <div className="flex-1" />

        {/* Right */}

        <div className="flex items-center gap-3">
          {/* Search */}

          <button
            aria-label="Search"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              transition-all
              duration-200
              hover:border-[#D4AF37]/30
              hover:bg-white/[0.05]
            "
          >
            <Search
              size={18}
              className="text-zinc-400"
            />
          </button>

          {/* Profile */}

          <div
            ref={menuRef}
            className="relative"
          >
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-3
                py-2
                transition-all
                duration-200
                hover:border-[#D4AF37]/30
                hover:bg-white/[0.05]
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#D4AF37]/15
                  text-sm
                  font-semibold
                  text-[#D4AF37]
                "
              >
                A
              </div>

              <div className="text-left leading-tight">
                <p className="text-sm font-medium text-white">
                  Administrator
                </p>

                <p className="text-xs text-zinc-500">
                  Executive Workspace
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`text-zinc-500 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-[100]
                  mt-3
                  w-48
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#111111]/95
                  backdrop-blur-2xl
                  shadow-[0_30px_80px_rgba(0,0,0,.55)]
                "
>
                <button
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    text-zinc-300
                    transition-colors
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}