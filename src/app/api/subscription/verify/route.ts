// src/app/api/subscription/verify/route.ts

import { NextRequest } from "next/server";
import crypto from "crypto";

import { ApiResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { razorpay } from "@/lib/server/razorpay";
import { supabaseAdmin } from "@/lib/server/supabase";
import { createClient } from "@/lib/supabase/server";

type VerifyBody = {
  razorpay_payment_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
};

type TrialRecord = {
  id: string;
  user_id: string;
  company_id: number | null;
  phone_e164: string;
  trial_status: string | null;
  subscription_status: string | null;
  razorpay_subscription_id: string | null;
  subscription_plan: string | null;
  subscription_billing_cycle: string | null;
  selected_plan: string | null;
  subscription_plan_id: string | null;
};

type SubscriptionNotes = {
  userId?: unknown;
  user_id?: unknown;
  plan?: unknown;
  planName?: unknown;
  billingCycle?: unknown;
  planId?: unknown;
  trialEndsAt?: unknown;
  trial_ends_at?: unknown;
};

function cleanString(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function getSubscriptionNote(
  notes: unknown,
  key: keyof SubscriptionNotes
): string {
  if (
    !notes ||
    typeof notes !== "object"
  ) {
    return "";
  }

  const value =
    (notes as SubscriptionNotes)[key];

  return cleanString(value);
}

function parseDate(
  value: unknown
): string | null {
  const stringValue =
    cleanString(value);

  if (!stringValue) {
    return null;
  }

  const date =
    new Date(stringValue);

  if (
    !Number.isFinite(
      date.getTime()
    )
  ) {
    return null;
  }

  return date.toISOString();
}

function createExpectedSignature(
  paymentId: string,
  subscriptionId: string,
  secret: string
): string {
  return crypto
    .createHmac(
      "sha256",
      secret
    )
    .update(
      `${paymentId}|${subscriptionId}`
    )
    .digest("hex");
}

function safeSignatureCompare(
  expected: string,
  received: string
): boolean {
  const expectedBuffer =
    Buffer.from(
      expected,
      "utf8"
    );

  const receivedBuffer =
    Buffer.from(
      received,
      "utf8"
    );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
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
        "[Subscription Verify] Auth error:",
        authError
      );

      return ApiResponse.error(
        "Unable to verify your account.",
        401
      );
    }

    if (!user) {
      return ApiResponse.error(
        "You must be signed in to verify your subscription.",
        401
      );
    }

    /*
     * ============================================================
     * 2. READ REQUEST
     * ============================================================
     */

    let body: VerifyBody;

    try {
      body =
        (await request.json()) as VerifyBody;
    } catch {
      return ApiResponse.error(
        "Invalid verification request.",
        400
      );
    }

    const paymentId =
      cleanString(
        body.razorpay_payment_id
      );

    const subscriptionId =
      cleanString(
        body.razorpay_subscription_id
      );

    const signature =
      cleanString(
        body.razorpay_signature
      );

    if (
      !paymentId ||
      !subscriptionId ||
      !signature
    ) {
      return ApiResponse.error(
        "Incomplete Razorpay verification data.",
        400
      );
    }

    /*
     * ============================================================
     * 3. RAZORPAY SECRET
     * ============================================================
     */

    const razorpaySecret =
      process.env
        .RAZORPAY_KEY_SECRET;

    if (!razorpaySecret) {
      console.error(
        "[Subscription Verify] RAZORPAY_KEY_SECRET is missing."
      );

      return ApiResponse.error(
        "Payment verification is not configured correctly.",
        500
      );
    }

    /*
     * ============================================================
     * 4. VERIFY SIGNATURE
     * ============================================================
     */

    const expectedSignature =
      createExpectedSignature(
        paymentId,
        subscriptionId,
        razorpaySecret
      );

    if (
      !safeSignatureCompare(
        expectedSignature,
        signature
      )
    ) {
      console.error(
        "[Subscription Verify] Invalid Razorpay signature.",
        {
          userId: user.id,
          subscriptionId,
          paymentId,
        }
      );

      return ApiResponse.error(
        "Payment verification failed.",
        400
      );
    }

    /*
     * ============================================================
     * 5. FETCH RAZORPAY SUBSCRIPTION
     * ============================================================
     */

    let subscription;

    try {
      subscription =
        await razorpay.subscriptions.fetch(
          subscriptionId
        );
    } catch (error) {
      console.error(
        "[Subscription Verify] Subscription fetch failed:",
        error
      );

      return ApiResponse.error(
        "Unable to verify the Razorpay subscription.",
        400
      );
    }

    if (
      !subscription ||
      subscription.id !==
        subscriptionId
    ) {
      return ApiResponse.error(
        "Razorpay subscription could not be verified.",
        400
      );
    }

    /*
     * ============================================================
     * 6. VERIFY SUBSCRIPTION OWNERSHIP
     * ============================================================
     */

    const subscriptionUserId =
      getSubscriptionNote(
        subscription.notes,
        "userId"
      ) ||
      getSubscriptionNote(
        subscription.notes,
        "user_id"
      );

    if (
      subscriptionUserId &&
      subscriptionUserId !==
        user.id
    ) {
      console.error(
        "[Subscription Verify] Subscription ownership mismatch:",
        {
          authenticatedUserId:
            user.id,
          subscriptionUserId,
          subscriptionId,
        }
      );

      return ApiResponse.error(
        "This subscription does not belong to this DhanarkOS account.",
        403
      );
    }

    /*
     * ============================================================
     * 7. FETCH RAZORPAY PAYMENT
     * ============================================================
     */

    let razorpayPayment;

    try {
      razorpayPayment =
        await razorpay.payments.fetch(
          paymentId
        );
    } catch (error) {
      console.error(
        "[Subscription Verify] Payment fetch failed:",
        error
      );

      return ApiResponse.error(
        "Unable to verify the Razorpay payment.",
        400
      );
    }

    if (
      !razorpayPayment ||
      razorpayPayment.id !==
        paymentId
    ) {
      return ApiResponse.error(
        "Razorpay payment could not be verified.",
        400
      );
    }

    /*
     * ============================================================
     * 8. PAYMENT DETAILS
     * ============================================================
     */

    const paymentRecord =
      razorpayPayment as unknown as Record<
        string,
        unknown
      >;

    const paymentSubscriptionId =
      cleanString(
        paymentRecord.subscription_id
      );

    const paymentStatus =
      cleanString(
        paymentRecord.status
      ).toLowerCase();

    /*
     * ============================================================
     * 9. DEBUG PAYMENT STATE
     * ============================================================
     */

    console.log(
      "[Subscription Verify] Razorpay payment state:",
      {
        userId: user.id,
        paymentId,
        subscriptionId,
        paymentStatus,
        paymentSubscriptionId:
          paymentSubscriptionId ||
          null,
        amount:
          paymentRecord.amount ??
          null,
        currency:
          paymentRecord.currency ??
          null,
        method:
          paymentRecord.method ??
          null,
        captured:
          paymentRecord.captured ??
          null,
        refundStatus:
          paymentRecord.refund_status ??
          null,
      }
    );

    console.log(
      "[Subscription Verify] Razorpay subscription state:",
      {
        subscriptionId:
          subscription.id,
        status:
          subscription.status,
        planId:
          subscription.plan_id ??
          null,
        startAt:
          subscription.start_at ??
          null,
        currentStart:
          subscription.current_start ??
          null,
        currentEnd:
          subscription.current_end ??
          null,
      }
    );

    /*
     * ============================================================
     * 10. PAYMENT / SUBSCRIPTION RELATIONSHIP
     * ============================================================
     */

    if (
      paymentSubscriptionId &&
      paymentSubscriptionId !==
        subscriptionId
    ) {
      console.error(
        "[Subscription Verify] Payment/subscription mismatch:",
        {
          paymentId,
          subscriptionId,
          paymentSubscriptionId,
          userId: user.id,
        }
      );

      return ApiResponse.error(
        "Payment does not belong to this subscription.",
        400
      );
    }

    /*
     * ============================================================
     * 11. VERIFY PAYMENT STATUS
     * ============================================================
     */

    if (
      paymentStatus ===
      "refunded"
    ) {
      console.error(
        "[Subscription Verify] Payment has been refunded:",
        {
          userId: user.id,
          paymentId,
          subscriptionId,
        }
      );

      return ApiResponse.error(
        "This Razorpay payment has been refunded and cannot activate your DhanarkOS subscription.",
        400
      );
    }

    if (
      paymentStatus !==
        "captured" &&
      paymentStatus !==
        "authorized"
    ) {
      return ApiResponse.error(
        `Razorpay payment is not valid. Current status: ${
          paymentStatus ||
          "unknown"
        }`,
        400
      );
    }

    /*
     * ============================================================
     * 12. READ PLAN INFORMATION
     * ============================================================
     */

    const selectedPlan =
      getSubscriptionNote(
        subscription.notes,
        "plan"
      );

    const planName =
      getSubscriptionNote(
        subscription.notes,
        "planName"
      );

    const billingCycle =
      getSubscriptionNote(
        subscription.notes,
        "billingCycle"
      );

    const planId =
      getSubscriptionNote(
        subscription.notes,
        "planId"
      ) ||
      cleanString(
        subscription.plan_id
      );

    /*
     * ============================================================
     * 13. DETERMINE TRIAL END
     * ============================================================
     */

    const explicitTrialEnd =
      parseDate(
        getSubscriptionNote(
          subscription.notes,
          "trialEndsAt"
        )
      ) ||
      parseDate(
        getSubscriptionNote(
          subscription.notes,
          "trial_ends_at"
        )
      );

    let trialEndsAt =
      explicitTrialEnd;

    if (!trialEndsAt) {
      const startAt =
        Number(
          subscription.start_at ??
            0
        );

      if (
        Number.isFinite(
          startAt
        ) &&
        startAt > 0
      ) {
        const startDate =
          new Date(
            startAt * 1000
          );

        if (
          Number.isFinite(
            startDate.getTime()
          )
        ) {
          trialEndsAt =
            startDate.toISOString();
        }
      }
    }

    if (!trialEndsAt) {
      trialEndsAt =
        new Date(
          Date.now() +
            7 *
              24 *
              60 *
              60 *
              1000
        ).toISOString();
    }

    /*
     * ============================================================
     * 14. FIND EXISTING TRIAL
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
            subscription_plan,
            subscription_billing_cycle,
            selected_plan,
            subscription_plan_id
          `
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (trialLookupError) {
      console.error(
        "[Subscription Verify] Trial lookup failed:",
        trialLookupError
      );

      return ApiResponse.error(
        "Unable to verify your DhanarkOS account.",
        500
      );
    }

    const trial =
      rawTrial as TrialRecord | null;

    /*
     * ============================================================
     * 15. VERIFY EXISTING SUBSCRIPTION OWNERSHIP
     * ============================================================
     */

    if (
      trial?.razorpay_subscription_id &&
      trial.razorpay_subscription_id !==
        subscriptionId
    ) {
      console.error(
        "[Subscription Verify] Existing account has a different subscription:",
        {
          userId: user.id,
          existingSubscriptionId:
            trial.razorpay_subscription_id,
          incomingSubscriptionId:
            subscriptionId,
        }
      );

      return ApiResponse.error(
        "This subscription does not belong to this DhanarkOS account.",
        403
      );
    }

    /*
     * ============================================================
     * 16. EXISTING TRIAL
     * ============================================================
     */

    if (trial) {
      const finalPlan =
        selectedPlan ||
        trial.subscription_plan ||
        trial.selected_plan ||
        null;

      const finalBillingCycle =
        billingCycle ||
        trial.subscription_billing_cycle ||
        "monthly";

      const {
        error: updateError,
      } =
        await supabaseAdmin
          .from(
            "dhanarkos_trials"
          )
          .update({
            razorpay_subscription_id:
              subscriptionId,

            razorpay_payment_id:
              paymentId,

            trial_status:
              "trialing",

            subscription_status:
              "none",

            trial_ends_at:
              trialEndsAt,

            subscription_plan:
              finalPlan,

            selected_plan:
              finalPlan,

            subscription_billing_cycle:
              finalBillingCycle,

            subscription_plan_id:
              planId ||
              trial.subscription_plan_id ||
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

      if (updateError) {
        console.error(
          "[Subscription Verify] Existing trial update failed:",
          updateError
        );

        return ApiResponse.error(
          "Razorpay authorization succeeded, but DhanarkOS could not save your account state.",
          500
        );
      }

      console.log(
        "[Subscription Verify] Existing trial activated:",
        {
          userId: user.id,
          trialId: trial.id,
          subscriptionId,
          paymentId,
          plan: finalPlan,
          billingCycle:
            finalBillingCycle,
          trialEndsAt,
        }
      );

      return ApiResponse.success({
        activated: true,

        trialStatus:
          "trialing",

        subscriptionStatus:
          "none",

        subscriptionId,

        paymentId,

        plan:
          finalPlan,

        planName:
          planName ||
          null,

        planId:
          planId ||
          null,

        billingCycle:
          finalBillingCycle,

        trialEndsAt,
      });
    }

    /*
     * ============================================================
     * 17. NO TRIAL YET
     * ============================================================
     */

    const pendingSubscription = {
      subscriptionId,

      paymentId,

      plan:
        selectedPlan ||
        null,

      planName:
        planName ||
        null,

      planId:
        planId ||
        null,

      billingCycle:
        billingCycle ||
        "monthly",

      trialStatus:
        "trialing",

      subscriptionStatus:
        "none",

      trialEndsAt,

      verifiedAt:
        new Date().toISOString(),
    };

    /*
     * ============================================================
     * 18. SAVE VERIFIED STATE
     * ============================================================
     */

    const existingMetadata =
      user.user_metadata ??
      {};

    const {
      data: updatedUser,
      error: metadataUpdateError,
    } =
      await supabaseAdmin.auth.admin
        .updateUserById(
          user.id,
          {
            user_metadata: {
              ...existingMetadata,

              dhanarkos_pending_subscription:
                pendingSubscription,
            },
          }
        );

    if (
      metadataUpdateError ||
      !updatedUser?.user
    ) {
      console.error(
        "[Subscription Verify] Failed to save pending subscription:",
        metadataUpdateError
      );

      return ApiResponse.error(
        "Razorpay authorization succeeded, but DhanarkOS could not save your account state.",
        500
      );
    }

    /*
     * ============================================================
     * 19. SUCCESS
     * ============================================================
     */

    console.log(
      "[Subscription Verify] Subscription verified successfully:",
      {
        userId: user.id,

        subscriptionId,

        paymentId,

        plan:
          selectedPlan ||
          null,

        planName:
          planName ||
          null,

        planId:
          planId ||
          null,

        billingCycle:
          billingCycle ||
          "monthly",

        trialEndsAt,
      }
    );

    return ApiResponse.success({
      activated: true,

      trialStatus:
        "trialing",

      subscriptionStatus:
        "none",

      subscriptionId,

      paymentId,

      plan:
        selectedPlan ||
        null,

      planName:
        planName ||
        null,

      planId:
        planId ||
        null,

      billingCycle:
        billingCycle ||
        "monthly",

      trialEndsAt,
    });
  } catch (error) {
    console.error(
      "========== SUBSCRIPTION VERIFY ERROR =========="
    );

    console.error(error);

    return handleApiError(
      error
    );
  }
}