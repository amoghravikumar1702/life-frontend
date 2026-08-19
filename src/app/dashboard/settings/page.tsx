"use client";

import Link from "next/link";
import {
  Bell,
  Check,
  ChevronRight,
  Lock,
  LogOut,
  RotateCcw,
  Settings2,
  Shield,
  SlidersHorizontal,
  User,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getSettings,
  updateSettings,
  type UserSettings,
} from "@/services/settingsService";

import { createClient } from "@/lib/supabase/client";

type NotificationKey =
  | "payment_received"
  | "payment_pending"
  | "invoice_reminders"
  | "ai_cfo_insights"
  | "system_updates";

const DEFAULT_SETTINGS: UserSettings = {
  currency: "INR",
  date_format: "DD MMM YYYY",
  payment_received: true,
  payment_pending: true,
  invoice_reminders: true,
  ai_cfo_insights: true,
  system_updates: true,
};

function Toggle({
  checked,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked
          ? "bg-[#D4AF37]"
          : "bg-white/[0.10]"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          checked
            ? "left-6"
            : "left-1"
        }`}
      />
    </button>
  );
}

function Section({
  icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/[0.07] bg-[#101113] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06]">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#D4AF37]">
            {eyebrow}
          </p>

          <h2 className="mt-1.5 text-lg font-semibold text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function SettingRow({
  title,
  description,
  children,
  last = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between ${
        !last
          ? "border-b border-white/[0.06]"
          : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-200">
          {title}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-600">
          {description}
        </p>
      </div>

      <div className="shrink-0">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<UserSettings | null>(null);

  const [email, setEmail] =
    useState<string>("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [loggingOut, setLoggingOut] =
    useState(false);

  /*
   * =========================================================
   * LOAD SETTINGS
   * =========================================================
   */

  async function loadSettings() {
    try {
      setLoading(true);
      setError(null);

      const supabase =
        createClient();

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "No active session found."
        );
      }

      setEmail(user.email ?? "");

      const data =
        await getSettings();

      setSettings(data);
    } catch (err) {
      console.error(
        "[Settings] Load error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  /*
   * =========================================================
   * SAVE SETTINGS
   * =========================================================
   */

  async function saveSettings(
    updates: Partial<UserSettings>
  ) {
    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const updated =
        await updateSettings(
          updates
        );

      setSettings(updated);

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 1800);
    } catch (err) {
      console.error(
        "[Settings] Save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =========================================================
   * TOGGLE
   * =========================================================
   */

  async function toggleSetting(
    key: NotificationKey
  ) {
    if (!settings || saving) {
      return;
    }

    const nextValue =
      !settings[key];

    /*
     * Optimistic UI
     */
    setSettings({
      ...settings,
      [key]: nextValue,
    });

    try {
      await saveSettings({
        [key]: nextValue,
      });
    } catch {
      /*
       * Reload original value
       * if save failed.
       */
      await loadSettings();
    }
  }

  /*
   * =========================================================
   * CURRENCY
   * =========================================================
   */

  async function changeCurrency(
    value: string
  ) {
    if (!settings || saving) {
      return;
    }

    setSettings({
      ...settings,
      currency: value,
    });

    try {
      await saveSettings({
        currency: value,
      });
    } catch {
      await loadSettings();
    }
  }

  /*
   * =========================================================
   * DATE FORMAT
   * =========================================================
   */

  async function changeDateFormat(
    value: string
  ) {
    if (!settings || saving) {
      return;
    }

    setSettings({
      ...settings,
      date_format: value,
    });

    try {
      await saveSettings({
        date_format: value,
      });
    } catch {
      await loadSettings();
    }
  }

  /*
   * =========================================================
   * RESTORE DEFAULTS
   * =========================================================
   */

  async function restoreDefaults() {
    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const updated =
        await updateSettings(
          DEFAULT_SETTINGS
        );

      setSettings(updated);

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 1800);
    } catch (err) {
      console.error(
        "[Settings] Restore defaults error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to restore defaults."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */

  async function logout() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      const supabase =
        createClient();

      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      window.location.href =
        "/login";
    } catch (err) {
      console.error(
        "[Settings] Logout error:",
        err
      );

      setLoggingOut(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to log out."
      );
    }
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#030712] px-3 pb-12 pt-3 text-white sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="h-48 animate-pulse rounded-[30px] border border-white/[0.07] bg-[#101113]" />

          <div className="mt-6 space-y-6">
            <div className="h-64 animate-pulse rounded-[28px] bg-[#101113]" />
            <div className="h-72 animate-pulse rounded-[28px] bg-[#101113]" />
            <div className="h-56 animate-pulse rounded-[28px] bg-[#101113]" />
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (error && !settings) {
    return (
      <main className="min-h-screen bg-[#030712] px-4 pb-12 pt-4 text-white md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[28px] border border-red-400/10 bg-[#101113] p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.04]">
              <AlertCircle
                size={19}
                className="text-red-400"
              />
            </div>

            <h1 className="mt-5 text-xl font-semibold">
              Unable to load settings
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadSettings}
              className="mt-6 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-semibold text-black"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <main className="min-h-screen min-w-0 bg-[#030712] px-3 pb-12 pt-3 text-white sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#101113] px-5 py-7 shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-64 w-64 rounded-full bg-[#D4AF37]/[0.04] blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.07]">
                <Settings2
                  size={24}
                  strokeWidth={1.6}
                  className="text-[#D4AF37]"
                />
              </div>

              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
                  Workspace Configuration
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Settings
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  Manage your ArkenOne account,
                  preferences, notifications,
                  and security.
                </p>
              </div>
            </div>

            {(saved || saving) && (
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
                  saving
                    ? "border-[#D4AF37]/10 bg-[#D4AF37]/[0.04] text-[#D4AF37]"
                    : "border-emerald-400/10 bg-emerald-400/[0.05] text-emerald-400"
                }`}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Changes saved
                  </>
                )}
              </div>
            )}
          </div>

          {error && settings && (
            <div className="relative mt-5 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}
        </section>

        <div className="mt-6 space-y-6">

          {/* =====================================================
              ACCOUNT
          ====================================================== */}

          <Section
            icon={
              <User
                size={19}
                className="text-[#D4AF37]"
              />
            }
            eyebrow="Account"
            title="Account information"
            description="Manage your personal ArkenOne account."
          >
            <div className="divide-y divide-white/[0.06]">

              <SettingRow
                title="Display name"
                description="Your workspace identity. Business information can be managed from Company Profile."
              >
                <span className="text-sm text-zinc-400">
                  Administrator
                </span>
              </SettingRow>

              <SettingRow
                title="Email address"
                description="The email address associated with your authenticated ArkenOne account."
              >
                <span className="max-w-[240px] truncate text-sm text-zinc-400">
                  {email || "Unavailable"}
                </span>
              </SettingRow>

              <SettingRow
                title="Company profile"
                description="Business name, contact information, and company details are managed separately."
                last
              >
                <Link
                  href="/company"
                  className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-[#D4AF37]/25 hover:text-white"
                >
                  Company Profile
                  <ChevronRight size={14} />
                </Link>
              </SettingRow>
            </div>
          </Section>

          {/* =====================================================
              NOTIFICATIONS
          ====================================================== */}

          <Section
            icon={
              <Bell
                size={19}
                className="text-[#D4AF37]"
              />
            }
            eyebrow="Notifications"
            title="Notification preferences"
            description="Choose which financial events and intelligence updates you want to receive."
          >
            <div className="divide-y divide-white/[0.06]">

              <SettingRow
                title="Payment received"
                description="Receive notifications when a customer payment is successfully recorded."
              >
                <Toggle
                  checked={
                    settings.payment_received
                  }
                  disabled={saving}
                  onChange={() =>
                    toggleSetting(
                      "payment_received"
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                title="Payment pending"
                description="Get notified when a payment requires attention or confirmation."
              >
                <Toggle
                  checked={
                    settings.payment_pending
                  }
                  disabled={saving}
                  onChange={() =>
                    toggleSetting(
                      "payment_pending"
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                title="Invoice reminders"
                description="Receive reminders about outstanding invoices and follow-ups."
              >
                <Toggle
                  checked={
                    settings.invoice_reminders
                  }
                  disabled={saving}
                  onChange={() =>
                    toggleSetting(
                      "invoice_reminders"
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                title="AI CFO insights"
                description="Receive important financial intelligence generated by ArkenOne AI CFO."
              >
                <Toggle
                  checked={
                    settings.ai_cfo_insights
                  }
                  disabled={saving}
                  onChange={() =>
                    toggleSetting(
                      "ai_cfo_insights"
                    )
                  }
                />
              </SettingRow>

              <SettingRow
                title="System updates"
                description="Important product, security, and system notifications."
                last
              >
                <Toggle
                  checked={
                    settings.system_updates
                  }
                  disabled={saving}
                  onChange={() =>
                    toggleSetting(
                      "system_updates"
                    )
                  }
                />
              </SettingRow>

            </div>
          </Section>

          {/* =====================================================
              PREFERENCES
          ====================================================== */}

          <Section
            icon={
              <SlidersHorizontal
                size={19}
                className="text-[#D4AF37]"
              />
            }
            eyebrow="Preferences"
            title="Financial preferences"
            description="Control how financial information is displayed across ArkenOne."
          >
            <div className="divide-y divide-white/[0.06]">

              <SettingRow
                title="Currency"
                description="The primary currency used throughout your financial workspace."
              >
                <select
                  value={
                    settings.currency
                  }
                  disabled={saving}
                  onChange={(event) =>
                    changeCurrency(
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-white/[0.08] bg-[#151618] px-4 py-2.5 text-xs text-zinc-300 outline-none focus:border-[#D4AF37]/30 disabled:opacity-50"
                >
                  <option value="INR">
                    INR — Indian Rupee
                  </option>

                  <option value="USD">
                    USD — US Dollar
                  </option>

                  <option value="EUR">
                    EUR — Euro
                  </option>

                  <option value="GBP">
                    GBP — British Pound
                  </option>
                </select>
              </SettingRow>

              <SettingRow
                title="Date format"
                description="Choose how dates are displayed throughout the application."
                last
              >
                <select
                  value={
                    settings.date_format
                  }
                  disabled={saving}
                  onChange={(event) =>
                    changeDateFormat(
                      event.target.value
                    )
                  }
                  className="rounded-xl border border-white/[0.08] bg-[#151618] px-4 py-2.5 text-xs text-zinc-300 outline-none focus:border-[#D4AF37]/30 disabled:opacity-50"
                >
                  <option value="DD MMM YYYY">
                    DD MMM YYYY
                  </option>

                  <option value="DD/MM/YYYY">
                    DD/MM/YYYY
                  </option>

                  <option value="MM/DD/YYYY">
                    MM/DD/YYYY
                  </option>
                </select>
              </SettingRow>

            </div>

            <button
              type="button"
              disabled={saving}
              onClick={restoreDefaults}
              className="mt-5 flex items-center gap-2 text-xs text-zinc-600 transition hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={13} />
              Restore default preferences
            </button>
          </Section>

          {/* =====================================================
              SECURITY
          ====================================================== */}

          <Section
            icon={
              <Shield
                size={19}
                className="text-[#D4AF37]"
              />
            }
            eyebrow="Privacy & Security"
            title="Account security"
            description="Keep your ArkenOne account protected."
          >
            <div className="divide-y divide-white/[0.06]">

              <SettingRow
                title="Password security"
                description="Use the secure password recovery system to change your password."
              >
                <Link
                  href="/forgot-password"
                  className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-[#D4AF37]/25 hover:text-white"
                >
                  Manage password
                  <Lock size={13} />
                </Link>
              </SettingRow>

              <SettingRow
                title="Privacy"
                description="Review how ArkenOne handles account and business information."
              >
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 text-xs font-medium text-[#D4AF37] hover:text-[#E8C75A]"
                >
                  Privacy policy
                  <ExternalLink size={13} />
                </Link>
              </SettingRow>

              <SettingRow
                title="Terms"
                description="Review the terms governing your use of ArkenOne."
                last
              >
                <Link
                  href="/terms"
                  className="flex items-center gap-2 text-xs font-medium text-[#D4AF37] hover:text-[#E8C75A]"
                >
                  Terms & Conditions
                  <ExternalLink size={13} />
                </Link>
              </SettingRow>

            </div>
          </Section>

          {/* =====================================================
              APPEARANCE
          ====================================================== */}

          <Section
            icon={
              <Settings2
                size={19}
                className="text-[#D4AF37]"
              />
            }
            eyebrow="Appearance"
            title="Interface"
            description="ArkenOne currently uses its Executive Glass interface across the workspace."
          >
            <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#D4AF37]/[0.025] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    Executive Glass
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Premium dark workspace
                    interface.
                  </p>
                </div>

                <span className="rounded-lg border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Active
                </span>
              </div>
            </div>
          </Section>

          {/* =====================================================
              ABOUT
          ====================================================== */}

          <Section
            icon={
              <FileText
                size={19}
                className="text-[#D4AF37]"
              />
            }
            eyebrow="About"
            title="ArkenOne"
            description="Product information and important legal documents."
          >
            <div className="divide-y divide-white/[0.06]">

              <SettingRow
                title="Version"
                description="Current ArkenOne application version."
              >
                <span className="font-mono text-xs text-zinc-500">
                  v1.0.0
                </span>
              </SettingRow>

              <SettingRow
                title="Privacy Policy"
                description="How your information is collected and handled."
              >
                <Link
                  href="/privacy"
                  className="text-xs font-medium text-[#D4AF37] hover:text-[#E8C75A]"
                >
                  View
                </Link>
              </SettingRow>

              <SettingRow
                title="Terms & Conditions"
                description="The terms governing use of the ArkenOne platform."
              >
                <Link
                  href="/terms"
                  className="text-xs font-medium text-[#D4AF37] hover:text-[#E8C75A]"
                >
                  View
                </Link>
              </SettingRow>

              <SettingRow
                title="Refund & Cancellation"
                description="Review subscription cancellation and refund terms."
                last
              >
                <Link
                  href="/refund-policy"
                  className="text-xs font-medium text-[#D4AF37] hover:text-[#E8C75A]"
                >
                  View
                </Link>
              </SettingRow>

            </div>
          </Section>

          {/* =====================================================
              DANGER ZONE
          ====================================================== */}

          <section className="rounded-[28px] border border-red-400/[0.10] bg-red-400/[0.015] p-5 sm:p-7">
            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.04]">
                <LogOut
                  size={19}
                  className="text-red-400"
                />
              </div>

              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-red-400">
                  Account Controls
                </p>

                <h2 className="mt-1.5 text-lg font-semibold text-white">
                  Sign out
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Sign out of your current
                  ArkenOne session.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-red-400/[0.08] bg-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Logout
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  You can sign back in at any
                  time.
                </p>
              </div>

              <button
                type="button"
                disabled={loggingOut}
                onClick={logout}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-2.5 text-xs font-medium text-red-400 transition hover:bg-red-400/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loggingOut ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                    Signing out…
                  </>
                ) : (
                  <>
                    <LogOut size={14} />
                    Logout
                  </>
                )}
              </button>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}