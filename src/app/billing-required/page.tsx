"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  ShieldCheck,
  Loader2,
  X,
} from "lucide-react";

type PlanKey =
  | "beginner"
  | "professional"
  | "advanced";

type BillingCycle =
  | "monthly"
  | "yearly";

type CreateSubscriptionResponse = {
  subscriptionId: string;
  plan: PlanKey;
  planName: string;
  planId: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  trialDays: number;
  trialEndsAt: string;
  startAt: number;
  keyId: string;
};

type RazorpaySubscriptionResponse = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (
  options: Record<string, unknown>
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

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

function yearlySavings(
  monthly: number,
  yearly: number
) {
  return monthly * 12 - yearly;
}

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(true),
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );

      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () =>
      resolve(true);

    script.onerror = () =>
      resolve(false);

    document.body.appendChild(script);
  });
}

export default function BillingRequiredPage() {
  const [
    billingCycle,
    setBillingCycle,
  ] = useState<BillingCycle>("yearly");

  const [
    selectedPlan,
    setSelectedPlan,
  ] = useState<PlanKey | null>(null);

  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  async function handleSubscribe(
    plan: PlanKey
  ) {
    if (isProcessing) {
      return;
    }

    setErrorMessage("");
    setSelectedPlan(plan);
    setIsProcessing(true);

    try {
      const razorpayLoaded =
        await loadRazorpay();

      if (
        !razorpayLoaded ||
        !window.Razorpay
      ) {
        throw new Error(
          "Unable to load secure payment checkout. Please try again."
        );
      }

      /*
       * IMPORTANT:
       *
       * This page uses /api/subscription/create-order
       * as the single subscription creation endpoint.
       *
       * Do not call /api/subscription/create here.
       */

      const response =
        await fetch(
          "/api/subscription/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              plan,
              billingCycle,
            }),
          }
        );

      const responseData =
        await response.json();

      if (
        !response.ok ||
        !responseData?.data
      ) {
        throw new Error(
          responseData?.error ??
            "Unable to start your DhanarkOS subscription."
        );
      }

      const subscription =
        responseData.data as CreateSubscriptionResponse;

      if (
        !subscription.subscriptionId
      ) {
        throw new Error(
          "DhanarkOS did not receive a valid subscription ID."
        );
      }

      if (
        !subscription.keyId
      ) {
        throw new Error(
          "Razorpay is not configured correctly."
        );
      }

      const razorpay =
        new window.Razorpay({
          key:
            subscription.keyId,

          subscription_id:
            subscription.subscriptionId,

          name:
            "DhanarkOS",

          description:
            `${subscription.planName} — ${subscription.billingCycle} plan`,

          notes: {
            product:
              "DhanarkOS",

            plan:
              subscription.plan,

            billingCycle:
              subscription.billingCycle,

            trialDays:
              String(
                subscription.trialDays
              ),
          },

          theme: {
            color:
              "#D4AF37",
          },

          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setSelectedPlan(null);
            },
          },

          handler:
            async function (
              paymentResponse: RazorpaySubscriptionResponse
            ) {
              try {
                /*
                 * Razorpay has returned the authorization
                 * response. Send it to the server.
                 *
                 * The server performs the actual verification.
                 */

                if (
                  !paymentResponse
                    ?.razorpay_payment_id ||
                  !paymentResponse
                    ?.razorpay_subscription_id ||
                  !paymentResponse
                    ?.razorpay_signature
                ) {
                  throw new Error(
                    "Razorpay returned incomplete payment verification data."
                  );
                }

                /*
                 * Make sure the subscription returned by
                 * Razorpay is the subscription we created.
                 *
                 * This prevents accidentally verifying a
                 * different subscription.
                 */

                if (
                  paymentResponse.razorpay_subscription_id !==
                  subscription.subscriptionId
                ) {
                  throw new Error(
                    "The Razorpay subscription does not match the subscription created for this checkout."
                  );
                }

                const verifyResponse =
                  await fetch(
                    "/api/subscription/verify",
                    {
                      method: "POST",

                      headers: {
                        "Content-Type":
                          "application/json",
                      },

                      body: JSON.stringify({
                        razorpay_payment_id:
                          paymentResponse.razorpay_payment_id,

                        razorpay_subscription_id:
                          paymentResponse.razorpay_subscription_id,

                        razorpay_signature:
                          paymentResponse.razorpay_signature,
                      }),
                    }
                  );

                const verifyData =
                  await verifyResponse.json();

                if (
                  !verifyResponse.ok ||
                  !verifyData?.data
                    ?.activated
                ) {
                  throw new Error(
                    verifyData?.error ??
                      "Payment authorization was received, but DhanarkOS could not verify your subscription."
                  );
                }

                window.location.href =
                  "/dashboard";
              } catch (error) {
                console.error(
                  "[DhanarkOS] Subscription verification failed:",
                  error
                );

                setErrorMessage(
                  error instanceof Error
                    ? error.message
                    : "We could not verify your subscription. Please contact support if you were charged."
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090A] text-white">
      <div className="pointer-events-none absolute left-1/2 top-[-260px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.035] blur-[150px]" />

      <div className="pointer-events-none absolute bottom-[-260px] right-[-180px] h-[500px] w-[500px] rounded-full bg-[#D4AF37]/[0.02] blur-[140px]" />

      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06]">
              <span className="text-sm font-semibold tracking-tight text-[#D4AF37]">
                D
              </span>
            </div>

            <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
              DhanarkOS
            </span>
          </Link>

          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/[0.03] hover:text-zinc-200"
          >
            Sign out
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
            Trial complete
          </p>

          <h1 className="mt-4 text-4xl font-light tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Continue with DhanarkOS.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            Your workspace and financial
            information remain preserved.
            Choose the level of financial
            intelligence your business needs.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-7">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-[11px] text-zinc-600">
              Workspace preserved
            </span>
          </div>

          <div className="hidden h-3 w-px bg-white/[0.08] sm:block" />

          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-[11px] text-zinc-600">
              Secure payment
            </span>
          </div>

          <div className="hidden h-3 w-px bg-white/[0.08] sm:block" />

          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-[#D4AF37]"
            />

            <span className="text-[11px] text-zinc-600">
              7-day free trial
            </span>
          </div>
        </div>

        <div className="mx-auto mt-12 flex w-fit items-center rounded-full border border-white/[0.07] bg-white/[0.02] p-1">
          <button
            type="button"
            onClick={() =>
              setBillingCycle("monthly")
            }
            className={`rounded-full px-5 py-2.5 text-xs font-medium transition ${
              billingCycle ===
              "monthly"
                ? "bg-white/[0.08] text-white"
                : "text-zinc-600 hover:text-zinc-300"
            }`}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() =>
              setBillingCycle("yearly")
            }
            className={`rounded-full px-5 py-2.5 text-xs font-medium transition ${
              billingCycle ===
              "yearly"
                ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                : "text-zinc-600 hover:text-zinc-300"
            }`}
          >
            Yearly
          </button>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const amount =
              billingCycle ===
              "yearly"
                ? plan.yearly
                : plan.monthly;

            const savings =
              yearlySavings(
                plan.monthly,
                plan.yearly
              );

            const loading =
              isProcessing &&
              selectedPlan ===
                plan.key;

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
                      {formatINR(amount)}
                    </span>

                    <span className="mb-1 text-xs text-zinc-600">
                      /{" "}
                      {billingCycle ===
                      "yearly"
                        ? "year"
                        : "month"}
                    </span>
                  </div>

                  {billingCycle ===
                    "yearly" && (
                    <p className="mt-2 text-[10px] text-zinc-700">
                      Save{" "}
                      <span className="text-zinc-400">
                        {formatINR(savings)}
                      </span>{" "}
                      vs monthly
                    </p>
                  )}

                  {billingCycle ===
                    "monthly" && (
                    <p className="mt-2 text-[10px] text-zinc-700">
                      Flexible monthly billing
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() =>
                    handleSubscribe(
                      plan.key
                    )
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
                      Choose{" "}
                      {plan.name}

                      <ArrowRight
                        size={15}
                      />
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
                Payment could not be completed
              </p>

              <p className="mt-1 text-xs leading-5 text-red-400/70">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-xl text-center">
          <p className="text-[10px] leading-5 text-zinc-700">
            Payments are processed securely
            through Razorpay. DhanarkOS only
            activates your workspace after
            server-side verification.
          </p>
        </div>
      </div>
    </main>
  );
}