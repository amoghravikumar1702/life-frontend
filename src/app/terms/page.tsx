import type { Metadata } from "next";
import Link from "next/link";
import DhanarkLogo from "@/components/brand/DhanarkLogo";

export const metadata: Metadata = {
  title: "Terms of Service — DhanarkOS",
  description:
    "Read the DhanarkOS Terms of Service covering account use, business and financial data, AI-powered financial intelligence, subscriptions, payments and acceptable use.",
  alternates: {
    canonical: "https://dhanark.com/terms",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsPage() {
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
              Terms of Service
            </h1>

            <p className="mt-4 text-sm text-zinc-600">
              Last updated: August 31, 2026
            </p>
          </div>

          <div className="space-y-10 text-sm leading-7 text-zinc-400">
            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                1. Agreement
              </h2>

              <p className="mt-3">
                These Terms of Service govern your access to and use of
                DhanarkOS, a financial operating system operated by Amogh
                Ravikumar in India.
              </p>

              <p className="mt-3">
                By creating an account or using DhanarkOS, you agree to these
                Terms and our{" "}
                <Link
                  href="/privacy"
                  className="text-[#D4AF37] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                2. Eligibility
              </h2>

              <p className="mt-3">
                You must be legally capable of entering into these Terms and
                using the service. If you use DhanarkOS on behalf of a business
                or organization, you represent that you have authority to do
                so.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                3. Your Account
              </h2>

              <p className="mt-3">
                You are responsible for maintaining the confidentiality of
                your account credentials and for activity occurring through
                your account.
              </p>

              <p className="mt-3">
                You must provide accurate information and must not use another
                person's credentials or account without authorization.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                4. Business and Financial Data
              </h2>

              <p className="mt-3">
                You retain ownership of business, financial, customer and
                operational information that you provide to DhanarkOS.
              </p>

              <p className="mt-3">
                You are responsible for ensuring that you have the necessary
                rights and permissions to upload or process information through
                your DhanarkOS workspace.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                5. AI CFO and Financial Intelligence
              </h2>

              <div className="mt-4 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-5 text-zinc-300">
                <strong className="font-medium text-[#D4AF37]">
                  Important:
                </strong>{" "}
                DhanarkOS AI Intelligence can make mistakes and may generate
                incomplete, outdated or inaccurate information. AI-generated
                outputs are provided for informational and decision-support
                purposes only and do not constitute professional financial,
                accounting, tax, investment or legal advice.
              </div>

              <p className="mt-4">
                You are responsible for reviewing and independently verifying
                important information before making financial or business
                decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                6. Service Availability
              </h2>

              <p className="mt-3">
                DhanarkOS is provided on an evolving basis and features may be
                modified, improved, suspended or discontinued from time to time.
              </p>

              <p className="mt-3">
                We do not guarantee uninterrupted, error-free or continuously
                available service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                7. Free Trial
              </h2>

              <p className="mt-3">
                DhanarkOS may provide a 7-day free trial. Trial availability
                and eligibility may be subject to change.
              </p>

              <p className="mt-3">
                Where payment information is required for a trial, the
                applicable subscription terms presented at checkout will
                determine when billing begins.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                8. Pricing and Payments
              </h2>

              <p className="mt-3">
                DhanarkOS offers subscription plans that may include monthly
                and yearly billing options.
              </p>

              <p className="mt-3">
                Current pricing will be displayed on the DhanarkOS pricing or
                checkout interface before payment is completed.
              </p>

              <p className="mt-3">
                Payments may be processed through Razorpay or another
                authorized payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                9. Refund Policy
              </h2>

              <p className="mt-3">
                Unless otherwise required by applicable law or expressly stated
                at checkout, payments for DhanarkOS subscriptions are
                non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                10. Acceptable Use
              </h2>

              <p className="mt-3">
                You may not use DhanarkOS to violate applicable laws, interfere
                with the platform, gain unauthorized access, upload malicious
                content, abuse payment functionality, or attempt to compromise
                the security of DhanarkOS or another user.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                11. Intellectual Property
              </h2>

              <p className="mt-3">
                DhanarkOS software, branding, interface, designs, content and
                underlying technology are owned by or licensed to DhanarkOS and
                may not be copied, modified, distributed or commercially
                exploited without authorization.
              </p>

              <p className="mt-3">
                These Terms do not transfer ownership of your business or
                financial data to DhanarkOS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                12. Third-Party Services
              </h2>

              <p className="mt-3">
                DhanarkOS depends on third-party services including Supabase,
                Razorpay and OpenAI. Availability or functionality of certain
                DhanarkOS features may therefore depend on these providers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                13. Limitation of Liability
              </h2>

              <p className="mt-3">
                To the maximum extent permitted by applicable law, DhanarkOS
                will not be responsible for indirect, incidental, special,
                consequential or business losses arising from your use of the
                service.
              </p>

              <p className="mt-3">
                You remain responsible for maintaining appropriate backups and
                independently verifying important financial information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                14. Account Termination
              </h2>

              <p className="mt-3">
                You may stop using DhanarkOS and request account deletion.
                DhanarkOS may suspend or terminate accounts that materially
                violate these Terms, applicable law or platform security
                requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                15. Changes to These Terms
              </h2>

              <p className="mt-3">
                We may update these Terms as DhanarkOS evolves. Updated Terms
                will be published on this page with a revised effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                16. Governing Law
              </h2>

              <p className="mt-3">
                These Terms are intended to be governed by the laws applicable
                in India, subject to applicable mandatory legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                17. Contact
              </h2>

              <p className="mt-3">
                For questions regarding these Terms, contact:
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