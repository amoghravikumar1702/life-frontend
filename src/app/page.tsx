"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";
import DhanarkLogo from "@/components/brand/DhanarkLogo";

const features = [
  {
    icon: CircleDollarSign,
    title: "Financial Command",
    description:
      "Revenue, cash, receivables and expenses in one financial view.",
  },
  {
    icon: FileText,
    title: "Invoice Intelligence",
    description:
      "Track invoices, collections and outstanding money without the chaos.",
  },
  {
    icon: Users,
    title: "Customer Intelligence",
    description:
      "Connect customers, payments and financial history in one place.",
  },
  {
    icon: BrainCircuit,
    title: "AI CFO",
    description:
      "Turn financial activity into clear signals and next actions.",
  },
];

const howItWorks = [
  {
    number: "01",
    icon: Users,
    title: "Add your customers",
    description:
      "Create your customer base and give DhanarkOS the relationships behind your business.",
    captures: "Customer data",
  },
  {
    number: "02",
    icon: FileText,
    title: "Create invoices",
    description:
      "Record what you are owed and keep every invoice connected to the right customer.",
    captures: "Invoice activity",
  },
  {
    number: "03",
    icon: WalletCards,
    title: "Collect payments",
    description:
      "As payments come in, DhanarkOS keeps your financial position continuously updated.",
    captures: "Payment activity",
  },
  {
    number: "04",
    icon: BrainCircuit,
    title: "AI CFO analyzes",
    description:
      "Your financial activity becomes context the AI CFO can use to identify patterns and priorities.",
    captures: "Financial intelligence",
    featured: true,
  },
];

