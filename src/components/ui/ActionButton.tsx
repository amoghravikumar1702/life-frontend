import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function ActionButton({
  variant = "secondary",
  className,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        `
          inline-flex
          min-h-10
          items-center
          justify-center
          gap-2
          rounded-xl
          px-4
          py-2.5
          text-xs
          font-medium
          whitespace-nowrap
          transition-all
          duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-[#D4AF37]/25
          focus:ring-offset-0
          disabled:cursor-not-allowed
          disabled:opacity-50
          active:scale-[0.98]
        `,
        variant === "primary"
          ? `
              border
              border-[#D4AF37]/20
              bg-[#D4AF37]
              text-[#090909]
              shadow-[0_8px_24px_rgba(212,175,55,0.14)]
              hover:scale-[1.01]
              hover:bg-[#E3C45A]
              hover:shadow-[0_10px_28px_rgba(212,175,55,0.18)]
            `
          : `
              border
              border-white/[0.07]
              bg-white/[0.025]
              text-zinc-300
              hover:border-[#D4AF37]/20
              hover:bg-[#D4AF37]/[0.05]
              hover:text-[#D4AF37]
            `,
        className
      )}
    >
      {children}
    </button>
  );
}