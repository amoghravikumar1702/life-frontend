"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import Navigation from "./Navigation";
import DhanarkLogo from "@/components/brand/DhanarkLogo";
import { getCompany } from "@/services/companyService";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [companyName, setCompanyName] =
    useState("Your Business");

  const [companyLogoUrl, setCompanyLogoUrl] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCompanyIdentity() {
      try {
        const company = await getCompany();

        if (!mounted || !company) {
          return;
        }

        setCompanyName(
          company.company_name?.trim() || "Your Business"
        );

        setCompanyLogoUrl(
          company.logo_url?.trim() || ""
        );
      } catch (error) {
        console.error(
          "[Sidebar] Failed to load company identity:",
          error
        );
      }
    }

    loadCompanyIdentity();

    return () => {
      mounted = false;
    };
  }, []);

  function CompanyLogo({
    className,
  }: {
    className: string;
  }) {
    return (
      <div
        className={`
          ${className}
          relative
          flex
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-full
          border
          border-white/[0.08]
          bg-white/[0.03]
        `}
      >
        {companyLogoUrl ? (
          <Image
            src={companyLogoUrl}
            alt={`${companyName} logo`}
            fill
            sizes="36px"
            className="object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-[#D4AF37]">
            {(companyName[0] || "C").toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      {/* ============================================================
          DESKTOP SIDEBAR
      ============================================================ */}

      <aside
        className={`
          hidden
          shrink-0
          lg:block
          transition-[width]
          duration-300
          ease-out
          ${
            collapsed
              ? "w-[76px]"
              : "w-[228px]"
          }
        `}
      >
        <div
          className="
            fixed
            bottom-5
            left-5
            top-5
            flex
            min-w-0
            flex-col
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.06]
            bg-[#0B0F15]/95
            shadow-[0_18px_60px_rgba(0,0,0,0.45)]
            backdrop-blur-[28px]
            transition-[width]
            duration-300
            ease-out
            xl:bottom-6
            xl:left-6
            xl:top-6
          "
          style={{
            width: collapsed ? 76 : 228,
          }}
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-white/15
              to-transparent
            "
          />

          <div
            className={`
              flex
              h-[76px]
              min-w-0
              shrink-0
              items-center
              ${
                collapsed
                  ? "justify-center px-3"
                  : "justify-start px-5"
              }
            `}
          >
            {collapsed ? (
              <DhanarkLogo
                variant="mark"
                href=""
                className="h-9 w-9 shrink-0 object-contain"
              />
            ) : (
              <DhanarkLogo
                variant="wordmark"
                href="/"
                className="
                  h-[28px]
                  w-auto
                  max-w-[138px]
                  shrink-0
                  object-contain
                "
              />
            )}
          </div>

          <div className="mx-5 h-px shrink-0 bg-white/[0.06]" />

          <div
            className="
              min-h-0
              min-w-0
              flex-1
              overflow-x-hidden
              overflow-y-auto
              px-3
              py-5
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <Navigation collapsed={collapsed} />
          </div>

          <div className="min-w-0 shrink-0 px-3 pb-3">
            <Link
              href="/pricing"
              className={`
                group
                flex
                min-h-11
                min-w-0
                items-center
                overflow-hidden
                rounded-2xl
                border
                border-[#D4AF37]/15
                bg-[#D4AF37]/[0.055]
                text-[#D4AF37]
                transition-all
                duration-300
                hover:border-[#D4AF37]/30
                hover:bg-[#D4AF37]/[0.09]
                hover:shadow-[0_8px_30px_rgba(212,175,55,0.07)]
                ${
                  collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3.5"
                }
              `}
              title={
                collapsed
                  ? "Upgrade"
                  : undefined
              }
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#D4AF37]/20
                  bg-[#D4AF37]/[0.08]
                "
              >
                <Sparkles
                  size={14}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-[#D4AF37]">
                      Upgrade
                    </p>

                    <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                      Unlock more intelligence
                    </p>
                  </div>

                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="
                      shrink-0
                      text-[#D4AF37]/50
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                      group-hover:text-[#D4AF37]
                    "
                  />
                </>
              )}
            </Link>
          </div>

          <div className="min-w-0 shrink-0 border-t border-white/[0.06] p-4">
            {collapsed ? (
              <div className="flex justify-center">
                <CompanyLogo className="h-9 w-9" />
              </div>
            ) : (
              <div
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-white/[0.05]
                  bg-white/[0.03]
                  px-3
                  py-3
                  transition-all
                  duration-300
                  hover:border-white/[0.09]
                  hover:bg-white/[0.045]
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  <CompanyLogo className="h-9 w-9" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-white">
                      {companyName}
                    </p>

                    <p className="truncate text-[11px] text-zinc-500">
                      Executive Workspace
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="
              absolute
              right-[-1px]
              top-7
              z-20
              flex
              h-10
              w-10
              translate-x-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/[0.08]
              bg-[#131821]
              text-zinc-300
              shadow-[0_12px_32px_rgba(0,0,0,0.45)]
              transition-all
              duration-300
              hover:scale-105
              hover:border-white/20
              hover:bg-[#1A202A]
              hover:text-white
              active:scale-95
            "
          >
            {collapsed ? (
              <ChevronRight
                size={16}
                aria-hidden="true"
              />
            ) : (
              <ChevronLeft
                size={16}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </aside>

      {/* ============================================================
          MOBILE OVERLAY
      ============================================================ */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="
            fixed
            inset-0
            z-[90]
            min-h-[44px]
            bg-black/60
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* ============================================================
          MOBILE DRAWER
      ============================================================ */}

      <aside
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        className={`
          fixed
          bottom-0
          left-0
          top-0
          z-[100]
          flex
          w-[min(86vw,320px)]
          max-w-full
          min-w-0
          flex-col
          overflow-hidden
          border-r
          border-white/[0.08]
          bg-[#0B0F15]
          shadow-[20px_0_80px_rgba(0,0,0,0.55)]
          transition-transform
          duration-300
          ease-out
          lg:hidden
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/15
            to-transparent
          "
        />

        <div
          className="
            flex
            h-[72px]
            min-w-0
            shrink-0
            items-center
            justify-between
            gap-3
            px-5
          "
        >
          <div className="min-w-0 flex-1 overflow-hidden">
            <DhanarkLogo
              variant="wordmark"
              href="/"
              className="
                h-[28px]
                w-auto
                max-w-[138px]
                shrink-0
                object-contain
              "
            />
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close menu"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.03]
              text-zinc-400
              transition-all
              duration-200
              hover:border-white/[0.12]
              hover:bg-white/[0.06]
              hover:text-white
              active:scale-95
            "
          >
            <X
              size={19}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="mx-5 h-px shrink-0 bg-white/[0.06]" />

        <div
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            px-3
            py-5
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <Navigation
            collapsed={false}
            mobile
            onNavigate={onMobileClose}
          />
        </div>

        <div className="min-w-0 shrink-0 px-3 pb-3">
          <Link
            href="/pricing"
            onClick={onMobileClose}
            className="
              group
              flex
              min-h-12
              min-w-0
              items-center
              gap-3
              overflow-hidden
              rounded-2xl
              border
              border-[#D4AF37]/15
              bg-[#D4AF37]/[0.055]
              px-3.5
              text-[#D4AF37]
              transition-all
              duration-300
              hover:border-[#D4AF37]/30
              hover:bg-[#D4AF37]/[0.09]
              active:scale-[0.99]
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
                rounded-xl
                border
                border-[#D4AF37]/20
                bg-[#D4AF37]/[0.08]
              "
            >
              <Sparkles
                size={14}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-[#D4AF37]">
                Upgrade
              </p>

              <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                Unlock more intelligence
              </p>
            </div>

            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="
                shrink-0
                text-[#D4AF37]/50
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
                group-hover:text-[#D4AF37]
              "
            />
          </Link>
        </div>

        <div className="min-w-0 shrink-0 border-t border-white/[0.06] p-4">
          <div
            className="
              min-w-0
              rounded-2xl
              border
              border-white/[0.05]
              bg-white/[0.03]
              px-3
              py-3
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <CompanyLogo className="h-9 w-9" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white">
                  {companyName}
                </p>

                <p className="truncate text-[11px] text-zinc-500">
                  Executive Workspace
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}