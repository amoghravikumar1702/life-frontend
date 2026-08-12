"use client";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({
  children,
}: MainContentProps) {
  return (
    <main className="px-5 pt-5 pb-8 lg:px-5">
      {children}
    </main>
  );
}