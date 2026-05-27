import { useState, useEffect } from 'react';
import { sanityClient } from './sanityClient';

export function useSanity(query, fallbackData = null, params = {}) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const result = await sanityClient.fetch(query, params);
        if (isMounted) {
          if (result && (Array.isArray(result) ? result.length > 0 : Object.keys(result).length > 0)) {
            setData(result);
          } else {
            console.warn('Sanity returned empty or null. Using fallback data.');
            setData(fallbackData);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Sanity fetch error:', err);
          setError(err);
          setData(fallbackData);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [query, JSON.stringify(params)]);

  return { data, loading, error };
}
