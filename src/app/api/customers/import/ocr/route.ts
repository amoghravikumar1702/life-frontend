import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ============================================================
     * AUTH
     * ============================================================
     */

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error(
        "[CustomerOCR] Auth error:",
        authError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify your account.",
        },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be signed in to process a customer list.",
        },
        { status: 401 }
      );
    }

    /*
     * ============================================================
     * FILE
     * ============================================================
     */

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select an image of your customer list.",
        },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The uploaded image is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The image must be smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    /*
     * Some browsers may not provide a reliable MIME type
     * for HEIC/HEIF files, so the extension is also checked.
     */

    const fileName =
      file.name.toLowerCase();

    const extensionIsAllowed =
      /\.(jpg|jpeg|png|webp|heic|heif)$/i.test(
        fileName
      );

    const typeIsAllowed =
      ALLOWED_TYPES.has(
        file.type
      );

    if (
      !typeIsAllowed &&
      !extensionIsAllowed
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please upload a JPG, PNG, WEBP, HEIC, or HEIF image.",
        },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * OCR NOT CONNECTED YET
     * ============================================================
     *
     * We intentionally stop here.
     *
     * The route is now ready for the OCR provider, but we are
     * NOT pretending that an image has been processed when it
     * hasn't.
     *
     * This prevents accidental customer records from being
     * created from unreliable or incomplete OCR data.
     */

    return NextResponse.json(
      {
        success: false,
        error:
          "Photo processing is not connected yet. Please use CSV or Excel for customer import.",
      },
      { status: 501 }
    );
  } catch (error: unknown) {
    console.error(
      "========== CUSTOMER OCR ERROR =========="
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to process the customer list image.",
      },
      { status: 500 }
    );
  }
}