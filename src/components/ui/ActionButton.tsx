import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function ActionButton({
  variant = "primary",
  className,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary"
          ? "bg-[#D4AF37] text-black hover:bg-[#E3C45A]"
          : "border border-white/10 bg-white/[0.02] text-white hover:border-[#D4AF37]/30 hover:bg-white/[0.04]",
        className
      )}
    >
      {children}
    </button>
  );
}