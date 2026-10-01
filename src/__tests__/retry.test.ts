import { retry } from '../utils/retry';

jest.useFakeTimers();

describe('retry', () => {
  test('resolves immediately on success', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await retry(fn, { retries: 3, baseDelayMs: 500, factor: 2 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('retries on failure and eventually resolves', async () => {
    let calls = 0;
    const fn = jest.fn().mockImplementation(() => {
      calls++;
      if (calls < 3) return Promise.reject(new Error('fail'));
      return Promise.resolve('ok');
    });

    const p = retry(fn, { retries: 3, baseDelayMs: 100, factor: 2 });
    await jest.runAllTimersAsync();
    const result = await p;
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('throws after exhausting retries', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('fail'));
    const expectation = expect(
      retry(fn, { retries: 2, baseDelayMs: 100, factor: 2 }),
    ).rejects.toThrow('fail');
    await jest.runAllTimersAsync();
    await expectation;
    expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  test('does not retry on abort', async () => {
    const ac = new AbortController();
    ac.abort();
    const fn = jest.fn().mockRejectedValue(
      Object.assign(new Error('Aborted'), { name: 'AbortError' }),
    );
    await expect(
      retry(fn, { retries: 3, baseDelayMs: 100, factor: 2, signal: ac.signal }),
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
