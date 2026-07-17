"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseAsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Generic data-fetching hook used across the dashboard to talk to the mock
 * `services/` layer. Keeps loading / error / empty states consistent so
 * every section can reuse the same skeleton + error UI conventions.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, deps: React.DependencyList = []) {
  const [state, setState] = useState<UseAsyncDataState<T>>({ data: null, isLoading: true, error: null });
  const fetcherRef = useRef(fetcher);

  // Keep the latest fetcher available without forcing the fetch effect below
  // to re-run on every render (it intentionally only depends on `deps`).
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const runFetch = useCallback(() => {
    let cancelled = false;

    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ data: null, isLoading: false, error });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return runFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runFetch, ...deps]);

  // Exposed for "Try again" buttons — called from event handlers, so it's
  // safe to flip back to a loading state synchronously here.
  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    runFetch();
  }, [runFetch]);

  return { ...state, refetch };
}
