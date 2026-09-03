import Link from "next/link";
import DhanarkLogo from "@/components/brand/DhanarkLogo";

export default function RefundPolicyPage() {
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
              Refund Policy
            </h1>

            <p className="mt-4 text-sm text-zinc-600">
              Last updated: August 31, 2026
            </p>
          </div>

          <div className="space-y-10 text-sm leading-7 text-zinc-400">
            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                1. General Policy
              </h2>

              <p className="mt-3">
                Payments made for DhanarkOS subscription plans are generally
                non-refundable.
              </p>

              <p className="mt-3">
                By purchasing a DhanarkOS subscription, you acknowledge that
                you are purchasing access to a digital software service and
                agree to the applicable subscription terms presented before
                completing payment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                2. No Refunds
              </h2>

              <div className="mt-4 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-5 text-zinc-300">
                <strong className="font-medium text-[#D4AF37]">
                  Important:
                </strong>{" "}
                DhanarkOS does not provide refunds for subscription payments,
                including monthly or yearly subscription payments, except where
                a refund is required by applicable law or expressly approved
                by DhanarkOS.
              </div>

              <p className="mt-4">
                This means that changing your mind, choosing not to use the
                service, or failing to use your subscription does not normally
                qualify for a refund.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                3. Subscription Cancellation
              </h2>

              <p className="mt-3">
                You may cancel your subscription in accordance with the
                cancellation options available through your DhanarkOS account
                or subscription management interface.
              </p>

              <p className="mt-3">
                Cancellation prevents future renewal where applicable but does
                not automatically create an entitlement to a refund for a
                payment that has already been processed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                4. Free Trials
              </h2>

              <p className="mt-3">
                Where DhanarkOS offers a free trial, the duration and
                eligibility of the trial will be displayed during signup or
                checkout.
              </p>

              <p className="mt-3">
                If a trial converts into a paid subscription, the resulting
                payment will be subject to this Refund Policy unless otherwise
                stated at checkout.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                5. Duplicate or Incorrect Charges
              </h2>

              <p className="mt-3">
                If you believe you were charged multiple times for the same
                subscription or that a payment was processed incorrectly,
                contact us as soon as possible with the relevant transaction
                details.
              </p>

              <p className="mt-3">
                We may investigate the transaction and, where appropriate,
                correct a genuine duplicate or processing error.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                6. Payment Provider Issues
              </h2>

              <p className="mt-3">
                Payments may be processed through third-party payment
                providers such as Razorpay. Payment processing, authorization,
                settlement or transaction errors may also be subject to the
                applicable policies and procedures of the payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                7. Legal Rights
              </h2>

              <p className="mt-3">
                Nothing in this Refund Policy is intended to exclude or limit
                any refund, cancellation or other consumer right that cannot
                legally be excluded or limited under applicable law.
              </p>

              <p className="mt-3">
                Where applicable law requires a refund or other remedy, that
                legal requirement will take precedence over this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-zinc-100">
                8. How to Contact Us
              </h2>

              <p className="mt-3">
                If you believe you have been incorrectly charged or have a
                payment-related issue, contact:
              </p>

              <p className="mt-3 font-medium text-zinc-200">
                dhanarksupport@gmail.com
              </p>

              <p className="mt-3">
                Please include your account email, transaction details and a
                brief description of the issue so that we can review it.
              </p>
            </section>
          </div>

          <div className="mt-16 border-t border-white/[0.06] pt-8">
            <div className="flex flex-wrap gap-5 text-xs text-zinc-600">
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>

              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>

              <Link href="/cookies" className="hover:text-white">
                Cookie Policy
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