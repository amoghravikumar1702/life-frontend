"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  FileText,
  Brain,
  Activity,
  BarChart3,
  TrendingUp,
  Target,
  FileBarChart2,
  Building2,
  Settings,
} from "lucide-react";

interface NavigationProps {
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}

const sections = [
  {
    title: "MISSION",
    items: [
      {
        label: "Mission Control",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "OPERATIONS",
    items: [
      {
        label: "Customers",
        href: "/customers",
        icon: Users,
      },
      {
        label: "Invoices",
        href: "/invoices",
        icon: FileText,
      },
    ],
  },

  {
    title: "INTELLIGENCE",
    items: [
      {
        label: "AI CFO",
        href: "/dashboard/ai-cfo",
        icon: Brain,
      },
      {
        label: "Business Health",
        href: "/dashboard/business-health",
        icon: Activity,
      },
      {
        label: "Financial Analysis",
        href: "/dashboard/financial-analysis",
        icon: BarChart3,
      },
      {
        label: "Forecast",
        href: "/dashboard/forecast",
        icon: TrendingUp,
      },
      {
        label: "Decision Center",
        href: "/dashboard/decision-center",
        icon: Target,
      },
      {
        label: "Executive Reports",
        href: "/dashboard/reports",
        icon: FileBarChart2,
      },
    ],
  },

  {
    title: "COMPANY",
    items: [
      {
        label: "Company",
        href: "/company",
        icon: Building2,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Navigation({
  collapsed = false,
  onNavigate,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-8">
      {sections.map((section) => (
        <div key={section.title}>
          {!collapsed && (
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
              {section.title}
            </p>
          )}

          <div className="space-y-2">
            {section.items.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={`
                    group
                    flex
                    h-12
                    items-center
                    rounded-2xl
                    transition-all
                    duration-200
                    ${
                      collapsed
                        ? "justify-center"
                        : "gap-3 px-4"
                    }
                    ${
                      active
                        ? "border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.03] hover:text-white"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className={
                      active
                        ? "text-[#D4AF37]"
                        : "text-zinc-500 group-hover:text-white"
                    }
                  />

                  {!collapsed && (
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}