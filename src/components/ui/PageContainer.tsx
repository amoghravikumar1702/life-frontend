import AmbientBackground from "./AmbientBackground";

interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <main className="relative min-h-screen bg-[#05070C]">
      {/* Ambient Background */}
      <AmbientBackground />

      {/* Layer 1 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at top, rgba(255,255,255,.03), transparent 40%),
            linear-gradient(180deg,#090C12 0%,#06080D 45%,#040506 100%)
          `,
        }}
      />

      {/* Layer 2 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-8 pb-8 lg:px-12">
        <div className="flex w-full flex-col gap-6">
          {children}
        </div>
      </div>
    </main>
  );
}