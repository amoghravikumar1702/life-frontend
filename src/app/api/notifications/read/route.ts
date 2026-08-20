import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest
) {
  try {
    const supabase = await createClient();

    /* =========================================================
       1. GET AUTHENTICATED USER
    ========================================================= */

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

    /* =========================================================
       2. READ REQUEST BODY
    ========================================================= */

    const body = await request.json();

    const notificationId =
      typeof body?.notificationId === "string"
        ? body.notificationId
        : null;

    const markAll =
      body?.markAll === true;

    /* =========================================================
       3. MARK ALL AS READ
    ========================================================= */

    if (markAll) {
      const { error } = await supabase
        .from("user_notifications")
        .update({
          is_read: true,
        })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        console.error(
          "[Notifications API] Mark all read error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Unable to mark notifications as read.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,
        markAll: true,
      });
    }

    /* =========================================================
       4. VALIDATE NOTIFICATION ID
    ========================================================= */

    if (!notificationId) {
      return NextResponse.json(
        {
          error:
            "Notification ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================================
       5. MARK ONE NOTIFICATION AS READ
    ========================================================= */

    const { error } = await supabase
      .from("user_notifications")
      .update({
        is_read: true,
      })
      .eq("id", notificationId)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "[Notifications API] Mark read error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to mark notification as read.",
        },
        {
          status: 500,
        }
      );
    }

    /* =========================================================
       6. RESPONSE
    ========================================================= */

    return NextResponse.json({
      success: true,
      notificationId,
    });
  } catch (error) {
    console.error(
      "[Notifications API] Unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update notification.",
      },
      {
        status: 500,
      }
    );
  }
}