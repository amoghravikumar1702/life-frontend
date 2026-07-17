import { supabaseAdmin } from "@/lib/server/supabase";

type CreateNotificationParams = {
  title: string;
  message: string;
  type: string;
};

export async function createNotification({
  title,
  message,
  type,
}: CreateNotificationParams) {
  const { error } = await supabaseAdmin
    .from("notifications")
    .insert({
      title,
      message,
      type,
      is_read: false,
    });

  if (error) {
    throw error;
  }
}