"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CircleDollarSign,
  FileText,
  Lock,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";

type Plan = {
  name: string;
  eyebrow: string;
  price: string;
  period: string;
  description: string;
  featured?: boolean;
  badge?: string;
  cta: string;
  href: string;
  features: string[];
  limitations?: string[];
};

const plans: Plan[] = [
  {
    name: "Free",
    eyebrow: "Get started",
    price: "₹0",
    period: "forever",
    description:
      "A simple way to experience ArkenOne and get your business set up.",
    cta: "Start free",
    href: "/onboarding",
    features: [
      "Business profile",
      "Basic customer management",
      "Limited invoice management",
      "Basic payment records",
      "Basic financial overview",
    ],
    limitations: [
      "Limited AI CFO insights",
      "No advanced automation",
      "Limited financial history",
      "Advanced features locked",
    ],
  },
  {
    name: "Pro",
    eyebrow: "For growing businesses",
    price: "₹1,499",
    period: "/ month",
    description:
      "The everyday financial workspace for businesses that want more control.",
    featured: true,
    badge: "Most popular",
    cta: "Choose Pro",
    href: "/onboarding",
    features: [
      "Everything in Free",
      "Unlimited customers",
      "Unlimited invoices",
      "Payment collection tools",
      "Financial overview",
      "AI CFO insights",
      "Financial notifications",
      "Payment follow-ups",
      "Expanded financial history",
    ],
  },
  {
    name: "Business",
    eyebrow: "For established businesses",
    price: "₹14,999",
    period: "/ year",
    description:
      "A complete financial operating layer for businesses ready to run with greater clarity.",
    cta: "Choose Business",
    href: "/onboarding",
    features: [
      "Everything in Pro",
      "Advanced AI CFO insights",
      "Advanced financial analytics",
      "Cash-flow intelligence",
      "Priority financial alerts",
      "Advanced payment workflows",
      "Business performance insights",
      "Extended financial history",
      "Priority support",
    ],
  },
  {
    name: "Advanced",
    eyebrow: "For businesses going further",
    price: "₹17,999",
    period: "/ year",
    description:
      "The most powerful ArkenOne experience for businesses that want deeper intelligence and automation.",
    badge: "Advanced",
    cta: "Choose Advanced",
    href: "/onboarding",
    features: [
      "Everything in Business",
      "Advanced AI CFO capabilities",
      "Deeper financial intelligence",
      "Advanced automation",
      "Priority action recommendations",
      "Advanced business insights",
      "Enhanced financial monitoring",
      "Early access to new capabilities",
      "Priority support",
    ],
  },
];

const comparisonRows = [
  {
    label: "Business profile",
    free: true,
    pro: true,
    business: true,
    advanced: true,
  },
  {
    label: "Customer management",
    free: "Limited",
    pro: true,
    business: true,
    advanced: true,
  },
  {
    label: "Invoice management",
    free: "Limited",
    pro: true,
    business: true,
    advanced: true,
  },
  {
    label: "Payment collection",
    free: "Basic",
    pro: true,
    business: true,
    advanced: true,
  },
  {
    label: "AI CFO",
    free: "Basic",
    pro: true,
    business: "Advanced",
    advanced: "Advanced+",
  },
  {
    label: "Financial analytics",
    free: false,
    pro: "Basic",
    business: true,
    advanced: "Advanced",
  },
  {
    label: "Financial automation",
    free: false,
    pro: "Basic",
    business: true,
    advanced: "Advanced",
  },
  {
    label: "Priority support",
    free: false,
    pro: false,
    business: true,
    advanced: true,
  },
];

