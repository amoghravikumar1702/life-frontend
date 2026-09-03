// src/components/ui/PageContainer.tsx

import AmbientBackground from "./AmbientBackground";

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent">
      {/* Ambient Background */}
      <AmbientBackground />

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