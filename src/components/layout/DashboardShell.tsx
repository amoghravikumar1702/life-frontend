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

  return (
    <div className="min-h-screen bg-[#0B0B0C]">
      <div className="flex min-h-screen gap-6 p-6">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />

        {/* Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Bar */}
          <TopBar />

          {/* Dashboard Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}