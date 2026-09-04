import type { Metadata } from "next";
import Link from "next/link";
import DhanarkLogo from "@/components/brand/DhanarkLogo";

export const metadata: Metadata = {
  title: "Privacy Policy — DhanarkOS",
  description:
    "Read the DhanarkOS Privacy Policy to understand how account, business, financial and AI-related information is collected, used and protected.",
  alternates: {
    canonical: "https://dhanark.com/privacy",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>

            <p className="mt-4 text-sm text-zinc-600">
              Last updated: August 31, 2026
            </p>
          </div>

          <div className="space-y-10 text-sm leading-7 text-zinc-400">
            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                1. Introduction
              </h2>

              <p className="mt-3">
                DhanarkOS is a financial operating system operated by Amogh
                Ravikumar in India. This Privacy Policy explains how DhanarkOS
                collects, uses, protects and handles information when you use
                the DhanarkOS platform and related services.
              </p>

              <p className="mt-3">
                By creating an account or using DhanarkOS, you acknowledge that
                you have read and understood this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                2. Information We Collect
              </h2>

              <p className="mt-3">
                The information collected depends on how you use the platform.
              </p>

              <h3 className="mt-5 font-medium text-zinc-200">
                Account information
              </h3>

              <p className="mt-2">
                When you create an account, DhanarkOS collects your email
                address and account authentication information, including your
                password in securely managed form.
              </p>

              <h3 className="mt-5 font-medium text-zinc-200">
                Business information
              </h3>

              <p className="mt-2">
                During onboarding, you may provide information such as your
                business name, financial revenue information, business field,
                customer information, customer lists, payment methods and
                related financial information required to operate your
                workspace.
              </p>

              <h3 className="mt-5 font-medium text-zinc-200">
                Payment information
              </h3>

              <p className="mt-2">
                Payments may be processed through third-party payment
                providers. DhanarkOS does not directly store your complete
                payment-card information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                3. How We Use Information
              </h2>

              <p className="mt-3">
                Information may be used to provide, maintain and improve
                DhanarkOS, authenticate accounts, operate financial features,
                provide AI-powered insights, process payments, provide
                customer support, prevent abuse and maintain platform security.
              </p>

              <p className="mt-3">
                Information is not collected for the purpose of selling your
                personal or business information to advertisers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                4. Financial and Business Data
              </h2>

              <p className="mt-3">
                Information entered into a DhanarkOS workspace is intended to
                remain private to the customer and their authorized workspace
                users.
              </p>

              <p className="mt-3">
                DhanarkOS does not claim ownership of your business,
                financial, customer or operational data. You retain ownership
                of the information you provide.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                5. AI-Powered Intelligence
              </h2>

              <p className="mt-3">
                DhanarkOS may use artificial intelligence to analyze information
                provided within your workspace and generate insights,
                summaries, suggestions and other financial intelligence.
              </p>

              <div className="mt-4 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-5 text-zinc-300">
                <strong className="font-medium text-[#D4AF37]">
                  Important AI Notice:
                </strong>{" "}
                DhanarkOS AI Intelligence can make mistakes, produce
                incomplete or inaccurate information, and should not be treated
                as a substitute for professional financial, accounting, tax or
                legal advice. You should independently verify important
                financial decisions before acting on AI-generated information.
              </div>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                6. Third-Party Services
              </h2>

              <p className="mt-3">
                DhanarkOS relies on selected third-party infrastructure and
                service providers, including:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Supabase for authentication and data infrastructure.</li>
                <li>Razorpay for payment processing.</li>
                <li>OpenAI for AI-powered functionality.</li>
              </ul>

              <p className="mt-4">
                These providers may process information as necessary to provide
                their services and are subject to their own privacy policies
                and terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                7. AI Data Processing
              </h2>

              <p className="mt-3">
                Information required to generate an AI response may be sent to
                our AI service provider. DhanarkOS aims to send only the
                information reasonably necessary for the requested AI
                functionality.
              </p>

              <p className="mt-3">
                DhanarkOS does not intentionally send unnecessary sensitive
                information to AI providers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                8. Data Security
              </h2>

              <p className="mt-3">
                DhanarkOS uses reasonable technical and organizational
                safeguards designed to protect information against
                unauthorized access, loss, misuse or alteration.
              </p>

              <p className="mt-3">
                However, no internet-based system can guarantee absolute
                security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                9. Account Deletion
              </h2>

              <p className="mt-3">
                You may request deletion of your DhanarkOS account and
                associated information.
              </p>

              <p className="mt-3">
                Once an account deletion request is processed, DhanarkOS will
                delete or anonymize information associated with the account
                where reasonably possible, subject to information that must be
                retained for legal, security, fraud-prevention or accounting
                purposes.
              </p>

              <p className="mt-3">
                DhanarkOS does not retain your business data simply for its own
                continued use after you have deleted your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                10. Cookies and Similar Technologies
              </h2>

              <p className="mt-3">
                DhanarkOS may use cookies or similar technologies where
                necessary for authentication, security, functionality and
                improving the user experience.
              </p>

              <p className="mt-3">
                See our{" "}
                <Link
                  href="/cookies"
                  className="text-[#D4AF37] hover:underline"
                >
                  Cookie Policy
                </Link>{" "}
                for additional information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                11. Your Choices
              </h2>

              <p className="mt-3">
                You may access, update or request deletion of information
                associated with your account, subject to applicable legal and
                operational requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                12. Contact
              </h2>

              <p className="mt-3">
                For privacy-related questions or requests, contact:
              </p>

              <p className="mt-3 font-medium text-zinc-200">
                dhanarksupport@gmail.com
              </p>
            </section>
          </div>

          <div className="mt-16 border-t border-white/[0.06] pt-8">
            <div className="flex flex-wrap gap-5 text-xs text-zinc-600">
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>

              <Link href="/cookies" className="hover:text-white">
                Cookie Policy
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