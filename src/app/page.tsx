"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDollarSign,
  Landmark,
  LayoutDashboard,
  Menu,
  Receipt,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const capabilities = [
  {
    icon: Users,
    label: "Customers",
    title: "Your relationships, organized.",
    description:
      "Keep customer details, relationships, and financial activity connected in one calm workspace.",
  },
  {
    icon: Receipt,
    label: "Invoices",
    title: "Know what you've billed.",
    description:
      "Create, track, and manage invoices while keeping outstanding money visible.",
  },
  {
    icon: CircleDollarSign,
    label: "Payments",
    title: "Turn pending money into action.",
    description:
      "Collect payments and keep incoming money connected to the financial picture.",
  },
  {
    icon: Landmark,
    label: "Cash flow",
    title: "See where the money is moving.",
    description:
      "Understand what is coming in, what is going out, and where the business stands.",
  },
  {
    icon: BrainCircuit,
    label: "AI CFO",
    title: "Intelligence beyond the numbers.",
    description:
      "Surface financial signals and context that deserve your attention.",
  },
];

const workflowSteps = [
  {
    number: "01",
    eyebrow: "SET UP",
    title: "Bring your business in",
    description:
      "Set up your business, customers, payment preferences, and financial workspace.",
  },
  {
    number: "02",
    eyebrow: "OPERATE",
    title: "Run finance from one place",
    description:
      "Manage customers, invoices, payments, and everyday financial activity.",
  },
  {
    number: "03",
    eyebrow: "UNDERSTAND",
    title: "Let ArkenOne read the signals",
    description:
      "Your financial activity becomes organized context that AI can understand.",
  },
  {
    number: "04",
    eyebrow: "ACT",
    title: "Move with clarity",
    description:
      "Know what deserves attention instead of searching through disconnected numbers.",
  },
];

