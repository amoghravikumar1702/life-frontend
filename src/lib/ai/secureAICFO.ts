import { createClient } from "@/lib/supabase/server";
import {
  generateAICFOBrief,
  AICFOBrief,
} from "@/lib/ai/openaiCFO";
import { ExecutiveReport } from "@/lib/cfo/types";

const CACHE_DURATION_MS =
  30 * 60 * 1000;

const MAX_REQUESTS_PER_HOUR = 5;

export async function getSecureAICFOBrief(
  report: ExecutiveReport
): Promise<AICFOBrief> {
  const supabase = await createClient();

  /*
   * ============================================================
   * AUTHENTICATION
   * ============================================================
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const ownerId = user.id;

  /*
   * ============================================================
   * LOAD CACHE
   * ============================================================
   */

  const {
    data: usage,
    error: usageError,
  } = await supabase
    .from("ai_cfo_usage")
    .select(
      "cached_brief,cached_at"
    )
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (usageError) {
    throw usageError;
  }

  /*
   * ============================================================
   * RETURN VALID CACHE
   * ============================================================
   */

  if (
    usage?.cached_brief &&
    usage.cached_at
  ) {
    const cachedAt =
      new Date(
        usage.cached_at
      ).getTime();

    const cacheAge =
      Date.now() - cachedAt;

    if (
      cacheAge <
      CACHE_DURATION_MS
    ) {
      return usage.cached_brief as AICFOBrief;
    }
  }

  /*
   * ============================================================
   * ATOMIC RATE LIMIT
   * ============================================================
   *
   * The database function locks the user's row.
   *
   * Multiple simultaneous requests therefore cannot
   * all pass the rate limit at the same time.
   */

  const {
    data: rateLimit,
    error: rateLimitError,
  } = await supabase.rpc(
    "check_ai_cfo_rate_limit",
    {
      p_owner_id: ownerId,
      p_max_requests:
        MAX_REQUESTS_PER_HOUR,
    }
  );

  if (rateLimitError) {
    console.error(
      "[DhanarkOS AI CFO] Rate limit error:",
      rateLimitError
    );

    throw new Error(
      "Unable to verify AI CFO request limits."
    );
  }

  const allowed =
    Boolean(rateLimit?.allowed);

  if (!allowed) {
    const retryAfter =
      Number(
        rateLimit?.retry_after ?? 3600
      );

    const minutes = Math.max(
      1,
      Math.ceil(
        retryAfter / 60
      )
    );

    throw new Error(
      `AI CFO rate limit exceeded. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`
    );
  }

  /*
   * ============================================================
   * OPENAI
   * ============================================================
   */

  const brief =
    await generateAICFOBrief(
      report
    );

  /*
   * ============================================================
   * CACHE
   * ============================================================
   */

  const {
    error: cacheError,
  } = await supabase
    .from("ai_cfo_usage")
    .update({
      cached_brief:
        brief,

      cached_at:
        new Date().toISOString(),

      updated_at:
        new Date().toISOString(),
    })
    .eq(
      "owner_id",
      ownerId
    );

  if (cacheError) {
    /*
     * Caching failure should never destroy
     * an otherwise successful CFO response.
     */

    console.error(
      "[DhanarkOS AI CFO] Cache write failed:",
      cacheError
    );
  }

  return brief;
}