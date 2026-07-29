"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type KPICardProps = {
  title: string;
  value: string;
  href: string;
  subtitle?: string;
};

export default function KPICard({
  title,
  value,
  href,
  subtitle,
}: KPICardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:bg-white/[0.05]"
    >
      {/* Gold Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8A8A8F]">
              {title}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {value}
            </h2>

            {subtitle && (
              <p className="mt-2 text-sm text-[#8A8A8F]">
                {subtitle}
              </p>
            )}
          </div>

          <ArrowUpRight
            size={18}
            className="text-[#8A8A8F] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#D4AF37]"
          />
        </div>
      </div>
    </Link>
  );
}