const pricingPlans = [
  {
    name: "Beginner",
    monthly: 799,
    annual: 7999,
    annualSavings: 1589,
    description:
      "A focused starting point for businesses building stronger financial control.",
    features: [
      "Core financial workspace",
      "Customers and contacts",
      "Invoice management",
      "Payment tracking",
      "Essential financial visibility",
    ],
    recommended: false,
  },
  {
    name: "Professional",
    monthly: 1699,
    annual: 16999,
    annualSavings: 3389,
    description:
      "The complete operating layer for businesses ready to run finance with confidence.",
    features: [
      "Everything in Beginner",
      "Advanced financial visibility",
      "AI CFO intelligence",
      "Payment collection workflows",
      "Financial insights and analysis",
      "Priority product capabilities",
    ],
    recommended: true,
  },
  {
    name: "Advanced",
    monthly: 1999,
    annual: 19999,
    annualSavings: 3989,
    description:
      "Maximum financial intelligence for businesses operating at a higher level.",
    features: [
      "Everything in Professional",
      "Advanced AI CFO capabilities",
      "Deeper financial analysis",
      "Enhanced reporting",
      "Advanced automation",
      "Highest capability tier",
    ],
    recommended: false,
  },
];

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`animate-[luxuryReveal_900ms_cubic-bezier(.16,1,.3,1)_both] ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<
    "monthly" | "yearly"
  >("yearly");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070809] text-white selection:bg-[#D4AF37]/20 selection:text-white">
      <style jsx global>{`
        @keyframes luxuryReveal {
          0% {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(6px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes luxuryFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -8px, 0);
          }
        }

        @keyframes luxuryPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }

          50% {
            opacity: 0.6;
            transform: scale(1.08);
          }
        }

        .luxury-glass {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .luxury-border {
          border-color: rgba(255, 255, 255, 0.075);
        }

        .luxury-card {
          transition:
            transform 500ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 500ms ease,
            background-color 500ms ease,
            box-shadow 500ms ease;
        }

        .luxury-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.16);
          background-color: rgba(255, 255, 255, 0.027);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.22);
        }

        .luxury-button {
          transition:
            transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 300ms ease,
            border-color 300ms ease,
            box-shadow 300ms ease;
        }

        .luxury-button:hover {
          transform: translateY(-1px);
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ============================================================
          NAVIGATION
      ============================================================ */}

      <header className="relative z-50 border-b border-white/[0.055] bg-[#070809]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[11px] border border-[#D4AF37]/20 bg-[#D4AF37]/[0.045]">
              <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />

              <span className="relative text-[13px] font-semibold tracking-[-0.05em] text-[#D4AF37]">
                A
              </span>
            </div>

            <div>
              <div className="text-[14px] font-semibold tracking-[-0.025em] text-white">
                ArkenOne
              </div>

              <div className="hidden text-[7px] font-medium uppercase tracking-[0.25em] text-zinc-700 sm:block">
                Financial operating system
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {[
              ["Product", "#product"],
              ["AI CFO", "#ai-cfo"],
              ["How it works", "#how-it-works"],
              ["Pricing", "#pricing"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-[11px] font-medium text-zinc-600 transition-colors duration-300 hover:text-zinc-200"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="luxury-button rounded-xl px-4 py-2.5 text-[11px] font-medium text-zinc-500 hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/onboarding"
              className="luxury-button group flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-[11px] font-semibold text-black shadow-[0_8px_35px_rgba(212,175,55,0.08)] hover:bg-[#E2C04A] hover:shadow-[0_12px_45px_rgba(212,175,55,0.13)]"
            >
              Start with ArkenOne
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <button
            type="button"
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() =>
              setMobileMenuOpen(
                (open) => !open
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-zinc-400 transition duration-300 hover:border-white/[0.13] hover:text-white md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={17} />
            ) : (
              <Menu size={17} />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/[0.055] bg-[#08090A]/95 px-5 py-5 backdrop-blur-2xl md:hidden">
            <div className="flex flex-col gap-1">
              {[
                ["Product", "#product"],
                ["AI CFO", "#ai-cfo"],
                ["How it works", "#how-it-works"],
                ["Pricing", "#pricing"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="rounded-xl px-3 py-3 text-[12px] text-zinc-500 transition hover:bg-white/[0.025] hover:text-white"
                >
                  {label}
                </a>
              ))}

              <div className="mt-3 flex gap-2 border-t border-white/[0.055] pt-4">
                <Link
                  href="/login"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex flex-1 items-center justify-center rounded-xl border border-white/[0.07] py-3 text-[11px] font-medium text-zinc-400"
                >
                  Sign in
                </Link>

                <Link
                  href="/onboarding"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3 text-[11px] font-semibold text-black"
                >
                  Start
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] overflow-hidden">
          <div className="absolute left-1/2 top-[-300px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-[150px]" />

          <div
            className="absolute left-[20%] top-[240px] h-[180px] w-[180px] rounded-full bg-white/[0.012] blur-[100px]"
            style={{
              animation:
                "luxuryPulse 8s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-28 lg:px-10 lg:pb-36">
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/10 bg-white/[0.018] px-3.5 py-2 shadow-[inset_0_1px_rgba(255,255,255,0.025)]">
                <Sparkles
                  size={12}
                  strokeWidth={1.5}
                  className="text-[#D4AF37]"
                />

                <span className="text-[8px] font-medium uppercase tracking-[0.28em] text-zinc-600">
                  AI-powered financial operations
                </span>
              </div>

              <h1 className="text-[45px] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[65px] lg:text-[82px]">
                Your business finances.
                <span className="mt-1 block text-zinc-500">
                  Finally under control.
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-7 text-zinc-500 sm:text-[17px] sm:leading-8">
                ArkenOne is the financial operating
                system for growing businesses —
                connecting customers, invoices,
                payments, cash flow, and an AI CFO
                into one intelligent workspace.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/onboarding"
                  className="luxury-button group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 text-[12px] font-semibold text-black shadow-[0_15px_50px_rgba(212,175,55,0.08)] hover:bg-[#E2C04A] hover:shadow-[0_18px_60px_rgba(212,175,55,0.14)] sm:w-auto"
                >
                  Start with ArkenOne
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>

                <Link
                  href="/walkthrough"
                  className="luxury-button group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.085] bg-white/[0.018] px-7 text-[12px] font-medium text-zinc-400 shadow-[inset_0_1px_rgba(255,255,255,0.025)] hover:border-white/[0.14] hover:bg-white/[0.03] hover:text-white sm:w-auto"
                >
                  Explore the system
                  <ChevronRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[8px] uppercase tracking-[0.18em] text-zinc-700">
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-[#D4AF37]/60" />
                  One financial workspace
                </span>

                <span className="hidden text-zinc-800 sm:inline">
                  /
                </span>

                <span>AI-first</span>

                <span className="hidden text-zinc-800 sm:inline">
                  /
                </span>

                <span>Built for growth</span>
              </div>
            </div>
          </Reveal>

          {/* Dashboard */}

          <Reveal className="delay-[120ms]">
            <div className="relative mx-auto mt-20 max-w-6xl sm:mt-24">
              <div className="pointer-events-none absolute -inset-12 rounded-[50px] bg-[#D4AF37]/[0.018] blur-3xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-white/[0.085] bg-[#101113]/95 shadow-[0_50px_140px_rgba(0,0,0,0.58),inset_0_1px_rgba(255,255,255,0.025)] backdrop-blur-2xl">
                <div className="flex h-12 items-center justify-between border-b border-white/[0.055] px-4 sm:px-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06]">
                      <span className="text-[8px] font-semibold text-[#D4AF37]">
                        A
                      </span>
                    </div>

                    <span className="text-[8px] font-medium tracking-[0.2em] text-zinc-700">
                      ARKENONE
                    </span>
                  </div>

                  <div className="hidden items-center gap-6 sm:flex">
                    <span className="text-[8px] text-zinc-700">
                      Overview
                    </span>

                    <span className="text-[8px] text-zinc-700">
                      Customers
                    </span>

                    <span className="text-[8px] text-zinc-700">
                      Invoices
                    </span>

                    <span className="text-[8px] text-[#D4AF37]/70">
                      AI CFO
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                  </div>
                </div>

                <div className="grid min-h-[390px] grid-cols-1 lg:grid-cols-[200px_1fr]">
                  <div className="hidden border-r border-white/[0.05] p-5 lg:block">
                    <div className="mb-8 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4AF37]/[0.07]">
                        <span className="text-[9px] font-semibold text-[#D4AF37]">
                          A
                        </span>
                      </div>

                      <div>
                        <div className="h-1.5 w-14 rounded-full bg-white/[0.06]" />
                        <div className="mt-1.5 h-1 w-9 rounded-full bg-white/[0.025]" />
                      </div>
                    </div>

                    <p className="mb-2 px-3 text-[7px] uppercase tracking-[0.2em] text-zinc-800">
                      Workspace
                    </p>

                    <div className="space-y-1">
                      {[
                        "Overview",
                        "Customers",
                        "Invoices",
                        "Payments",
                        "AI Insights",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2.5 text-[9px] transition-colors ${
                            index === 0
                              ? "bg-white/[0.045] text-zinc-300"
                              : "text-zinc-700"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 sm:p-8">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.22em] text-zinc-700">
                          Financial overview
                        </p>

                        <h3 className="mt-2 text-xl font-medium tracking-[-0.025em] text-white">
                          Good morning.
                        </h3>

                        <p className="mt-1.5 text-[9px] text-zinc-700">
                          Here's what deserves your attention.
                        </p>
                      </div>

                      <div className="flex h-9 items-center gap-2 self-start rounded-lg border border-white/[0.055] bg-white/[0.018] px-3">
                        <LayoutDashboard
                          size={12}
                          strokeWidth={1.5}
                          className="text-[#D4AF37]"
                        />

                        <span className="text-[9px] text-zinc-600">
                          This month
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        ["Revenue", "₹9.48L"],
                        ["Outstanding", "₹1.26L"],
                        ["Collected", "₹8.22L"],
                        ["Customers", "124"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="luxury-glass rounded-xl border border-white/[0.055] p-4"
                        >
                          <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                            {label}
                          </p>

                          <p className="mt-2 text-lg font-medium tracking-[-0.025em] text-zinc-100">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-[1.25fr_0.75fr]">
                      <div className="luxury-glass min-h-[160px] rounded-xl border border-white/[0.055] p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-[8px] uppercase tracking-[0.16em] text-zinc-700">
                            Cash movement
                          </p>

                          <span className="text-[8px] text-zinc-800">
                            Last 6 months
                          </span>
                        </div>

                        <div className="mt-9 flex h-16 items-end gap-2">
                          {[
                            32,
                            48,
                            38,
                            61,
                            52,
                            76,
                            68,
                            91,
                            74,
                            84,
                            79,
                            96,
                          ].map(
                            (height, index) => (
                              <div
                                key={index}
                                className="flex-1 rounded-t-sm bg-gradient-to-t from-[#D4AF37]/10 to-[#D4AF37]/35"
                                style={{
                                  height: `${height}%`,
                                }}
                              />
                            )
                          )}
                        </div>
                      </div>

                      <div className="relative overflow-hidden rounded-xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.022] p-5">
                        <div className="absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full bg-[#D4AF37]/[0.035] blur-2xl" />

                        <div className="relative flex items-center gap-2">
                          <BrainCircuit
                            size={14}
                            strokeWidth={1.5}
                            className="text-[#D4AF37]"
                          />

                          <p className="text-[8px] uppercase tracking-[0.16em] text-[#D4AF37]">
                            AI CFO
                          </p>
                        </div>

                        <p className="relative mt-5 text-sm leading-5 text-zinc-300">
                          ₹1.26L is currently
                          outstanding. 8 invoices
                          are approaching their
                          expected payment date.
                        </p>

                        <div className="relative mt-5 flex items-center gap-1 text-[8px] font-medium text-[#D4AF37]">
                          Review insights
                          <ArrowRight size={10} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-5 flex w-fit items-center gap-3 text-[7px] uppercase tracking-[0.25em] text-zinc-800">
                <span className="h-px w-8 bg-white/[0.05]" />
                Financial command center
                <span className="h-px w-8 bg-white/[0.05]" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          PROBLEM
      ============================================================ */}

      <section className="border-y border-white/[0.055] bg-[#090A0B]">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">
          <Reveal>
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
                The problem
              </p>

              <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-4xl">
                Your business is moving.
                <span className="block text-zinc-500">
                  Your financial tools shouldn't
                  hold it back.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-zinc-600">
                Growth creates more financial
                activity. More customers. More
                invoices. More payments. More
                decisions.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "01",
                "Scattered information",
                "Customer details, invoices and payment information live in different places.",
              ],
              [
                "02",
                "Unclear cash position",
                "You know money is moving, but knowing exactly where you stand takes work.",
              ],
              [
                "03",
                "Manual follow-ups",
                "Outstanding payments can quietly become lost time and lost cash.",
              ],
              [
                "04",
                "Too much number hunting",
                "Important financial signals get buried inside spreadsheets and reports.",
              ],
            ].map((item, index) => (
              <Reveal
                key={item[0]}
                className={`delay-[${index * 80}ms]`}
              >
                <div className="luxury-card h-full rounded-2xl border border-white/[0.06] bg-[#0E0F10] p-6">
                  <span className="text-[9px] font-medium tracking-[0.15em] text-[#D4AF37]">
                    {item[0]}
                  </span>

                  <h3 className="mt-6 text-sm font-medium text-zinc-200">
                    {item[1]}
                  </h3>

                  <p className="mt-2.5 text-xs leading-5 text-zinc-700">
                    {item[2]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRODUCT
      ============================================================ */}

      <section
        id="product"
        className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      >
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
              One financial command center
            </p>

            <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl">
              Everything important.
              <span className="block text-zinc-500">
                One place.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-600">
              ArkenOne brings the everyday financial
              operations of your business into a single,
              calm workspace.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(
            ({
              icon: Icon,
              label,
              title,
              description,
            }) => (
              <div
                key={label}
                className="luxury-card group rounded-2xl border border-white/[0.065] bg-white/[0.012] p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.065] bg-white/[0.018] transition duration-500 group-hover:border-[#D4AF37]/15 group-hover:bg-[#D4AF37]/[0.04]">
                  <Icon
                    size={17}
                    strokeWidth={1.45}
                    className="text-[#D4AF37]"
                  />
                </div>

                <p className="mt-7 text-[8px] font-medium uppercase tracking-[0.22em] text-[#D4AF37]">
                  {label}
                </p>

                <h3 className="mt-2.5 text-base font-medium tracking-[-0.02em] text-white">
                  {title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-zinc-700">
                  {description}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ============================================================
          AI CFO
      ============================================================ */}

      <section
        id="ai-cfo"
        className="relative overflow-hidden border-y border-white/[0.055] bg-[#090A0B]"
      >
        <div className="pointer-events-none absolute right-[-180px] top-1/2 h-[550px] w-[550px] -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.022] blur-[140px]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <Reveal>
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.045]">
                <BrainCircuit
                  size={19}
                  strokeWidth={1.35}
                  className="text-[#D4AF37]"
                />
              </div>

              <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
                The intelligence layer
              </p>

              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.06] tracking-[-0.05em] text-white sm:text-5xl">
                Numbers tell you
                <span className="block text-zinc-500">
                  what happened.
                </span>

                <span className="mt-1 block">
                  AI helps you see
                  <span className="text-zinc-500">
                    {" "}
                    what matters.
                  </span>
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-sm leading-7 text-zinc-600 sm:text-[15px]">
                ArkenOne turns financial activity
                into context — surfacing important
                movement, outstanding money, and
                signals that deserve your attention.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  "Surface important financial signals",
                  "Highlight payments and follow-ups",
                  "Turn financial activity into context",
                  "Help focus decisions instead of data hunting",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.04]">
                      <Check
                        size={10}
                        className="text-[#D4AF37]"
                      />
                    </div>

                    <span className="text-sm text-zinc-500">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/walkthrough"
                className="group mt-10 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#D4AF37]"
              >
                Explore the AI CFO
                <ArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>

          <Reveal className="delay-[120ms]">
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-8 rounded-[40px] bg-[#D4AF37]/[0.02] blur-3xl"
                style={{
                  animation:
                    "luxuryFloat 8s ease-in-out infinite",
                }}
              />

              <div className="luxury-glass relative overflow-hidden rounded-[28px] border border-white/[0.075] shadow-[0_45px_120px_rgba(0,0,0,0.42),inset_0_1px_rgba(255,255,255,0.025)]">
                <div className="flex items-center justify-between border-b border-white/[0.055] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.045]">
                      <BrainCircuit
                        size={16}
                        strokeWidth={1.35}
                        className="text-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-white">
                        AI CFO
                      </p>

                      <p className="mt-0.5 text-[8px] text-zinc-700">
                        Financial intelligence
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.025] px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

                    <span className="text-[7px] uppercase tracking-[0.16em] text-[#D4AF37]">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-700">
                      What deserves attention
                    </p>

                    <span className="text-[8px] text-zinc-800">
                      Just now
                    </span>
                  </div>

                  <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.018] p-5">
                    <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-[#D4AF37]/[0.035] blur-3xl" />

                    <div className="relative flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/[0.07]">
                        <Sparkles
                          size={13}
                          strokeWidth={1.4}
                          className="text-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#D4AF37]">
                          Cash-flow attention
                        </p>

                        <h3 className="mt-2.5 text-base font-medium leading-6 tracking-[-0.02em] text-zinc-100 sm:text-lg">
                          Outstanding invoices
                          are becoming a
                          near-term priority.
                        </h3>
                      </div>
                    </div>

                    <p className="relative mt-5 text-xs leading-6 text-zinc-700">
                      ₹1.26L is currently outstanding.
                      8 invoices are approaching their
                      expected payment dates. Reviewing
                      these accounts could improve
                      near-term cash visibility.
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="luxury-glass rounded-xl border border-white/[0.055] p-4">
                      <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                        Outstanding
                      </p>

                      <p className="mt-2 text-lg font-medium tracking-[-0.025em] text-white">
                        ₹1.26L
                      </p>

                      <p className="mt-1 text-[8px] text-zinc-800">
                        Active invoices
                      </p>
                    </div>

                    <div className="luxury-glass rounded-xl border border-white/[0.055] p-4">
                      <p className="text-[7px] uppercase tracking-[0.16em] text-zinc-700">
                        Attention
                      </p>

                      <p className="mt-2 text-lg font-medium tracking-[-0.025em] text-[#D4AF37]">
                        8
                      </p>

                      <p className="mt-1 text-[8px] text-zinc-800">
                        Invoices to review
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-white/[0.055] bg-white/[0.012] p-4">
                    <div className="flex items-center gap-2">
                      <Check
                        size={12}
                        className="text-[#D4AF37]"
                      />

                      <p className="text-[8px] uppercase tracking-[0.15em] text-zinc-600">
                        Suggested next step
                      </p>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-zinc-600">
                      Review the 8 invoices and
                      prioritize accounts with the
                      nearest expected payment dates.
                    </p>
                  </div>

                  <Link
                    href="/walkthrough"
                    className="luxury-button group mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.065] bg-white/[0.018] py-3 text-[10px] font-medium text-zinc-400 hover:border-white/[0.12] hover:text-white"
                  >
                    Explore AI CFO
                    <ArrowRight
                      size={12}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
      ============================================================ */}

      <section
        id="how-it-works"
        className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
      >
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
              How ArkenOne works
            </p>

            <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl">
              From financial activity
              <span className="block text-zinc-500">
                to financial clarity.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-zinc-600">
              ArkenOne connects the everyday
              financial operations of your business
              with an intelligence layer designed to
              help you understand what happens next.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[28px] hidden h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent lg:block" />

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step) => (
              <div
                key={step.number}
                className="luxury-card relative rounded-2xl border border-white/[0.06] bg-[#0D0E0F] p-6 sm:p-7"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[9px] font-medium tracking-[0.2em] text-[#D4AF37]">
                    {step.number}
                  </span>

                  <span className="text-[7px] font-medium tracking-[0.2em] text-zinc-800">
                    {step.eyebrow}
                  </span>
                </div>

                <h3 className="mt-12 text-base font-medium tracking-[-0.02em] text-white sm:text-lg">
                  {step.title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-zinc-700">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="luxury-glass mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/[0.06] p-5 sm:flex-row sm:p-6">
          <div>
            <p className="text-xs font-medium text-zinc-300">
              See the complete ArkenOne system.
            </p>

            <p className="mt-1 text-[9px] leading-5 text-zinc-700">
              Explore the product before you commit.
            </p>
          </div>

          <Link
            href="/walkthrough"
            className="luxury-button group flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-[10px] font-semibold text-black hover:bg-[#E2C04A] sm:w-auto"
          >
            Take the walkthrough
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>

      {/* ============================================================
          PRICING
      ============================================================ */}

      <section
        id="pricing"
        className="border-y border-white/[0.055] bg-[#090A0B]"
      >
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
                Simple, serious pricing
              </p>

              <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl">
                Choose the level of
                <span className="block text-zinc-500">
                  financial control you need.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-7 text-zinc-600">
                Experience ArkenOne first, then choose
                the level that fits your business.
              </p>

              <div className="mt-9 inline-flex rounded-xl border border-white/[0.065] bg-white/[0.018] p-1 shadow-[inset_0_1px_rgba(255,255,255,0.025)]">
                <button
                  type="button"
                  onClick={() =>
                    setBillingCycle("monthly")
                  }
                  className={`rounded-lg px-5 py-2.5 text-[9px] font-medium transition-all duration-300 ${
                    billingCycle === "monthly"
                      ? "bg-white/[0.075] text-white shadow-[0_4px_18px_rgba(0,0,0,0.18)]"
                      : "text-zinc-700 hover:text-zinc-400"
                  }`}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setBillingCycle("yearly")
                  }
                  className={`rounded-lg px-5 py-2.5 text-[9px] font-medium transition-all duration-300 ${
                    billingCycle === "yearly"
                      ? "bg-[#D4AF37] text-black shadow-[0_6px_24px_rgba(212,175,55,0.08)]"
                      : "text-zinc-700 hover:text-zinc-400"
                  }`}
                >
                  Yearly
                </button>
              </div>

              {billingCycle === "yearly" && (
                <p className="mt-4 text-[8px] uppercase tracking-[0.18em] text-[#D4AF37]/70">
                  Annual billing saves you money
                </p>
              )}
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan) => {
              const yearly =
                billingCycle === "yearly";

              const displayedPrice = yearly
                ? plan.annual
                : plan.monthly;

              const monthlyComparison =
                plan.monthly * 12;

              return (
                <div
                  key={plan.name}
                  className={`group relative flex flex-col overflow-hidden rounded-[26px] border p-6 transition-all duration-500 sm:p-7 ${
                    plan.recommended
                      ? "border-[#D4AF37]/25 bg-[#D4AF37]/[0.027] shadow-[0_35px_100px_rgba(0,0,0,0.3)]"
                      : "border-white/[0.06] bg-[#0E0F10] hover:border-white/[0.1]"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
                  )}

                  {plan.recommended && (
                    <div className="absolute right-5 top-5 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] px-2.5 py-1">
                      <span className="text-[7px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="min-h-[110px]">
                    <p
                      className={`text-[9px] font-medium uppercase tracking-[0.22em] ${
                        plan.recommended
                          ? "text-[#D4AF37]"
                          : "text-zinc-600"
                      }`}
                    >
                      {plan.name}
                    </p>

                    <p className="mt-4 max-w-[260px] text-xs leading-6 text-zinc-700">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mt-7">
                    <div className="flex items-end gap-2">
                      <span className="text-[38px] font-semibold leading-none tracking-[-0.055em] text-white">
                        {formatINR(displayedPrice)}
                      </span>

                      <span className="pb-1 text-[9px] text-zinc-700">
                        / {yearly ? "year" : "month"}
                      </span>
                    </div>

                    {yearly ? (
                      <div className="mt-4">
                        <p className="text-[9px] text-zinc-700">
                          Equivalent to{" "}
                          <span className="text-zinc-500">
                            {formatINR(
                              Math.round(
                                plan.annual /
                                  12
                              )
                            )}
                            /month
                          </span>
                        </p>

                        <p className="mt-1.5 text-[9px] font-medium text-[#D4AF37]">
                          Save{" "}
                          {formatINR(
                            plan.annualSavings
                          )}
                          /year
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <p className="text-[9px] text-zinc-700">
                          {formatINR(
                            monthlyComparison
                          )}{" "}
                          if paid monthly for a year
                        </p>

                        <p className="mt-1.5 text-[9px] font-medium text-[#D4AF37]">
                          Save{" "}
                          {formatINR(
                            plan.annualSavings
                          )}{" "}
                          with yearly billing
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="my-7 h-px bg-white/[0.055]" />

                  <div className="space-y-3.5">
                    {plan.features.map(
                      (feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3"
                        >
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/[0.07]">
                            <Check
                              size={9}
                              strokeWidth={2}
                              className="text-[#D4AF37]"
                            />
                          </div>

                          <span className="text-[11px] leading-5 text-zinc-500">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-auto pt-9">
                    <Link
                      href="/onboarding"
                      className={`luxury-button group flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-[10px] font-semibold ${
                        plan.recommended
                          ? "bg-[#D4AF37] text-black hover:bg-[#E2C04A]"
                          : "border border-white/[0.07] bg-white/[0.018] text-zinc-400 hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white"
                      }`}
                    >
                      Start with {plan.name}
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <Reveal className="delay-[120ms]">
            <div className="luxury-glass mt-5 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/[0.06] p-5 sm:flex-row sm:p-6">
              <div>
                <p className="text-xs font-medium text-zinc-300">
                  Want to experience ArkenOne first?
                </p>

                <p className="mt-1 text-[9px] leading-5 text-zinc-700">
                  Start with the limited free trial.
                </p>
              </div>

              <Link
                href="/onboarding"
                className="luxury-button group flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 text-[10px] font-medium text-zinc-400 hover:border-[#D4AF37]/15 hover:text-white sm:w-auto"
              >
                Start your trial
                <ArrowRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>

          <div className="mt-7 text-center">
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.18em] text-zinc-700 transition hover:text-zinc-400"
            >
              View full pricing details
              <ChevronRight
                size={11}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          BUILT FOR GROWTH
      ============================================================ */}

      <section className="border-b border-white/[0.055] bg-[#090A0B]">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-10">
          <Reveal>
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
                Built for growth
              </p>

              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-4xl">
                Serious financial control.
                <span className="block text-zinc-500">
                  Without enterprise complexity.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-600">
                Whether you're running a service
                business, growing a local company,
                or building the next stage of your
                business, ArkenOne gives you a clearer
                financial operating layer.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Built for growing businesses",
              "Designed around financial clarity",
              "AI-first intelligence",
              "Customers, invoices and payments together",
              "Premium, simple workspace",
              "Designed to scale with you",
            ].map((item) => (
              <div
                key={item}
                className="luxury-card flex items-center gap-3 rounded-xl border border-white/[0.055] bg-white/[0.012] px-4 py-4"
              >
                <Check
                  size={13}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#D4AF37]"
                />

                <span className="text-[10px] text-zinc-600">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}

      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.028] blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <Reveal>
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
              Take control
            </p>

            <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              Run your business.
              <span className="block text-zinc-500">
                Think with clarity.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-zinc-600 sm:text-[15px]">
              Bring your financial operations together
              and build a clearer view of where your
              business stands.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="luxury-button group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 text-[12px] font-semibold text-black shadow-[0_15px_50px_rgba(212,175,55,0.08)] hover:bg-[#E2C04A] hover:shadow-[0_18px_65px_rgba(212,175,55,0.13)] sm:w-auto"
              >
                Start your trial
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/pricing"
                className="luxury-button group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.018] px-7 text-[12px] font-medium text-zinc-400 hover:border-white/[0.13] hover:bg-white/[0.03] hover:text-white sm:w-auto"
              >
                Compare plans
                <ChevronRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <footer className="border-t border-white/[0.055] bg-[#070809]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04]">
              <span className="text-[11px] font-semibold text-[#D4AF37]">
                A
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-400">
                ArkenOne
              </p>

              <p className="mt-0.5 text-[8px] text-zinc-800">
                Financial clarity for growing businesses.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#product"
              className="text-[9px] text-zinc-700 transition hover:text-zinc-400"
            >
              Product
            </a>

            <a
              href="#ai-cfo"
              className="text-[9px] text-zinc-700 transition hover:text-zinc-400"
            >
              AI CFO
            </a>

            <a
              href="#how-it-works"
              className="text-[9px] text-zinc-700 transition hover:text-zinc-400"
            >
              How it works
            </a>

            <a
              href="#pricing"
              className="text-[9px] text-zinc-700 transition hover:text-zinc-400"
            >
              Pricing
            </a>

            <Link
              href="/login"
              className="text-[9px] text-zinc-700 transition hover:text-zinc-400"
            >
              Sign in
            </Link>
          </div>

          <p className="text-[8px] text-zinc-800">
            © {new Date().getFullYear()} ArkenOne
          </p>
        </div>
      </footer>
    </main>
  );
}