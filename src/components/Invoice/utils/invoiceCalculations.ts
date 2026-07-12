export const GST_RATE = 0.18;

export function calculateSubtotal(
  items: {
    quantity: number;
    price: number;
  }[]
) {
  return items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
}

export function calculateTax(
  subtotal: number
) {
  return subtotal * GST_RATE;
}

export function calculateTotal(
  subtotal: number,
  tax: number
) {
  return subtotal + tax;
}

export function formatCurrency(
  amount: number
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}