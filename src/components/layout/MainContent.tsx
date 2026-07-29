"use client";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({
  children,
}: MainContentProps) {
  return (
    <main className="flex-1 overflow-hidden">
      <div
        className="
          w-full
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
          2xl:px-12
          py-6
        "
      >
        {children}
      </div>
    </main>
  );
}