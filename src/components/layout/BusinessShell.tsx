import AppShell from "./AppShell";
import { getCurrentBusinessConfig } from "@/lib/business/getBusinessConfig";

interface BusinessShellProps {
  children: React.ReactNode;
}

export default async function BusinessShell({
  children,
}: BusinessShellProps) {
  const business = await getCurrentBusinessConfig();

  return (
    <AppShell
      business={business}
    >
      {children}
    </AppShell>
  );
}