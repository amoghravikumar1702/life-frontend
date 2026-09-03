"use client";

import { useEffect, useState } from "react";

import Navbar from "./NavBar";
import Sidebar from "./SideBar";
import MainContent from "./MainContent";

import type { BusinessConfig } from "@/config/business/types";

interface AppShellProps {
  children: React.ReactNode;
  business: BusinessConfig;
}

export default function AppShell({
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(
      "DhanarkOS-sidebar-collapsed"
    );

    if (saved === "true") {
      setCollapsed(true);
    }
  }, []);

  function toggleSidebar() {
    const next = !collapsed;

    setCollapsed(next);

    localStorage.setItem(
      "DhanarkOS-sidebar-collapsed",
      String(next)
    );
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobileMenu}
      />

      <div
        className={`
          min-h-screen
          transition-[margin]
          duration-300
          ease-out
          ${
            collapsed
              ? "lg:ml-[110px]"
              : "lg:ml-[275px]"
          }
        `}
      >
        <div className="px-3 pt-3 sm:px-5 sm:pt-5">
          <Navbar
            onOpenMenu={() =>
              setMobileOpen(true)
            }
          />
        </div>

        <MainContent>
          {children}
        </MainContent>
      </div>
    </div>
  );
}