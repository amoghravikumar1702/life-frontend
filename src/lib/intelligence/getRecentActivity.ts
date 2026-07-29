export async function getRecentActivity() {
  return [
    {
      type: "payment",
      title: "Payment received",
      description: "Recent customer payment recorded.",
    },
    {
      type: "invoice",
      title: "Invoice issued",
      description: "A new invoice has been created.",
    },
  ];
}