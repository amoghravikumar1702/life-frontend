"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
  Activity,
  BarChart3,
  Brain,
  Building2,
  FileBarChart2,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
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
];

export default function Navigation({
  collapsed = false,
  mobile = false,
  onNavigate,
}: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className={`
        ${
          mobile
            ? "space-y-7"
            : collapsed
              ? "space-y-6"
              : "space-y-6 sm:space-y-7"
        }
      `}
    >
      {sections.map((section) => (
        <section key={section.title}>
          {/* SECTION LABEL */}

          {!collapsed && (
            <p
              className={`
                mb-3
                font-medium
                uppercase
                tracking-[0.32em]
                text-zinc-600
                ${
                  mobile
                    ? "px-3 text-[9px]"
                    : "px-4 text-[10px]"
                }
              `}
            >
              {section.title}
            </p>
          )}

          {/* NAV ITEMS */}

          <div
            className={`
              ${
                mobile
                  ? "space-y-1.5"
                  : "space-y-1"
              }
            `}
          >
            {section.items.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(
                  `${item.href}/`
                );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={
                    collapsed
                      ? item.label
                      : undefined
                  }
                  className="block"
                >
                  <motion.div
                    whileHover={{
                      x:
                        collapsed || mobile
                          ? 0
                          : 3,
                      scale: mobile
                        ? 1
                        : 1.01,
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                    transition={{
                      duration: 0.22,
                      ease: "easeOut",
                    }}
                    className={`
                      group
                      relative
                      flex
                      overflow-hidden
                      rounded-xl
                      transition-all
                      duration-300

                      ${
                        mobile
                          ? "min-h-[48px] gap-3 px-4 py-3"
                          : collapsed
                            ? "mx-auto h-11 w-11 items-center justify-center"
                            : "min-h-11 items-center gap-3 px-4 py-2.5"
                      }

                      ${
                        active
                          ? `
                            border
                            border-[#D4AF37]/12
                            bg-white/[0.035]
                            text-white
                            shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
                          `
                          : `
                            border
                            border-transparent
                            text-zinc-500
                            hover:border-white/[0.04]
                            hover:bg-white/[0.025]
                            hover:text-zinc-100
                          `
                      }
                    `}
                  >
                    {/* ACTIVE INDICATOR */}

                    {active && (
                      <>
                        <motion.span
                          layoutId={
                            mobile
                              ? "ArkenOne-mobile-nav-indicator"
                              : "ArkenOne-nav-indicator"
                          }
                          className="
                            absolute
                            bottom-2
                            left-0
                            top-2
                            w-[2px]
                            rounded-r-full
                            bg-[#D4AF37]
                          "
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            bg-[linear-gradient(90deg,rgba(212,175,55,0.08),transparent_72%)]
                          "
                        />
                      </>
                    )}

                    {/* ICON */}

                    <Icon
                      size={mobile ? 18 : 17}
                      strokeWidth={1.9}
                      className={`
                        relative
                        z-10
                        shrink-0
                        transition-colors
                        duration-300
                        ${
                          active
                            ? "text-[#D4AF37]"
                            : "text-zinc-500 group-hover:text-zinc-100"
                        }
                      `}
                    />

                    {/* LABEL */}

                    {!collapsed && (
                      <span
                        className={`
                          relative
                          z-10
                          truncate
                          font-medium
                          tracking-[0.01em]
                          transition-colors
                          duration-300
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