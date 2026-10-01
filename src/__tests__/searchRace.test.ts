import { searchProducts } from '../features/products/services/productsApi';

// Test: simulate out-of-order responses — slow request A, fast request B
// Only B's results should be committed.
describe('search race condition (useProducts hook logic)', () => {
  test('stale response from A is discarded when B resolves first', async () => {
    let resolveA!: (v: unknown) => void;
    let resolveB!: (v: unknown) => void;

    const responseA = {
      products: [{ id: 1, title: 'Result A' }],
      total: 1,
      skip: 0,
      limit: 20,
    };
    const responseB = {
      products: [{ id: 2, title: 'Result B' }],
      total: 1,
      skip: 0,
      limit: 20,
    };

    const fetchId = { current: 0 };
    const latestQuery = { current: '' };
    let committed: unknown = null;

    async function simulateFetch(
      query: string,
      mockResponse: unknown,
      resolverSetter: (r: (v: unknown) => void) => void,
    ) {
      const id = ++fetchId.current;
      latestQuery.current = query;

      await new Promise((res) => resolverSetter(res));

      // This is the guard: only commit if still the latest fetch
      if (id !== fetchId.current) return;
      committed = mockResponse;
    }

    const promiseA = simulateFetch('apple', responseA, (r) => (resolveA = r));
    const promiseB = simulateFetch('banana', responseB, (r) => (resolveB = r));

    // B resolves first
    resolveB(undefined);
    await promiseB;
    expect(committed).toEqual(responseB);

    // A resolves second (stale)
    resolveA(undefined);
    await promiseA;
    // Should still be B's result — A was discarded
    expect(committed).toEqual(responseB);
  });
});