const plans = [
  {
    name: "Beginner",
    price: "₹799",
    description: "For businesses getting started.",
  },
  {
    name: "Professional",
    price: "₹1,699",
    description: "For businesses ready to grow.",
    featured: true,
  },
  {
    name: "Advanced",
    price: "₹1,999",
    description: "For businesses ready to scale.",
  },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070809] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-[160px]" />

        <div className="absolute bottom-[-250px] right-[-200px] h-[500px] w-[500px] rounded-full bg-[#D4AF37]/[0.018] blur-[140px]" />
      </div>

      {/* ========================================================= */}
      {/* NAVIGATION */}
      {/* ========================================================= */}

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-[1380px] px-3 pt-3 sm:px-6 lg:px-8">
          <div className="relative flex h-14 items-center justify-between rounded-2xl border border-white/[0.08] bg-[#090A0B]/95 px-3 shadow-[0_16px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:h-15 sm:px-4 lg:h-16 lg:px-5">
            {/* Gold line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden rounded-t-2xl">
              <div className="absolute h-px w-1/4 animate-[dhanarkSweep_6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#F7E7A0] to-transparent shadow-[0_0_12px_rgba(212,175,55,0.8)]" />
            </div>

            {/* Logo */}
            <div className="relative z-10">
              <Link href="/" onClick={closeMenu}>
                <DhanarkLogo
                  variant="full"
                  href=""
                  priority
                  className="h-[30px] w-auto sm:h-[34px] lg:h-[38px]"
                />
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center rounded-xl border border-white/[0.055] bg-black/20 p-1 md:flex">
              <a
                href="#platform"
                className="rounded-lg px-4 py-2 text-[11px] text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
              >
                Platform
              </a>

              <a
                href="#how-it-works"
                className="rounded-lg px-4 py-2 text-[11px] text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
              >
                How It Works
              </a>

              <a
                href="#intelligence"
                className="flex items-center gap-2 rounded-lg border border-[#D4AF37]/15 bg-[#D4AF37]/[0.055] px-4 py-2 text-[11px] text-[#E4C85A]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />

                AI CFO

                <span className="rounded bg-[#D4AF37]/10 px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  Live
                </span>
              </a>

              <Link
                href="/pricing"
                className="rounded-lg px-4 py-2 text-[11px] text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
              >
                Pricing
              </Link>
            </nav>

            {/* Desktop actions */}
            <div className="relative z-10 ml-auto hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-[11px] text-zinc-500 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="group flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-[11px] font-semibold text-black transition hover:bg-[#E2C04A]"
              >
                Enter DhanarkOS

                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="relative z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-zinc-300 md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>

            {/* Mobile menu */}
            {mobileOpen && (
              <div className="absolute left-0 right-0 top-[62px] rounded-2xl border border-white/[0.08] bg-[#0A0B0C] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.7)] md:hidden">
                <div className="mb-2 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.035] p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
                      AI CFO · LIVE
                    </span>
                  </div>

                  <p className="mt-1 text-[9px] text-zinc-600">
                    Financial intelligence at your command.
                  </p>
                </div>

                {[
                  ["Platform", "#platform"],
                  ["How It Works", "#how-it-works"],
                  ["AI CFO", "#intelligence"],
                  ["Pricing", "#pricing"],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    {label}
                  </a>
                ))}

                <div className="my-2 h-px bg-white/[0.06]" />

                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3 text-sm text-zinc-400"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="mt-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] text-sm font-semibold text-black"
                >
                  Enter DhanarkOS
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pb-24 lg:pt-44">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] xl:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.055] px-3 py-1.5">
                <Sparkles size={11} className="text-[#D4AF37]" />

                <span className="text-[8px] font-medium uppercase tracking-[0.27em] text-[#D4AF37]">
                  Financial Operating System
                </span>
              </div>

              <h1 className="mt-6 text-[50px] font-light leading-[0.94] tracking-[-0.055em] sm:text-[64px] lg:text-[72px] xl:text-[82px]">
                Capital.
                <br />
                <span className="text-zinc-500">Mastered.</span>
              </h1>

              {/* SEO / accessibility context */}
              <p className="sr-only">
                DhanarkOS is an AI financial operating system for growing
                businesses.
              </p>

              <p className="mt-7 max-w-lg text-[14px] leading-7 text-zinc-500 sm:text-[15px]">
                DhanarkOS gives growing businesses one intelligent command
                center to understand money, manage financial operations and
                make better decisions.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 text-[12px] font-semibold text-black transition hover:bg-[#E2C04A]"
                >
                  Start 7-Day Free Trial
                  <ArrowRight size={14} />
                </Link>

                <a
                  href="#platform"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 text-[12px] text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Explore Platform
                  <ChevronRight size={14} />
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[8px] uppercase tracking-[0.18em] text-zinc-700">
                {["7-Day Trial", "Secure Billing", "Full Access"].map(
                  (item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <Check size={10} className="text-[#D4AF37]" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </motion.div>

            {/* Product preview */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-[40px] bg-[#D4AF37]/[0.025] blur-[70px]" />

              <div className="relative overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#0C0E10] p-1.5 shadow-[0_35px_90px_rgba(0,0,0,0.5)]">
                <div className="flex h-9 items-center justify-between px-3">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                  </div>

                  <div className="rounded-md border border-white/[0.05] bg-white/[0.02] px-10 py-1">
                    <span className="text-[6px] text-zinc-700">
                      app.dhanark.com
                    </span>
                  </div>

                  <div className="w-8" />
                </div>

                <div className="grid min-h-[390px] grid-cols-[110px_1fr] sm:min-h-[440px] sm:grid-cols-[140px_1fr]">
                  <div className="border-r border-white/[0.055] p-3 sm:p-4">
                    <DhanarkLogo
                      variant="wordmark"
                      href=""
                      className="mb-7 h-6 w-auto"
                    />

                    <div className="space-y-1">
                      {[
                        "Overview",
                        "Customers",
                        "Invoices",
                        "Expenses",
                        "AI CFO",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-md px-2.5 py-2 text-[7px] sm:text-[8px] ${
                            index === 0
                              ? "bg-white/[0.06] text-white"
                              : "text-zinc-600"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[7px] uppercase tracking-[0.18em] text-zinc-700">
                          Financial Overview
                        </p>

                        <h3 className="mt-1 text-[13px] font-medium text-zinc-200 sm:text-base">
                          Financial Position
                        </h3>
                      </div>

                      <span className="rounded-md bg-[#D4AF37]/[0.06] px-2 py-1 text-[6px] text-[#D4AF37]">
                        LIVE
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        ["Revenue", "₹9.48L"],
                        ["Collected", "₹8.22L"],
                        ["Outstanding", "₹1.26L"],
                        ["Runway", "11.7 Mo"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-lg border border-white/[0.055] bg-white/[0.018] p-2.5 sm:p-3"
                        >
                          <p className="text-[6px] uppercase tracking-[0.12em] text-zinc-700">
                            {label}
                          </p>

                          <p className="mt-1 text-[11px] font-medium text-zinc-200 sm:text-sm">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 rounded-lg border border-white/[0.055] bg-white/[0.018] p-3 sm:p-4">
                      <div className="flex justify-between">
                        <p className="text-[6px] uppercase tracking-[0.15em] text-zinc-700">
                          Revenue Trend
                        </p>

                        <p className="text-[6px] text-zinc-700">
                          6 months
                        </p>
                      </div>

                      <div className="relative mt-3 h-[110px] sm:h-[130px]">
                        <div className="absolute inset-x-0 top-0 border-t border-white/[0.035]" />
                        <div className="absolute inset-x-0 top-1/2 border-t border-white/[0.035]" />
                        <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.035]" />

                        <svg
                          viewBox="0 0 500 130"
                          className="absolute inset-0 h-full w-full"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          <defs>
                            <linearGradient
                              id="revenueFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#D4AF37"
                                stopOpacity="0.18"
                              />

                              <stop
                                offset="100%"
                                stopColor="#D4AF37"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>

                          <path
                            d="M0 105 C50 98 70 76 110 84 C150 92 160 58 200 68 C240 78 250 48 290 55 C330 62 345 35 380 43 C415 51 445 20 500 16 L500 130 L0 130 Z"
                            fill="url(#revenueFill)"
                          />

                          <path
                            d="M0 105 C50 98 70 76 110 84 C150 92 160 58 200 68 C240 78 250 48 290 55 C330 62 345 35 380 43 C415 51 445 20 500 16"
                            fill="none"
                            stroke="#D4AF37"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg border border-[#D4AF37]/12 bg-[#D4AF37]/[0.035] p-3 sm:p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#D4AF37]/10">
                          <BrainCircuit
                            size={13}
                            className="text-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <p className="text-[6px] uppercase tracking-[0.17em] text-[#D4AF37]">
                            AI CFO
                          </p>

                          <p className="mt-0.5 text-[8px] text-zinc-300 sm:text-[9px]">
                            ₹1.26L in receivables deserves attention.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-3 hidden rounded-xl border border-white/[0.08] bg-[#101214]/95 p-3 shadow-xl backdrop-blur-xl sm:block">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={14} className="text-[#D4AF37]" />

                  <div>
                    <p className="text-[6px] uppercase tracking-[0.15em] text-zinc-700">
                      Protected
                    </p>

                    <p className="mt-0.5 text-[8px] text-zinc-400">
                      Financial control
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TRUST STRIP */}
      {/* ========================================================= */}

      <section className="border-y border-white/[0.055] bg-[#090A0B]">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 sm:justify-between sm:px-6 lg:px-8">
          <span className="text-[8px] uppercase tracking-[0.24em] text-zinc-700">
            Built for financial clarity
          </span>

          {["Finance", "Operations", "Intelligence", "Decision Making"].map(
            (item) => (
              <span
                key={item}
                className="text-[8px] uppercase tracking-[0.18em] text-zinc-600"
              >
                {item}
              </span>
            )
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* PLATFORM */}
      {/* ========================================================= */}

      <section
        id="platform"
        className="scroll-mt-28 px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-[1380px]">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                One financial layer
              </p>

              <h2 className="mt-4 max-w-lg text-3xl font-light leading-[1.08] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Everything your business needs to understand money.
              </h2>

              <p className="mt-5 max-w-md text-[13px] leading-6 text-zinc-600">
                Replace disconnected financial tools with one intelligent
                command layer.
              </p>

              <Link
                href="/signup"
                className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium text-[#D4AF37]"
              >
                Build your workspace
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 sm:p-6"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05]">
                      <Icon size={15} className="text-[#D4AF37]" />
                    </div>

                    <h3 className="mt-5 text-sm font-medium">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-[11px] leading-5 text-zinc-600">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* DHAAR / AI CFO INTRO */}
      {/* ========================================================= */}

      <section className="border-y border-white/[0.055] bg-[#090A0B] px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1380px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[520px] overflow-hidden rounded-[30px] border border-[#D4AF37]/20 bg-[#080A0C] shadow-[0_30px_100px_rgba(0,0,0,0.4)] lg:min-h-[560px]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-[120px] top-[-140px] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/[0.055] blur-[120px]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-220px] right-[180px] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/[0.025] blur-[120px]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent"
            />

            <div className="relative z-20 flex min-h-[520px] max-w-[700px] flex-col justify-center px-7 py-12 sm:px-10 lg:min-h-[560px] lg:px-14 lg:py-14">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.055]">
                  <BrainCircuit
                    size={16}
                    strokeWidth={1.5}
                    className="text-[#D4AF37]"
                  />
                </div>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                    DHAAR / AI CFO
                  </p>

                  <p className="mt-1 text-[9px] text-zinc-700">
                    Financial intelligence layer
                  </p>
                </div>
              </div>

              <h2 className="mt-8 max-w-xl text-[44px] font-light leading-[0.98] tracking-[-0.05em] sm:text-[54px] lg:text-[64px]">
                Meet{" "}
                <span className="text-[#D4AF37]">
                  Dhaar.
                </span>
              </h2>

              <p className="mt-5 text-[20px] font-light tracking-[-0.02em] text-zinc-300 sm:text-[22px]">
                The intelligence behind DhanarkOS.
              </p>

              <p className="mt-6 max-w-[560px] text-[13px] leading-7 text-zinc-500 sm:text-[14px]">
                Dhaar turns your business&apos;s financial activity into clear
                signals, priorities and actions — helping you understand what
                is happening, what needs attention and what to do next.
              </p>

              <Link
                href="/signup"
                className="group mt-8 inline-flex w-fit items-center gap-2 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.055] px-4 py-3 text-[10px] font-medium text-[#D4AF37] transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.09]"
              >
                See Dhaar in action

                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[-125px] right-[-65px] z-10 hidden h-[570px] w-[52%] sm:block sm:bottom-[-120px] sm:right-[-45px] sm:h-[600px] lg:bottom-[-115px] lg:right-[-25px] lg:h-[650px] xl:right-[-5px] xl:h-[680px]"
            >
              <Image
                src="/images/dhaar/dhaar-mascot.png"
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 0px, (max-width: 1024px) 52vw, 50vw"
                className="select-none object-contain object-bottom"
              />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-30 rounded-[30px] ring-1 ring-inset ring-white/[0.025]"
            />
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* HOW DHANARK WORKS */}
      {/* ========================================================= */}

      <section
        id="how-it-works"
        className="scroll-mt-28 border-y border-white/[0.055] bg-[#090A0B] px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-[1380px]">
          {/* Section heading */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
              HOW DHANARK WORKS
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-6xl">
              Your financial activity
              <br />
              becomes{" "}
              <span className="text-[#D4AF37]">
                financial intelligence.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-[13px] leading-6 text-zinc-500 sm:text-[14px]">
              DhanarkOS doesn&apos;t ask you to manually build an analysis.
              You use the system normally. As your financial activity builds,
              the AI CFO turns that information into useful signals and
              actions.
            </p>
          </div>

          {/* Workflow */}
          <div className="relative mt-12 lg:mt-14">
            <div className="grid gap-4 lg:grid-cols-4 lg:gap-5">
              {howItWorks.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    className={`group relative min-h-[330px] rounded-[20px] border p-5 sm:p-6 ${
                      step.featured
                        ? "border-[#D4AF37]/25 bg-[#D4AF37]/[0.035]"
                        : "border-white/[0.07] bg-white/[0.018]"
                    }`}
                  >
                    {/* Step header */}
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-[13px] font-semibold tracking-[0.18em] ${
                          step.featured
                            ? "text-[#D4AF37]"
                            : "text-[#D4AF37]/80"
                        }`}
                      >
                        {step.number}
                      </span>

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                          step.featured
                            ? "border-[#D4AF37]/25 bg-[#D4AF37]/[0.07]"
                            : "border-white/[0.08] bg-white/[0.025]"
                        }`}
                      >
                        <Icon
                          size={19}
                          strokeWidth={1.6}
                          className={
                            step.featured
                              ? "text-[#D4AF37]"
                              : "text-zinc-400"
                          }
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-8">
                      <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-100 sm:text-[18px]">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-[11px] leading-5 text-zinc-600 sm:text-[12px] sm:leading-6">
                        {step.description}
                      </p>
                    </div>

                    {/* Captures */}
                    <div
                      className={`absolute bottom-5 left-5 right-5 rounded-xl border p-3 sm:bottom-6 sm:left-6 sm:right-6 ${
                        step.featured
                          ? "border-[#D4AF37]/15 bg-[#D4AF37]/[0.045]"
                          : "border-white/[0.06] bg-black/10"
                      }`}
                    >
                      <p
                        className={`text-[7px] font-semibold uppercase tracking-[0.2em] ${
                          step.featured
                            ? "text-[#D4AF37]"
                            : "text-zinc-700"
                        }`}
                      >
                        DHANARKOS CAPTURES
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <Icon
                          size={12}
                          className={
                            step.featured
                              ? "text-[#D4AF37]"
                              : "text-zinc-500"
                          }
                        />

                        <span className="text-[10px] text-zinc-300 sm:text-[11px]">
                          {step.captures}
                        </span>
                      </div>
                    </div>

                    {/* Desktop connector */}
                    {index < howItWorks.length - 1 && (
                      <div className="pointer-events-none absolute -right-[22px] top-[64px] z-20 hidden items-center lg:flex">
                        <div className="h-px w-5 border-t border-dashed border-[#D4AF37]/35" />

                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-[#0B0C0D] shadow-[0_0_20px_rgba(212,175,55,0.08)]">
                          <ArrowRight
                            size={13}
                            strokeWidth={1.7}
                            className="text-[#D4AF37]"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* AI CFO Result */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mx-auto mt-5 max-w-[1020px]"
          >
            <div className="relative overflow-hidden rounded-[20px] border border-[#D4AF37]/20 bg-[#0B0D0E] p-5 sm:p-6 lg:p-7">
              {/* Subtle glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#D4AF37]/[0.045] blur-[70px]" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* AI icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06]">
                  <BrainCircuit
                    size={21}
                    strokeWidth={1.5}
                    className="text-[#D4AF37]"
                  />
                </div>

                {/* Result */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                      AI CFO RESULT
                    </p>

                    <span className="rounded-full bg-[#D4AF37]/[0.08] px-2 py-1 text-[6px] font-semibold uppercase tracking-[0.12em] text-[#D4AF37]">
                      Generated from activity
                    </span>
                  </div>

                  <p className="mt-2 max-w-3xl text-[12px] leading-5 text-zinc-300 sm:text-[13px] sm:leading-6">
                    ₹1.26L remains outstanding. Two invoices are approaching
                    their expected collection window. Prioritize these
                    receivables to improve near-term cash position.
                  </p>
                </div>

                {/* Action */}
                <Link
                  href="/signup"
                  className="group flex shrink-0 items-center gap-2 text-[10px] font-medium text-[#D4AF37] transition hover:text-[#E2C04A]"
                >
                  View insight

                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* AI CFO */}
      {/* ========================================================= */}

      <section
        id="intelligence"
        className="scroll-mt-28 px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06]">
            <BrainCircuit size={17} className="text-[#D4AF37]" />
          </div>

          <p className="mt-5 text-[8px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            DhanarkOS AI CFO
          </p>

          <h2 className="mt-4 text-3xl font-light leading-[1.05] tracking-[-0.04em] sm:text-4xl lg:text-6xl">
            Don&apos;t just see the numbers.
            <br />
            <span className="text-zinc-500">Know what to do next.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[13px] leading-6 text-zinc-600">
            DhanarkOS transforms financial activity into practical signals,
            priorities and decisions.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PRICING */}
      {/* ========================================================= */}

      <section
        id="pricing"
        className="scroll-mt-28 px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="text-center">
            <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Pricing
            </p>

            <h2 className="mt-4 text-3xl font-light tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Choose your level of control.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-[12px] leading-5 text-zinc-600">
              Every plan begins with a 7-day free trial.
            </p>
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-5 ${
                  plan.featured
                    ? "border-[#D4AF37]/25 bg-[#D4AF37]/[0.035]"
                    : "border-white/[0.07] bg-white/[0.018]"
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#D4AF37]/10 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#D4AF37]">
                    Recommended
                  </span>
                )}

                <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                  {plan.name}
                </p>

                <div className="mt-5 flex items-end gap-1">
                  <span className="text-3xl font-light tracking-[-0.04em]">
                    {plan.price}
                  </span>

                  <span className="mb-1 text-[9px] text-zinc-700">
                    / month
                  </span>
                </div>

                <p className="mt-2 text-[10px] text-zinc-600">
                  {plan.description}
                </p>

                <Link
                  href="/signup"
                  className={`mt-6 flex h-10 items-center justify-center gap-2 rounded-lg text-[11px] font-semibold ${
                    plan.featured
                      ? "bg-[#D4AF37] text-black hover:bg-[#E2C04A]"
                      : "border border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]"
                  }`}
                >
                  Start Free Trial
                  <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-[10px] font-medium text-[#D4AF37] transition hover:text-[#E2C04A]"
            >
              Explore full pricing
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section
        id="about"
        className="scroll-mt-28 border-t border-white/[0.055] px-5 py-24 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32"
      >
        <div className="mx-auto max-w-3xl">
          <ShieldCheck size={25} className="mx-auto text-[#D4AF37]" />

          <h2 className="mt-6 text-4xl font-light leading-[1] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Your business.
            <br />
            <span className="text-zinc-500">Under your command.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-md text-[12px] leading-6 text-zinc-600">
            Start with financial clarity and build toward intelligent
            execution.
          </p>

          <Link
            href="/signup"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-[12px] font-semibold text-black transition hover:bg-[#E2C04A]"
          >
            Start Your 7-Day Free Trial
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="border-t border-white/[0.055] px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            aria-label="DhanarkOS home"
            className="inline-flex items-center transition-opacity hover:opacity-85"
          >
            <DhanarkLogo
              variant="wordmark"
              href=""
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex flex-col items-center gap-4 sm:items-end">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
              <a
                href="mailto:dhanarkos@gmail.com"
                className="text-zinc-400 transition hover:text-white"
              >
                dhanarkos@gmail.com
              </a>

              <a
                href="tel:+918123593336"
                className="text-zinc-400 transition hover:text-white"
              >
                +91 8123593336
              </a>

              <Link
                href="/contact"
                className="text-zinc-400 transition hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="/login"
                className="text-zinc-400 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="text-zinc-400 transition hover:text-white"
              >
                Sign Up
              </Link>

              <Link
                href="/privacy"
                className="text-zinc-400 transition hover:text-white"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="text-zinc-400 transition hover:text-white"
              >
                Terms
              </Link>

              <Link
                href="/cookies"
                className="text-zinc-400 transition hover:text-white"
              >
                Cookies
              </Link>

              <Link
                href="/refund-policy"
                className="text-zinc-400 transition hover:text-white"
              >
                Refunds
              </Link>
            </div>

            <span className="text-xs text-zinc-600">
              © {new Date().getFullYear()} DhanarkOS. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* ANIMATION */}
      {/* ========================================================= */}

      <style jsx global>{`
        @keyframes dhanarkSweep {
          0% {
            transform: translateX(-150%);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          50% {
            opacity: 1;
          }

          60% {
            opacity: 0;
          }

          100% {
            transform: translateX(500%);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}