import Link from "next/link";
import DhanarkLogo from "@/components/brand/DhanarkLogo";
import PasswordField from "@/components/Auth/PasswordField";

import { signUp } from "./actions";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function SignupPage({
  searchParams,
}: SignupPageProps) {
  const params = await searchParams;

  const error = params.error;
  const success = params.success;

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#090A0B] text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-280px] h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.045] blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-240px] left-[-180px] h-[460px] w-[460px] rounded-full bg-[#D4AF37]/[0.025] blur-[130px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex items-center p-7 sm:p-10 lg:p-12 xl:p-16">
            <form action={signUp} className="w-full">
              <div className="mb-12 flex items-center lg:hidden">
                <DhanarkLogo
                  variant="full"
                  href="/"
                  className="h-10 w-auto"
                  priority
                />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
                  Get Started
                </p>

                <h1 className="mt-4 text-3xl font-light tracking-[-0.03em] text-zinc-100 sm:text-4xl">
                  Build your command center
                </h1>

                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
                  Create your DhanarkOS account and bring your business
                  finances into one intelligent workspace.
                </p>
              </div>

              {error && (
                <div className="mt-7 rounded-2xl border border-red-500/15 bg-red-500/[0.04] px-4 py-3.5">
                  <p className="text-xs leading-5 text-red-300">
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="mt-7 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3.5">
                  <p className="text-xs leading-5 text-emerald-300">
                    {success}
                  </p>
                </div>
              )}

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

                  <PasswordField />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/[0.055] bg-white/[0.018] px-4 py-3.5">
                <input
                  id="legal-consent"
                  name="legal-consent"
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-black/30 accent-[#D4AF37]"
                />

                <label
                  htmlFor="legal-consent"
                  className="cursor-pointer text-[11px] leading-5 text-zinc-500"
                >
                  I agree to DhanarkOS&apos;s{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-300 underline decoration-white/20 underline-offset-2 transition hover:text-[#D4AF37]"
                  >
                    Terms of Service
                  </Link>{" "}
                  and acknowledge the{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-300 underline decoration-white/20 underline-offset-2 transition hover:text-[#D4AF37]"
                  >
                    Privacy Policy
                  </Link>{" "}
                  ,{" "}
                  <Link
                    href="/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-300 underline decoration-white/20 underline-offset-2 transition hover:text-[#D4AF37]"
                  >
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/refund-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-300 underline decoration-white/20 underline-offset-2 transition hover:text-[#D4AF37]"
                  >
                    Refund Policy
                  </Link>
                  .
                </label>
              </div>

              <p className="mt-4 text-[10px] leading-5 text-zinc-700">
                DhanarkOS AI Intelligence is designed to assist with
                financial understanding and decision-making. AI-generated
                information may contain errors or inaccuracies and should
                not be treated as professional financial, accounting, tax,
                or legal advice. Always verify important information before
                making business decisions.
              </p>

              <button
                type="submit"
                className="mt-5 flex h-14 w-full items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#090A0B] transition duration-200 hover:brightness-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.12)] active:scale-[0.995]"
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

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-zinc-700">
                <Link
                  href="/pricing"
                  className="transition hover:text-zinc-400"
                >
                  Pricing
                </Link>

                <span>•</span>

                <Link
                  href="/terms"
                  className="transition hover:text-zinc-400"
                >
                  Terms
                </Link>

                <span>•</span>

                <Link
                  href="/refund-policy"
                  className="transition hover:text-[#D4AF37]"
                >
                  Refund Policy
                </Link>
              </div>

              <p className="mt-6 text-center text-[10px] uppercase tracking-[0.25em] text-zinc-700">
                Your financial workspace starts here
              </p>
            </form>
          </div>

          <div className="relative hidden overflow-hidden border-l border-white/[0.06] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
            <div className="pointer-events-none absolute bottom-[-180px] right-[-140px] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/[0.035] blur-[120px]" />

            <div className="relative">
              <DhanarkLogo
                variant="full"
                href="/"
                className="h-11 w-auto"
              />

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
                  Track performance, understand your financial position,
                  and ask your AI CFO what to do next.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="h-px w-16 bg-[#D4AF37]/50" />

              <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                DhanarkOS Executive Intelligence
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}