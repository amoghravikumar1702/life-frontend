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
    throw new Error(result.message ?? "Failed to create payment order.");
  }

  const order = result.data;

  const Razorpay = (window as any).Razorpay;

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
      color: "#06b6d4",
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

        const verifyResult = await verifyResponse.json();

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
        console.error(error);

        alert(
          error instanceof Error
            ? error.message
            : "Payment verification failed."
        );
      }
    },
  });

  paymentObject.on("payment.failed", function (response: any) {
    console.error(response);

    const description =
      response?.error?.description ??
      "Your payment could not be completed.";

    alert(`Payment Failed\n\n${description}`);
  });

  paymentObject.open();
}