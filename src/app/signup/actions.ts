"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

import { createClient } from "@/lib/supabase/server";

import {
  checkAndRecordSignupAttempt,
  recordSuccessfulSignup,
} from "@/lib/server/signup-rate-limit";

const DEVICE_COOKIE = "dhanarkos_device_id";

const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 128;

/**
 * Creates a cryptographically secure anonymous device identifier.
 */
function createDeviceId(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Redirects back to signup with a safe user-facing error.
 */
function redirectWithError(message: string): never {
  redirect(`/signup?error=${encodeURIComponent(message)}`);
}

/**
 * Basic server-side email validation.
 */
function isValidEmail(email: string): boolean {
  if (email.length === 0 || email.length > 254) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Strong password validation.
 *
 * Requirements:
 * - 10–128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
function isStrongPassword(password: string): boolean {
  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

  return (
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialCharacter
  );
}

/**
 * Returns a specific password validation message.
 */
function getPasswordError(password: string): string | null {
  if (!password) {
    return "Please enter a password.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  return null;
}

/**
 * Converts a FormData value into a boolean checkbox state.
 *
 * HTML checkboxes normally submit "on" when checked.
 */
function isChecked(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true" || value === "1";
}

export async function signUp(formData: FormData) {
  /*
   * ============================================================
   * INPUT
   * ============================================================
   */

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  /*
   * ============================================================
   * LEGAL CONSENT
   * ============================================================
   *
   * The signup page uses one checkbox:
   *
   * name="legal-consent"
   *
   * That single checkbox represents agreement to the Terms of
   * Service and acknowledgement of the Privacy, Cookie, and
   * Refund Policies.
   *
   * This check is performed server-side so the requirement
   * cannot be bypassed by manually calling the server action.
   */

  const legalConsentAccepted = isChecked(
    formData.get("legal-consent")
  );

  if (!legalConsentAccepted) {
    redirectWithError(
      "Please agree to the Terms of Service and acknowledge the Privacy Policy, Cookie Policy, and Refund Policy before creating your account."
    );
  }

  /*
   * ============================================================
   * SERVER-SIDE EMAIL VALIDATION
   * ============================================================
   */

  if (!email) {
    redirectWithError(
      "Please enter your email address."
    );
  }

  if (!isValidEmail(email)) {
    redirectWithError(
      "Please enter a valid email address."
    );
  }

  /*
   * ============================================================
   * SERVER-SIDE STRONG PASSWORD VALIDATION
   * ============================================================
   *
   * The frontend strength meter is only visual feedback.
   *
   * These checks are mandatory here because server-side
   * validation cannot be bypassed by modifying the browser.
   */

  const passwordError = getPasswordError(password);

  if (passwordError) {
    redirectWithError(passwordError);
  }

  /*
   * Extra safety check.
   *
   * Keeps the strong-password requirement explicit even if
   * getPasswordError is changed in the future.
   */

  if (!isStrongPassword(password)) {
    redirectWithError(
      "Please choose a stronger password containing uppercase, lowercase, a number, and a special character."
    );
  }

  /*
   * ============================================================
   * DEVICE IDENTIFIER
   * ============================================================
   *
   * We keep the anonymous device identifier because it provides
   * an additional abuse-control signal without blocking every
   * user on the same shared network.
   */

  const cookieStore = await cookies();

  let deviceId = cookieStore.get(DEVICE_COOKIE)?.value;

  /*
   * Never trust arbitrary client-provided device values.
   *
   * We only accept a correctly shaped opaque identifier.
   */

  if (
    !deviceId ||
    !/^[a-f0-9]{64}$/i.test(deviceId)
  ) {
    deviceId = createDeviceId();

    cookieStore.set(
      DEVICE_COOKIE,
      deviceId,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      }
    );
  }

  /*
   * ============================================================
   * SIGNUP RATE LIMIT — DEVICE
   * ============================================================
   *
   * IP/network-based trial blocking has intentionally been
   * removed.
   *
   * Shared networks such as offices, homes, colleges, hostels,
   * coworking spaces, mobile carriers, and VPNs can legitimately
   * contain many different users.
   *
   * We therefore do NOT use the network/IP as a trial identity.
   */

  const deviceLimit =
    await checkAndRecordSignupAttempt(
      "device",
      deviceId
    );

  if (!deviceLimit.allowed) {
    redirectWithError(
      deviceLimit.reason === "already_used"
        ? "This device has already been used to create a DhanarkOS trial recently."
        : "Too many signup attempts from this device. Please try again later."
    );
  }

  /*
   * ============================================================
   * SIGNUP RATE LIMIT — EMAIL
   * ============================================================
   *
   * Email remains an important identity signal.
   *
   * This prevents the same email address from repeatedly
   * attempting to create trials while still allowing legitimate
   * users on the same network to sign up.
   */

  const emailLimit =
    await checkAndRecordSignupAttempt(
      "email",
      email
    );

  if (!emailLimit.allowed) {
    redirectWithError(
      emailLimit.reason === "already_used"
        ? "This email has already been used to create a DhanarkOS trial recently."
        : "Too many signup attempts for this email. Please try again later."
    );
  }

  /*
   * ============================================================
   * SUPABASE AUTH
   * ============================================================
   */

  const supabase = await createClient();

  const {
    data,
    error,
  } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (error) {
    console.error(
      "[DhanarkOS Signup] Supabase signup failed:",
      error
    );

    redirectWithError(
      error.message ||
        "Unable to create your account. Please try again."
    );
  }

  if (!data.user) {
    redirectWithError(
      "Unable to create your account. Please try again."
    );
  }

  /*
   * ============================================================
   * SUCCESSFUL SIGNUP
   * ============================================================
   *
   * Record successful signup only after Supabase has
   * successfully created the user.
   *
   * We intentionally do NOT record an IP/network identifier.
   */

  try {
    await recordSuccessfulSignup(
      "email",
      email
    );

    await recordSuccessfulSignup(
      "device",
      deviceId
    );
  } catch (recordError) {
    /*
     * The account already exists at this point.
     *
     * Do not fail the signup just because the anti-abuse
     * bookkeeping encountered an unexpected problem.
     */

    console.error(
      "[DhanarkOS Signup] Failed to record successful signup:",
      recordError
    );
  }

  /*
   * ============================================================
   * EMAIL CONFIRMATION / SESSION FLOW
   * ============================================================
   */

  if (!data.session) {
    redirect(
      `/login?success=${encodeURIComponent(
        "Account created successfully. Please check your email to confirm your account."
      )}`
    );
  }

  /*
   * ============================================================
   * AUTHENTICATED SIGNUP
   * ============================================================
   *
   * If Supabase returned an active session immediately,
   * continue directly into the application flow.
   */

  redirect("/pricing");
}