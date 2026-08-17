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
          {/* BACKDROP */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="
              fixed
              inset-0
              z-40
              bg-black/75
              backdrop-blur-[3px]
              lg:hidden
            "
          />

          {/* DRAWER */}

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 30,
              mass: 0.8,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="
              fixed
              inset-y-0
              left-0
              z-50
              flex
              w-[min(300px,calc(100vw-28px))]
              flex-col
              overflow-hidden
              border-r
              border-white/[0.07]
              bg-[#090A0C]
              shadow-2xl
              shadow-black/50
              lg:hidden
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                min-h-[72px]
                shrink-0
                items-center
                justify-between
                border-b
                border-white/[0.06]
                px-5
                pb-3
                pt-[max(12px,env(safe-area-inset-top))]
              "
            >
              <div className="min-w-0">
                <h1
                  className="
                    text-[19px]
                    font-semibold
                    tracking-[-0.03em]
                    text-white
                  "
                >
                  ArkenOne
                </h1>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.28em]
                    text-zinc-600
                  "
                >
                  Financial OS
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/[0.06]
                  bg-white/[0.025]
                  text-zinc-400
                  transition-all
                  duration-200
                  active:scale-95
                  hover:bg-white/[0.06]
                  hover:text-white
                "
              >
                <X
                  size={19}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {/* NAVIGATION */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overscroll-contain
                px-4
                py-5
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              <Navigation
                mobile
                onNavigate={onClose}
              />
            </div>

            {/* FOOTER */}

            <div
              className="
                shrink-0
                border-t
                border-white/[0.05]
                px-5
                pb-[max(16px,env(safe-area-inset-bottom))]
                pt-4
              "
            >
              <div
                className="
                  rounded-2xl
                  border
                  border-[#D4AF37]/10
                  bg-[#D4AF37]/[0.025]
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-[#D4AF37]
                  "
                >
                  ARKENONE
                </p>

                <p className="mt-1 text-[11px] text-zinc-600">
                  Executive Financial OS
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}