import { discounted, formatPrice } from '../utils/price';

describe('price utils', () => {
  test('discounted rounds to 2 decimals', () => {
    expect(discounted(100, 10)).toBe(90);
    expect(discounted(99.99, 15)).toBe(84.99);
    expect(discounted(549.99, 12.96)).toBe(478.71);
  });

  test('formatPrice formats USD', () => {
    expect(formatPrice(90)).toBe('$90.00');
    expect(formatPrice(84.99)).toBe('$84.99');
  });
});
