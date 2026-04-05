export function calculateShipping(subtotal) {
  if (subtotal >= 500) return 0;
  return 29.90;
}