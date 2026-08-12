import { ReactNode } from "react";
import clsx from "clsx";

interface SurfaceProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Surface({
  children,
  className,
  hover = true,
}: SurfaceProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden",
        "rounded-[34px]",
        "border border-white/[0.07]",
        "bg-[linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.018))]",
        "backdrop-blur-3xl",
        "shadow-[0_25px_80px_rgba(0,0,0,.45)]",
        "transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
        hover &&
          "hover:-translate-y-[3px] hover:border-white/10 hover:shadow-[0_35px_90px_rgba(0,0,0,.55)]",
        className
      )}
    >
      {/* Top highlight */}

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Soft reflection */}

      <div className="absolute -top-20 left-1/2 h-52 w-[140%] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}