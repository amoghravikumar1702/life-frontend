import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/walkthrough",

  // Legal / trust pages
  "/privacy",
  "/terms",
  "/cookies",
  "/refund-policy",
  "/contact",
];

function isPublicRoute(pathname: string) {
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  // Public payment portal
  if (
    pathname === "/pay" ||
    pathname.startsWith("/pay/")
  ) {
    return true;
  }

  // Public API routes.
  // Individual API routes perform their own auth.
  if (
    pathname === "/api" ||
    pathname.startsWith("/api/")
  ) {
    return true;
  }

  return false;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
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
   * Validate the Supabase user.
   *
   * This runs before protected application
   * pages are allowed through.
   */
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  /*
   * Public pages are always accessible,
   * whether the visitor is logged in or not.
   */
  if (isPublicRoute(pathname)) {
    return response;
  }

  /*
   * Everything else is protected.
   *
   * No valid Supabase user =
   * redirect to login.
   */
  if (error || !user) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/login";
    loginUrl.search = "";

    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  /*
   * Valid authenticated user.
   */
  return response;
}