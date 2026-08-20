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
  Bell,
  Check,
  CheckCheck,
  CreditCard,
  AlertCircle,
  Sparkles,
  Info,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from "@/services/notificationService";

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
    description:
      "Business dashboard and financial position",
    href: "/dashboard",
    icon: LayoutDashboard,
    keywords:
      "dashboard home mission control financial position",
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
    description:
      "AI-powered financial intelligence",
    href: "/dashboard/ai-cfo",
    icon: Brain,
    keywords:
      "ai cfo intelligence insights artificial intelligence",
  },
  {
    label: "Financial Analysis",
    description:
      "Revenue, expenses, profit and cash flow",
    href: "/dashboard/financial-analysis",
    icon: BarChart3,
    keywords:
      "financial analysis revenue expenses profit cash flow margin",
  },
  {
    label: "Executive Reports",
    description:
      "Business reports and executive intelligence",
    href: "/dashboard/reports",
    icon: FileBarChart,
    keywords:
      "reports executive report documents",
  },
  {
    label: "Company",
    description:
      "Manage company information",
    href: "/company",
    icon: Building2,
    keywords:
      "company business organization",
  },
  {
    label: "Settings",
    description:
      "Manage your workspace settings",
    href: "/settings",
    icon: Settings,
    keywords:
      "settings preferences configuration",
  },
];

