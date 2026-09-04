import type { Metadata } from "next";
import Link from "next/link";
import DhanarkLogo from "@/components/brand/DhanarkLogo";

export const metadata: Metadata = {
  title: "Cookie Policy — DhanarkOS",
  description:
    "Read the DhanarkOS Cookie Policy to understand how cookies and similar technologies are used for authentication, security, sessions and platform functionality.",
  alternates: {
    canonical: "https://dhanark.com/cookies",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#070809] text-white">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070809]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="DhanarkOS home">
            <DhanarkLogo
              variant="full"
              href=""
              priority
              className="h-8 w-auto"
            />
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-[11px] font-semibold text-black transition hover:bg-[#E2C04A]"
          >
            Get Started
          </Link>
        </div>
      </header>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Legal
            </p>

            <h1 className="mt-4 text-4xl font-light tracking-[-0.04em] sm:text-5xl">
              Cookie Policy
            </h1>

            <p className="mt-4 text-sm text-zinc-600">
              Last updated: August 31, 2026
            </p>
          </div>

          <div className="space-y-10 text-sm leading-7 text-zinc-400">
            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                1. What Are Cookies?
              </h2>

              <p className="mt-3">
                Cookies are small text files or similar technologies stored on
                your device when you visit or use a website. They can help
                websites remember information and provide functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                2. How DhanarkOS Uses Cookies
              </h2>

              <p className="mt-3">
                DhanarkOS may use cookies and similar technologies for
                authentication, security, maintaining sessions, remembering
                necessary preferences and supporting core platform
                functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                3. Essential Cookies
              </h2>

              <p className="mt-3">
                Some cookies may be necessary for DhanarkOS to function
                correctly. These may support authentication, security and
                account sessions.
              </p>

              <p className="mt-3">
                Disabling essential cookies may prevent certain parts of the
                platform from working properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                4. Analytics and Optional Technologies
              </h2>

              <p className="mt-3">
                If DhanarkOS introduces analytics, performance monitoring,
                advertising or other non-essential tracking technologies in the
                future, this Cookie Policy may be updated and, where required,
                appropriate consent mechanisms may be provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                5. Third-Party Services
              </h2>

              <p className="mt-3">
                Third-party services used by DhanarkOS may use cookies or
                similar technologies as part of providing their services.
                These may include infrastructure, authentication, payment and
                AI service providers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                6. Managing Cookies
              </h2>

              <p className="mt-3">
                Most modern browsers allow you to control or delete cookies
                through browser settings.
              </p>

              <p className="mt-3">
                Please note that disabling certain cookies may affect the
                functionality of DhanarkOS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                7. Updates
              </h2>

              <p className="mt-3">
                We may update this Cookie Policy when our technology,
                functionality or legal requirements change.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                8. Contact
              </h2>

              <p className="mt-3">
                Questions about cookies or privacy can be sent to:
              </p>

              <p className="mt-3 font-medium text-zinc-200">
                dhanarksupport@gmail.com
              </p>
            </section>
          </div>

          <div className="mt-16 border-t border-white/[0.06] pt-8">
            <div className="flex flex-wrap gap-5 text-xs text-zinc-600">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>

              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>

              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>

              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>

              <Link href="/" className="hover:text-white">
                DhanarkOS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}