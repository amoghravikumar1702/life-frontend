"use client";

import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
        className="
          absolute
          -left-40
          -top-40
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#D4AF37]/[0.025]
          blur-[120px]
        "
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.5,
          delay: 0.15,
          ease: "easeOut",
        }}
        className="
          absolute
          right-[-180px]
          top-[18%]
          h-[460px]
          w-[460px]
          rounded-full
          bg-white/[0.018]
          blur-[130px]
        "
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1.8,
          delay: 0.25,
          ease: "easeOut",
        }}
        className="
          absolute
          bottom-[-220px]
          left-[30%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#D4AF37]/[0.018]
          blur-[140px]
        "
      />

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/[0.08]
          to-transparent
        "
      />
    </div>
  );
}