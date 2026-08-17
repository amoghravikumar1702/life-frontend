import Link from "next/link";
import { signUp } from "./actions";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#090A0B] text-white">
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-[-280px] h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.045] blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-240px] left-[-180px] h-[460px] w-[460px] rounded-full bg-[#D4AF37]/[0.025] blur-[130px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
          {/* Signup */}
          <div className="flex items-center p-7 sm:p-10 lg:p-12 xl:p-16">
            <form action={signUp} className="w-full">
              {/* Mobile brand */}
              <div className="mb-12 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
                  <span className="text-sm font-semibold text-[#D4AF37]">
                    A
                  </span>
                </div>

                <span className="text-lg font-medium text-zinc-100">
                  ArkenOne
                </span>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
                  Get Started
                </p>

                <h1 className="mt-4 text-3xl font-light tracking-[-0.03em] text-zinc-100 sm:text-4xl">
                  Build your command center
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
                  Create your ArkenOne account and bring your
                  business finances into one intelligent workspace.
                </p>
              </div>

              <div className="mt-9 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-xs font-medium uppercase tracking-[0.18em] text-zinc-500"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/40 focus:bg-black/30 focus:ring-1 focus:ring-[#D4AF37]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2.5 block text-xs font-medium uppercase tracking-[0.18em] text-zinc-500"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/40 focus:bg-black/30 focus:ring-1 focus:ring-[#D4AF37]/10"
                  />

                  <p className="mt-2 text-[11px] text-zinc-700">
                    Minimum 6 characters
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 flex h-14 w-full items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#090A0B] transition duration-200 hover:brightness-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.12)] active:scale-[0.995]"
              >
                Create Account
              </button>

              <div className="mt-7 border-t border-white/[0.06] pt-7 text-center">
                <p className="text-sm text-zinc-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-[#D4AF37] transition hover:text-[#E5C65A]"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <p className="mt-8 text-center text-[10px] uppercase tracking-[0.25em] text-zinc-700">
                Your financial workspace starts here
              </p>
            </form>
          </div>

          {/* Brand panel */}
          <div className="relative hidden overflow-hidden border-l border-white/[0.06] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
            <div className="pointer-events-none absolute bottom-[-180px] right-[-140px] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/[0.035] blur-[120px]" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
                  <span className="text-sm font-semibold tracking-tight text-[#D4AF37]">
                    A
                  </span>
                </div>

                <span className="text-lg font-medium tracking-[-0.02em] text-zinc-100">
                  ArkenOne
                </span>
              </div>

              <div className="mt-20 max-w-md">
                <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#D4AF37]">
                  AI-Powered Finance
                </p>

                <h2 className="mt-5 text-4xl font-light leading-[1.12] tracking-[-0.035em] text-zinc-100 xl:text-5xl">
                  Think like a CFO.
                  <br />
                  <span className="text-zinc-500">
                    Move like a founder.
                  </span>
                </h2>

                <p className="mt-7 max-w-sm text-sm leading-7 text-zinc-500">
                  Track performance, understand your financial
                  position, and ask your AI CFO what to do next.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="h-px w-16 bg-[#D4AF37]/50" />

              <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                ArkenOne Executive Intelligence
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}