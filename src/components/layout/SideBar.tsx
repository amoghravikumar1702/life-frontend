"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Navigation from "./Navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className={`
        hidden lg:flex
        sticky top-[70px]
        h-[calc(100vh-70px)]
        flex-col
        border-r border-white/10
        bg-[#0A0A0B]
        transition-all duration-300
        ${collapsed ? "w-20" : "w-[280px]"}
      `}
    >
      {/* Header */}
      <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-semibold text-white">
              FINZURA
            </h1>

            <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">
              Financial OS
            </p>
          </div>
        )}

        <button
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <Navigation collapsed={collapsed} />
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="shrink-0 border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20 font-semibold text-[#D4AF37]">
              A
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Administrator
              </p>

              <p className="text-xs text-zinc-500">
                Workspace
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}