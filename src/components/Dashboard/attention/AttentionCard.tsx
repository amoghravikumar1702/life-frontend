"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { AttentionItem } from "./types";

type Props = {
  item: AttentionItem;
};

const statusStyles = {
  critical: {
    icon: AlertTriangle,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    badge: "border-red-500/20 bg-red-500/10 text-red-300",
    label: "Critical",
  },
  warning: {
    icon: Clock3,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-300",
    badge:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
    label: "Attention",
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badge:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    label: "Healthy",
  },
};

export default function AttentionCard({
  item,
}: Props) {
  const style = statusStyles[item.status];
  const Icon = style.icon;

  return (
    <Link
      href={item.href}
      className="
        group
        flex
        items-center
        justify-between
        rounded-[28px]
        border
        border-white/10
        bg-[rgba(18,18,20,0.55)]
        px-8
        py-7
        backdrop-blur-2xl
        transition-all
        duration-300
        hover:border-[#D4AF37]/25
        hover:bg-white/[0.05]
        hover:-translate-y-0.5
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
      "
    >
      <div className="flex items-start gap-6">
        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${style.iconBg}
            ${style.iconColor}
          `}
        >
          <Icon size={24} strokeWidth={2} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-ui text-xl font-semibold text-white">
              {item.title}
            </h3>

            <span
              className={`
                rounded-full
                border
                px-3
                py-1
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
                ${style.badge}
              `}
            >
              {style.label}
            </span>
          </div>

          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#9E9EA3]">
            {item.description}
          </p>
        </div>
      </div>

      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/[0.03]
          transition-all
          duration-300
          group-hover:border-[#D4AF37]/30
          group-hover:bg-[#D4AF37]/10
        "
      >
        <ArrowUpRight
          size={18}
          className="
            text-[#8A8A8F]
            transition-all
            duration-300
            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
            group-hover:text-[#D4AF37]
          "
        />
      </div>
    </Link>
  );
}