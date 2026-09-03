"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
} from "lucide-react";

import { logout } from "@/app/logout/actions";

interface NavbarProps {
  onOpenMenu: () => void;
}

export default function Navbar({
  onOpenMenu,
}: NavbarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  async function handleLogout() {
    if (
      !window.confirm(
        "Are you sure you want to log out?"
      )
    ) {
      return;
    }

    setLoggingOut(true);

    try {
      await logout();

      queryClient.clear();

      router.push("/login");
    } catch (err) {
      console.error(err);

      alert("Logout failed.");

      setLoggingOut(false);
    }
  }

  return (
    <header
      className="
        w-full
        overflow-visible
        rounded-2xl
        border
        border-white/[0.05]
        bg-[#0C1117]/75
        backdrop-blur-2xl
        transition-all
        duration-300
      "
    >
      <div
        className="
          flex
          h-14
          items-center
          justify-between
          gap-3
          px-3
          sm:px-5
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-2.5
            sm:gap-3
          "
        >
          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.025]
              text-zinc-300
              transition-all
              duration-300
              active:scale-95
              hover:bg-white/[0.05]
              hover:text-white
              lg:hidden
            "
          >
            <Menu
              size={18}
              strokeWidth={1.8}
            />
          </button>

          {/* PAGE TITLE */}

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-[14px]
                font-semibold
                tracking-[-0.02em]
                text-white
                sm:text-[15px]
              "
            >
              Mission Control
            </h1>

            <p
              className="
                truncate
                text-[10px]
                text-zinc-500
                sm:text-[11px]
              "
            >
              Everything looks healthy today.
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5
            sm:gap-2
          "
        >
          {/* SEARCH */}

          <div className="hidden lg:flex">
            <div
              className="
                flex
                h-9
                w-[240px]
                items-center
                gap-2.5
                rounded-xl
                border
                border-white/[0.05]
                bg-white/[0.025]
                px-3
                transition-all
                duration-300
                focus-within:border-[#D4AF37]/35
                focus-within:bg-white/[0.04]
              "
            >
              <Search
                size={15}
                className="text-zinc-500"
              />

              <input
                placeholder="Search..."
                className="
                  w-full
                  bg-transparent
                  text-[13px]
                  text-white
                  outline-none
                  placeholder:text-zinc-600
                "
              />
            </div>
          </div>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.05]
              bg-white/[0.025]
              text-zinc-300
              transition-all
              duration-300
              active:scale-95
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            <Bell
              size={16}
              strokeWidth={1.8}
            />

            <span
              className="
                absolute
                right-2.5
                top-2.5
                h-1.5
                w-1.5
                rounded-full
                bg-[#D4AF37]
              "
            />
          </button>

          {/* COMPANY SWITCHER */}

          <button
            type="button"
            className="
              hidden
              h-9
              items-center
              gap-2
              rounded-xl
              border
              border-white/[0.05]
              bg-white/[0.025]
              px-3
              transition-all
              duration-300
              hover:bg-white/[0.05]
              md:flex
            "
          >
            <div
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-md
                bg-[#D4AF37]/15
                text-[11px]
                font-semibold
                text-[#D4AF37]
              "
            >
              F
            </div>

            <span className="text-sm text-white">
              DhanarkOS
            </span>

            <ChevronDown
              size={14}
              className="text-zinc-500"
            />
          </button>

          {/* USER MENU */}

          <div
            ref={menuRef}
            className="relative shrink-0"
          >
            <button
              type="button"
              aria-label="Open account menu"
              aria-expanded={menuOpen}
              onClick={() =>
                setMenuOpen(
                  (current) => !current
                )
              }
              className="
                flex
                h-10
                items-center
                gap-1.5
                rounded-xl
                border
                border-white/[0.05]
                bg-white/[0.025]
                px-1.5
                transition-all
                duration-300
                active:scale-95
                hover:bg-white/[0.05]
                sm:h-9
                sm:px-2
              "
            >
              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#D4AF37]/15
                  text-xs
                  font-semibold
                  text-[#D4AF37]
                "
              >
                A
              </div>

              <ChevronDown
                size={14}
                className={`
                  hidden
                  text-zinc-500
                  transition-transform
                  duration-300
                  sm:block
                  ${
                    menuOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* ACCOUNT DROPDOWN */}

            {menuOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+10px)]
                  z-50
                  w-[min(224px,calc(100vw-24px))]
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-[#0E141C]/95
                  shadow-2xl
                  shadow-black/40
                  backdrop-blur-2xl
                "
              >
                <div
                  className="
                    border-b
                    border-white/[0.05]
                    p-4
                  "
                >
                  <p className="text-sm font-medium text-white">
                    Administrator
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Executive Workspace
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                    flex
                    min-h-11
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-sm
                    text-red-300
                    transition-all
                    duration-300
                    hover:bg-red-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <LogOut size={15} />

                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}