export async function collectPayment(
  invoiceId: number
) {
  const response =
    await fetch(
      "/api/payments/create-link",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          invoiceId,
        }),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
        result.error ??
        "Failed to generate payment link."
    );
  }

  if (
    !result.data?.paymentUrl
  ) {
    throw new Error(
      "Payment URL was not returned by the server."
    );
  }

  return {
    paymentUrl:
      result.data.paymentUrl,
  };
}