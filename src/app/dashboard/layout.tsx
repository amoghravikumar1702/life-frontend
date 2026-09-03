import type { ReactNode } from "react";

import DashboardShell from "@/components/layout/DashboardShell";
import {
  requireDhanarkOSAccess,
} from "@/lib/dhanark/access";

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