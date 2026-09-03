/*
 * ============================================================
 * DhanarkOS AI CFO — RATE LIMITER
 * ============================================================
 *
 * MVP protection against excessive AI CFO requests.
 *
 * Current policy:
 *
 *   10 requests
 *   per authenticated user
 *   per hour
 *
 * IMPORTANT:
 *
 * This limiter runs server-side only.
 *
 * This is an in-memory limiter and is appropriate as an MVP
 * protection layer.
 *
 * For a multi-instance production deployment, this should
 * eventually move to a shared store such as Redis/Upstash.
 */

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/*
 * ============================================================
 * CONFIGURATION
 * ============================================================
 */

const WINDOW_MS =
  60 * 60 * 1000;

const MAX_REQUESTS = 10;

/*
 * ============================================================
 * STORAGE
 * ============================================================
 *
 * The key should normally be:
 *
 * ai-cfo-ask:${user.id}
 *
 * Never use a client-controlled identifier here.
 */

const requests =
  new Map<string, RateLimitEntry>();

/*
 * ============================================================
 * CLEANUP
 * ============================================================
 *
 * Remove expired entries so the in-memory Map does not grow
 * indefinitely.
 */

function cleanupExpiredEntries(
  now: number
): void {
  for (const [
    key,
    entry,
  ] of requests.entries()) {
    if (
      now >= entry.resetAt
    ) {
      requests.delete(key);
    }
  }
}

/*
 * ============================================================
 * RATE LIMIT CHECK
 * ============================================================
 */

export function checkRateLimit(
  key: string
): RateLimitResult {
  const now = Date.now();

  /*
   * ==========================================================
   * INVALID KEY
   * ==========================================================
   *
   * Never allow an empty key.
   *
   * An invalid key should fail closed rather than allowing
   * requests to share an unintended bucket.
   */

  if (
    typeof key !== "string" ||
    key.trim().length === 0
  ) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 60,
    };
  }

  /*
   * Normalize surrounding whitespace.
   */

  const normalizedKey =
    key.trim();

  /*
   * Remove expired entries before checking the current
   * request.
   */

  cleanupExpiredEntries(now);

  const existing =
    requests.get(
      normalizedKey
    );

  /*
   * ==========================================================
   * FIRST REQUEST
   * ==========================================================
   */

  if (!existing) {
    requests.set(
      normalizedKey,
      {
        count: 1,
        resetAt:
          now + WINDOW_MS,
      }
    );

    return {
      allowed: true,
      remaining:
        MAX_REQUESTS - 1,
      retryAfterSeconds: 0,
    };
  }

  /*
   * ==========================================================
   * EXPIRED WINDOW
   * ==========================================================
   */

  if (
    now >= existing.resetAt
  ) {
    requests.set(
      normalizedKey,
      {
        count: 1,
        resetAt:
          now + WINDOW_MS,
      }
    );

    return {
      allowed: true,
      remaining:
        MAX_REQUESTS - 1,
      retryAfterSeconds: 0,
    };
  }

  /*
   * ==========================================================
   * LIMIT EXCEEDED
   * ==========================================================
   */

  if (
    existing.count >=
    MAX_REQUESTS
  ) {
    const retryAfterSeconds =
      Math.max(
        1,
        Math.ceil(
          (existing.resetAt -
            now) /
            1000
        )
      );

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  /*
   * ==========================================================
   * COUNT REQUEST
   * ==========================================================
   */

  existing.count += 1;

  requests.set(
    normalizedKey,
    existing
  );

  return {
    allowed: true,

    remaining:
      Math.max(
        0,
        MAX_REQUESTS -
          existing.count
      ),

    retryAfterSeconds: 0,
  };
}