function getNotificationIcon(
  type: Notification["type"]
) {
  switch (type) {
    case "payment":
    case "payment_received":
    case "invoice_paid":
      return CreditCard;

    case "payment_failed":
    case "invoice_overdue":
      return AlertCircle;

    case "ai_cfo_insight":
      return Sparkles;

    case "system_update":
      return Info;

    default:
      return Bell;
  }
}

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

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    notificationsLoading,
    setNotificationsLoading,
  ] = useState(false);

  const [
    markingAllRead,
    setMarkingAllRead,
  ] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const notificationRef =
    useRef<HTMLDivElement>(null);

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  /*
   * =========================================================
   * CLOSE PROFILE / NOTIFICATION MENUS
   * =========================================================
   */

  useEffect(() => {
    function handleClick(
      event: MouseEvent
    ) {
      const target =
        event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          target
        )
      ) {
        setNotificationsOpen(false);
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
   * LOAD NOTIFICATIONS
   * =========================================================
   */

  async function loadNotifications() {
    try {
      setNotificationsLoading(true);

      const [
        notificationData,
        unread,
      ] = await Promise.all([
        getNotifications(30),
        getUnreadNotificationCount(),
      ]);

      setNotifications(
        notificationData
      );

      setUnreadCount(unread);
    } catch (error) {
      console.error(
        "[TopBar] Failed to load notifications:",
        error
      );
    } finally {
      setNotificationsLoading(false);
    }
  }

  /*
   * =========================================================
   * INITIAL NOTIFICATION LOAD
   * =========================================================
   */

  useEffect(() => {
    loadNotifications();

    const interval =
      window.setInterval(() => {
        loadNotifications();
      }, 30000);

    return () =>
      window.clearInterval(interval);
  }, []);

  /*
   * =========================================================
   * OPEN NOTIFICATIONS
   * =========================================================
   */

  async function handleNotificationToggle() {
    const nextState =
      !notificationsOpen;

    setNotificationsOpen(
      nextState
    );

    if (nextState) {
      await loadNotifications();
    }
  }

  /*
   * =========================================================
   * MARK ONE AS READ
   * =========================================================
   */

  async function handleNotificationClick(
    notification: Notification
  ) {
    try {
      if (!notification.is_read) {
        await markNotificationAsRead(
          notification.id
        );

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  is_read: true,
                }
              : item
          )
        );

        setUnreadCount((current) =>
          Math.max(current - 1, 0)
        );
      }

      setNotificationsOpen(false);

      if (notification.link) {
        router.push(
          notification.link
        );
      }
    } catch (error) {
      console.error(
        "[TopBar] Failed to mark notification as read:",
        error
      );
    }
  }

  /*
   * =========================================================
   * MARK ALL AS READ
   * =========================================================
   */

  async function handleMarkAllAsRead() {
    if (
      markingAllRead ||
      unreadCount === 0
    ) {
      return;
    }

    try {
      setMarkingAllRead(true);

      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          is_read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "[TopBar] Failed to mark all notifications as read:",
        error
      );
    } finally {
      setMarkingAllRead(false);
    }
  }

  /*
   * =========================================================
   * FORMAT NOTIFICATION TIME
   * =========================================================
   */

  function formatNotificationTime(
    createdAt: string
  ) {
    const date =
      new Date(createdAt);

    const now = new Date();

    const difference =
      now.getTime() -
      date.getTime();

    const seconds =
      Math.floor(
        difference / 1000
      );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes =
      Math.floor(
        seconds / 60
      );

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours =
      Math.floor(
        minutes / 60
      );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days =
      Math.floor(
        hours / 24
      );

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  }

  /*
   * =========================================================
   * SEARCH KEYBOARD HANDLING
   * =========================================================
   */

  useEffect(() => {
    function handleKeyboard(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
        setNotificationsOpen(false);
        return;
      }

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k"
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
      } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "[TopBar] Logout error:",
          error
        );

        setLoggingOut(false);
        return;
      }

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
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
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

          {/* RIGHT */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* SEARCH */}

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

            {/* =====================================================
                NOTIFICATIONS
            ===================================================== */}

            <div
              ref={notificationRef}
              className="relative"
            >
              <button
                type="button"
                onClick={
                  handleNotificationToggle
                }
                aria-label="Notifications"
                aria-expanded={
                  notificationsOpen
                }
                title="Notifications"
                className="
                  relative
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
                <Bell
                  size={17}
                  className={
                    unreadCount > 0
                      ? "text-[#D4AF37]"
                      : "text-zinc-400"
                  }
                />

                {unreadCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      min-h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#101010]
                      bg-[#D4AF37]
                      px-1
                      text-[8px]
                      font-bold
                      text-black
                    "
                  >
                    {unreadCount >
                    99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-full
                    z-[150]
                    mt-3
                    w-[calc(100vw-24px)]
                    max-w-[390px]
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-[#111111]/98
                    shadow-[0_30px_100px_rgba(0,0,0,.65)]
                    backdrop-blur-2xl
                  "
                >
                  {/* HEADER */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-white/[0.07]
                      px-5
                      py-4
                    "
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Notifications
                      </p>

                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                        ArkenOne Intelligence
                      </p>
                    </div>

                    {unreadCount >
                      0 && (
                      <button
                        type="button"
                        onClick={
                          handleMarkAllAsRead
                        }
                        disabled={
                          markingAllRead
                        }
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-[10px]
                          font-medium
                          text-[#D4AF37]
                          transition
                          hover:text-white
                          disabled:opacity-50
                        "
                      >
                        <CheckCheck
                          size={13}
                        />

                        {markingAllRead
                          ? "Updating..."
                          : "Mark all read"}
                      </button>
                    )}
                  </div>

                  {/* BODY */}

                  <div className="max-h-[420px] overflow-y-auto">
                    {notificationsLoading &&
                    notifications.length ===
                      0 ? (
                      <div className="px-5 py-12 text-center">
                        <div
                          className="
                            mx-auto
                            h-6
                            w-6
                            animate-spin
                            rounded-full
                            border-2
                            border-white/10
                            border-t-[#D4AF37]
                          "
                        />

                        <p className="mt-4 text-xs text-zinc-600">
                          Loading notifications...
                        </p>
                      </div>
                    ) : notifications.length ===
                      0 ? (
                      <div className="px-5 py-14 text-center">
                        <div
                          className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/[0.06]
                            bg-white/[0.025]
                          "
                        >
                          <Bell
                            size={19}
                            className="text-zinc-700"
                          />
                        </div>

                        <p className="mt-4 text-sm font-medium text-zinc-400">
                          All clear
                        </p>

                        <p className="mt-1 text-xs text-zinc-700">
                          You have no
                          notifications
                          right now.
                        </p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {notifications.map(
                          (
                            notification
                          ) => {
                            const Icon =
                              getNotificationIcon(
                                notification.type
                              );

                            return (
                              <button
                                key={
                                  notification.id
                                }
                                type="button"
                                onClick={() =>
                                  handleNotificationClick(
                                    notification
                                  )
                                }
                                className={`
                                  group
                                  flex
                                  w-full
                                  items-start
                                  gap-3
                                  rounded-2xl
                                  p-3
                                  text-left
                                  transition
                                  hover:bg-white/[0.05]
                                  ${
                                    !notification.is_read
                                      ? "bg-white/[0.025]"
                                      : ""
                                  }
                                `}
                              >
                                {/* ICON */}

                                <div
                                  className={`
                                    relative
                                    mt-0.5
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    ${
                                      !notification.is_read
                                        ? "border-[#D4AF37]/15 bg-[#D4AF37]/[0.07]"
                                        : "border-white/[0.06] bg-white/[0.025]"
                                    }
                                  `}
                                >
                                  <Icon
                                    size={15}
                                    className={
                                      !notification.is_read
                                        ? "text-[#D4AF37]"
                                        : "text-zinc-500"
                                    }
                                  />

                                  {!notification.is_read && (
                                    <span
                                      className="
                                        absolute
                                        -right-0.5
                                        -top-0.5
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-[#D4AF37]
                                      "
                                    />
                                  )}
                                </div>

                                {/* CONTENT */}

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <p
                                      className={`
                                        text-[13px]
                                        font-medium
                                        ${
                                          !notification.is_read
                                            ? "text-white"
                                            : "text-zinc-400"
                                        }
                                      `}
                                    >
                                      {
                                        notification.title
                                      }
                                    </p>

                                    <span className="shrink-0 text-[9px] text-zinc-700">
                                      {formatNotificationTime(
                                        notification.created_at
                                      )}
                                    </span>
                                  </div>

                                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-600">
                                    {
                                      notification.message
                                    }
                                  </p>

                                  {notification.link && (
                                    <span className="mt-2 flex items-center gap-1 text-[9px] uppercase tracking-[0.15em] text-[#D4AF37]/70 opacity-0 transition group-hover:opacity-100">
                                      Open
                                      <span>
                                        →
                                      </span>
                                    </span>
                                  )}
                                </div>

                                {/* READ STATE */}

                                {!notification.is_read && (
                                  <Check
                                    size={13}
                                    className="mt-1 shrink-0 text-zinc-700 opacity-0 transition group-hover:opacity-100"
                                  />
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  {/* FOOTER */}

                  <div className="border-t border-white/[0.06] px-5 py-3">
                    <p className="text-center text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                      Financial events · AI
                      intelligence ·
                      system updates
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE */}

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

            <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                ArkenOne Search
              </span>

              <span className="text-[10px] text-zinc-700">
                ESC to close · ENTER to
                open
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}