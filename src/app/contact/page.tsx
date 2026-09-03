import Link from "next/link";
import DhanarkLogo from "@/components/brand/DhanarkLogo";
import {
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#070809] text-white">
      <header className="border-b border-white/[0.06] bg-[#090A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/">
            <DhanarkLogo
              variant="full"
              href=""
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          <Link
            href="/"
            className="text-xs text-zinc-500 transition hover:text-white"
          >
            Back to DhanarkOS
          </Link>
        </div>
      </header>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Contact
            </p>

            <h1 className="mt-4 text-4xl font-light tracking-[-0.04em] sm:text-5xl">
              We&apos;re here to help.
            </h1>

            <p className="mt-5 text-sm leading-7 text-zinc-500">
              Whether you need support, have a privacy question or want to
              learn more about DhanarkOS, reach out to us directly.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <a
              href="mailto:dhanarksupport@gmail.com"
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 transition hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/[0.025]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
                <Mail size={17} className="text-[#D4AF37]" />
              </div>

              <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
                Support
              </p>

              <h2 className="mt-2 text-sm font-medium text-zinc-200">
                dhanarksupport@gmail.com
              </h2>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Account, product and general support.
              </p>
            </a>

            <a
              href="mailto:dhanarkos@gmail.com"
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 transition hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/[0.025]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
                <ShieldCheck size={17} className="text-[#D4AF37]" />
              </div>

              <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
                General
              </p>

              <h2 className="mt-2 text-sm font-medium text-zinc-200">
                dhanarkos@gmail.com
              </h2>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                General enquiries and business communication.
              </p>
            </a>
          </div>

          <div className="mt-3 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025]">
              <MapPin size={17} className="text-zinc-400" />
            </div>

            <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
              Business Location
            </p>

            <h2 className="mt-2 text-sm font-medium text-zinc-200">
              Bengaluru, Karnataka, India
            </h2>

            <p className="mt-2 max-w-lg text-xs leading-5 text-zinc-600">
              DhanarkOS is currently operated from Bengaluru, India.
              DhanarkOS is not currently represented as a formally registered
              company.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-5 border-t border-white/[0.055] pt-7 text-xs text-zinc-600">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>

            <Link href="/terms" className="transition hover:text-white">
              Terms of Service
            </Link>

            <Link href="/cookies" className="transition hover:text-white">
              Cookie Policy
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.055] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/">
            <DhanarkLogo
              variant="wordmark"
              href=""
              className="h-7 w-auto"
            />
          </Link>

          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} DhanarkOS. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}