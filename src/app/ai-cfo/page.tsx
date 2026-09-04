import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  CircleDollarSign,
  FileText,
  LineChart,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI CFO for Small Businesses — DhanarkOS",
  description:
    "Learn what an AI CFO is, how AI CFO software works, and how DhanarkOS helps growing businesses understand cash flow, invoices, expenses and financial decisions.",
  alternates: {
    canonical: "https://dhanark.com/ai-cfo",
  },
  openGraph: {
    title: "AI CFO for Small Businesses — DhanarkOS",
    description:
      "Understand what an AI CFO does and how DhanarkOS turns business financial activity into clear signals, priorities and decisions.",
    url: "https://dhanark.com/ai-cfo",
    siteName: "DhanarkOS",
    type: "article",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI CFO for Small Businesses — DhanarkOS",
    description:
      "Understand what an AI CFO does and how DhanarkOS turns financial activity into useful business intelligence.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const capabilities = [
  {
    icon: CircleDollarSign,
    title: "Cash-flow visibility",
    description:
      "Understand money coming in, money going out and the financial position your business is moving toward.",
  },
  {
    icon: FileText,
    title: "Receivables intelligence",
    description:
      "Connect invoices, customers and outstanding payments so you can see where expected cash is getting delayed.",
  },
  {
    icon: LineChart,
    title: "Financial analysis",
    description:
      "Turn financial activity into patterns, signals and context instead of leaving you to interpret disconnected numbers.",
  },
  {
    icon: WalletCards,
    title: "Decision support",
    description:
      "Surface priorities and practical next actions from the financial information already inside your workspace.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Your business generates financial activity",
    description:
      "Customers, invoices, payments, expenses and other financial events create the underlying information your business needs to understand.",
  },
  {
    number: "02",
    title: "DhanarkOS organizes the information",
    description:
      "Your financial activity is connected inside one operating layer instead of being scattered across disconnected tools and records.",
  },
  {
    number: "03",
    title: "The AI CFO interprets the context",
    description:
      "Dhaar analyzes the financial context available in DhanarkOS to identify meaningful patterns, priorities and areas that deserve attention.",
  },
  {
    number: "04",
    title: "You get clearer next actions",
    description:
      "The goal is not another dashboard full of numbers. It is a clearer understanding of what is happening and what deserves your attention next.",
  },
];

const comparison = [
  {
    label: "Bookkeeping software",
    text: "Primarily records and organizes financial transactions and accounting information.",
  },
  {
    label: "Traditional accountant",
    text: "Provides professional accounting, tax and financial services based on the business relationship and scope of work.",
  },
  {
    label: "AI CFO software",
    text: "Uses financial data and analysis to help business owners understand financial conditions, identify patterns and make better-informed decisions.",
  },
];

const questions = [
  {
    question: "What is an AI CFO?",
    answer:
      "An AI CFO is software that analyzes a business's financial information and helps turn that information into financial insights, priorities and decision support. It is designed to help business owners understand what is happening financially without relying only on raw reports or spreadsheets.",
  },
  {
    question: "What does an AI CFO do for a small business?",
    answer:
      "An AI CFO can help a small business monitor financial activity, understand cash flow, identify outstanding receivables, analyze financial patterns and surface areas that may require attention. The exact capabilities depend on the software and the financial information available to it.",
  },
  {
    question: "Is an AI CFO the same as an accountant?",
    answer:
      "No. An AI CFO product is software for financial analysis and decision support. It does not automatically replace professional accounting, tax, audit or other regulated financial services. Businesses may use both technology and qualified professionals for different needs.",
  },
  {
    question: "How does DhanarkOS use AI for finance?",
    answer:
      "DhanarkOS connects financial activity such as customers, invoices, payments and expenses into one financial operating layer. Its AI CFO, Dhaar, uses that available context to turn financial activity into signals, priorities and practical next actions.",
  },
  {
    question: "Who can benefit from an AI CFO?",
    answer:
      "An AI CFO can be useful for founders, business owners and finance teams that need a clearer understanding of cash flow, receivables, expenses and financial performance but do not want to rely entirely on manual analysis.",
  },
];

