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
  id: number;
  trial_status: string | null;
  subscription_status: string | null;
  razorpay_subscription_id: string | null;
};

type RazorpaySubscriptionRecord = {
  id: string;
  status?: string | null;
  start_at?: number | null;
  [key: string]: unknown;
};

const PLANS: Record<
  PlanKey,
  Record<BillingCycle, PlanConfig>
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

function cleanString(
  value: unknown
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
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
        "You must be signed in to start your DhanarkOS trial.",
        401
      );
    }

    /*
     * ============================================================
     * 2. READ REQUEST
     * ============================================================
     */

    let body: {
      plan?: unknown;
      billingCycle?: unknown;
    };

    try {
      body =
        (await request.json()) as {
          plan?: unknown;
          billingCycle?: unknown;
        };
    } catch {
      return ApiResponse.error(
        "Invalid subscription request.",
        400
      );
    }

    const requestedPlan =
      cleanString(
        body?.plan
      ).toLowerCase();

    const requestedBillingCycle =
      cleanString(
        body?.billingCycle ||
          "monthly"
      ).toLowerCase();

    if (
      !Object.prototype.hasOwnProperty.call(
        PLANS,
        requestedPlan
      )
    ) {
      return ApiResponse.error(
        "Please select a valid DhanarkOS plan.",
        400
      );
    }

    if (
      requestedBillingCycle !==
        "monthly" &&
      requestedBillingCycle !==
        "yearly"
    ) {
      return ApiResponse.error(
        "Please select a valid billing cycle.",
        400
      );
    }

    const plan =
      requestedPlan as PlanKey;

    const billingCycle =
      requestedBillingCycle as BillingCycle;

    const planConfig =
      PLANS[plan][billingCycle];

    /*
     * ============================================================
     * 3. LOOK FOR EXISTING TRIAL
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
            trial_status,
            subscription_status,
            razorpay_subscription_id
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
     * 4. CHECK EXISTING RAZORPAY SUBSCRIPTION
     * ============================================================
     *
     * Never assume that an ID stored in Supabase is still usable.
     *
     * Fetch the live Razorpay object and inspect its status.
     * ============================================================
     */

    if (
      trial?.razorpay_subscription_id
    ) {
      const existingSubscriptionId =
        trial.razorpay_subscription_id;

      let existingSubscription:
        RazorpaySubscriptionRecord | null =
        null;

      try {
        const fetchedSubscription =
          await razorpay.subscriptions.fetch(
            existingSubscriptionId
          );

        existingSubscription =
          fetchedSubscription as unknown as RazorpaySubscriptionRecord;
      } catch (error) {
        console.error(
          "[DhanarkOS Subscription] Existing Razorpay subscription fetch failed:",
          {
            subscriptionId:
              existingSubscriptionId,
            error,
          }
        );

        /*
         * Razorpay cannot retrieve the stored subscription.
         * Remove the stale reference.
         */

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
       * 5. HANDLE EXISTING SUBSCRIPTION
       * ==========================================================
       */

      if (existingSubscription) {
        const status =
          cleanString(
            existingSubscription.status
          ).toLowerCase();

        /*
         * --------------------------------------------------------
         * CREATED
         * --------------------------------------------------------
         *
         * Reuse an unfinished subscription.
         *
         * This is important because creating a second subscription
         * every time Checkout is opened can produce stale payment
         * attempts and confusing Checkout states.
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
              process.env
                .NEXT_PUBLIC_RAZORPAY_KEY_ID,

            reused:
              true,
          });
        }

        /*
         * --------------------------------------------------------
         * AUTHENTICATED
         * --------------------------------------------------------
         *
         * Razorpay has accepted authorization.
         */

        if (
          status === "authenticated"
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
              process.env
                .NEXT_PUBLIC_RAZORPAY_KEY_ID,

            reused:
              true,
          });
        }

        /*
         * --------------------------------------------------------
         * ACTIVE
         * --------------------------------------------------------
         */

        if (
          status === "active"
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
          status === "halted"
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
          status === "completed"
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
         */

        if (
          status === "cancelled" ||
          status === "expired"
        ) {
          console.log(
            "[DhanarkOS Subscription] Clearing unusable subscription:",
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
              "[DhanarkOS Subscription] Failed to clear unusable subscription:",
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
     * 6. CALCULATE TRIAL END
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
     * 7. VERIFY RAZORPAY PLAN
     * ============================================================
     */

    try {
      const razorpayPlan =
        await razorpay.plans.fetch(
          planConfig.planId
        );

      const razorpayAmount =
        Number(
          razorpayPlan.item
            ?.amount ?? 0
        );

      const expectedAmount =
        planConfig.amount * 100;

      const expectedPeriod =
        billingCycle ===
        "monthly"
          ? "monthly"
          : "yearly";

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
            razorpayAmount,

          expectedAmount,

          period:
            razorpayPlan.period,

          interval:
            razorpayPlan.interval,
        }
      );

      /*
       * Razorpay amounts are stored in paise.
       */

      if (
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
          "The configured Razorpay plan amount does not match DhanarkOS pricing.",
          400
        );
      }

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
     * 8. CREATE NEW RAZORPAY SUBSCRIPTION
     * ============================================================
     */

    let subscription:
      RazorpaySubscriptionRecord | null =
      null;

    try {
      const createdSubscription =
        await razorpay.subscriptions.create({
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

            plan:
              plan,

            planName:
              planConfig.name,

            billingCycle,

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
        });

      subscription =
        createdSubscription as unknown as RazorpaySubscriptionRecord;
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
     * 9. VALIDATE RESPONSE
     * ============================================================
     */

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
     * 10. SAVE SUBSCRIPTION
     * ============================================================
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
      /*
       * ==========================================================
       * 11. CREATE TRIAL RECORD IF MISSING
       * ==========================================================
       */

      /*
       * phone_e164 is NOT NULL in the database according to the
       * existing DhanarkOS schema.
       *
       * Therefore we cannot safely insert a billing record here
       * without the onboarding phone value.
       *
       * Save the verified subscription in auth metadata instead.
       *
       * This prevents the database constraint from turning a valid
       * Razorpay subscription into a broken application state.
       */

      const {
        data: currentUser,
        error: currentUserError,
      } =
        await supabaseAdmin.auth.admin
          .getUserById(
            user.id
          );

      if (
        currentUserError ||
        !currentUser?.user
      ) {
        console.error(
          "[DhanarkOS Subscription] Unable to read current user metadata:",
          currentUserError
        );

        return ApiResponse.error(
          "Your Razorpay subscription was created, but DhanarkOS could not save your account state. Please contact support before trying again.",
          500
        );
      }

      const existingMetadata =
        currentUser.user
          .user_metadata ?? {};

      const {
        error: metadataError,
      } =
        await supabaseAdmin.auth.admin
          .updateUserById(
            user.id,
            {
              user_metadata: {
                ...existingMetadata,

                dhanarkos_pending_subscription:
                  {
                    subscriptionId:
                      subscription.id,

                    plan,

                    planName:
                      planConfig.name,

                    planId:
                      planConfig.planId,

                    billingCycle,

                    amount:
                      planConfig.amount,

                    trialDays:
                      TRIAL_DAYS,

                    trialEndsAt:
                      trialEndsAt.toISOString(),

                    startAt,

                    status:
                      "pending",

                    createdAt:
                      new Date().toISOString(),
                  },
              },
            }
          );

      if (metadataError) {
        console.error(
          "[DhanarkOS Subscription] Pending subscription metadata save failed:",
          metadataError
        );

        return ApiResponse.error(
          "Your Razorpay subscription was created, but DhanarkOS could not save your account state. Please contact support before trying again.",
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
        process.env
          .NEXT_PUBLIC_RAZORPAY_KEY_ID,

      reused:
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