// src/app/walkthrough/page.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  FileBarChart2,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

type WalkthroughSection = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  details: string;
  icon: React.ElementType;
  href: string;
  action: string;
  features: string[];
};

const sections: WalkthroughSection[] = [
  {
    number: "01",
    eyebrow: "WORKSPACE",
    title: "Mission Control",
    description:
      "Your starting point inside ArkenOne. See the financial position of your business without digging through multiple screens.",
    details:
      "Use Mission Control to understand the current state of your business first. Revenue, expenses, profit, cash proxy, receivables, customers, financial health, and trend are brought together here.",
    icon: LayoutDashboard,
    href: "/dashboard",
    action: "Open Mission Control",
    features: [
      "Financial Health",
      "Revenue",
      "Expenses",
      "Profit",
      "Receivables",
      "Customer count",
    ],
  },
  {
    number: "02",
    eyebrow: "OPERATIONS",
    title: "Customers",
    description:
      "Keep your customer information organized and connected to the rest of your financial workflow.",
    details:
      "Add customers individually or bring an existing customer list into ArkenOne. Your customer records become the foundation for invoices and payment workflows.",
    icon: Users,
    href: "/customers",
    action: "Open Customers",
    features: [
      "Customer records",
      "Contact details",
      "Customer information",
      "Import customer lists",
    ],
  },
  {
    number: "03",
    eyebrow: "OPERATIONS",
    title: "Invoices",
    description:
      "Create invoices and keep track of what your customers owe you.",
    details:
      "Use the invoice workspace to create and manage invoices. Once an invoice exists, ArkenOne can keep the amount due and payment status visible in your financial picture.",
    icon: FileText,
    href: "/invoices",
    action: "Open Invoices",
    features: [
      "Create invoices",
      "Track invoice status",
      "Monitor balances",
      "View outstanding amounts",
    ],
  },
  {
    number: "04",
    eyebrow: "OPERATIONS",
    title: "Record Payment",
    description:
      "Record payments received from customers and keep your receivables accurate.",
    details:
      "When a customer pays outside the automated payment flow, use Record Payment to register the payment against the relevant invoice.",
    icon: WalletCards,
    href: "/record-payment",
    action: "Record a Payment",
    features: [
      "Record received payments",
      "Update invoice balances",
      "Keep receivables accurate",
      "Maintain payment history",
    ],
  },
  {
    number: "05",
    eyebrow: "OPERATIONS",
    title: "Expenses",
    description:
      "Bring business spending into the same financial picture as your revenue.",
    details:
      "Record your business expenses so ArkenOne can account for spending when presenting your profitability and financial health.",
    icon: Receipt,
    href: "/expenses",
    action: "Open Expenses",
    features: [
      "Record expenses",
      "Track business spending",
      "Understand expense impact",
      "Improve financial visibility",
    ],
  },
  {
    number: "06",
    eyebrow: "INTELLIGENCE",
    title: "AI CFO",
    description:
      "Go beyond numbers and use your financial information to support better decisions.",
    details:
      "The AI CFO is ArkenOne's intelligence layer. It is designed to interpret the financial information available in your workspace and turn it into useful business context.",
    icon: Brain,
    href: "/dashboard/ai-cfo",
    action: "Open AI CFO",
    features: [
      "Financial insights",
      "Business context",
      "Risk awareness",
      "Decision support",
    ],
  },
  {
    number: "07",
    eyebrow: "INTELLIGENCE",
    title: "Financial Analysis",
    description:
      "Look deeper into your business performance when the overview is not enough.",
    details:
      "Use Financial Analysis when you want a more detailed view of the numbers behind your business and a clearer understanding of performance.",
    icon: BarChart3,
    href: "/dashboard/financial-analysis",
    action: "Open Financial Analysis",
    features: [
      "Performance analysis",
      "Financial trends",
      "Detailed business view",
      "Decision support",
    ],
  },
  {
    number: "08",
    eyebrow: "INTELLIGENCE",
    title: "Executive Reports",
    description:
      "Turn your financial information into a cleaner management-level view.",
    details:
      "Executive Reports are designed for reviewing the business at a higher level and creating a more structured picture of financial performance.",
    icon: FileBarChart2,
    href: "/dashboard/reports",
    action: "Open Executive Reports",
    features: [
      "Executive reporting",
      "Financial summaries",
      "Management visibility",
      "Business review",
    ],
  },
  {
    number: "09",
    eyebrow: "COMPANY",
    title: "Company",
    description:
      "Manage the business information that powers your ArkenOne workspace.",
    details:
      "Use the Company area when you need to review or update your business profile and the information associated with your ArkenOne account.",
    icon: Building2,
    href: "/company",
    action: "Open Company",
    features: [
      "Business profile",
      "Company information",
      "Business details",
      "Account context",
    ],
  },
  {
    number: "10",
    eyebrow: "CONFIGURATION",
    title: "Settings",
    description:
      "Control the configuration of your ArkenOne workspace.",
    details:
      "Settings is where you can manage the configuration and preferences available for your account as ArkenOne continues to expand.",
    icon: Settings,
    href: "/settings",
    action: "Open Settings",
    features: [
      "Workspace settings",
      "Account preferences",
      "Configuration",
      "Future controls",
    ],
  },
];

