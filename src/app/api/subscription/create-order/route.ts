// src/app/api/subscription/create-order/route.ts

import { NextRequest } from "next/server";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { razorpay } from "@/lib/server/razorpay";
import { supabaseAdmin } from "@/lib/server/supabase";
import { createClient } from "@/lib/supabase/server";

type PlanKey =
  | "beginner"
  | "professional"
  | "advanced";

type BillingCycle =
  | "monthly"
  | "yearly";

type PlanConfig = {
  name: string;
  planId: string;
  amount: number;
};

type TrialRecord = {
  id: string;
  user_id: string;
  company_id: number | null;
  phone_e164: string | null;
  trial_status: string | null;
  subscription_status: string | null;
  razorpay_subscription_id: string | null;
  razorpay_payment_id: string | null;
  selected_plan: string | null;
  subscription_plan: string | null;
  subscription_plan_id: string | null;
  subscription_billing_cycle: string | null;
  trial_ends_at: string | null;
};

type RazorpaySubscriptionResult = {
  id: string;
  status?: string;
  plan_id?: string;
  start_at?: number | null;
  current_start?: number | null;
  current_end?: number | null;
  charge_at?: number | null;
  total_count?: number | null;
  quantity?: number | null;
  notes?: Record<string, unknown> | null;
};

const PLANS: Record<
  PlanKey,
  {
    monthly: PlanConfig;
    yearly: PlanConfig;
  }
> = {
  beginner: {
    monthly: {
      name: "DhanarkOS Beginner",
      planId: "plan_TY3d3eum1IUML2",
      amount: 799,
    },

    yearly: {
      name: "DhanarkOS Beginner",
      planId: "plan_TY3do4zJKcekIw",
      amount: 7999,
    },
  },

  professional: {
    monthly: {
      name: "DhanarkOS Professional",
      planId: "plan_TY3emwzLrCPaZ0",
      amount: 1699,
    },

    yearly: {
      name: "DhanarkOS Professional",
      planId: "plan_TY3fhuyGO7gpmD",
      amount: 16999,
    },
  },

  advanced: {
    monthly: {
      name: "DhanarkOS Advanced",
      planId: "plan_TY3gpgclmhuPz6",
      amount: 1999,
    },

    yearly: {
      name: "DhanarkOS Advanced",
      planId: "plan_TY3hNosnckAaNg",
      amount: 19999,
    },
  },
};

const TRIAL_DAYS = 7;

const TRIAL_MILLISECONDS =
  TRIAL_DAYS *
  24 *
  60 *
  60 *
  1000;

function getRazorpayKeyId(): string {
  return (
    process.env.RAZORPAY_KEY_ID ??
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ??
    ""
  );
}

function getSubscriptionNote(
  subscription: RazorpaySubscriptionResult,
  key: string
): string | null {
  const value =
    subscription.notes?.[key];

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return null;
}

