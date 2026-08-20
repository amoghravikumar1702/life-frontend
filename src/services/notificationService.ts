import { createClient } from "@/lib/supabase/client";

/* ============================================================
   TYPES
============================================================ */

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

/* ============================================================
   BROWSER CLIENT
============================================================ */

const supabase = createClient();

/* ============================================================
   SERVER: CREATE NOTIFICATION
============================================================ */

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
}): Promise<void> {
  const targetUser = ownerId ?? userId;

  if (!targetUser) {
    throw new Error("Notification user is required.");
  }

  const { supabaseAdmin } = await import("@/lib/server/supabase");

  const { error } = await supabaseAdmin
    .from("user_notifications")
    .insert({
      user_id: targetUser,
      type,
      title,
      message,
      link,
      is_read: false,
    });

  if (error) throw error;
}

/* ============================================================
   CLIENT HELPERS
============================================================ */

async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  return user.id;
}

export async function getNotifications(limit = 30): Promise<Notification[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("user_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []) as Notification[];
}

export async function getUnreadNotificationCount() {
  const userId = await getCurrentUserId();

  const { count, error } = await supabase
    .from("user_notifications")
    .select("id", { head: true, count: "exact" })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;

  return count ?? 0;
}

export async function markNotificationAsRead(id: string) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("user_notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function markAllNotificationsAsRead() {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("user_notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw error;
}