export default function WalkthroughPage() {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const current =
    sections[currentIndex];

  const Icon = current.icon;

  const isFirst =
    currentIndex === 0;

  const isLast =
    currentIndex ===
    sections.length - 1;

  function next() {
    if (isLast) {
      return;
    }

    setCurrentIndex(
      (value) => value + 1
    );
  }

  function previous() {
    if (isFirst) {
      return;
    }

    setCurrentIndex(
      (value) => value - 1
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#0B0B0C]
        px-4
        py-6
        text-white
        sm:px-6
        sm:py-8
      "
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-white/[0.06]
            pb-5
          "
        >
          <Link
            href="/dashboard"
            className="
              flex
              items-center
              gap-3
              text-sm
              font-semibold
              tracking-tight
              text-white
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-[#D4AF37]/20
                bg-[#D4AF37]/[0.07]
              "
            >
              <span className="text-xs font-semibold text-[#D4AF37]">
                A
              </span>
            </div>

            ArkenOne
          </Link>

          <Link
            href="/dashboard"
            className="
              text-xs
              font-medium
              text-zinc-600
              transition
              hover:text-zinc-300
            "
          >
            Back to Mission Control
          </Link>
        </header>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="
            mx-auto
            max-w-3xl
            px-2
            pb-10
            pt-14
            text-center
            sm:pb-14
            sm:pt-20
          "
        >
          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.34em]
              text-[#D4AF37]
            "
          >
            Product Walkthrough
          </p>

          <h1
            className="
              mt-4
              text-3xl
              font-semibold
              tracking-[-0.045em]
              text-white
              sm:text-5xl
            "
          >
            Know where to go.
            <br />
            Know what to do.
          </h1>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-zinc-500
              sm:text-base
            "
          >
            A practical guide to ArkenOne.
            Explore each part of the platform,
            understand what it does, and open
            the right workspace when you're
            ready to use it.
          </p>
        </section>

        {/* =====================================================
            MAIN WALKTHROUGH
        ===================================================== */}

        <section
          className="
            overflow-hidden
            rounded-[30px]
            border
            border-white/[0.07]
            bg-[#101214]
            shadow-[0_40px_120px_rgba(0,0,0,0.35)]
          "
        >
          {/* PROGRESS */}

          <div className="flex gap-1 px-5 pt-5 sm:px-7 sm:pt-7">
            {sections.map(
              (section, index) => (
                <button
                  key={section.number}
                  type="button"
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  aria-label={`Open ${section.title}`}
                  className="
                    h-1
                    flex-1
                    overflow-hidden
                    rounded-full
                    bg-white/[0.06]
                    transition
                    hover:bg-white/[0.12]
                  "
                >
                  <span
                    className={`
                      block
                      h-full
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        index <= currentIndex
                          ? "bg-[#D4AF37]"
                          : "bg-transparent"
                      }
                    `}
                  />
                </button>
              )
            )}
          </div>

          <div
            className="
              grid
              lg:grid-cols-[0.8fr_1.2fr]
            "
          >
            {/* =================================================
                VISUAL PANEL
            ================================================= */}

            <div
              className="
                flex
                min-h-[360px]
                items-center
                justify-center
                border-b
                border-white/[0.06]
                bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_58%)]
                p-8
                lg:min-h-[570px]
                lg:border-b-0
                lg:border-r
              "
            >
              <div className="relative">
                <div
                  className="
                    absolute
                    inset-[-50px]
                    rounded-full
                    border
                    border-[#D4AF37]/[0.06]
                  "
                />

                <div
                  className="
                    absolute
                    inset-[-85px]
                    rounded-full
                    border
                    border-[#D4AF37]/[0.035]
                  "
                />

                <div
                  className="
                    absolute
                    inset-[-120px]
                    rounded-full
                    border
                    border-white/[0.025]
                  "
                />

                <div
                  className="
                    relative
                    flex
                    h-28
                    w-28
                    items-center
                    justify-center
                    rounded-[30px]
                    border
                    border-[#D4AF37]/20
                    bg-[#D4AF37]/[0.07]
                    shadow-[0_20px_70px_rgba(212,175,55,0.08)]
                  "
                >
                  <Icon
                    size={42}
                    strokeWidth={1.35}
                    className="text-[#D4AF37]"
                  />
                </div>

                <div
                  className="
                    absolute
                    -bottom-6
                    left-1/2
                    -translate-x-1/2
                    whitespace-nowrap
                    rounded-full
                    border
                    border-white/[0.07]
                    bg-[#111315]
                    px-4
                    py-2
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.24em]
                    text-zinc-500
                  "
                >
                  {current.number} /{" "}
                  {String(
                    sections.length
                  ).padStart(2, "0")}
                </div>
              </div>
            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="flex flex-col p-6 sm:p-8 lg:p-12">
              <div>
                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.30em]
                    text-[#D4AF37]
                  "
                >
                  {current.eyebrow}
                </p>

                <h2
                  className="
                    mt-4
                    text-2xl
                    font-semibold
                    tracking-[-0.035em]
                    text-white
                    sm:text-3xl
                  "
                >
                  {current.title}
                </h2>

                <p
                  className="
                    mt-4
                    text-sm
                    leading-7
                    text-zinc-400
                  "
                >
                  {current.description}
                </p>

                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-white/[0.018]
                    p-4
                  "
                >
                  <p
                    className="
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.28em]
                      text-zinc-600
                    "
                  >
                    What to do here
                  </p>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-zinc-500
                    "
                  >
                    {current.details}
                  </p>
                </div>
              </div>

              {/* =================================================
                  FEATURES
              ================================================= */}

              <div className="mt-7">
                <p
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.28em]
                    text-zinc-600
                  "
                >
                  What you can do
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {current.features.map(
                    (feature) => (
                      <div
                        key={feature}
                        className="
                          flex
                          items-center
                          gap-3
                          rounded-xl
                          border
                          border-white/[0.06]
                          bg-white/[0.018]
                          px-4
                          py-3
                        "
                      >
                        <div
                          className="
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#D4AF37]/[0.10]
                          "
                        >
                          <Check
                            size={11}
                            className="text-[#D4AF37]"
                          />
                        </div>

                        <span className="text-xs text-zinc-400">
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* =================================================
                  ACTION
              ================================================= */}

              <div className="mt-7">
                <Link
                  href={current.href}
                  className="
                    flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#D4AF37]
                    px-5
                    text-xs
                    font-semibold
                    text-black
                    transition
                    hover:bg-[#E2C04A]
                    sm:w-fit
                  "
                >
                  {current.action}

                  <ArrowRight
                    size={15}
                  />
                </Link>
              </div>

              {/* =================================================
                  NAVIGATION
              ================================================= */}

              <div
                className="
                  mt-8
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-white/[0.06]
                  pt-6
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={previous}
                  className="
                    flex
                    min-h-10
                    items-center
                    justify-center
                    gap-1.5
                    rounded-xl
                    border
                    border-white/[0.08]
                    px-4
                    text-xs
                    font-medium
                    text-zinc-500
                    transition
                    hover:bg-white/[0.035]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-25
                  "
                >
                  <ChevronLeft
                    size={14}
                  />

                  Previous
                </button>

                <button
                  type="button"
                  disabled={isLast}
                  onClick={next}
                  className="
                    flex
                    min-h-10
                    items-center
                    justify-center
                    gap-1.5
                    rounded-xl
                    border
                    border-white/[0.08]
                    px-4
                    text-xs
                    font-medium
                    text-zinc-400
                    transition
                    hover:bg-white/[0.035]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-25
                  "
                >
                  Next

                  <ChevronRight
                    size={14}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK NAVIGATION
        ===================================================== */}

        <section className="py-12 sm:py-16">
          <div className="mb-5">
            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.30em]
                text-[#D4AF37]
              "
            >
              Quick Access
            </p>

            <h2
              className="
                mt-2
                text-xl
                font-semibold
                tracking-tight
                text-white
              "
            >
              Go directly where you need to.
            </h2>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {sections.map(
              (section) => {
                const SectionIcon =
                  section.icon;

                return (
                  <Link
                    key={section.number}
                    href={section.href}
                    className="
                      group
                      rounded-2xl
                      border
                      border-white/[0.06]
                      bg-white/[0.015]
                      p-4
                      transition
                      duration-300
                      hover:border-[#D4AF37]/15
                      hover:bg-white/[0.025]
                    "
                  >
                    <SectionIcon
                      size={17}
                      strokeWidth={1.7}
                      className="
                        text-zinc-600
                        transition
                        group-hover:text-[#D4AF37]
                      "
                    />

                    <p
                      className="
                        mt-4
                        text-xs
                        font-medium
                        text-zinc-300
                        group-hover:text-white
                      "
                    >
                      {section.title}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                        {section.number}
                      </span>

                      <ArrowRight
                        size={13}
                        className="
                          text-zinc-700
                          transition
                          group-hover:translate-x-0.5
                          group-hover:text-[#D4AF37]
                        "
                      />
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <section
          className="
            border-t
            border-white/[0.06]
            py-10
            text-center
          "
        >
          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.30em]
              text-zinc-700
            "
          >
            ArkenOne
          </p>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-xs
              leading-6
              text-zinc-700
            "
          >
            One connected financial workspace
            for understanding, operating, and
            growing your business.
          </p>
        </section>
      </div>
    </main>
  );
}