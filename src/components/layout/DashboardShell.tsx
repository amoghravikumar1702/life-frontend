"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import Sidebar from "./SideBar";
import TopBar from "./TopBar";

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(
      (current) => !current
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0B0C] text-white">
      <div
        className="
          flex
          min-h-screen
          w-full
          gap-3
          p-3
          sm:gap-4
          sm:p-4
          lg:gap-5
          lg:p-5
          xl:gap-6
          xl:p-6
        "
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() =>
            setCollapsed(
              (current) => !current
            )
          }
          mobileOpen={mobileMenuOpen}
          onMobileClose={closeMobileMenu}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="w-full min-w-0">
            <TopBar
              onMobileMenu={toggleMobileMenu}
            />
          </div>

          <main
            className="
              min-w-0
              flex-1
              pb-6
              sm:pb-8
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}