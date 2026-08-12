"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;

  glow?: "purple" | "blue" | "gold" | "green" | "none";

  strength?: "low" | "medium" | "high";
}

const glowMap = {
  purple: {
    color: "111,91,255",
  },
  blue: {
    color: "37,99,235",
  },
  gold: {
    color: "212,175,55",
  },
  green: {
    color: "34,197,94",
  },
};

export default function GlowCard({
  children,
  className,
  hover = true,
  glow = "none",
  strength = "medium",
}: GlowCardProps) {
  const opacity =
    strength === "high"
      ? 0.14
      : strength === "medium"
      ? 0.09
      : 0.05;

  return (
    <div className="relative isolate">
      {glow !== "none" && (
        <>
          {/* Premium Edge Lighting */}

          <div
            className="absolute inset-0 -z-10 rounded-[34px]"
            style={{
              background: `
                linear-gradient(
                  145deg,
                  rgba(${glowMap[glow].color},${opacity}),
                  transparent 22%,
                  transparent 78%,
                  rgba(${glowMap[glow].color},${opacity * 0.6})
                )
              `,
            }}
          />
                  </>
      )}

      <div
        className={clsx(
          "relative overflow-hidden",
          "rounded-[34px]",
          "border border-white/[0.06]",
          "bg-[#0D1117]/92",
          "backdrop-blur-3xl",
          "shadow-[0_12px_32px_rgba(0,0,0,.28)]",
          "transition-all duration-300",
          hover &&
            "hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(0,0,0,.34)]",
          className
        )}
      >
        {/* Top Edge Highlight */}

        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,.18) 50%, transparent 100%)",
          }}
        />

        {/* Inner Matte Layer */}

        <div className="absolute inset-0 bg-white/[0.015]" />

        {/* Content */}

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}