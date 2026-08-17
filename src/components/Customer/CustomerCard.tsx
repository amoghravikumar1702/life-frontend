"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Mail,
  Phone,
  Trash2,
  Wallet,
} from "lucide-react";

import { Customer } from "@/types/customer";

interface CustomerMetrics {
  invoiceCount: number;
  revenue: number;
  outstanding: number;
  collected: number;
}

interface CustomerCardProps {
  customer: Customer;
  metrics: CustomerMetrics;
  onDelete: (id: number) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

export default function CustomerCard({
  customer,
  metrics,
  onDelete,
}: CustomerCardProps) {
  const collectionRate =
    metrics.revenue > 0
      ? Math.round(
          (metrics.collected / metrics.revenue) * 100
        )
      : 0;

  const displayName =
    customer.customer_name?.trim() ||
    "Unnamed Customer";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  return (
    <motion.article
      variants={{
        hidden: {
          opacity: 0,
          y: 14,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.06]
        bg-[#101214]
        transition-all
        duration-300
        hover:border-[#D4AF37]/15
        hover:bg-[#111418]
        sm:rounded-[28px]
      "
    >
      {/* Top accent */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#D4AF37]/20
          to-transparent
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {/* Avatar */}
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#D4AF37]/15
                bg-[#D4AF37]/[0.07]
                text-sm
                font-semibold
                text-[#D4AF37]
                sm:h-12
                sm:w-12
                sm:rounded-2xl
              "
            >
              {initials}
            </div>

            {/* Customer identity */}
            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-semibold text-white sm:text-[15px]">
                {displayName}
              </h3>

              {customer.business_name && (
                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-zinc-500 sm:text-xs">
                  <Building2
                    size={12}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {customer.business_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <span
            className={`
              shrink-0
              rounded-full
              border
              px-2
              py-1
              text-[8px]
              font-medium
              uppercase
              tracking-[0.14em]
              sm:px-2.5
              sm:text-[9px]
              sm:tracking-[0.16em]
              ${
                metrics.invoiceCount > 0
                  ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-400"
                  : "border-white/[0.06] bg-white/[0.02] text-zinc-600"
              }
            `}
          >
            {metrics.invoiceCount > 0
              ? "Active"
              : "New"}
          </span>
        </div>

        {/* Contact */}
        {(customer.email || customer.phone) && (
          <div className="mt-4 space-y-2 sm:mt-5">
            {customer.email && (
              <div className="flex min-w-0 items-center gap-2 text-[11px] text-zinc-500 sm:text-xs">
                <Mail
                  size={13}
                  className="shrink-0 text-zinc-600"
                />

                <span className="truncate">
                  {customer.email}
                </span>
              </div>
            )}

            {customer.phone && (
              <div className="flex min-w-0 items-center gap-2 text-[11px] text-zinc-500 sm:text-xs">
                <Phone
                  size={13}
                  className="shrink-0 text-zinc-600"
                />

                <span className="truncate">
                  {customer.phone}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Financial metrics */}
      <div
        className="
          grid
          grid-cols-2
          gap-px
          border-y
          border-white/[0.05]
          bg-white/[0.04]
        "
      >
        <div className="min-w-0 bg-[#101214] px-4 py-3.5 sm:px-5 sm:py-4">
          <p className="text-[8px] uppercase tracking-[0.18em] text-zinc-600 sm:text-[9px] sm:tracking-[0.22em]">
            Revenue
          </p>

          <p className="mt-2 truncate text-[16px] font-semibold tracking-tight text-white sm:text-lg">
            {formatCurrency(metrics.revenue)}
          </p>
        </div>

        <div className="min-w-0 bg-[#101214] px-4 py-3.5 sm:px-5 sm:py-4">
          <p className="text-[8px] uppercase tracking-[0.18em] text-zinc-600 sm:text-[9px] sm:tracking-[0.22em]">
            Outstanding
          </p>

          <p
            className={`
              mt-2
              truncate
              text-[16px]
              font-semibold
              tracking-tight
              sm:text-lg
              ${
                metrics.outstanding > 0
                  ? "text-[#D4AF37]"
                  : "text-zinc-300"
              }
            `}
          >
            {formatCurrency(metrics.outstanding)}
          </p>
        </div>
      </div>

      {/* Collection */}
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet
              size={14}
              className="text-zinc-600"
            />

            <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-600 sm:text-[10px] sm:tracking-[0.2em]">
              Collection
            </span>
          </div>

          <span className="text-xs font-medium text-zinc-400">
            {collectionRate}%
          </span>
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(
                collectionRate,
                100
              )}%`,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className={`
              h-full
              rounded-full
              ${
                collectionRate >= 80
                  ? "bg-emerald-400"
                  : collectionRate >= 50
                    ? "bg-[#D4AF37]"
                    : "bg-amber-400"
              }
            `}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-white/[0.05] px-4 py-3.5 sm:px-6 sm:py-4">
        <Link
          href={`/customers/${customer.id}`}
          className="
            flex
            min-h-10
            flex-1
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.02]
            px-3
            text-[11px]
            font-medium
            text-zinc-400
            transition
            hover:border-[#D4AF37]/20
            hover:bg-[#D4AF37]/[0.05]
            hover:text-[#D4AF37]
            active:scale-[0.98]
            sm:text-xs
          "
        >
          <span>View Customer</span>
          <ArrowUpRight size={14} />
        </Link>

        <button
          type="button"
          title="Delete customer"
          aria-label="Delete customer"
          onClick={() =>
            onDelete(customer.id ?? 0)
          }
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.06]
            bg-white/[0.02]
            text-zinc-600
            transition
            hover:border-red-500/20
            hover:bg-red-500/[0.06]
            hover:text-red-400
            active:scale-95
          "
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.article>
  );
}