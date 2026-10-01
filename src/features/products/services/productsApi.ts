import { Product, ProductsResponse } from '../types';
import { retry } from '../../../utils/retry';
import { env } from '../../../config/env';

const BASE = env.apiBaseUrl;
const RETRY_CONFIG = { retries: 3, baseDelayMs: 500, factor: 2 };

async function get<T>(path: string, signal: AbortSignal): Promise<T> {
  return retry(
    async () => {
      const res = await fetch(`${BASE}${path}`, { signal });
      if (!res.ok) {
        const err = Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
        throw err;
      }
      return res.json() as Promise<T>;
    },
    { ...RETRY_CONFIG, signal },
  );
}

export function fetchProducts(
  limit: number,
  skip: number,
  signal: AbortSignal,
): Promise<ProductsResponse> {
  return get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`, signal);
}

export function searchProducts(
  query: string,
  limit: number,
  skip: number,
  signal: AbortSignal,
): Promise<ProductsResponse> {
  return get<ProductsResponse>(
    `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`,
    signal,
  );
}

export function fetchProduct(id: number, signal: AbortSignal): Promise<Product> {
  return get<Product>(`/products/${id}`, signal);
}
