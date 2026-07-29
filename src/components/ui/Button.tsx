import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-xl px-5 py-3",
        "font-semibold",
        "transition-all duration-300",

        variant === "primary"
          ? "bg-[var(--primary)] text-black hover:scale-[1.02] hover:shadow-[var(--shadow-gold)]"
          : "border border-[var(--border)] bg-[var(--glass-bg)] hover:bg-white/10",

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}