import crypto from "crypto";

import { supabaseAdmin } from "@/lib/server/supabase";

const SUCCESS_COOLDOWN_SECONDS =
  process.env.NODE_ENV === "production"
    ? 24 * 60 * 60
    : 0;

const ATTEMPT_WINDOW_SECONDS =
  15 * 60;

const MAX_ATTEMPTS_PER_WINDOW = 5;

type IdentifierType =
  | "ip"
  | "device"
  | "email";

type RateLimitReason =
  | "rate_limited"
  | "already_used";

export type RateLimitResult = {
  allowed: boolean;
  reason?: RateLimitReason;
  retryAfterSeconds?: number;
};

function hashIdentifier(
  value: string
): string {
  const pepper =
    process.env.RATE_LIMIT_SECRET;

  if (!pepper) {
    throw new Error(
      "RATE_LIMIT_SECRET is not configured."
    );
  }

  return crypto
    .createHmac(
      "sha256",
      pepper
    )
    .update(value)
    .digest("hex");
}

function normalizeIdentifier(
  value: string
): string {
  return value
    .trim()
    .toLowerCase();
}

/*
 * ============================================================
 * ATOMIC SIGNUP RATE LIMIT
 * ============================================================
 *
 * The database function performs:
 *
 * 1. Row creation
 * 2. Row locking
 * 3. Cooldown check
 * 4. Attempt-window check
 * 5. Atomic increment
 *
 * inside one PostgreSQL transaction.
 */

export async function checkAndRecordSignupAttempt(
  type: IdentifierType,
  identifier: string
): Promise<RateLimitResult> {
  const normalized =
    normalizeIdentifier(
      identifier
    );

  if (!normalized) {
    return {
      allowed: false,
      reason: "rate_limited",
    };
  }

  const identifierHash =
    hashIdentifier(
      normalized
    );

  const {
    data,
    error,
  } =
    await supabaseAdmin.rpc(
      "check_and_record_signup_attempt",
      {
        p_identifier_type:
          type,

        p_identifier_hash:
          identifierHash,

        p_max_attempts:
          MAX_ATTEMPTS_PER_WINDOW,

        p_window_seconds:
          ATTEMPT_WINDOW_SECONDS,

        p_success_cooldown_seconds:
          SUCCESS_COOLDOWN_SECONDS,
      }
    );

  if (error) {
    console.error(
      "[Signup Rate Limit] Atomic check failed:",
      {
        message:
          error.message,
        code:
          error.code,
        details:
          error.details,
        hint:
          error.hint,
      }
    );

    throw new Error(
      "Unable to verify signup rate limit."
    );
  }

  if (!data) {
    throw new Error(
      "Signup rate limit check returned no result."
    );
  }

  return {
    allowed:
      Boolean(data.allowed),

    reason:
      data.reason ===
        "rate_limited" ||
      data.reason ===
        "already_used"
        ? data.reason
        : undefined,

    retryAfterSeconds:
      typeof data.retry_after_seconds ===
      "number"
        ? data.retry_after_seconds
        : undefined,
  };
}

/*
 * ============================================================
 * SUCCESSFUL SIGNUP
 * ============================================================
 *
 * This remains separate from the attempt counter.
 */

export async function recordSuccessfulSignup(
  type: IdentifierType,
  identifier: string
) {
  const normalized =
    normalizeIdentifier(
      identifier
    );

  if (!normalized) {
    return;
  }

  const identifierHash =
    hashIdentifier(
      normalized
    );

  const now =
    new Date().toISOString();

  const {
    error,
  } =
    await supabaseAdmin
      .from(
        "dhanarkos_signup_rate_limits"
      )
      .upsert(
        {
          identifier_type:
            type,

          identifier_hash:
            identifierHash,

          attempt_count:
            0,

          successful_signup_at:
            now,

          last_attempt_at:
            now,

          updated_at:
            now,
        },
        {
          onConflict:
            "identifier_type,identifier_hash",
        }
      );

  if (error) {
    console.error(
      "[Signup Rate Limit] Successful signup recording failed:",
      {
        message:
          error.message,
        code:
          error.code,
        details:
          error.details,
        hint:
          error.hint,
      }
    );

    throw new Error(
      "Unable to finalize signup rate limit."
    );
  }
}