function getTrialEndFromSubscription(
  subscription: RazorpaySubscriptionResult
): string {
  if (
    typeof subscription.start_at ===
      "number" &&
    subscription.start_at > 0
  ) {
    return new Date(
      subscription.start_at * 1000
    ).toISOString();
  }

  const explicitTrialEnd =
    getSubscriptionNote(
      subscription,
      "trialEndsAt"
    ) ??
    getSubscriptionNote(
      subscription,
      "trial_ends_at"
    );

  if (explicitTrialEnd) {
    const parsed =
      new Date(explicitTrialEnd);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date(
    Date.now() + TRIAL_MILLISECONDS
  ).toISOString();
}

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ============================================================
     * 1. AUTHENTICATION
     * ============================================================
     */

    const supabase =
      await createClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError) {
      console.error(
        "[DhanarkOS Subscription] Auth error:",
        authError
      );

      return ApiResponse.error(
        "Unable to verify your account.",
        401
      );
    }

    if (!user) {
      return ApiResponse.error(
        "You must be signed in to start a DhanarkOS trial.",
        401
      );
    }

    /*
     * ============================================================
     * 2. VALIDATE REQUEST
     * ============================================================
     */

    let body: {
      plan?: string;
      billingCycle?: string;
    };

    try {
      body =
        await request.json();
    } catch {
      return ApiResponse.error(
        "Invalid subscription request.",
        400
      );
    }

    const plan =
      String(
        body?.plan ?? ""
      ).toLowerCase() as PlanKey;

    const billingCycle =
      String(
        body?.billingCycle ??
          "monthly"
      ).toLowerCase() as BillingCycle;

    if (
      !Object.prototype.hasOwnProperty.call(
        PLANS,
        plan
      )
    ) {
      return ApiResponse.error(
        "Please select a valid DhanarkOS plan.",
        400
      );
    }

    if (
      billingCycle !== "monthly" &&
      billingCycle !== "yearly"
    ) {
      return ApiResponse.error(
        "Please select a valid billing cycle.",
        400
      );
    }

    const planConfig =
      PLANS[plan][billingCycle];

    /*
     * ============================================================
     * 3. RAZORPAY KEY CHECK
     * ============================================================
     */

    const razorpayKeyId =
      getRazorpayKeyId();

    if (!razorpayKeyId) {
      console.error(
        "[DhanarkOS Subscription] Razorpay key ID is missing."
      );

      return ApiResponse.error(
        "Razorpay is not configured correctly.",
        500
      );
    }

    /*
     * ============================================================
     * 4. FIND EXISTING TRIAL
     * ============================================================
     */

    const {
      data: rawTrial,
      error: trialLookupError,
    } =
      await supabaseAdmin
        .from("dhanarkos_trials")
        .select(
          `
            id,
            user_id,
            company_id,
            phone_e164,
            trial_status,
            subscription_status,
            razorpay_subscription_id,
            razorpay_payment_id,
            selected_plan,
            subscription_plan,
            subscription_plan_id,
            subscription_billing_cycle,
            trial_ends_at
          `
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (trialLookupError) {
      console.error(
        "[DhanarkOS Subscription] Trial lookup failed:",
        trialLookupError
      );

      return ApiResponse.error(
        "Unable to verify your DhanarkOS trial.",
        500
      );
    }

    const trial =
      rawTrial as TrialRecord | null;

    /*
     * ============================================================
     * 5. CHECK EXISTING RAZORPAY SUBSCRIPTION
     * ============================================================
     */

    if (
      trial?.razorpay_subscription_id
    ) {
      const existingSubscriptionId =
        trial.razorpay_subscription_id;

      let existingSubscription:
        | RazorpaySubscriptionResult
        | null = null;

      try {
        const fetchedSubscription =
          await razorpay.subscriptions.fetch(
            existingSubscriptionId
          );

        existingSubscription =
          fetchedSubscription as RazorpaySubscriptionResult;
      } catch (error) {
        /*
         * The database points to a subscription
         * Razorpay can no longer retrieve.
         *
         * This is safe to clear because Razorpay
         * itself could not verify the entity.
         */

        console.error(
          "[DhanarkOS Subscription] Existing Razorpay subscription fetch failed:",
          {
            subscriptionId:
              existingSubscriptionId,
            error,
          }
        );

        const {
          error: clearError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update({
              razorpay_subscription_id:
                null,

              razorpay_payment_id:
                null,

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              trial.id
            )
            .eq(
              "user_id",
              user.id
            );

        if (clearError) {
          console.error(
            "[DhanarkOS Subscription] Failed to clear stale subscription:",
            clearError
          );

          return ApiResponse.error(
            "Your previous subscription could not be verified. Please contact support.",
            500
          );
        }
      }

      /*
       * ==========================================================
       * 6. HANDLE VERIFIED EXISTING SUBSCRIPTION
       * ==========================================================
       */

      if (existingSubscription) {
        const status =
          String(
            existingSubscription.status ??
              ""
          ).toLowerCase();

        const razorpayPlanId =
          existingSubscription.plan_id ??
          null;

        const subscriptionUserId =
          getSubscriptionNote(
            existingSubscription,
            "userId"
          );

        const subscriptionPlan =
          getSubscriptionNote(
            existingSubscription,
            "plan"
          );

        const subscriptionBillingCycle =
          getSubscriptionNote(
            existingSubscription,
            "billingCycle"
          );

        console.log(
          "[DhanarkOS Subscription] Existing subscription found:",
          {
            userId:
              user.id,
            subscriptionId:
              existingSubscription.id,
            status,
            razorpayPlanId,
            subscriptionUserId,
            subscriptionPlan,
            subscriptionBillingCycle,
            requestedPlan:
              plan,
            requestedBillingCycle:
              billingCycle,
          }
        );

        /*
         * --------------------------------------------------------
         * OWNERSHIP CHECK
         * --------------------------------------------------------
         */

        if (
          subscriptionUserId &&
          subscriptionUserId !==
            user.id
        ) {
          console.error(
            "[DhanarkOS Subscription] Subscription ownership mismatch:",
            {
              userId:
                user.id,
              subscriptionUserId,
              subscriptionId:
                existingSubscription.id,
            }
          );

          return ApiResponse.error(
            "This Razorpay subscription does not belong to this DhanarkOS account.",
            403
          );
        }

        /*
         * --------------------------------------------------------
         * PLAN CONSISTENCY CHECK
         * --------------------------------------------------------
         *
         * Never allow an existing subscription for one
         * plan to be silently reused for another plan.
         */

        const existingPlanMatches =
          razorpayPlanId ===
          planConfig.planId;

        const existingBillingCycleMatches =
          !subscriptionBillingCycle ||
          subscriptionBillingCycle ===
            billingCycle;

        if (
          status ===
            "authenticated" &&
          (
            !existingPlanMatches ||
            !existingBillingCycleMatches
          )
        ) {
          console.warn(
            "[DhanarkOS Subscription] Existing authenticated subscription does not match requested plan:",
            {
              subscriptionId:
                existingSubscription.id,
              existingPlan:
                subscriptionPlan,
              existingBillingCycle:
                subscriptionBillingCycle,
              existingPlanId:
                razorpayPlanId,
              requestedPlan:
                plan,
              requestedBillingCycle:
                billingCycle,
              requestedPlanId:
                planConfig.planId,
            }
          );

          return ApiResponse.error(
            "You already have an authorized DhanarkOS subscription for a different plan. Please manage your existing subscription before selecting another plan.",
            409
          );
        }

        /*
         * --------------------------------------------------------
         * CREATED / PENDING
         * --------------------------------------------------------
         *
         * These states still require Razorpay Checkout.
         */

        if (
          status === "created" ||
          status === "pending"
        ) {
          return ApiResponse.success({
            subscriptionId:
              existingSubscription.id,

            plan,
            planName:
              planConfig.name,

            planId:
              planConfig.planId,

            amount:
              planConfig.amount,

            currency:
              "INR",

            billingCycle,

            trialDays:
              TRIAL_DAYS,

            trialEndsAt:
              null,

            startAt:
              existingSubscription.start_at ??
              null,

            status,

            keyId:
              razorpayKeyId,

            reused:
              true,

            alreadyAuthorized:
              false,
          });
        }

        /*
         * --------------------------------------------------------
         * AUTHENTICATED
         * --------------------------------------------------------
         *
         * THIS IS THE CRITICAL FIX.
         *
         * An authenticated subscription has already completed
         * the authorization step.
         *
         * DO NOT send it back to Razorpay Checkout.
         *
         * Synchronize DhanarkOS and tell the frontend that
         * authorization is already complete.
         */

        if (
          status ===
          "authenticated"
        ) {
          const trialEndsAt =
            getTrialEndFromSubscription(
              existingSubscription
            );

          if (trial) {
            const {
              error: syncError,
            } =
              await supabaseAdmin
                .from(
                  "dhanarkos_trials"
                )
                .update({
                  razorpay_subscription_id:
                    existingSubscription.id,

                  /*
                   * Do NOT overwrite an existing
                   * payment ID with null.
                   */
                  selected_plan:
                    plan,

                  subscription_plan:
                    plan,

                  subscription_plan_id:
                    planConfig.planId,

                  subscription_billing_cycle:
                    billingCycle,

                  trial_status:
                    "trialing",

                  subscription_status:
                    "none",

                  trial_ends_at:
                    trialEndsAt,

                  updated_at:
                    new Date().toISOString(),
                })
                .eq(
                  "id",
                  trial.id
                )
                .eq(
                  "user_id",
                  user.id
                );

            if (syncError) {
              console.error(
                "[DhanarkOS Subscription] Failed to synchronize authenticated subscription:",
                syncError
              );

              return ApiResponse.error(
                "Your Razorpay authorization is complete, but DhanarkOS could not synchronize your account. Please try again.",
                500
              );
            }
          }

          console.log(
            "[DhanarkOS Subscription] Existing subscription is already authenticated. Checkout will NOT be reopened.",
            {
              userId:
                user.id,
              subscriptionId:
                existingSubscription.id,
              plan,
              billingCycle,
              trialEndsAt,
            }
          );

          return ApiResponse.success({
            subscriptionId:
              existingSubscription.id,

            plan,
            planName:
              planConfig.name,

            planId:
              planConfig.planId,

            amount:
              planConfig.amount,

            currency:
              "INR",

            billingCycle,

            trialDays:
              TRIAL_DAYS,

            trialEndsAt,

            startAt:
              existingSubscription.start_at ??
              null,

            status,

            keyId:
              razorpayKeyId,

            reused:
              true,

            alreadyAuthorized:
              true,
          });
        }

        /*
         * --------------------------------------------------------
         * ACTIVE
         * --------------------------------------------------------
         */

        if (
          status ===
          "active"
        ) {
          return ApiResponse.error(
            "Your DhanarkOS subscription is already active.",
            400
          );
        }

        /*
         * --------------------------------------------------------
         * HALTED
         * --------------------------------------------------------
         */

        if (
          status ===
          "halted"
        ) {
          return ApiResponse.error(
            "Your existing DhanarkOS subscription requires payment attention before another subscription can be created.",
            400
          );
        }

        /*
         * --------------------------------------------------------
         * COMPLETED
         * --------------------------------------------------------
         */

        if (
          status ===
          "completed"
        ) {
          return ApiResponse.error(
            "Your DhanarkOS subscription has already completed.",
            400
          );
        }

        /*
         * --------------------------------------------------------
         * CANCELLED / EXPIRED
         * --------------------------------------------------------
         *
         * These subscriptions can safely be detached from
         * the DhanarkOS trial record so a fresh subscription
         * can be created.
         */

        if (
          status === "cancelled" ||
          status === "expired"
        ) {
          console.log(
            "[DhanarkOS Subscription] Clearing unusable existing subscription:",
            {
              userId:
                user.id,
              subscriptionId:
                existingSubscription.id,
              status,
            }
          );

          const {
            error: clearError,
          } =
            await supabaseAdmin
              .from(
                "dhanarkos_trials"
              )
              .update({
                razorpay_subscription_id:
                  null,

                razorpay_payment_id:
                  null,

                updated_at:
                  new Date().toISOString(),
              })
              .eq(
                "id",
                trial.id
              )
              .eq(
                "user_id",
                user.id
              );

          if (clearError) {
            console.error(
              "[DhanarkOS Subscription] Failed to clear cancelled/expired subscription:",
              clearError
            );

            return ApiResponse.error(
              "Unable to reset your previous subscription. Please contact support.",
              500
            );
          }
        }
      }
    }

    /*
     * ============================================================
     * 7. CALCULATE TRIAL END
     * ============================================================
     */

    const trialEndsAt =
      new Date(
        Date.now() +
          TRIAL_MILLISECONDS
      );

    const startAt =
      Math.floor(
        trialEndsAt.getTime() /
          1000
      );

    /*
     * ============================================================
     * 8. VERIFY RAZORPAY PLAN
     * ============================================================
     */

    try {
      const razorpayPlan =
        await razorpay.plans.fetch(
          planConfig.planId
        );

      console.log(
        "[DhanarkOS Subscription] Razorpay plan verified:",
        {
          plan,
          billingCycle,
          planId:
            planConfig.planId,
          name:
            razorpayPlan.item
              ?.name,
          amount:
            razorpayPlan.item
              ?.amount,
          period:
            razorpayPlan.period,
          interval:
            razorpayPlan.interval,
        }
      );

      /*
       * Verify amount.
       *
       * Razorpay amounts are represented in paise.
       */

      const razorpayAmount =
        Number(
          razorpayPlan.item
            ?.amount ?? 0
        );

      const expectedAmount =
        planConfig.amount *
        100;

      if (
        razorpayAmount &&
        razorpayAmount !==
          expectedAmount
      ) {
        console.error(
          "[DhanarkOS Subscription] Plan amount mismatch:",
          {
            plan,
            billingCycle,
            planId:
              planConfig.planId,
            expectedAmount,
            actualAmount:
              razorpayAmount,
          }
        );

        return ApiResponse.error(
          `The configured Razorpay plan amount does not match the ${plan} plan.`,
          400
        );
      }

      /*
       * Verify billing period.
       *
       * Razorpay's plan period normally reports
       * "monthly" or "yearly".
       */

      const expectedPeriod =
        billingCycle ===
        "monthly"
          ? "monthly"
          : "yearly";

      if (
        razorpayPlan.period &&
        razorpayPlan.period !==
          expectedPeriod
      ) {
        console.error(
          "[DhanarkOS Subscription] Plan period mismatch:",
          {
            plan,
            billingCycle,
            planId:
              planConfig.planId,
            expectedPeriod,
            actualPeriod:
              razorpayPlan.period,
          }
        );

        return ApiResponse.error(
          `The configured Razorpay plan does not match the ${billingCycle} billing cycle.`,
          400
        );
      }
    } catch (error) {
      console.error(
        "[DhanarkOS Subscription] Razorpay plan verification failed:",
        {
          plan,
          billingCycle,
          planId:
            planConfig.planId,
          error,
        }
      );

      return ApiResponse.error(
        `The configured Razorpay plan for ${planConfig.name} is invalid or belongs to a different Razorpay account/mode.`,
        400
      );
    }

    /*
     * ============================================================
     * 9. CREATE NEW RAZORPAY SUBSCRIPTION
     * ============================================================
     */

    let subscription:
      | RazorpaySubscriptionResult
      | null = null;

    try {
      const createdSubscription =
        await razorpay.subscriptions.create(
          {
            plan_id:
              planConfig.planId,

            total_count:
              billingCycle ===
              "monthly"
                ? 120
                : 10,

            quantity:
              1,

            customer_notify:
              true,

            start_at:
              startAt,

            notes: {
              product:
                "DhanarkOS",

              userId:
                user.id,

              plan,

              planName:
                planConfig.name,

              billingCycle,

              planId:
                planConfig.planId,

              amount:
                String(
                  planConfig.amount
                ),

              trialDays:
                String(
                  TRIAL_DAYS
                ),

              trialEndsAt:
                trialEndsAt.toISOString(),
            },
          }
        );

      subscription =
        createdSubscription as RazorpaySubscriptionResult;
    } catch (error) {
      console.error(
        "[DhanarkOS Subscription] Razorpay subscription creation failed:",
        error
      );

      return ApiResponse.error(
        "Unable to create your Razorpay subscription. Please try again.",
        502
      );
    }

    /*
     * ============================================================
     * 10. VALIDATE RAZORPAY RESPONSE
     * ============================================================
     */

    console.log(
      "[DhanarkOS DEBUG] CREATED RAZORPAY SUBSCRIPTION:",
      {
        id:
          subscription?.id,

        status:
          subscription?.status,

        plan_id:
          subscription?.plan_id,
      }
    );

    if (
      !subscription?.id
    ) {
      console.error(
        "[DhanarkOS Subscription] Razorpay returned no subscription ID:",
        subscription
      );

      return ApiResponse.error(
        "Razorpay did not return a subscription ID.",
        502
      );
    }

    /*
     * ============================================================
     * 11. SAVE SUBSCRIPTION
     * ============================================================
     *
     * IMPORTANT:
     *
     * The database constraint allows:
     *
     * trialing
     * expired
     * active
     * cancelled
     *
     * It does NOT allow "pending".
     *
     * Therefore we use "trialing" immediately after the
     * subscription has been created and the trial dates are
     * established.
     */

    if (trial) {
      const {
        error: updateError,
      } =
        await supabaseAdmin
          .from(
            "dhanarkos_trials"
          )
          .update({
            razorpay_subscription_id:
              subscription.id,

            razorpay_payment_id:
              null,

            selected_plan:
              plan,

            subscription_plan:
              plan,

            subscription_plan_id:
              planConfig.planId,

            subscription_billing_cycle:
              billingCycle,

            trial_status:
              "trialing",

            subscription_status:
              "none",

            trial_ends_at:
              trialEndsAt.toISOString(),

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            trial.id
          )
          .eq(
            "user_id",
            user.id
          );

      if (updateError) {
        console.error(
          "[DhanarkOS Subscription] Existing trial update failed:",
          updateError
        );

        return ApiResponse.error(
          "Your Razorpay subscription was created, but DhanarkOS could not save your account state. Please contact support before trying again.",
          500
        );
      }
    } else {
      const {
        error: insertError,
      } =
        await supabaseAdmin
          .from(
            "dhanarkos_trials"
          )
          .insert({
            user_id:
              user.id,

            trial_status:
              "trialing",

            subscription_status:
              "none",

            selected_plan:
              plan,

            subscription_plan:
              plan,

            subscription_plan_id:
              planConfig.planId,

            subscription_billing_cycle:
              billingCycle,

            razorpay_subscription_id:
              subscription.id,

            razorpay_payment_id:
              null,

            trial_started_at:
              new Date().toISOString(),

            trial_ends_at:
              trialEndsAt.toISOString(),
          });

      if (insertError) {
        console.error(
          "[DhanarkOS Subscription] Trial creation failed:",
          insertError
        );

        return ApiResponse.error(
          "Your Razorpay subscription was created, but DhanarkOS could not save your trial. Please contact support before trying again.",
          500
        );
      }
    }

    /*
     * ============================================================
     * 12. SUCCESS
     * ============================================================
     */

    console.log(
      "[DhanarkOS Subscription] Subscription created successfully:",
      {
        userId:
          user.id,

        subscriptionId:
          subscription.id,

        plan,

        billingCycle,

        planId:
          planConfig.planId,

        trialExists:
          Boolean(trial),

        trialEndsAt:
          trialEndsAt.toISOString(),
      }
    );

    return ApiResponse.success({
      subscriptionId:
        subscription.id,

      plan,

      planName:
        planConfig.name,

      planId:
        planConfig.planId,

      amount:
        planConfig.amount,

      currency:
        "INR",

      billingCycle,

      trialDays:
        TRIAL_DAYS,

      trialEndsAt:
        trialEndsAt.toISOString(),

      startAt,

      status:
        subscription.status ??
        "created",

      keyId:
        razorpayKeyId,

      reused:
        false,

      alreadyAuthorized:
        false,
    });
  } catch (error) {
    console.error(
      "[DhanarkOS Subscription] Unexpected error:",
      error
    );

    return handleApiError(
      error
    );
  }
}