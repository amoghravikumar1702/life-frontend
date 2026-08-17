// src/components/layout/SideBar.tsx

"use client";

import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import Navigation from "./Navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* ============================================================
          DESKTOP SIDEBAR
      ============================================================ */}

      <aside
        className={`
          hidden
          shrink-0
          lg:block
          transition-all
          duration-300
          ease-out
          ${collapsed ? "w-[92px]" : "w-[248px]"}
        `}
      >
        <div
          className="
            fixed
            left-5
            top-5
            bottom-5
            flex
            flex-col
            overflow-hidden
            rounded-[32px]
            border
            border-white/[0.06]
            bg-[#0B0F15]/88
            backdrop-blur-[28px]
            shadow-[0_18px_60px_rgba(0,0,0,0.45)]
            transition-all
            duration-300
            ease-out
          "
          style={{
            width: collapsed ? 76 : 228,
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Logo */}

          <div className="px-5 pb-6 pt-7">
            {collapsed ? (
              <div className="flex justify-center">
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
                    text-[17px]
                    font-semibold
                    tracking-tight
                    text-[#D4AF37]
                  "
                >
                  A
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[#D4AF37]/20
                    bg-[#D4AF37]/10
                    text-[17px]
                    font-semibold
                    tracking-tight
                    text-[#D4AF37]
                  "
                >
                  A
                </div>

                <div className="min-w-0">
                  <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-white">
                    ArkenOne
                  </h1>

                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.34em] text-zinc-500">
                    Executive OS
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mx-5 h-px bg-white/[0.06]" />

          {/* Navigation */}

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <Navigation collapsed={collapsed} />
          </div>

          {/* Footer */}

          <div className="border-t border-white/[0.06] p-4">
            {collapsed ? (
              <div className="flex justify-center">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[#D4AF37]/20
                    bg-[#D4AF37]/10
                    text-sm
                    font-semibold
                    text-[#D4AF37]
                  "
                >
                  A
                </div>
              </div>
            ) : (
              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.05]
                  bg-white/[0.03]
                  px-3.5
                  py-3
                  transition-all
                  duration-300
                  hover:border-white/[0.09]
                  hover:bg-white/[0.045]
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-[#D4AF37]/20
                      bg-[#D4AF37]/10
                      text-sm
                      font-semibold
                      text-[#D4AF37]
                    "
                  >
                    A
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-white">
                      Administrator
                    </p>

                    <p className="truncate text-[11px] text-zinc-500">
                      Executive Workspace
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapse */}

          <button
            type="button"
            onClick={onToggle}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="
              absolute
              -right-3
              top-9
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.08]
              bg-[#131821]
              text-zinc-300
              shadow-[0_12px_32px_rgba(0,0,0,0.45)]
              transition-all
              duration-300
              hover:scale-105
              hover:border-white/20
              hover:bg-[#1A202A]
              hover:text-white
            "
          >
            {collapsed ? (
              <ChevronRight size={15} />
            ) : (
              <ChevronLeft size={15} />
            )}
          </button>
        </div>
      </aside>

      {/* ============================================================
          MOBILE OVERLAY
      ============================================================ */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="
            fixed
            inset-0
            z-[90]
            bg-black/60
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* ============================================================
          MOBILE DRAWER
      ============================================================ */}

      <aside
        aria-hidden={!mobileOpen}
        className={`
          fixed
          bottom-0
          left-0
          top-0
          z-[100]
          flex
          w-[min(86vw,320px)]
          flex-col
          overflow-hidden
          border-r
          border-white/[0.08]
          bg-[#0B0F15]
          shadow-[20px_0_80px_rgba(0,0,0,0.55)]
          transition-transform
          duration-300
          ease-out
          lg:hidden
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Mobile Header */}

        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-[#D4AF37]/20
                bg-[#D4AF37]/10
                text-[17px]
                font-semibold
                text-[#D4AF37]
              "
            >
              A
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[21px] font-semibold tracking-[-0.03em] text-white">
                ArkenOne
              </h1>

              <p className="truncate text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                Executive OS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close menu"
            className="
              ml-3
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.03]
              text-zinc-400
              transition
              hover:bg-white/[0.06]
              hover:text-white
              active:scale-95
            "
          >
            <X size={19} />
          </button>
        </div>

        <div className="mx-5 h-px bg-white/[0.06]" />

        {/* Mobile Navigation */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <Navigation
            collapsed={false}
            onNavigate={onMobileClose}
          />
        </div>

        {/* Mobile Footer */}

        <div className="border-t border-white/[0.06] p-4">
          <div
            className="
              rounded-2xl
              border
              border-white/[0.05]
              bg-white/[0.03]
              px-3.5
              py-3
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#D4AF37]/20
                  bg-[#D4AF37]/10
                  text-sm
                  font-semibold
                  text-[#D4AF37]
                "
              >
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-white">
                  Administrator
                </p>

                <p className="truncate text-[11px] text-zinc-500">
                  Executive Workspace
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}