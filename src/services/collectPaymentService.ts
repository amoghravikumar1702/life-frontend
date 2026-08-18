"use client";

import { createPaymentLink } from "@/services/paymentService";

export type CollectPaymentResult = {
  paymentUrl: string;
  paymentToken?: string;
};

export async function collectPayment(
  invoiceId: number
): Promise<CollectPaymentResult> {
  if (
    !Number.isInteger(invoiceId) ||
    invoiceId <= 0
  ) {
    throw new Error(
      "Invalid invoice ID."
    );
  }

  const result =
    await createPaymentLink(invoiceId);

  if (!result?.paymentUrl) {
    throw new Error(
      "Payment link could not be created."
    );
  }

  return {
    paymentUrl: result.paymentUrl,

    paymentToken:
      result.paymentToken,
  };
}