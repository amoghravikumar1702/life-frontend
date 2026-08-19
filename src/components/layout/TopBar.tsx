"use client";

import {
  Menu,
  ChevronDown,
  LogOut,
  Search,
  X,
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Brain,
  BarChart3,
  Building2,
  Settings,
  FileBarChart,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

interface TopBarProps {
  onMobileMenu?: () => void;
}

type SearchItem = {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  keywords: string;
};

const searchItems: SearchItem[] = [
  {
    label: "Mission Control",
    description: "Business dashboard and financial position",
    href: "/dashboard",
    icon: LayoutDashboard,
    keywords: "dashboard home mission control financial position",
  },
  {
    label: "Customers",
    description: "Manage your customers",
    href: "/customers",
    icon: Users,
    keywords: "customers clients people",
  },
  {
    label: "Invoices",
    description: "Create and manage invoices",
    href: "/invoices",
    icon: FileText,
    keywords: "invoices billing bills",
  },
  {
    label: "Expenses",
    description: "Track business expenses",
    href: "/expenses",
    icon: Receipt,
    keywords: "expenses costs spending",
  },
  {
    label: "AI CFO",
    description: "AI-powered financial intelligence",
    href: "/dashboard/ai-cfo",
    icon: Brain,
    keywords: "ai cfo intelligence insights artificial intelligence",
  },
  {
    label: "Financial Analysis",
    description: "Revenue, expenses, profit and cash flow",
    href: "/dashboard/financial-analysis",
    icon: BarChart3,
    keywords: "financial analysis revenue expenses profit cash flow margin",
  },
  {
    label: "Executive Reports",
    description: "Business reports and executive intelligence",
    href: "/dashboard/reports",
    icon: FileBarChart,
    keywords: "reports executive report documents",
  },
  {
    label: "Company",
    description: "Manage company information",
    href: "/company",
    icon: Building2,
    keywords: "company business organization",
  },
  {
    label: "Settings",
    description: "Manage your workspace settings",
    href: "/settings",
    icon: Settings,
    keywords: "settings preferences configuration",
  },
];

export default function TopBar({
  onMobileMenu,
}: TopBarProps) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loggingOut, setLoggingOut] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  /*
   * =========================================================
   * CLOSE PROFILE MENU WHEN CLICKING OUTSIDE
   * =========================================================
   */

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  /*
   * =========================================================
   * SEARCH KEYBOARD HANDLING
   * =========================================================
   */

  useEffect(() => {
    function handleKeyboard(
      event: KeyboardEvent
    ) {
      /*
       * Escape closes search
       */

      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        return;
      }

      /*
       * Cmd/Ctrl + K opens search
       */

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setSearchOpen(true);

        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyboard
      );
  }, []);

  /*
   * =========================================================
   * FOCUS SEARCH INPUT
   * =========================================================
   */

  useEffect(() => {
    if (searchOpen) {
      const timer =
        window.setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);

      return () =>
        window.clearTimeout(timer);
    }
  }, [searchOpen]);

  /*
   * =========================================================
   * SEARCH RESULTS
   * =========================================================
   */

  const normalizedQuery =
    searchQuery
      .trim()
      .toLowerCase();

  const filteredResults =
    normalizedQuery.length === 0
      ? searchItems
      : searchItems.filter(
          (item) =>
            item.label
              .toLowerCase()
              .includes(
                normalizedQuery
              ) ||
            item.description
              .toLowerCase()
              .includes(
                normalizedQuery
              ) ||
            item.keywords
              .toLowerCase()
              .includes(
                normalizedQuery
              )
        );

  /*
   * =========================================================
   * NAVIGATE FROM SEARCH
   * =========================================================
   */

  function handleSearchNavigate(
    href: string
  ) {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  }

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const supabase =
        createClient();

      const {
        error,
      } = await supabase.auth.signOut();

      if (error) {
        console.error(
          "[TopBar] Logout error:",
          error
        );

        setLoggingOut(false);
        return;
      }

      /*
       * Force navigation so the authenticated
       * dashboard cannot remain visible from
       * client-side state.
       */

      window.location.href =
        "/login";
    } catch (error) {
      console.error(
        "[TopBar] Logout error:",
        error
      );

      setLoggingOut(false);
    }
  }

  return (
    <>
      <header className="relative z-50 mb-4 sm:mb-6">
        <div
          className="
            flex
            min-h-16
            w-full
            items-center
            justify-between
            gap-3
            rounded-2xl
            border
            border-white/10
            bg-[#101010]/80
            px-3
            py-2.5
            backdrop-blur-2xl
            shadow-[0_12px_40px_rgba(0,0,0,0.25)]
            sm:rounded-3xl
            sm:px-5
            lg:px-7
          "
        >
          {/* ========================================================
              LEFT
          ======================================================== */}

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {/* Mobile menu */}

            <button
              type="button"
              onClick={onMobileMenu}
              aria-label="Open navigation"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                text-zinc-400
                transition
                hover:border-[#D4AF37]/30
                hover:bg-white/[0.05]
                hover:text-white
                lg:hidden
              "
            >
              <Menu size={19} />
            </button>

            {/* Brand */}

            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  hidden
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#D4AF37]/20
                  bg-[#D4AF37]/10
                  sm:flex
                "
              >
                <span className="text-lg font-semibold text-[#D4AF37]">
                  A
                </span>
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-[16px] font-semibold tracking-tight text-white sm:text-[17px]">
                  ArkenOne
                </h1>

                <p className="mt-0.5 hidden text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:block">
                  Executive Operating System
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-1" />

          {/* ========================================================
              RIGHT
          ======================================================== */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* ======================================================
                SEARCH BUTTON
            ======================================================= */}

            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);

                setTimeout(() => {
                  searchInputRef.current?.focus();
                }, 50);
              }}
              aria-label="Search"
              title="Search"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                transition-all
                duration-200
                hover:border-[#D4AF37]/30
                hover:bg-white/[0.05]
              "
            >
              <Search
                size={17}
                className="text-zinc-400"
              />
            </button>

            {/* ======================================================
                PROFILE
            ======================================================= */}

            <div
              ref={menuRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setMenuOpen(
                    (prev) => !prev
                  )
                }
                aria-expanded={menuOpen}
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-2
                  transition-all
                  duration-200
                  hover:border-[#D4AF37]/30
                  hover:bg-white/[0.05]
                  sm:h-auto
                  sm:gap-3
                  sm:rounded-2xl
                  sm:px-3
                  sm:py-2
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#D4AF37]/15
                    text-xs
                    font-semibold
                    text-[#D4AF37]
                    sm:h-10
                    sm:w-10
                    sm:text-sm
                  "
                >
                  A
                </div>

                <div className="hidden text-left leading-tight sm:block">
                  <p className="text-sm font-medium text-white">
                    Administrator
                  </p>

                  <p className="text-xs text-zinc-500">
                    Executive Workspace
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`
                    hidden
                    text-zinc-500
                    transition-transform
                    sm:block
                    ${
                      menuOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {menuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    z-[100]
                    mt-3
                    w-48
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#111111]/95
                    backdrop-blur-2xl
                    shadow-[0_30px_80px_rgba(0,0,0,.55)]
                  "
                >
                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    disabled={
                      loggingOut
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-sm
                      text-zinc-300
                      transition-colors
                      hover:bg-white/[0.05]
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <LogOut
                      size={16}
                    />

                    {loggingOut
                      ? "Signing out..."
                      : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          SEARCH OVERLAY
      ============================================================ */}

      {searchOpen && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-start
            justify-center
            bg-black/60
            px-4
            pt-[12vh]
            backdrop-blur-md
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSearchOpen(false);
              setSearchQuery("");
            }
          }}
        >
          <div
            className="
              w-full
              max-w-2xl
              overflow-hidden
              rounded-[28px]
              border
              border-white/10
              bg-[#111214]/95
              shadow-[0_40px_120px_rgba(0,0,0,.65)]
              backdrop-blur-2xl
            "
          >
            {/* Search input */}

            <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4">
              <Search
                size={19}
                className="shrink-0 text-[#D4AF37]"
              />

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Escape"
                  ) {
                    setSearchOpen(
                      false
                    );
                    setSearchQuery("");
                  }

                  if (
                    event.key ===
                      "Enter" &&
                    filteredResults.length >
                      0
                  ) {
                    handleSearchNavigate(
                      filteredResults[0]
                        .href
                    );
                  }
                }}
                placeholder="Search ArkenOne..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-base
                  text-white
                  outline-none
                  placeholder:text-zinc-600
                "
              />

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                aria-label="Close search"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  text-zinc-500
                  transition
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* Results */}

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {filteredResults.length >
              0 ? (
                <div className="space-y-1">
                  {filteredResults.map(
                    (item) => {
                      const Icon =
                        item.icon;

                      return (
                        <button
                          key={
                            item.href
                          }
                          type="button"
                          onClick={() =>
                            handleSearchNavigate(
                              item.href
                            )
                          }
                          className="
                            group
                            flex
                            w-full
                            items-center
                            gap-4
                            rounded-2xl
                            px-4
                            py-3.5
                            text-left
                            transition
                            hover:bg-white/[0.05]
                          "
                        >
                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-[#D4AF37]/10
                              bg-[#D4AF37]/[0.05]
                              transition
                              group-hover:border-[#D4AF37]/25
                              group-hover:bg-[#D4AF37]/[0.08]
                            "
                          >
                            <Icon
                              size={17}
                              className="text-[#D4AF37]"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white">
                              {
                                item.label
                              }
                            </p>

                            <p className="mt-0.5 truncate text-xs text-zinc-600">
                              {
                                item.description
                              }
                            </p>
                          </div>

                          <span className="hidden text-[9px] uppercase tracking-[0.18em] text-zinc-700 sm:block">
                            Open
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
                  <Search
                    size={24}
                    className="mx-auto text-zinc-700"
                  />

                  <p className="mt-4 text-sm font-medium text-zinc-400">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-zinc-700">
                    Try searching for
                    customers, invoices,
                    expenses or AI CFO.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}

            <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                ArkenOne Search
              </span>

              <span className="text-[10px] text-zinc-700">
                ESC to close · ENTER to open
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}