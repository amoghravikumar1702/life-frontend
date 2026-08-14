import { loadRazorpay } from "@/lib/loadRazorpay";
import { QueryClient } from "@tanstack/react-query";

type PaymentCheckoutParams = {
  invoiceId: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  queryClient: QueryClient;
};

export async function openRazorpayCheckout({
  invoiceId,
  customerName,
  customerEmail,
  customerPhone,
  queryClient,
}: PaymentCheckoutParams) {
  const loaded = await loadRazorpay();

  if (!loaded) {
    throw new Error("Failed to load Razorpay.");
  }

  const response = await fetch("/api/payments/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invoiceId,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Failed to create payment order."
    );
  }

  const order = result.data;

  if (!order?.id || !order?.amount || !order?.currency) {
    throw new Error("Invalid Razorpay order returned by the server.");
  }

  const Razorpay = (window as any).Razorpay;

  if (!Razorpay) {
    throw new Error("Razorpay Checkout is not available.");
  }

  const paymentObject = new Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

    amount: order.amount,

    currency: order.currency,

    name: "ArkenOne",

    description: `Invoice ${order.receipt ?? ""}`,

    order_id: order.id,

    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },

    theme: {
      color: "#D4AF37",
    },

    modal: {
      ondismiss() {
        console.log("Payment cancelled.");
      },
    },

    handler: async (paymentResponse: any) => {
      try {
        const verifyResponse = await fetch(
          "/api/payments/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentResponse),
          }
        );

        const verifyResult =
          await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(
            verifyResult.message ??
              "Payment verification failed."
          );
        }

        alert("Payment Successful!");

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["dashboard"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["customers"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["invoices"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["business-health"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["financial-analysis"],
          }),

          queryClient.invalidateQueries({
            queryKey: ["ai-cfo"],
          }),
        ]);
      } catch (error) {
        console.error(
          "RAZORPAY VERIFICATION ERROR:",
          error
        );

        console.error(
          "RAZORPAY VERIFICATION ERROR JSON:",
          JSON.stringify(error, null, 2)
        );

        alert(
          error instanceof Error
            ? error.message
            : "Payment verification failed."
        );
      }
    },
  });

  paymentObject.on(
    "payment.failed",
    function (response: any) {
      console.error(
        "RAZORPAY PAYMENT FAILED:",
        JSON.stringify(response, null, 2)
      );

      console.error(
        "RAZORPAY ERROR CODE:",
        response?.error?.code
      );

      console.error(
        "RAZORPAY ERROR DESCRIPTION:",
        response?.error?.description
      );

      console.error(
        "RAZORPAY ERROR SOURCE:",
        response?.error?.source
      );

      console.error(
        "RAZORPAY ERROR STEP:",
        response?.error?.step
      );

      console.error(
        "RAZORPAY ERROR REASON:",
        response?.error?.reason
      );

      const description =
        response?.error?.description ??
        "Your payment could not be completed.";

      alert(
        `Payment Failed\n\n${description}`
      );
    }
  );

  paymentObject.open();
}