/**
 * useApi — Generic data-fetching hook with polling support.
 * Usage: const { data, loading, error, refetch } = useApi(apiFn, pollMs);
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export function useApi(apiFn, pollIntervalMs = 0) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const isMounted             = useRef(true);

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      if (isMounted.current) setData(result);
    } catch (err) {
      if (isMounted.current) setError(err?.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetch();

    let timer;
    if (pollIntervalMs > 0) {
      timer = setInterval(() => fetch(true), pollIntervalMs);
    }

    return () => {
      isMounted.current = false;
      if (timer) clearInterval(timer);
    };
  }, [fetch, pollIntervalMs]);

  return { data, loading, error, refetch: () => fetch(false) };
}
