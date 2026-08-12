"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;

  className?: string;

  hover?: boolean;

  elevated?: boolean;

  padding?: "none" | "sm" | "md" | "lg";

  onClick?: () => void;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className,
  hover = false,
  elevated = false,
  padding = "lg",
  onClick,
}: CardProps) {
  return (
    <motion.div
      layout
      onClick={onClick}
      whileHover={
        hover
          ? {
              y: -4,
              scale: 1.01,
            }
          : undefined
      }
      transition={{
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={clsx(
        "relative overflow-hidden rounded-3xl",

        elevated ? "bg-[#14171B]" : "bg-[#101214]",

        "border border-white/[0.06]",

        "shadow-[0_10px_40px_rgba(0,0,0,0.28)]",

        "backdrop-blur-xl",

        paddingClasses[padding],

        hover &&
          "cursor-pointer transition-colors duration-200 hover:bg-[#14171B]",

        className
      )}
    >
      {children}
    </motion.div>
  );
}