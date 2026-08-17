"use client";

import {
  Menu,
  ChevronDown,
  LogOut,
  Search,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

interface TopBarProps {
  onMobileMenu?: () => void;
}

export default function TopBar({
  onMobileMenu,
}: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  return (
    <header className="relative z-50 mb-4 sm:mb-6">
      <div
        className="
          flex
          min-h-16
          w-full
          items-center
          justify-between
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-[#101010]/80
          px-3
          py-2.5
          backdrop-blur-2xl
          shadow-[0_12px_40px_rgba(0,0,0,0.25)]
          sm:rounded-3xl
          sm:px-5
          lg:px-7
        "
      >
        {/* ========================================================
            LEFT
        ======================================================== */}

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMobileMenu}
            aria-label="Open navigation"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              text-zinc-400
              transition
              hover:border-[#D4AF37]/30
              hover:bg-white/[0.05]
              hover:text-white
              lg:hidden
            "
          >
            <Menu size={19} />
          </button>

          {/* Brand */}
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                hidden
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-[#D4AF37]/20
                bg-[#D4AF37]/10
                sm:flex
              "
            >
              <span className="text-lg font-semibold text-[#D4AF37]">
                A
              </span>
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[16px] font-semibold tracking-tight text-white sm:text-[17px]">
                ArkenOne
              </h1>

              <p className="mt-0.5 hidden text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:block">
                Executive Operating System
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1" />

        {/* ========================================================
            RIGHT
        ======================================================== */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
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
              size={17}
              className="text-zinc-400"
            />
          </button>

          {/* Profile */}
          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setMenuOpen((prev) => !prev)
              }
              aria-expanded={menuOpen}
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                px-2
                transition-all
                duration-200
                hover:border-[#D4AF37]/30
                hover:bg-white/[0.05]
                sm:h-auto
                sm:gap-3
                sm:rounded-2xl
                sm:px-3
                sm:py-2
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#D4AF37]/15
                  text-xs
                  font-semibold
                  text-[#D4AF37]
                  sm:h-10
                  sm:w-10
                  sm:text-sm
                "
              >
                A
              </div>

              <div className="hidden text-left leading-tight sm:block">
                <p className="text-sm font-medium text-white">
                  Administrator
                </p>

                <p className="text-xs text-zinc-500">
                  Executive Workspace
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`
                  hidden
                  text-zinc-500
                  transition-transform
                  sm:block
                  ${
                    menuOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
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
                  type="button"
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