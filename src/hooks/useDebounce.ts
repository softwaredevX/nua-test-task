import { useEffect, useRef, useState } from 'react';

export function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(value), ms);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, ms]);

  return debounced;
}
