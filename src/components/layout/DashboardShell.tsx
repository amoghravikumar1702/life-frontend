"use client";

import { ReactNode, useState } from "react";

import TopBar from "./TopBar";
import Sidebar from "./SideBar";

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#090909]">

      <TopBar />

      <div className="flex h-[calc(100vh-80px)]">

        <Sidebar
          collapsed={collapsed}
          onToggle={() =>
            setCollapsed((prev) => !prev)
          }
        />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {children}
        </main>

      </div>

    </div>
  );
}