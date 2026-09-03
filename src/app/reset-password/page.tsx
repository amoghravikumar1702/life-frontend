"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [supabase] = useState(() =>
    createClient()
  );

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeRecovery = async () => {
      /*
       * When Supabase redirects the user back after
       * clicking the password-reset email, it establishes
       * a PASSWORD_RECOVERY session in the browser.
       */

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setReady(true);
        return;
      }

      /*
       * Listen for the recovery event in case the session
       * is established immediately after page load.
       */
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (
            event === "PASSWORD_RECOVERY" &&
            session
          ) {
            setReady(true);
          }
        }
      );

      /*
       * Give Supabase a moment to process the
       * recovery session from the email link.
       */
      setTimeout(async () => {
        if (!mounted) return;

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (currentSession) {
          setReady(true);
        } else {
          setError(
            "Your password reset link is invalid or has expired. Please request a new reset link."
          );
        }
      }, 1000);

      return () => {
        subscription.unsubscribe();
      };
    };

    initializeRecovery();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const formData = new FormData(
      event.currentTarget
    );

    const password = String(
      formData.get("password") ?? ""
    );

    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    );

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    const { error: updateError } =
      await supabase.auth.updateUser({
        password,
      });

    if (updateError) {
      console.error(
        "[Reset Password] Update error:",
        updateError
      );

      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    /*
     * Sign out the recovery session so the user
     * explicitly signs in with the new password.
     */
    await supabase.auth.signOut();
  }

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

          {success ? (
            <>
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
                Password Updated
              </p>

              <h1 className="mt-4 text-3xl font-light tracking-[-0.03em] text-zinc-100 sm:text-4xl">
                You're all set.
              </h1>

              <p className="mt-4 text-sm leading-7 text-zinc-500">
                Your DhanarkOS password has been
                successfully updated. Sign in using
                your new password.
              </p>

              <Link
                href="/login"
                className="mt-8 flex h-14 w-full items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#090A0B] transition duration-200 hover:brightness-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.12)]"
              >
                Continue to Sign In
              </Link>
            </>
          ) : (
            <>
              <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
                Secure Recovery
              </p>

              <h1 className="mt-4 text-3xl font-light tracking-[-0.03em] text-zinc-100 sm:text-4xl">
                Set new password
              </h1>

              <p className="mt-4 text-sm leading-7 text-zinc-500">
                Choose a new password for your
                DhanarkOS account.
              </p>

              {!ready && !error && (
                <div className="mt-9 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 text-sm text-zinc-500">
                  Verifying your password reset
                  session...
                </div>
              )}

              {ready && (
                <form
                  onSubmit={handleSubmit}
                  className="mt-9 space-y-5"
                >
                  {/* New password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2.5 block text-xs font-medium uppercase tracking-[0.18em] text-zinc-500"
                    >
                      New Password
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Minimum 8 characters"
                      className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/40 focus:bg-black/30 focus:ring-1 focus:ring-[#D4AF37]/10"
                    />
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2.5 block text-xs font-medium uppercase tracking-[0.18em] text-zinc-500"
                    >
                      Confirm Password
                    </label>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Enter password again"
                      className="h-14 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-[#D4AF37]/40 focus:bg-black/30 focus:ring-1 focus:ring-[#D4AF37]/10"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm leading-6 text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#090A0B] transition duration-200 hover:brightness-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Updating..."
                      : "Update Password"}
                  </button>
                </form>
              )}

              {error && !ready && (
                <Link
                  href="/forgot-password"
                  className="mt-6 flex h-14 w-full items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-zinc-200 transition hover:border-[#D4AF37]/30 hover:bg-white/[0.05]"
                >
                  Request New Reset Link
                </Link>
              )}

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