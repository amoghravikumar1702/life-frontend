"use client";

import { ReactNode, useState } from "react";

import Sidebar from "./SideBar";
import TopBar from "./TopBar";

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      <div className="flex min-h-screen gap-6 p-3 sm:p-4 lg:gap-6 lg:p-6">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={closeMobileMenu}
        />

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            onMobileMenu={() =>
              setMobileMenuOpen((prev) => !prev)
            }
          />

          <main className="min-w-0 flex-1 pb-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}