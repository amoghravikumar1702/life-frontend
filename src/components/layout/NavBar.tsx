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
        !menuRef.current.contains(e.target as Node)
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
        rounded-2xl
        border
        border-white/[0.05]
        bg-[#0C1117]/75
        backdrop-blur-2xl
        transition-all
        duration-300
      "
    >
      <div className="flex h-14 items-center justify-between px-5">

        {/* Left */}

        <div className="flex items-center gap-3 min-w-0">

          <button
            onClick={onOpenMenu}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.025]
              transition-all
              duration-300
              hover:bg-white/[0.05]
              lg:hidden
            "
          >
            <Menu size={17} />
          </button>

          <div className="min-w-0">

            <h1 className="truncate text-[15px] font-semibold tracking-[-0.02em] text-white">
              Mission Control
            </h1>

            <p className="truncate text-[11px] text-zinc-500">
              Everything looks healthy today.
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-2">

          {/* Search */}

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

          {/* Notifications */}

          <button
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.05]
              bg-white/[0.025]
              transition-all
              duration-300
              hover:bg-white/[0.05]
            "
          >
            <Bell size={16} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

          </button>

          {/* Company Switcher */}

          <button
            className="
              hidden
              md:flex
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
              ArkenOne
            </span>

            <ChevronDown
              size={14}
              className="text-zinc-500"
            />

          </button>

          {/* Avatar */}

          <div
            ref={menuRef}
            className="relative"
          >

            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              className="
                flex
                h-9
                items-center
                gap-2
                rounded-xl
                border
                border-white/[0.05]
                bg-white/[0.025]
                px-2
                transition-all
                duration-300
                hover:bg-white/[0.05]
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
                className={`hidden sm:block text-zinc-500 transition-transform duration-300 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />

            </button>

            {menuOpen && (

              <div
                className="
                  absolute
                  right-0
                  top-[48px]
                  z-50
                  w-56
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-[#0E141C]/95
                  backdrop-blur-2xl
                "
              >

                <div className="border-b border-white/[0.05] p-4">

                  <p className="text-sm font-medium text-white">
                    Administrator
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Executive Workspace
                  </p>

                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-sm
                    text-red-300
                    transition-all
                    duration-300
                    hover:bg-red-500/10
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