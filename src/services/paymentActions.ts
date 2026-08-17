"use client";

import { createPaymentLink } from "@/services/paymentService";

export async function handleCollectPayment(
  invoiceId: number
): Promise<string | null> {
  try {
    const { paymentUrl } =
      await createPaymentLink(invoiceId);

    if (!paymentUrl) {
      throw new Error(
        "Payment link was not generated."
      );
    }

    await navigator.clipboard.writeText(
      paymentUrl
    );

    alert(
      "Payment link generated and copied to clipboard."
    );

    return paymentUrl;
  } catch (error) {
    console.error(
      "Collect Payment Error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate payment link.";

    alert(message);

    return null;
  }
}