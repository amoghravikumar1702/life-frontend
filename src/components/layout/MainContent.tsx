"use client";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({
  children,
}: MainContentProps) {
  return (
    <main
      className="
        w-full
        px-3
        pb-8
        pt-4
        sm:px-5
        sm:pt-5
        lg:px-5
        lg:pb-10
      "
    >
      <div className="mx-auto w-full max-w-[1800px]">
        {children}
      </div>
    </main>
  );
}