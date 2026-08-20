import { supabaseAdmin } from "@/lib/server/supabase";

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

export type ServerNotification = {
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
 * CREATE NOTIFICATION
 * ============================================================
 *
 * SERVER ONLY.
 *
 * Used by:
 * - Payment verification
 * - Future invoice automation
 * - AI CFO
 * - System events
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
}): Promise<ServerNotification> {
  const notificationUserId =
    ownerId ?? userId;

  if (!notificationUserId) {
    throw new Error(
      "A notification owner is required."
    );
  }

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("user_notifications")
    .insert({
      user_id: notificationUserId,
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

  return data as ServerNotification;
}