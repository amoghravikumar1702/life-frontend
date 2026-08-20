"use client";

import { createClient } from "@/lib/supabase/client";

/*
 * ============================================================
 * NOTIFICATION TYPES
 * ============================================================
 */

export type NotificationType =
  | "payment"
  | "payment_received"
  | "payment_pending"
  | "payment_failed"
  | "invoice_paid"
  | "invoice_overdue"
  | "invoice_reminder"
  | "ai_cfo_insight"
  | "system_update";

/*
 * ============================================================
 * NOTIFICATION MODEL
 * ============================================================
 */

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

/*
 * ============================================================
 * CLIENT SUPABASE
 * ============================================================
 *
 * Only created when this module is used by the browser.
 *
 * IMPORTANT:
 * We do NOT import supabaseAdmin at module level.
 * This prevents the browser from trying to initialize
 * the server Supabase client.
 */

const supabase = createClient();

/*
 * ============================================================
 * CREATE NOTIFICATION
 * ============================================================
 *
 * Server-side function.
 *
 * Supports both:
 *
 * ownerId: invoice.owner_id
 *
 * and:
 *
 * userId: user.id
 *
 * The server Supabase client is loaded dynamically so that
 * importing this service from client components does not
 * execute server-only code in the browser.
 */

export async function createNotification({
  ownerId,
  userId,
  type,
  title,
  message,
  link = null,
}: {
  ownerId?: string;
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
}): Promise<Notification> {
  const notificationUserId =
    ownerId ?? userId;

  if (!notificationUserId) {
    throw new Error(
      "A notification owner is required."
    );
  }

  /*
   * Server-only import.
   */
  const {
    supabaseAdmin,
  } = await import(
    "@/lib/server/supabase"
  );

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("user_notifications")
    .insert({
      user_id:
        notificationUserId,

      type,

      title,

      message,

      link,

      is_read: false,
    })
    .select(
      `
        id,
        user_id,
        type,
        title,
        message,
        link,
        is_read,
        created_at
      `
    )
    .single();

  if (error) {
    console.error(
      "[Notifications] Create error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to create notification."
    );
  }

  return data as Notification;
}

/*
 * ============================================================
 * GET NOTIFICATIONS
 * ============================================================
 */

export async function getNotifications(
  limit = 30
): Promise<Notification[]> {
  const safeLimit = Math.min(
    Math.max(limit, 1),
    100
  );

  const {
    data,
    error,
  } = await supabase
    .from("user_notifications")
    .select(
      `
        id,
        user_id,
        type,
        title,
        message,
        link,
        is_read,
        created_at
      `
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(safeLimit);

  if (error) {
    console.error(
      "[Notifications] Load error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to load notifications."
    );
  }

  return (data ??
    []) as Notification[];
}

/*
 * ============================================================
 * GET UNREAD COUNT
 * ============================================================
 */

export async function getUnreadNotificationCount(): Promise<number> {
  const {
    count,
    error,
  } = await supabase
    .from("user_notifications")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq(
      "is_read",
      false
    );

  if (error) {
    console.error(
      "[Notifications] Unread count error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to load unread notification count."
    );
  }

  return count ?? 0;
}

/*
 * ============================================================
 * MARK ONE NOTIFICATION AS READ
 * ============================================================
 */

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  if (!notificationId) {
    throw new Error(
      "Notification ID is required."
    );
  }

  const {
    error,
  } = await supabase
    .from("user_notifications")
    .update({
      is_read: true,
    })
    .eq(
      "id",
      notificationId
    );

  if (error) {
    console.error(
      "[Notifications] Mark read error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to mark notification as read."
    );
  }
}

/*
 * ============================================================
 * MARK ALL NOTIFICATIONS AS READ
 * ============================================================
 */

export async function markAllNotificationsAsRead(): Promise<void> {
  const {
    error,
  } = await supabase
    .from("user_notifications")
    .update({
      is_read: true,
    })
    .eq(
      "is_read",
      false
    );

  if (error) {
    console.error(
      "[Notifications] Mark all read error:",
      error
    );

    throw new Error(
      error.message ||
        "Unable to mark notifications as read."
    );
  }
}