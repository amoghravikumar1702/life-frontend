"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

export default function Stagger({
  children,
  className,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
    >
      {children}
    </motion.div>
  );
}