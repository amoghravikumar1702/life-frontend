"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import DhanarkLogo from "@/components/brand/DhanarkLogo";

type PlanKey = "beginner" | "professional" | "advanced";

type BillingCycle = "monthly" | "yearly";

type RazorpayResponse = {
  razorpay_payment_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (
  options: Record<string, unknown>
) => RazorpayInstance;

type SubscriptionResponse = {
  subscriptionId?: string;
  keyId?: string;
  plan?: PlanKey;
  planName?: string;
  planId?: string;
  billingCycle?: BillingCycle;
  amount?: number;
  currency?: string;
  trialDays?: number;
  status?: string;
  trialEndsAt?: string | null;
  startAt?: number | null;
  reused?: boolean;
  alreadyAuthorized?: boolean;
};

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const RAZORPAY_CHECKOUT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

const plans = [
  {
    key: "beginner" as PlanKey,
    name: "Beginner",
    monthly: 799,
    yearly: 7999,
    description:
      "A focused financial workspace for businesses getting started.",
    features: [
      "Customers & invoices",
      "Payment tracking",
      "Expense management",
      "Financial overview",
      "Core DhanarkOS intelligence",
    ],
  },

  {
    key: "professional" as PlanKey,
    name: "Professional",
    monthly: 1699,
    yearly: 16999,
    description:
      "The complete financial operating layer for growing businesses.",
    features: [
      "Everything in Beginner",
      "AI CFO insights",
      "Advanced cash-flow visibility",
      "Financial analysis",
      "Reports & business intelligence",
    ],
    featured: true,
  },

  {
    key: "advanced" as PlanKey,
    name: "Advanced",
    monthly: 1999,
    yearly: 19999,
    description:
      "Maximum financial intelligence for businesses ready to scale.",
    features: [
      "Everything in Professional",
      "Advanced AI CFO intelligence",
      "Deeper financial analysis",
      "Priority capabilities",
      "Built for scaling operations",
    ],
  },
];

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getYearlySavings(monthly: number, yearly: number) {
  const normalYearly = monthly * 12;

  const savings = normalYearly - yearly;

  const percentage =
    normalYearly > 0
      ? Math.round((savings / normalYearly) * 100)
      : 0;

  return {
    amount: savings,
    percentage,
  };
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_CHECKOUT_URL}"]`
    );

    if (existingScript) {
      const handleLoad = () => {
        resolve(Boolean(window.Razorpay));
      };

      const handleError = () => {
        resolve(false);
      };

      existingScript.addEventListener("load", handleLoad, {
        once: true,
      });

      existingScript.addEventListener("error", handleError, {
        once: true,
      });

      return;
    }

    const script = document.createElement("script");

    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;

    script.onload = () => {
      resolve(Boolean(window.Razorpay));
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>("monthly");

  const [selectedPlan, setSelectedPlan] =
    useState<PlanKey | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [isCheckingAuth, setIsCheckingAuth] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  /*
   * ============================================================
   * AUTHENTICATION GATE
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    async function checkAuthentication() {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!mounted) {
          return;
        }

        if (error) {
          console.error(
            "[DhanarkOS Pricing] Authentication check error:",
            error
          );
        }

        if (!user) {
          window.location.replace("/signup");
          return;
        }

        setIsCheckingAuth(false);
      } catch (error) {
        console.error(
          "[DhanarkOS Pricing] Authentication check failed:",
          error
        );

        if (mounted) {
          window.location.replace("/signup");
        }
      }
    }

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ============================================================
   * SUBSCRIBE
   * ============================================================
   */

  async function handleSubscribe(plan: PlanKey) {
    if (isProcessing || isCheckingAuth) {
      return;
    }

    setErrorMessage("");
    setSelectedPlan(plan);
    setIsProcessing(true);

    try {
      /*
       * --------------------------------------------------------
       * FINAL AUTH CHECK
       * --------------------------------------------------------
       */

      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error(
          "[DhanarkOS Pricing] Final auth check failed:",
          authError
        );
      }

      if (!user) {
        window.location.replace("/signup");
        return;
      }

      /*
       * --------------------------------------------------------
       * CREATE / RECOVER SUBSCRIPTION
       * --------------------------------------------------------
       *
       * IMPORTANT:
       *
       * We intentionally call our backend BEFORE loading or
       * opening Razorpay.
       *
       * The backend knows whether the existing Razorpay
       * subscription is already authenticated.
       */

      const createResponse = await fetch(
        "/api/subscription/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          credentials: "include",

          cache: "no-store",

          body: JSON.stringify({
            plan,
            billingCycle,
          }),
        }
      );

      let createResult: {
        data?: SubscriptionResponse;
        error?: string;
        message?: string;
      } = {};

      try {
        createResult = await createResponse.json();
      } catch {
        throw new Error(
          `Unable to create your DhanarkOS subscription. (${createResponse.status})`
        );
      }

      if (!createResponse.ok || !createResult.data) {
        throw new Error(
          createResult.error ??
            createResult.message ??
            `Unable to create your DhanarkOS subscription. (${createResponse.status})`
        );
      }

      const subscription = createResult.data;

      /*
       * ========================================================
       * CRITICAL: ALREADY AUTHORIZED
       * ========================================================
       *
       * Razorpay has already authenticated this subscription.
       *
       * DO NOT:
       *
       * - Load Razorpay Checkout
       * - Create a new subscription
       * - Call new window.Razorpay(...)
       * - Call /api/subscription/verify
       *
       * The authorization step is already complete.
       *
       * Go directly to onboarding.
       *
       * We check BOTH flags intentionally:
       *
       * 1. alreadyAuthorized === true
       * 2. status === "authenticated"
       *
       * This makes the frontend defensive even if the backend
       * response changes slightly in the future.
       */

      const alreadyAuthorized =
        subscription.alreadyAuthorized === true ||
        subscription.status === "authenticated";

      if (alreadyAuthorized) {
        console.log(
          "[DhanarkOS] Subscription already authenticated. Skipping Razorpay Checkout.",
          {
            subscriptionId:
              subscription.subscriptionId,

            status:
              subscription.status,

            reused:
              subscription.reused,

            alreadyAuthorized:
              subscription.alreadyAuthorized,

            plan:
              subscription.plan,

            billingCycle:
              subscription.billingCycle,

            trialEndsAt:
              subscription.trialEndsAt,
          }
        );

        /*
         * Stop the loading state before navigation.
         */

        setIsProcessing(false);
        setSelectedPlan(null);

        /*
         * IMPORTANT:
         *
         * No Razorpay code runs from this point.
         */

        window.location.replace("/onboarding");

        return;
      }

      /*
       * --------------------------------------------------------
       * VALIDATE SUBSCRIPTION
       * --------------------------------------------------------
       */

      if (!subscription.subscriptionId) {
        throw new Error(
          "Razorpay did not return a subscription ID."
        );
      }

      if (!subscription.keyId) {
        throw new Error(
          "Razorpay public key is not configured."
        );
      }

      /*
       * --------------------------------------------------------
       * LOAD RAZORPAY
       * --------------------------------------------------------
       *
       * We only reach this point when Checkout is actually
       * required.
       */

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error(
          "Unable to load secure payment checkout. Please disable ad blockers or privacy extensions and try again."
        );
      }

      /*
       * --------------------------------------------------------
       * DEBUG
       * --------------------------------------------------------
       */

      console.log(
        "[DhanarkOS DEBUG] Opening Razorpay Checkout:",
        {
          keyId: subscription.keyId,

          subscriptionId:
            subscription.subscriptionId,

          planId:
            subscription.planId,

          plan:
            subscription.plan,

          billingCycle:
            subscription.billingCycle,

          status:
            subscription.status,

          reused:
            subscription.reused,

          alreadyAuthorized:
            subscription.alreadyAuthorized,
        }
      );

      /*
       * --------------------------------------------------------
       * OPEN RAZORPAY
       * --------------------------------------------------------
       *
       * This block can ONLY be reached when the subscription
       * is NOT already authenticated.
       */

      const razorpay = new window.Razorpay({
        key: subscription.keyId,

        subscription_id:
          subscription.subscriptionId,

        name: "DhanarkOS",

        description:
          `${
            subscription.planName ?? "DhanarkOS"
          } — ${
            billingCycle === "yearly"
              ? "Yearly"
              : "Monthly"
          } — 7-day free trial`,

        notes: {
          product: "DhanarkOS",

          plan:
            subscription.plan ?? plan,

          planId:
            subscription.planId ?? "",

          billingCycle:
            subscription.billingCycle ??
            billingCycle,

          trialDays: String(
            subscription.trialDays ?? 7
          ),
        },

        theme: {
          color: "#D4AF37",
        },

        modal: {
          ondismiss: () => {
            console.log(
              "[DhanarkOS] Razorpay checkout dismissed."
            );

            setIsProcessing(false);
            setSelectedPlan(null);
          },
        },

        handler: async function (
          response: RazorpayResponse
        ) {
          try {
            /*
             * ------------------------------------------------
             * VALIDATE RESPONSE
             * ------------------------------------------------
             */

            if (
              !response?.razorpay_payment_id ||
              !response?.razorpay_subscription_id ||
              !response?.razorpay_signature
            ) {
              throw new Error(
                "Razorpay did not return complete subscription authorization data."
              );
            }

            /*
             * ------------------------------------------------
             * SERVER VERIFICATION
             * ------------------------------------------------
             *
             * This route is ONLY used for a fresh Checkout
             * authorization.
             *
             * Already-authenticated subscriptions never reach
             * this handler because Checkout is never opened.
             */

            const verifyResponse =
              await fetch(
                "/api/subscription/verify",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    Accept:
                      "application/json",
                  },

                  credentials:
                    "include",

                  cache: "no-store",

                  body: JSON.stringify({
                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_subscription_id:
                      response.razorpay_subscription_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }),
                }
              );

            let verifyResult: {
              data?: {
                activated?: boolean;

                trialStatus?: string;

                subscriptionStatus?: string;

                subscriptionId?: string;

                paymentId?: string;

                trialEndsAt?: string;

                plan?: string | null;

                billingCycle?: string;
              };

              error?: string;

              message?: string;
            } = {};

            try {
              verifyResult =
                await verifyResponse.json();
            } catch {
              throw new Error(
                `Payment verification failed. (${verifyResponse.status})`
              );
            }

            if (
              !verifyResponse.ok ||
              !verifyResult.data?.activated
            ) {
              throw new Error(
                verifyResult.error ??
                  verifyResult.message ??
                  "Your Razorpay subscription authorization could not be verified."
              );
            }

            console.log(
              "[DhanarkOS] Subscription authorization verified:",
              {
                subscriptionId:
                  verifyResult.data
                    ?.subscriptionId,

                paymentId:
                  verifyResult.data
                    ?.paymentId,

                trialEndsAt:
                  verifyResult.data
                    ?.trialEndsAt,
              }
            );

            window.location.replace(
              "/onboarding"
            );
          } catch (error) {
            console.error(
              "[DhanarkOS] Subscription verification failed:",
              error
            );

            setErrorMessage(
              error instanceof Error
                ? error.message
                : "We could not verify your subscription authorization. If you were charged, please contact support."
            );

            setIsProcessing(false);
            setSelectedPlan(null);
          }
        },
      });

      razorpay.open();
    } catch (error) {
      console.error(
        "[DhanarkOS] Subscription checkout failed:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start secure checkout."
      );

      setIsProcessing(false);
      setSelectedPlan(null);
    }
  }

  /*
   * ============================================================
   * AUTH CHECK SCREEN
   * ============================================================
   */

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090A] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={22}
            className="animate-spin text-[#D4AF37]"
          />

          <p className="text-xs text-zinc-600">
            Securing your workspace...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090A] text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-260px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-260px] right-[-180px] h-[500px] w-[500px] rounded-full bg-[#D4AF37]/[0.02] blur-[140px]" />

      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <DhanarkLogo
            variant="full"
            href="/"
            className="h-10 w-auto"
            priority
          />

          <Link
            href="/"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/[0.03] hover:text-zinc-200"
          >
            Back
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] shadow-[0_0_50px_rgba(212,175,55,0.06)]">
            <LockKeyhole
              size={22}
              strokeWidth={1.5}
              className="text-[#D4AF37]"
            />
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
            Start your journey
          </p>

          <h1 className="mt-4 text-4xl font-light tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Choose your level of control.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            Select the DhanarkOS plan that fits
            your business. Every plan begins with
            a 7-day free trial.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1.5">
            <button
              type="button"
              onClick={() =>
                setBillingCycle("monthly")
              }
              disabled={isProcessing}
              className={`rounded-xl px-6 py-2.5 text-sm font-medium transition ${
                billingCycle === "monthly"
                  ? "bg-white/[0.09] text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() =>
                setBillingCycle("yearly")
              }
              disabled={isProcessing}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition ${
                billingCycle === "yearly"
                  ? "bg-[#D4AF37] text-black shadow-[0_8px_30px_rgba(212,175,55,0.12)]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Yearly

              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  billingCycle === "yearly"
                    ? "bg-black/10 text-black"
                    : "bg-[#D4AF37]/10 text-[#D4AF37]"
                }`}
              >
                Save
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-7">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-[11px] text-zinc-600">
              7-day free trial
            </span>
          </div>

          <div className="hidden h-3 w-px bg-white/[0.08] sm:block" />

          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-[11px] text-zinc-600">
              Secure Razorpay billing
            </span>
          </div>

          <div className="hidden h-3 w-px bg-white/[0.08] sm:block" />

          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-[11px] text-zinc-600">
              Cancel anytime
            </span>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const loading =
              isProcessing &&
              selectedPlan === plan.key;

            const price =
              billingCycle === "yearly"
                ? plan.yearly
                : plan.monthly;

            const savings =
              getYearlySavings(
                plan.monthly,
                plan.yearly
              );

            return (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-[24px] border p-6 transition duration-300 sm:p-7 ${
                  plan.featured
                    ? "border-[#D4AF37]/30 bg-[#D4AF37]/[0.035] shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
                    : "border-white/[0.07] bg-white/[0.018] hover:border-white/[0.12]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-5 top-5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                    Recommended
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                    {plan.name}
                  </p>

                  <h2 className="mt-4 text-xl font-medium tracking-tight text-white">
                    {plan.name}
                  </h2>

                  <p className="mt-3 min-h-[60px] text-xs leading-5 text-zinc-600">
                    {plan.description}
                  </p>
                </div>

                <div className="mt-7">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-medium tracking-[-0.04em] text-white">
                      {formatINR(price)}
                    </span>

                    <span className="mb-1 text-xs text-zinc-600">
                      /
                      {billingCycle === "yearly"
                        ? "year"
                        : "month"}
                    </span>
                  </div>

                  {billingCycle === "yearly" ? (
                    <p className="mt-2 text-[10px] text-zinc-600">
                      Save{" "}
                      <span className="text-[#D4AF37]">
                        {formatINR(
                          savings.amount
                        )}
                      </span>{" "}
                      / year
                      <span className="ml-1 text-zinc-500">
                        ({savings.percentage}%)
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-[10px] text-zinc-700">
                      7 days free, then{" "}
                      <span className="text-zinc-400">
                        {formatINR(
                          plan.monthly
                        )}
                      </span>{" "}
                      / month
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() =>
                    handleSubscribe(plan.key)
                  }
                  className={`mt-7 flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    plan.featured
                      ? "bg-[#D4AF37] text-black hover:bg-[#E2C04A]"
                      : "border border-white/[0.08] bg-white/[0.025] text-zinc-300 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />

                      Opening secure checkout...
                    </>
                  ) : (
                    <>
                      Start free trial

                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <div className="mt-7 border-t border-white/[0.06] pt-6">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-700">
                    Includes
                  </p>

                  <div className="mt-4 space-y-3">
                    {plan.features.map(
                      (feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-2.5"
                        >
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/[0.08]">
                            <Check
                              size={10}
                              strokeWidth={2}
                              className="text-[#D4AF37]"
                            />
                          </div>

                          <span className="text-xs leading-5 text-zinc-500">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {errorMessage && (
          <div className="mx-auto mt-8 flex max-w-xl items-start gap-3 rounded-2xl border border-red-500/15 bg-red-500/[0.035] px-5 py-4">
            <X
              size={16}
              className="mt-0.5 shrink-0 text-red-400"
            />

            <div>
              <p className="text-xs font-medium text-red-300">
                Subscription setup could not be completed
              </p>

              <p className="mt-1 text-xs leading-5 text-red-400/70">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-xl text-center">
          <p className="text-[10px] leading-5 text-zinc-700">
            Your 7-day trial begins after
            secure Razorpay authorization.
            Your selected{" "}
            {billingCycle === "yearly"
              ? "yearly"
              : "monthly"}{" "}
            plan begins billing after the
            trial period.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] text-zinc-600">
            <Link
              href="/terms"
              className="transition hover:text-zinc-300"
            >
              Terms of Service
            </Link>

            <span className="text-zinc-800">
              •
            </span>

            <Link
              href="/privacy"
              className="transition hover:text-zinc-300"
            >
              Privacy Policy
            </Link>

            <span className="text-zinc-800">
              •
            </span>

            <Link
              href="/refund-policy"
              className="transition hover:text-[#D4AF37]"
            >
              Refund Policy
            </Link>
          </div>

          <p className="mt-4 text-[10px] leading-5 text-zinc-700">
            Subscriptions are non-refundable.
            Cancelling your subscription does not
            create an entitlement to a refund for
            the current billing period, except where
            a refund is required by applicable law.
          </p>
        </div>
      </div>
    </main>
  );
}