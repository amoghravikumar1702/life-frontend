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
    const saved =
      localStorage.getItem(
        "finzura-sidebar-collapsed"
      );

    if (saved === "true") {
      setCollapsed(true);
    }
  }, []);

  function toggleSidebar() {
    const next = !collapsed;

    setCollapsed(next);

    localStorage.setItem(
      "finzura-sidebar-collapsed",
      String(next)
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
      />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onOpenMenu={() =>
            setDrawerOpen(true)
          }
        />

        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}