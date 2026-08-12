"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Navigation from "./Navigation";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({
  open,
  onClose,
}: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />

          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
            className="
              fixed
              left-0
              top-0
              z-50
              flex
              h-screen
              w-[300px]
              flex-col
              border-r
              border-white/10
              bg-[#0A0A0B]
            "
          >
            <div className="flex h-[70px] items-center justify-between border-b border-white/10 px-6">
              <div>
                <h1 className="text-xl font-semibold text-white">
                  ArkenOne
                </h1>

                <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                  Financial OS
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-5">
              <Navigation
                mobile
                onNavigate={onClose}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}