export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold tracking-wide text-white">
          NEXORA
        </h1>

        <div className="flex items-center gap-8 text-gray-300">
          <a href="#" className="hover:text-white transition">
            Features
          </a>

          <a href="#" className="hover:text-white transition">
            Pricing
          </a>

          <a href="#" className="hover:text-white transition">
            Contact
          </a>

          <button className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}