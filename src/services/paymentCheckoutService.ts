import { loadRazorpay } from "@/lib/loadRazorpay";

type PaymentCheckoutParams = {
  invoiceId: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
};

export async function openRazorpayCheckout({
  invoiceId,
  customerName,
  customerEmail,
  customerPhone,
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
    throw new Error(result.message);
  }

  const order = result.data;

  const Razorpay = (window as any).Razorpay;

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

    amount: order.amount,

    currency: order.currency,

    name: "FINZURA",

    description: "Invoice Payment",

    order_id: order.id,

    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },

    theme: {
      color: "#06b6d4",
    },

    handler: async function (response: any) {
      console.log("🎉 Razorpay Success");
      console.dir(response);

      const verifyResponse = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      const verifyResult = await verifyResponse.json();

      console.log("Verification Result");
      console.dir(verifyResult);

      if (!verifyResponse.ok) {
        alert("❌ Payment verification failed.");
        return;
      }

      alert("✅ Payment verified successfully!");
    },
  };

  const paymentObject = new Razorpay(options);

  paymentObject.open();
}