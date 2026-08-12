export async function collectPayment(invoiceId: number) {
  console.log("STEP 1: Creating ArkenOne payment link");

  const response = await fetch("/api/payments/create-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invoiceId,
    }),
  });

  console.log("STEP 2: Response Received", response.status);

  const result = await response.json();

  console.log("STEP 3: Response Body");
  console.dir(result, { depth: null });

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create payment link."
    );
  }

  return result.data;
}