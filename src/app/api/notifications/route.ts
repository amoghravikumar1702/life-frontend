import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { data, error } = await supabase
      .from("user_notifications")
      .select(`
        id,
        user_id,
        type,
        title,
        message,
        link,
        is_read,
        created_at
      `)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(30);

    if (error) {
      console.error(
        "[Notifications API] Load error:",
        error
      );

      return NextResponse.json(
        {
          error: "Unable to load notifications.",
        },
        {
          status: 500,
        }
      );
    }

    const unreadCount =
      (data ?? []).filter(
        (notification) =>
          !notification.is_read
      ).length;

    return NextResponse.json({
      notifications: data ?? [],
      unreadCount,
    });
  } catch (error) {
    console.error(
      "[Notifications API] Unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load notifications.",
      },
      {
        status: 500,
      }
    );
  }
}