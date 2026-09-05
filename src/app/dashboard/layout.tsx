"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/SideBar";
import TopBar from "@/components/layout/TopBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#07090C] text-white">
      <div className="flex min-h-screen">
        {/* Desktop sidebar spacer.
            Sidebar itself is fixed 24px from the left,
            so reserve that space as well. */}
        <div
          className={`
            hidden
            shrink-0
            transition-[width]
            duration-300
            ease-out
            lg:block
            ${
              sidebarCollapsed
                ? "w-[100px]"
                : "w-[252px]"
            }
          `}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() =>
              setSidebarCollapsed(
                (current) => !current
              )
            }
            mobileOpen={mobileMenuOpen}
            onMobileClose={() =>
              setMobileMenuOpen(false)
            }
          />
        </div>

        {/* Main application area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            onMobileMenu={() =>
              setMobileMenuOpen(true)
            }
          />

          <main className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}