export default function AICFOPage() {
  return (
    <main className="min-h-screen bg-[#070809] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-[160px]" />

        <div className="absolute right-[-180px] top-[45%] h-[500px] w-[500px] rounded-full bg-[#D4AF37]/[0.018] blur-[150px]" />
      </div>

      {/* Navigation */}
      <header className="border-b border-white/[0.055]">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="DhanarkOS home"
            className="inline-flex items-center"
          >
            <span className="text-[18px] font-semibold tracking-[-0.04em]">
              Dhanark
              <span className="text-[#D4AF37]">OS</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-5">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-[11px] text-zinc-500 transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/pricing"
              className="rounded-lg px-3 py-2 text-[11px] text-zinc-500 transition hover:text-white"
            >
              Pricing
            </Link>

            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-[11px] font-semibold text-black transition hover:bg-[#E2C04A]"
            >
              Start Free Trial
              <ArrowRight size={12} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-[980px]">
          <div className="max-w-4xl">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              AI CFO FOR SMALL BUSINESSES
            </p>

            <h1 className="mt-5 max-w-4xl text-[46px] font-light leading-[0.98] tracking-[-0.055em] sm:text-[62px] lg:text-[76px]">
              Your business has
              <br />
              <span className="text-zinc-500">
                numbers. You need intelligence.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-[15px] leading-7 text-zinc-400 sm:text-[17px] sm:leading-8">
              An AI CFO is software that analyzes a business&apos;s financial
              information and turns it into insights, priorities and decision
              support. DhanarkOS brings that intelligence into the same
              financial operating system where your business manages
              customers, invoices, payments and expenses.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-[12px] font-semibold text-black transition hover:bg-[#E2C04A]"
              >
                Start 7-Day Free Trial
                <ArrowRight size={14} />
              </Link>

              <Link
                href="#what-is-an-ai-cfo"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 text-[12px] text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                Understand AI CFOs
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Definition card */}
          <div
            id="what-is-an-ai-cfo"
            className="mt-16 scroll-mt-12 rounded-[24px] border border-[#D4AF37]/20 bg-[#0B0D0E] p-6 sm:p-8 lg:p-10"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06]">
                <BrainCircuit
                  size={19}
                  strokeWidth={1.5}
                  className="text-[#D4AF37]"
                />
              </div>

              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                  Direct answer
                </p>

                <h2 className="mt-3 text-2xl font-light tracking-[-0.035em] sm:text-3xl">
                  What is an AI CFO?
                </h2>

                <p className="mt-4 max-w-4xl text-[13px] leading-7 text-zinc-400 sm:text-[14px] sm:leading-7">
                  An AI CFO is software that analyzes a business&apos;s
                  financial data and helps owners understand cash flow,
                  expenses, receivables, financial performance and potential
                  next actions. Unlike a traditional dashboard that primarily
                  displays information, an AI CFO is designed to interpret
                  financial context and make that information more useful for
                  decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What does an AI CFO do */}
      <section className="border-y border-white/[0.055] bg-[#090A0B] px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-2xl">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              WHAT IT DOES
            </p>

            <h2 className="mt-4 text-3xl font-light leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              What does an AI CFO actually do?
            </h2>

            <p className="mt-5 text-[13px] leading-7 text-zinc-500 sm:text-[14px]">
              The value of an AI CFO is not simply putting AI next to a
              financial dashboard. It is connecting financial activity with
              context so business owners can understand what deserves
              attention.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 sm:p-7"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
                    <Icon size={17} className="text-[#D4AF37]" />
                  </div>

                  <h3 className="mt-6 text-[17px] font-medium tracking-[-0.02em]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[12px] leading-6 text-zinc-500 sm:text-[13px]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-2xl">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              HOW IT WORKS
            </p>

            <h2 className="mt-4 text-3xl font-light leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              From financial activity
              <br />
              to financial intelligence.
            </h2>
          </div>

          <div className="mt-12 grid gap-3 lg:grid-cols-4">
            {workflow.map((step) => (
              <article
                key={step.number}
                className="relative rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6"
              >
                <span className="text-[12px] font-semibold tracking-[0.18em] text-[#D4AF37]">
                  {step.number}
                </span>

                <h3 className="mt-8 text-[16px] font-medium leading-6">
                  {step.title}
                </h3>

                <p className="mt-3 text-[11px] leading-6 text-zinc-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DhanarkOS */}
      <section className="border-y border-white/[0.055] bg-[#090A0B] px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                DHANARKOS AI CFO
              </p>

              <h2 className="mt-4 text-3xl font-light leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Meet Dhaar.
                <br />
                <span className="text-zinc-500">
                  The intelligence layer.
                </span>
              </h2>

              <p className="mt-6 text-[13px] leading-7 text-zinc-500 sm:text-[14px]">
                Dhaar is DhanarkOS&apos;s AI CFO. It is designed to turn the
                financial activity already inside your workspace into signals,
                priorities and actions.
              </p>

              <Link
                href="/signup"
                className="group mt-7 inline-flex items-center gap-2 text-[11px] font-medium text-[#D4AF37] transition hover:text-[#E2C04A]"
              >
                Experience Dhaar
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="rounded-[24px] border border-[#D4AF37]/15 bg-[#0B0D0E] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06]">
                  <BrainCircuit
                    size={17}
                    strokeWidth={1.5}
                    className="text-[#D4AF37]"
                  />
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                    AI CFO SIGNAL
                  </p>

                  <p className="mt-1 text-[9px] text-zinc-600">
                    Example financial intelligence
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5">
                <p className="text-[8px] uppercase tracking-[0.18em] text-zinc-700">
                  Financial priority
                </p>

                <p className="mt-3 text-[15px] leading-6 text-zinc-200">
                  Outstanding receivables deserve attention before they put
                  near-term cash flow under pressure.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["Receivables", "Cash Flow", "Priority"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/[0.045] px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-[#D4AF37]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[9px] text-zinc-600">
                <ShieldCheck size={12} className="text-[#D4AF37]" />
                Generated from financial activity available in DhanarkOS.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-2xl">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              UNDERSTANDING THE DIFFERENCE
            </p>

            <h2 className="mt-4 text-3xl font-light leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              AI CFO vs accounting software vs accountant.
            </h2>

            <p className="mt-5 text-[13px] leading-7 text-zinc-500">
              These tools and roles can overlap, but they solve different
              problems. An AI CFO is primarily focused on financial analysis,
              context and decision support.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {comparison.map((item) => (
              <article
                key={item.label}
                className="grid gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 sm:grid-cols-[220px_1fr] sm:items-center sm:p-6"
              >
                <h3 className="text-[14px] font-medium text-zinc-200">
                  {item.label}
                </h3>

                <p className="text-[12px] leading-6 text-zinc-500">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="border-y border-white/[0.055] bg-[#090A0B] px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                WHO IT&apos;S FOR
              </p>

              <h2 className="mt-4 text-3xl font-light leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Built for businesses that have outgrown guesswork.
              </h2>
            </div>

            <div className="space-y-5">
              {[
                "Founders who want a clearer view of business cash flow.",
                "Growing businesses managing more customers, invoices and payments.",
                "Teams that want financial analysis without manually building every report.",
                "Business owners who want financial information connected to practical decisions.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <Check
                    size={15}
                    className="mt-1 shrink-0 text-[#D4AF37]"
                  />

                  <p className="text-[13px] leading-7 text-zinc-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[900px]">
          <div className="text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              COMMON QUESTIONS
            </p>

            <h2 className="mt-4 text-3xl font-light tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Questions about AI CFOs.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[13px] leading-7 text-zinc-500">
              Clear answers to the questions business owners commonly ask
              before adopting AI-powered financial intelligence.
            </p>
          </div>

          <div className="mt-12 space-y-3">
            {questions.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6 sm:p-7"
              >
                <h3 className="text-[16px] font-medium tracking-[-0.02em] text-zinc-100">
                  {item.question}
                </h3>

                <p className="mt-3 text-[12px] leading-6 text-zinc-500 sm:text-[13px]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.055] px-5 py-24 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <BrainCircuit
            size={25}
            strokeWidth={1.4}
            className="mx-auto text-[#D4AF37]"
          />

          <h2 className="mt-6 text-4xl font-light leading-[1] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Stop reading the numbers.
            <br />
            <span className="text-zinc-500">
              Start understanding them.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[12px] leading-6 text-zinc-600">
            DhanarkOS brings your financial operations and AI-powered
            financial intelligence into one command center.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-[12px] font-semibold text-black transition hover:bg-[#E2C04A]"
          >
            Start Your 7-Day Free Trial
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.055] px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-[14px] font-semibold tracking-[-0.03em]"
          >
            Dhanark
            <span className="text-[#D4AF37]">OS</span>
          </Link>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] text-zinc-600">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            <Link href="/pricing" className="transition hover:text-white">
              Pricing
            </Link>

            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>

            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>

            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}