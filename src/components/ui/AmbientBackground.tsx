"use client";

import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* Purple */}

      <motion.div
        animate={{
          x: [-40, 20, -40],
          y: [-20, 30, -20],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-72 right-[-220px] h-[850px] w-[850px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(111,91,255,.24) 0%, rgba(111,91,255,.08) 40%, transparent 75%)",
          filter: "blur(220px)",
        }}
      />

      {/* Blue */}

      <motion.div
        animate={{
          x: [30, -30, 30],
          y: [40, -20, 40],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[35%] left-[-250px] h-[900px] w-[900px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,.18) 0%, rgba(37,99,235,.06) 40%, transparent 75%)",
          filter: "blur(240px)",
        }}
      />

      {/* Gold */}

      <motion.div
        animate={{
          x: [-15, 35, -15],
          y: [10, -30, 10],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-280px] right-[15%] h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,.18) 0%, rgba(212,175,55,.06) 40%, transparent 75%)",
          filter: "blur(180px)",
        }}
      />

      {/* Center Light */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,.03), transparent 60%)",
        }}
      />

      {/* Vignette */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,.65) 100%)",
        }}
      />

    </div>
  );
}