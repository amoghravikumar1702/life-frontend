import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

const PRODUCT_ROUTES = [
  "/dashboard",
  "/customers",
  "/invoices",
  "/payments",
  "/expenses",
  "/reports",
  "/ai",
  "/insights",
];

const PUBLIC_AUTH_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/pricing",
  "/onboarding",
  "/billing-required",
];

function isProductRoute(
  pathname: string
): boolean {
  return PRODUCT_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

function isPublicAuthRoute(
  pathname: string
): boolean {
  return PUBLIC_AUTH_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

export async function updateSession(
  request: NextRequest
) {
  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value
                );
              }
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options
                );
              }
            );
          },
        },
      }
    );

  /*
   * ============================================================
   * VALIDATE AUTHENTICATED USER
   * ============================================================
   */

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  const pathname =
    request.nextUrl.pathname;

  /*
   * ============================================================
   * PUBLIC ROUTES
   * ============================================================
   *
   * These routes do not require an active ArkenOne trial.
   */

  if (
    isPublicAuthRoute(
      pathname
    )
  ) {
    return response;
  }

  /*
   * ============================================================
   * PRODUCT ROUTES
   * ============================================================
   */

  if (
    isProductRoute(
      pathname
    )
  ) {
    /*
     * No authenticated user.
     *
     * Send them to login.
     */

    if (!user) {
      const loginUrl =
        request.nextUrl.clone();

      loginUrl.pathname =
        "/login";

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(
        loginUrl
      );
    }

    /*
     * ========================================================
     * LOAD TRIAL / SUBSCRIPTION
     * ========================================================
     */

    const {
      data: trial,
      error: trialError,
    } =
      await supabase
        .from(
          "arkenone_trials"
        )
        .select(
          `
            id,
            trial_status,
            trial_ends_at,
            subscription_status
          `
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    /*
     * If the trial record cannot be read, fail closed.
     *
     * We do NOT give access when billing state is unknown.
     */

    if (trialError) {
      console.error(
        "[Middleware] Trial lookup failed:",
        trialError
      );

      const billingUrl =
        request.nextUrl.clone();

      billingUrl.pathname =
        "/billing-required";

      billingUrl.searchParams.set(
        "reason",
        "verification"
      );

      return NextResponse.redirect(
        billingUrl
      );
    }

    /*
     * ========================================================
     * NO TRIAL RECORD
     * ========================================================
     *
     * This normally means onboarding has not completed.
     *
     * Do not give access to the product.
     */

    if (!trial) {
      const onboardingUrl =
        request.nextUrl.clone();

      onboardingUrl.pathname =
        "/onboarding";

      return NextResponse.redirect(
        onboardingUrl
      );
    }

    /*
     * ========================================================
     * ACTIVE PAID SUBSCRIPTION
     * ========================================================
     */

    if (
      trial.subscription_status ===
      "active"
    ) {
      return response;
    }

    /*
     * ========================================================
     * TRIAL STATUS
     * ========================================================
     */

    const now =
      Date.now();

    const trialEndsAt =
      new Date(
        trial.trial_ends_at
      ).getTime();

    const trialStillActive =
      trial.trial_status ===
        "trialing" &&
      Number.isFinite(
        trialEndsAt
      ) &&
      trialEndsAt > now;

    if (
      trialStillActive
    ) {
      return response;
    }

    /*
     * ========================================================
     * TRIAL EXPIRED
     * ========================================================
     *
     * Hard lock.
     *
     * No dashboard.
     * No customers.
     * No invoices.
     * No payments.
     * No expenses.
     * No AI CFO.
     * No reports.
     */

    const billingUrl =
      request.nextUrl.clone();

    billingUrl.pathname =
      "/billing-required";

    return NextResponse.redirect(
      billingUrl
    );
  }

  /*
   * ============================================================
   * EVERYTHING ELSE
   * ============================================================
   */

  return response;
}