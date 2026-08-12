"use client";

import { useEffect, useState } from "react";

import Navbar from "./NavBar";
import Sidebar from "./SideBar";
import MobileDrawer from "./MobileDrawer";
import MainContent from "./MainContent";

import type { BusinessConfig } from "@/config/business/types";

interface AppShellProps {
  children: React.ReactNode;
  business: BusinessConfig;
}

export default function AppShell({
  children,
}: AppShellProps) {
  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(
      "ArkenOne-sidebar-collapsed"
    );

    if (saved === "true") {
      setCollapsed(true);
    }
  }, []);

  function toggleSidebar() {
    const next = !collapsed;

    setCollapsed(next);

    localStorage.setItem(
      "ArkenOne-sidebar-collapsed",
      String(next)
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
      />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <div
        className={`
          transition-all
          duration-500
          ${
            collapsed
              ? "lg:ml-[110px]"
              : "lg:ml-[275px]"
          }
        `}
      >

        <div className="px-5 pt-5">

          <Navbar
            onOpenMenu={() =>
              setDrawerOpen(true)
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