function FeatureIcon({
  included,
}: {
  included: boolean | string;
}) {
  if (included === false) {
    return (
      <X
        size={14}
        className="text-zinc-700"
      />
    );
  }

  if (included === true) {
    return (
      <Check
        size={14}
        className="text-[#D4AF37]"
      />
    );
  }

  return (
    <span className="text-[10px] text-zinc-500">
      {included}
    </span>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08090A] text-white">
      {/* ============================================================
          NAVIGATION
      ============================================================ */}

      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.07]">
              <span className="text-sm font-semibold text-[#D4AF37]">
                A
              </span>
            </div>

            <span className="text-[15px] font-semibold tracking-tight">
              ArkenOne
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              Product
            </Link>

            <Link
              href="/#how-it-works"
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              How it works
            </Link>

            <Link
              href="/pricing"
              className="text-sm text-white"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:text-white sm:px-4"
            >
              Sign in
            </Link>

            <Link
              href="/onboarding"
              className="flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#E2C04A]"
            >
              Get started
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-[140px]" />

        <div className="relative mx-auto max-w-4xl px-5 pb-14 pt-20 text-center sm:px-8 sm:pb-20 sm:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2">
            <Sparkles
              size={13}
              className="text-[#D4AF37]"
            />

            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
              Simple pricing. Serious control.
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">
            Choose the level of
            <span className="block text-zinc-500">
              control your business needs.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
            Start with the essentials. Upgrade when your
            business needs deeper financial intelligence,
            automation, and control.
          </p>
        </div>
      </section>

      {/* ============================================================
          PRICING CARDS
      ============================================================ */}

      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="grid gap-3 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col overflow-hidden rounded-[24px] border p-6 transition ${
                plan.featured
                  ? "border-[#D4AF37]/35 bg-[#111214] shadow-[0_30px_90px_rgba(212,175,55,0.07)]"
                  : "border-white/[0.07] bg-white/[0.018]"
              }`}
            >
              {plan.badge && (
                <div className="absolute right-5 top-5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.15em] text-[#D4AF37]">
                  {plan.badge}
                </div>
              )}

              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#D4AF37]">
                {plan.eyebrow}
              </p>

              <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
                {plan.name}
              </h2>

              <p className="mt-3 min-h-[60px] text-xs leading-5 text-zinc-600">
                {plan.description}
              </p>

              <div className="mt-7 flex items-end gap-1">
                <span className="text-3xl font-semibold tracking-[-0.04em] text-white">
                  {plan.price}
                </span>

                <span className="mb-1 text-[10px] text-zinc-600">
                  {plan.period}
                </span>
              </div>

              <Link
                href={plan.href}
                className={`mt-6 flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition ${
                  plan.featured
                    ? "bg-[#D4AF37] text-black hover:bg-[#E2C04A]"
                    : "border border-white/[0.09] bg-white/[0.025] text-zinc-200 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {plan.cta}
                <ArrowRight size={14} />
              </Link>

              <div className="my-6 h-px bg-white/[0.06]" />

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Includes
              </p>

              <div className="mt-4 space-y-3">
                {plan.features.map(
                  (feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2.5"
                    >
                      <Check
                        size={13}
                        className="mt-0.5 shrink-0 text-[#D4AF37]"
                      />

                      <span className="text-xs leading-4 text-zinc-400">
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>

              {plan.limitations && (
                <>
                  <div className="my-5 h-px bg-white/[0.05]" />

                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-700">
                    Free plan limits
                  </p>

                  <div className="mt-4 space-y-3">
                    {plan.limitations.map(
                      (feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-2.5"
                        >
                          <Lock
                            size={12}
                            className="mt-0.5 shrink-0 text-zinc-700"
                          />

                          <span className="text-xs leading-4 text-zinc-600">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-[10px] text-zinc-700">
          Pricing shown for the current ArkenOne
          launch structure. Taxes, if applicable,
          are charged separately.
        </p>
      </section>

      {/* ============================================================
          VALUE SECTION
      ============================================================ */}

      <section className="border-y border-white/[0.06] bg-[#0A0B0C]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
              Why upgrade
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Don't pay for more
              software.
              <span className="block text-zinc-500">
                Pay for more control.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500">
              ArkenOne is designed so that upgrading
              gives your business more financial capability
              — not just more storage or cosmetic features.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">
              <CircleDollarSign
                size={18}
                className="text-[#D4AF37]"
              />

              <h3 className="mt-5 text-sm font-medium text-white">
                More visibility
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Go beyond basic records and understand
                your financial position.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">
              <BrainCircuit
                size={18}
                className="text-[#D4AF37]"
              />

              <h3 className="mt-5 text-sm font-medium text-white">
                More intelligence
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Unlock deeper AI CFO capabilities as
                your business grows.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">
              <Zap
                size={18}
                className="text-[#D4AF37]"
              />

              <h3 className="mt-5 text-sm font-medium text-white">
                More automation
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Reduce repetitive financial work and
                focus on running the business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPARISON
      ============================================================ */}

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
            Compare plans
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
            Everything you need.
            Clearly defined.
          </h2>
        </div>

        <div className="mt-12 overflow-x-auto rounded-[22px] border border-white/[0.07]">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.018]">
                <th className="w-[32%] px-5 py-5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                  Capability
                </th>

                {[
                  "Free",
                  "Pro",
                  "Business",
                  "Advanced",
                ].map(
                  (plan) => (
                    <th
                      key={plan}
                      className={`px-4 py-5 text-center text-[10px] font-medium uppercase tracking-[0.18em] ${
                        plan === "Pro"
                          ? "text-[#D4AF37]"
                          : "text-zinc-600"
                      }`}
                    >
                      {plan}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {comparisonRows.map(
                (row) => (
                  <tr
                    key={row.label}
                    className="border-b border-white/[0.05] last:border-0"
                  >
                    <td className="px-5 py-4 text-xs text-zinc-400">
                      {row.label}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <FeatureIcon
                          included={
                            row.free
                          }
                        />
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <FeatureIcon
                          included={
                            row.pro
                          }
                        />
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <FeatureIcon
                          included={
                            row.business
                          }
                        />
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <FeatureIcon
                          included={
                            row.advanced
                          }
                        />
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          FAQ / REASSURANCE
      ============================================================ */}

      <section className="border-y border-white/[0.06] bg-[#0A0B0C]">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
              Before you start
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">
              Start simple. Upgrade when
              you need more.
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-6">
              <div className="flex items-start gap-4">
                <FileText
                  size={17}
                  className="mt-0.5 shrink-0 text-[#D4AF37]"
                />

                <div>
                  <h3 className="text-sm font-medium text-zinc-200">
                    Can I start without paying?
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    Yes. The Free plan lets you set up
                    your business and experience the
                    core ArkenOne workflow before
                    upgrading.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-6">
              <div className="flex items-start gap-4">
                <BrainCircuit
                  size={17}
                  className="mt-0.5 shrink-0 text-[#D4AF37]"
                />

                <div>
                  <h3 className="text-sm font-medium text-zinc-200">
                    Why are AI CFO features limited
                    on Free?
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    ArkenOne's deeper financial
                    intelligence is one of its core
                    value drivers. Paid plans unlock
                    progressively more advanced
                    intelligence and automation.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.018] p-6">
              <div className="flex items-start gap-4">
                <Users
                  size={17}
                  className="mt-0.5 shrink-0 text-[#D4AF37]"
                />

                <div>
                  <h3 className="text-sm font-medium text-zinc-200">
                    Which plan should I choose?
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-zinc-600">
                    Pro is the natural starting point
                    for most growing businesses. Business
                    and Advanced are designed for teams
                    that want deeper financial intelligence
                    and automation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
            Ready when you are
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            Your business deserves
            <span className="block text-zinc-500">
              better financial visibility.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-zinc-500">
            Start with the essentials and unlock
            more as your business grows.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E2C04A] sm:w-auto"
            >
              Start with ArkenOne
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/"
              className="flex min-h-12 w-full items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.025] px-6 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.04] hover:text-white sm:w-auto"
            >
              Learn about ArkenOne
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/[0.05]">
              <span className="text-xs font-semibold text-[#D4AF37]">
                A
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-300">
                ArkenOne
              </p>

              <p className="mt-0.5 text-[10px] text-zinc-700">
                Financial clarity for growing businesses.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/"
              className="text-[10px] text-zinc-600 transition hover:text-zinc-300"
            >
              Product
            </Link>

            <Link
              href="/#how-it-works"
              className="text-[10px] text-zinc-600 transition hover:text-zinc-300"
            >
              How it works
            </Link>

            <Link
              href="/login"
              className="text-[10px] text-zinc-600 transition hover:text-zinc-300"
            >
              Sign in
            </Link>
          </div>

          <p className="text-[10px] text-zinc-700">
            © {new Date().getFullYear()} ArkenOne
          </p>
        </div>
      </footer>
    </main>
  );
}