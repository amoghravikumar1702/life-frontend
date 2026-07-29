"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import {
  Bell,
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

  const [loggingOut, setLoggingOut] =
    useState(false);

  async function handleLogout() {
    if (
      !window.confirm(
        "Are you sure you want to log out?"
      )
    )
      return;

    setLoggingOut(true);

    try {
      await logout();

      queryClient.clear();

      router.push("/login");
    } catch (error) {
      console.error(error);

      alert("Logout failed.");

      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/80 backdrop-blur-2xl">
      <div className="flex h-[70px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-white">
              Dashboard
            </h1>

            <p className="hidden text-xs text-zinc-500 sm:block">
              Financial Operating System
            </p>
          </div>
        </div>

        {/* Search */}

        <div className="hidden lg:flex lg:w-[420px]">
          <div className="flex h-11 w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
            <Search
              size={18}
              className="text-zinc-500"
            />

            <input
              placeholder="Search customers, invoices..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10">
            <Search
              size={18}
              className="lg:hidden"
            />

            <Bell
              size={18}
              className="hidden lg:block"
            />
          </button>

          <button className="hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 lg:flex">
            <Bell size={18} />
          </button>

          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20 font-semibold text-[#D4AF37]">
              A
            </div>

            <div>
              <p className="text-sm font-medium">
                Administrator
              </p>

              <p className="text-xs text-zinc-500">
                Workspace
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="hidden h-11 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-sm text-red-300 transition hover:bg-red-500/20 xl:flex"
          >
            <LogOut size={16} />

            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}