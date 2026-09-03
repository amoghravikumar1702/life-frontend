import Link from "next/link";
import { sendPasswordReset } from "./actions";

interface ForgotPasswordPageProps {
  searchParams: Promise<{
    sent?: string;
  }>;
}

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;
  const sent = params.sent === "true";

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#090A0B] text-white">
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-[-280px] h-[560px] w-[760px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.045] blur-[140px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md rounded-[32px] border border-white/[0.08] bg-white/[0.025] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10 lg:p-12">
          
          {/* Brand */}
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
              <span className="text-sm font-semibold text-[#D4AF37]">
                A
              </span>
            </div>

            <span className="text-lg font-medium text-zinc-100">
              DhanarkOS
            </span>
          </div>

          {sent ? (
            <>
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
                Check your inbox
              </p>

              <h1 className="mt-4 text-3xl font-light tracking-[-0.03em] text-zinc-100 sm:text-4xl">
                Reset link sent
              </h1>

              <p className="mt-4 text-sm leading-7 text-zinc-500">
                If an account exists for that email,
                we've sent instructions to reset your
                password.
              </p>

              <Link
                href="/login"
                className="mt-8 flex h-14 w-full items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-zinc-200 transition hover:border-[#D4AF37]/30 hover:bg-white/[0.05]"
              >
                Back to Sign In
              </Link>
            </>
          ) : (
            <>
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
                Account Recovery
              </p>

              <h1 className="mt-4 text-3xl font-light tracking-[-0.03em] text-zinc-100 sm:text-4xl">
                Forgot password?
              </h1>

              <p className="mt-4 text-sm leading-7 text-zinc-500">
                Enter the email associated with your
                DhanarkOS workspace and we'll send you
                a secure password reset link.
              </p>

              <form
                action={sendPasswordReset}
                className="mt-9"
              >
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

                <button
                  type="submit"
                  className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#090A0B] transition duration-200 hover:brightness-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.12)] active:scale-[0.995]"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="mt-7 border-t border-white/[0.06] pt-7 text-center">
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#D4AF37] transition hover:text-[#E5C65A]"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.25em] text-zinc-700">
            Secure financial workspace
          </p>
        </div>
      </div>
    </main>
  );
}