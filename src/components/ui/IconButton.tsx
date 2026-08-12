"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface IconButtonProps {
  icon: ReactNode;

  onClick?: () => void;

  ariaLabel: string;

  title?: string;

  size?: "sm" | "md" | "lg";

  variant?: "default" | "primary" | "danger";

  disabled?: boolean;

  className?: string;

  type?: "button" | "submit" | "reset";
}

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const variantClasses = {
  default:
    "border border-white/[0.06] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] hover:text-white",

  primary:
    "border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20",

  danger:
    "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20",
};

export default function IconButton({
  icon,
  onClick,
  ariaLabel,
  title,
  size = "md",
  variant = "default",
  disabled = false,
  className,
  type = "button",
}: IconButtonProps) {
  return (
    <motion.button
      whileHover={
        disabled
          ? undefined
          : {
              y: -2,
              scale: 1.04,
            }
      }
      whileTap={
        disabled
          ? undefined
          : {
              scale: 0.96,
            }
      }
      transition={{
        duration: 0.18,
      }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={clsx(
        "inline-flex items-center justify-center rounded-2xl",

        "transition-all duration-200",

        "disabled:cursor-not-allowed disabled:opacity-50",

        sizeClasses[size],

        variantClasses[variant],

        className
      )}
    >
      {icon}
    </motion.button>
  );
}