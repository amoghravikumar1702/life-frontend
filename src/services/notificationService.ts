import { supabaseAdmin } from "@/lib/server/supabase";

type CreateNotificationParams = {
  ownerId: string;
  title: string;
  message: string;
  type: string;
};

export async function createNotification({
  ownerId,
  title,
  message,
  type,
}: CreateNotificationParams) {
  const { error } = await supabaseAdmin
    .from("notifications")
    .insert({
      owner_id: ownerId,
      title,
      message,
      type,
      is_read: false,
    });

  if (error) {
    throw error;
  }
}