interface RetryOptions {
  retries: number;
  baseDelayMs: number;
  factor: number;
  signal?: AbortSignal;
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export async function retry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions,
): Promise<T> {
  const { retries, baseDelayMs, factor, signal } = opts;
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isAbort = err instanceof Error && err.name === 'AbortError';
      const status = (err as { status?: number })?.status;
      const isClientError = typeof status === 'number' && status >= 400 && status < 500;

      if (isAbort || isClientError || attempt >= retries) {
        throw err;
      }

      const waitMs = baseDelayMs * Math.pow(factor, attempt);
      attempt++;
      await delay(waitMs, signal);
    }
  }
}
