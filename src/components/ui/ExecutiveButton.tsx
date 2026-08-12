import Link from "next/link";
import { ReactNode, MouseEventHandler } from "react";
import clsx from "clsx";

interface ExecutiveButtonProps {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export default function ExecutiveButton({
  href,
  children,
  variant = "primary",
  className,
  onClick,
  disabled,
}: ExecutiveButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition-all duration-300",
    variant === "primary"
      ? "bg-[#D4AF37] text-black hover:scale-[1.02]"
      : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]",
    disabled && "cursor-not-allowed opacity-50 hover:scale-100",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}