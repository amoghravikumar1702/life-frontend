
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
  BarChart3,
  Brain,
  Building2,
  FileBarChart2,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

interface NavigationProps {
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}

const sections = [
  {
    title: "Workspace",
    items: [
      {
        label: "Mission Control",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Operations",
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
      {
        label: "Record Payment",
        href: "/record-payment",
        icon: WalletCards,
      },
      {
        label: "Expenses",
        href: "/expenses",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Intelligence",
    items: [
      {
        label: "AI CFO",
        href: "/dashboard/ai-cfo",
        icon: Brain,
      },
      {
        label: "Financial Analysis",
        href: "/dashboard/financial-analysis",
        icon: BarChart3,
      },
      {
        label: "Executive Reports",
        href: "/dashboard/reports",
        icon: FileBarChart2,
      },
    ],
  },
  {
    title: "Company",
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
  {
    title: "Learn",
    items: [
      {
        label: "How DhanarkOS Works",
        href: "/walkthrough",
        icon: HelpCircle,
      },
    ],
  },
];

export default function Navigation({
  collapsed = false,
  mobile = false,
  onNavigate,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className={`
        w-full
        max-w-full
        min-w-0
        overflow-x-hidden
        ${mobile ? "space-y-7" : collapsed ? "space-y-6" : "space-y-6 sm:space-y-7"}
      `}
    >
      {sections.map((section) => (
        <section
          key={section.title}
          className="w-full max-w-full min-w-0"
        >
          {!collapsed && (
            <p
              className={`
                mb-3
                min-w-0
                truncate
                px-4
                font-medium
                uppercase
                tracking-[0.32em]
                text-zinc-600
                ${mobile ? "text-[9px]" : "text-[10px]"}
              `}
            >
              {section.title}
            </p>
          )}

          <div
            className={`
              w-full
              min-w-0
              ${mobile ? "space-y-1.5" : "space-y-1"}
            `}
          >
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
                  aria-current={active ? "page" : undefined}
                  className="
                    block
                    w-full
                    max-w-full
                    min-w-0
                    touch-manipulation
                    outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#D4AF37]/40
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#0E1013]
                  "
                >
                  <motion.div
                    whileHover={
                      mobile
                        ? undefined
                        : {
                            x: collapsed ? 0 : 3,
                          }
                    }
                    whileTap={{
                      scale: 0.985,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className={`
                      group
                      relative
                      flex
                      w-full
                      max-w-full
                      min-w-0
                      overflow-hidden
                      rounded-xl
                      transition-colors
                      duration-200

                      ${
                        mobile
                          ? "min-h-[48px] items-center gap-3 px-4 py-3"
                          : collapsed
                            ? "mx-auto h-11 w-11 items-center justify-center"
                            : "min-h-[44px] items-center gap-3 px-4 py-2.5"
                      }

                      ${
                        active
                          ? "border border-[#D4AF37]/12 bg-white/[0.035] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                          : "border border-transparent text-zinc-500 hover:border-white/[0.04] hover:bg-white/[0.025] hover:text-zinc-100"
                      }
                    `}
                  >
                    {active && (
                      <>
                        <motion.span
                          layoutId={
                            mobile
                              ? "DhanarkOS-mobile-nav-indicator"
                              : "DhanarkOS-nav-indicator"
                          }
                          className="
                            absolute
                            bottom-2
                            left-0
                            top-2
                            z-20
                            w-[2px]
                            rounded-r-full
                            bg-[#D4AF37]
                          "
                        />

                        <div
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-[linear-gradient(90deg,rgba(212,175,55,0.08),transparent_72%)]
                          "
                        />
                      </>
                    )}

                    <span
                      className="
                        relative
                        z-10
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                      "
                    >
                      <Icon
                        size={mobile ? 18 : 17}
                        strokeWidth={1.9}
                        aria-hidden="true"
                        className={`
                          shrink-0
                          transition-colors
                          duration-200
                          ${
                            active
                              ? "text-[#D4AF37]"
                              : "text-zinc-500 group-hover:text-zinc-100"
                          }
                        `}
                      />
                    </span>

                    {!collapsed && (
                      <span
                        className={`
                          relative
                          z-10
                          min-w-0
                          flex-1
                          truncate
                          font-medium
                          tracking-[0.01em]
                          transition-colors
                          duration-200
                          ${
                            mobile
                              ? "text-[14px]"
                              : "text-[13.5px]"
                          }
                          ${
                            active
                              ? "text-white"
                              : "text-zinc-400 group-hover:text-zinc-100"
                          }
                        `}
                      >
                        {item.label}
                      </span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}

