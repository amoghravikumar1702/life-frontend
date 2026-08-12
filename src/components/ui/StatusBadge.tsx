"use client";

import clsx from "clsx";

type StatusVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "gold";

interface StatusBadgeProps {
  // New API
  label?: string;
  variant?: StatusVariant;

  // Backward-compatible API
  status?: string;

  size?: "sm" | "md";

  dot?: boolean;

  className?: string;
}

const variants = {
  neutral: {
    container:
      "border-white/[0.06] bg-white/[0.03] text-zinc-300",
    dot: "bg-zinc-400",
  },

  success: {
    container:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
  },

  warning: {
    container:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
  },

  danger: {
    container:
      "border-red-500/20 bg-red-500/10 text-red-300",
    dot: "bg-red-400",
  },

  info: {
    container:
      "border-sky-500/20 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400",
  },

  gold: {
    container:
      "border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]",
    dot: "bg-[#D4AF37]",
  },
} as const;

const sizes = {
  sm: "px-2.5 py-1 text-[11px]",
  md: "px-3 py-1.5 text-xs",
} as const;

function mapStatusToVariant(
  status: string
): StatusVariant {
  switch (status.trim().toLowerCase()) {
    case "paid":
    case "completed":
    case "excellent":
    case "active":
      return "success";

    case "pending":
    case "due":
    case "average":
      return "warning";

    case "overdue":
    case "failed":
    case "cancelled":
    case "attention":
      return "danger";

    case "draft":
      return "neutral";

    default:
      return "info";
  }
}

export default function StatusBadge({
  status,
  label,
  variant,
  size = "md",
  dot = true,
  className,
}: StatusBadgeProps) {
  const finalLabel = label ?? status ?? "";

  const finalVariant =
    variant ??
    (status
      ? mapStatusToVariant(status)
      : "neutral");

  const style = variants[finalVariant];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border font-medium tracking-wide",

        sizes[size],

        style.container,

        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            "h-2 w-2 rounded-full",
            style.dot
          )}
        />
      )}

      {finalLabel}
    </span>
  );
}