// src/components/ui/PageContainer.tsx

import AmbientBackground from "./AmbientBackground";

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05070C]">
      {/* Ambient Background */}
      <AmbientBackground />

      {/* Layer 1 — Executive gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at top,
              rgba(255,255,255,.03),
              transparent 40%
            ),
            linear-gradient(
              180deg,
              #090C12 0%,
              #06080D 45%,
              #040506 100%
            )
          `,
        }}
      />

      {/* Layer 2 — Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,.02) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.02) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div
        className="
          relative
          z-10
          w-full
          px-3
          pb-6
          sm:px-4
          sm:pb-8
          md:px-6
          lg:px-8
          lg:pb-8
          xl:px-12
        "
      >
        <div
          className="
            flex
            w-full
            min-w-0
            flex-col
            gap-4
            sm:gap-5
            lg:gap-6
          "
        >
          {children}
        </div>
      </div>
    </main>
  );
}