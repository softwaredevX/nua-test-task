export function discounted(price: number, discountPercentage: number): number {
  return Math.round(price * (1 - discountPercentage / 100) * 100) / 100;
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
