import type { Metadata } from "next";
import type { ReactNode } from "react";

import DashboardShell from "@/components/layout/DashboardShell";
import {
  requireDhanarkOSAccess,
} from "@/lib/dhanark/access";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDhanarkOSAccess();

  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}