export function formatCurrency(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)}`;
}