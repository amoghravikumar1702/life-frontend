"use client";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0C]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <div className="text-xl font-semibold tracking-tight text-white">
          DhanarkOS
        </div>

        <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
          <a href="#">Product</a>
          <a href="#">Solutions</a>
          <a href="#">Pricing</a>
          <a href="#">Resources</a>
        </nav>

        <button className="rounded-xl bg-white px-5 py-2 text-sm font-medium text-black transition hover:opacity-90">
          Start Free
        </button>
      </div>
    </header>
  );
}