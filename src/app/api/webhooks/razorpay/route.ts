import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { supabaseAdmin } from "@/lib/server/supabase";

type RazorpaySubscription = {
  id?: string;
  plan_id?: string;
  status?: string;
  start_at?: number | null;
  current_start?: number | null;
  current_end?: number | null;
  charge_at?: number | null;
  paid_count?: number;
  remaining_count?: number;
};

type RazorpayPayment = {
  id?: string;
  amount?: number;
  status?: string;
  subscription_id?: string;
};

type RazorpayEvent = {
  entity?: string;
  event?: string;
  account_id?: string;
  created_at?: number;
  payload?: {
    subscription?: {
      entity?: RazorpaySubscription;
    };
    payment?: {
      entity?: RazorpayPayment;
    };
  };
};

function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
) {
  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        secret
      )
      .update(rawBody)
      .digest("hex");

  const expectedBuffer =
    Buffer.from(
      expectedSignature,
      "utf8"
    );

  const receivedBuffer =
    Buffer.from(
      signature,
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

function unixToISOString(
  value:
    | number
    | null
    | undefined
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  return new Date(
    value * 1000
  ).toISOString();
}

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ============================================================
     * WEBHOOK SECRET
     * ============================================================
     */

    const webhookSecret =
      process.env
        .RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "[DhanarkOS Razorpay Webhook] Missing RAZORPAY_WEBHOOK_SECRET."
      );

      return NextResponse.json(
        {
          error:
            "Webhook is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ============================================================
     * RAW BODY
     * ============================================================
     *
     * Razorpay signs the exact raw request body.
     */

    const rawBody =
      await request.text();

    const signature =
      request.headers.get(
        "x-razorpay-signature"
      );

    const eventId =
      request.headers.get(
        "x-razorpay-event-id"
      );

    if (!signature) {
      console.error(
        "[DhanarkOS Razorpay Webhook] Missing signature."
      );

      return NextResponse.json(
        {
          error:
            "Missing webhook signature.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ============================================================
     * VERIFY SIGNATURE
     * ============================================================
     */

    const validSignature =
      verifyWebhookSignature(
        rawBody,
        signature,
        webhookSecret
      );

    if (!validSignature) {
      console.error(
        "[DhanarkOS Razorpay Webhook] Invalid signature."
      );

      return NextResponse.json(
        {
          error:
            "Invalid webhook signature.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ============================================================
     * PARSE EVENT
     * ============================================================
     */

    let event: RazorpayEvent;

    try {
      event =
        JSON.parse(
          rawBody
        ) as RazorpayEvent;
    } catch {
      console.error(
        "[DhanarkOS Razorpay Webhook] Invalid JSON payload."
      );

      return NextResponse.json(
        {
          error:
            "Invalid webhook payload.",
        },
        {
          status: 400,
        }
      );
    }

    const eventName =
      event.event ?? "";

    const subscription =
      event.payload
        ?.subscription
        ?.entity;

    const payment =
      event.payload
        ?.payment
        ?.entity;

    const subscriptionId =
      subscription?.id ??
      payment?.subscription_id ??
      null;

    console.log(
      "[DhanarkOS Razorpay Webhook] Received:",
      {
        eventId,
        event:
          eventName,
        subscriptionId,
      }
    );

    /*
     * ============================================================
     * NO SUBSCRIPTION ID
     * ============================================================
     */

    if (!subscriptionId) {
      console.log(
        "[DhanarkOS Razorpay Webhook] No subscription ID. Ignoring event."
      );

      return NextResponse.json(
        {
          received:
            true,
        },
        {
          status: 200,
        }
      );
    }

    /*
     * ============================================================
     * FIND DHANARKOS ACCOUNT
     * ============================================================
     *
     * Use the service-role client because this endpoint is called
     * by Razorpay, not by an authenticated browser session.
     */

    const {
      data: trial,
      error: trialLookupError,
    } =
      await supabaseAdmin
        .from("dhanarkos_trials")
        .select(
          `
            id,
            user_id,
            trial_status,
            trial_ends_at,
            subscription_status,
            razorpay_subscription_id,
            selected_plan,
            subscription_plan,
            subscription_plan_id,
            subscription_billing_cycle
          `
        )
        .eq(
          "razorpay_subscription_id",
          subscriptionId
        )
        .maybeSingle();

    if (trialLookupError) {
      console.error(
        "[DhanarkOS Razorpay Webhook] Trial lookup failed:",
        trialLookupError
      );

      return NextResponse.json(
        {
          error:
            "Unable to process webhook.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ============================================================
     * UNKNOWN SUBSCRIPTION
     * ============================================================
     */

    if (!trial) {
      console.warn(
        "[DhanarkOS Razorpay Webhook] Subscription not found:",
        subscriptionId
      );

      /*
       * The webhook is valid, but the subscription isn't associated
       * with a DhanarkOS account.
       *
       * Return 200 to avoid unnecessary Razorpay retries.
       */

      return NextResponse.json(
        {
          received:
            true,
        },
        {
          status: 200,
        }
      );
    }

    /*
     * ============================================================
     * SUBSCRIPTION AUTHENTICATED
     * ============================================================
     */

    switch (eventName) {
      case "subscription.authenticated": {
        const trialEndsAt =
          unixToISOString(
            subscription?.start_at
          );

        const updatePayload: Record<
          string,
          unknown
        > = {
          trial_status:
            "trialing",

          subscription_status:
            "none",

          updated_at:
            new Date().toISOString(),
        };

        if (trialEndsAt) {
          updatePayload.trial_ends_at =
            trialEndsAt;
        }

        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update(
              updatePayload
            )
            .eq(
              "id",
              trial.id
            );

        if (updateError) {
          console.error(
            "[DhanarkOS Razorpay Webhook] Authentication update failed:",
            updateError
          );

          return NextResponse.json(
            {
              error:
                "Unable to update trial.",
            },
            {
              status: 500,
            }
          );
        }

        console.log(
          "[DhanarkOS Razorpay Webhook] Trial authenticated:",
          subscriptionId
        );

        break;
      }

      /*
       * ============================================================
       * SUBSCRIPTION ACTIVATED
       * ============================================================
       */

      case "subscription.activated": {
        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update({
              trial_status:
                "expired",

              subscription_status:
                "active",

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              trial.id
            );

        if (updateError) {
          console.error(
            "[DhanarkOS Razorpay Webhook] Activation update failed:",
            updateError
          );

          return NextResponse.json(
            {
              error:
                "Unable to activate subscription.",
            },
            {
              status: 500,
            }
          );
        }

        console.log(
          "[DhanarkOS Razorpay Webhook] Subscription activated:",
          subscriptionId
        );

        break;
      }

      /*
       * ============================================================
       * SUBSCRIPTION CHARGED
       * ============================================================
       *
       * This is the important recurring-payment event.
       *
       * Once Razorpay successfully charges the customer after the
       * trial, DhanarkOS becomes a paid active subscription.
       */

      case "subscription.charged": {
        const nextBillingDate =
          unixToISOString(
            subscription?.charge_at
          );

        /*
         * First update the core fields that must exist.
         */

        const {
          error: coreUpdateError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update({
              trial_status:
                "expired",

              subscription_status:
                "active",

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              trial.id
            );

        if (coreUpdateError) {
          console.error(
            "[DhanarkOS Razorpay Webhook] Charged update failed:",
            coreUpdateError
          );

          return NextResponse.json(
            {
              error:
                "Unable to activate paid subscription.",
            },
            {
              status: 500,
            }
          );
        }

        /*
         * next_billing_at is optional.
         *
         * If your database has the column, save it.
         *
         * If it doesn't, the subscription is still correctly
         * activated above.
         */

        if (nextBillingDate) {
          const {
            error:
              billingDateError,
          } =
            await supabaseAdmin
              .from(
                "dhanarkos_trials"
              )
              .update({
                next_billing_at:
                  nextBillingDate,
              })
              .eq(
                "id",
                trial.id
              );

          if (billingDateError) {
            console.warn(
              "[DhanarkOS Razorpay Webhook] next_billing_at could not be saved:",
              billingDateError.message
            );
          }
        }

        console.log(
          "[DhanarkOS Razorpay Webhook] Subscription charged successfully:",
          {
            subscriptionId,
            paymentId:
              payment?.id ??
              null,
            nextBillingDate,
          }
        );

        break;
      }

      /*
       * ============================================================
       * SUBSCRIPTION PENDING
       * ============================================================
       */

      case "subscription.pending": {
        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update({
              subscription_status:
                "past_due",

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              trial.id
            );

        if (updateError) {
          console.error(
            "[DhanarkOS Razorpay Webhook] Pending update failed:",
            updateError
          );

          return NextResponse.json(
            {
              error:
                "Unable to update pending subscription.",
            },
            {
              status: 500,
            }
          );
        }

        break;
      }

      /*
       * ============================================================
       * SUBSCRIPTION HALTED
       * ============================================================
       */

      case "subscription.halted": {
        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update({
              subscription_status:
                "past_due",

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              trial.id
            );

        if (updateError) {
          console.error(
            "[DhanarkOS Razorpay Webhook] Halted update failed:",
            updateError
          );

          return NextResponse.json(
            {
              error:
                "Unable to update halted subscription.",
            },
            {
              status: 500,
            }
          );
        }

        break;
      }

      /*
       * ============================================================
       * SUBSCRIPTION CANCELLED
       * ============================================================
       */

      case "subscription.cancelled": {
        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update({
              subscription_status:
                "cancelled",

              trial_status:
                "expired",

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              trial.id
            );

        if (updateError) {
          console.error(
            "[DhanarkOS Razorpay Webhook] Cancellation update failed:",
            updateError
          );

          return NextResponse.json(
            {
              error:
                "Unable to update cancelled subscription.",
            },
            {
              status: 500,
            }
          );
        }

        break;
      }

      /*
       * ============================================================
       * SUBSCRIPTION COMPLETED
       * ============================================================
       */

      case "subscription.completed": {
        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update({
              subscription_status:
                "cancelled",

              trial_status:
                "expired",

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              trial.id
            );

        if (updateError) {
          console.error(
            "[DhanarkOS Razorpay Webhook] Completion update failed:",
            updateError
          );

          return NextResponse.json(
            {
              error:
                "Unable to update completed subscription.",
            },
            {
              status: 500,
            }
          );
        }

        break;
      }

      /*
       * ============================================================
       * SUBSCRIPTION UPDATED
       * ============================================================
       */

      case "subscription.updated": {
        console.log(
          "[DhanarkOS Razorpay Webhook] Subscription updated:",
          subscriptionId
        );

        break;
      }

      /*
       * ============================================================
       * SUBSCRIPTION PAUSED
       * ============================================================
       */

      case "subscription.paused": {
        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update({
              subscription_status:
                "past_due",

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              trial.id
            );

        if (updateError) {
          console.error(
            "[DhanarkOS Razorpay Webhook] Pause update failed:",
            updateError
          );

          return NextResponse.json(
            {
              error:
                "Unable to update paused subscription.",
            },
            {
              status: 500,
            }
          );
        }

        break;
      }

      /*
       * ============================================================
       * SUBSCRIPTION RESUMED
       * ============================================================
       */

      case "subscription.resumed": {
        const {
          error: updateError,
        } =
          await supabaseAdmin
            .from(
              "dhanarkos_trials"
            )
            .update({
              subscription_status:
                "active",

              updated_at:
                new Date().toISOString(),
            })
            .eq(
              "id",
              trial.id
            );

        if (updateError) {
          console.error(
            "[DhanarkOS Razorpay Webhook] Resume update failed:",
            updateError
          );

          return NextResponse.json(
            {
              error:
                "Unable to update resumed subscription.",
            },
            {
              status: 500,
            }
          );
        }

        break;
      }

      /*
       * ============================================================
       * UNKNOWN EVENT
       * ============================================================
       */

      default: {
        console.log(
          "[DhanarkOS Razorpay Webhook] Event acknowledged:",
          eventName
        );

        break;
      }
    }

    /*
     * ============================================================
     * SUCCESS
     * ============================================================
     */

    return NextResponse.json(
      {
        received:
          true,

        event:
          eventName,

        eventId:
          eventId ?? null,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "[DhanarkOS Razorpay Webhook] Unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed.",
      },
      {
        status: 500,
      }
    );
  }
}