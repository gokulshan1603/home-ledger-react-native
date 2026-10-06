import {useCallback, useEffect, useState} from 'react';
import {GoldHolding} from '../types/gold';
import {listenGold, listGold} from '../services/goldService';

export const useGold = () => {
  const [items, setItems] = useState<GoldHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listGold());
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    return listenGold(next => {
      setItems(next);
      setError(null);
      setLoading(false);
    }, nextError => {
      setError(nextError.message);
      setLoading(false);
    });
  }, []);

  return {items, loading, error, refresh, reload: refresh};
};
