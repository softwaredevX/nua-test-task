import { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types';
import { fetchProducts, searchProducts } from '../services/productsApi';
import { track } from '../../../services/analytics/analytics';

const PAGE_SIZE = 20;

interface State {
  products: Product[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
}

export function useProducts(query: string) {
  const [state, setState] = useState<State>({
    products: [],
    total: 0,
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: null,
  });

  const pageRef = useRef(0);
  const fetchIdRef = useRef(0);
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(
    async (skip: number, isRefresh: boolean) => {
      // Guard against duplicate page fetches during infinite scroll only
      if (skip > 0 && inFlightRef.current) return;

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      const fetchId = ++fetchIdRef.current;
      inFlightRef.current = true;

      const isFirstPage = skip === 0;

      setState((s) => ({
        ...s,
        loading: isFirstPage && !isRefresh,
        loadingMore: !isFirstPage,
        refreshing: isRefresh,
        error: null,
      }));

      try {
        const fn = query.trim()
          ? () => searchProducts(query, PAGE_SIZE, skip, ac.signal)
          : () => fetchProducts(PAGE_SIZE, skip, ac.signal);

        const data = await fn();

        if (fetchId !== fetchIdRef.current) return;

        if (query.trim()) {
          track('search_performed', {
            query: query.trim(),
            resultCount: data.total,
          });
        }

        setState((s) => ({
          ...s,
          products: isFirstPage ? data.products : [...s.products, ...data.products],
          total: data.total,
          loading: false,
          loadingMore: false,
          refreshing: false,
          error: null,
        }));
        pageRef.current = skip + data.products.length;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        if (fetchId !== fetchIdRef.current) return;
        setState((s) => ({
          ...s,
          loading: false,
          loadingMore: false,
          refreshing: false,
          error: "Couldn't load products. Try again.",
        }));
      } finally {
        if (fetchId === fetchIdRef.current) {
          inFlightRef.current = false;
        }
      }
    },
    [query],
  );

  useEffect(() => {
    pageRef.current = 0;
    load(0, false);
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const loadMore = useCallback(() => {
    if (state.loadingMore || state.loading || state.refreshing) return;
    if (state.products.length === 0 || pageRef.current >= state.total) return;
    load(pageRef.current, false);
  }, [load, state.loadingMore, state.loading, state.refreshing, state.products.length, state.total]);

  const refresh = useCallback(() => {
    pageRef.current = 0;
    load(0, true);
  }, [load]);

  return { ...state, loadMore, refresh };
}
