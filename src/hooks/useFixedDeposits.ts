import {useCallback, useEffect, useState} from 'react';
import {FixedDeposit} from '../types/fixedDeposit';
import {listenFixedDeposits, listFixedDeposits} from '../services/fdService';

export const useFixedDeposits = () => {
  const [items, setItems] = useState<FixedDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listFixedDeposits());
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    return listenFixedDeposits(next => {
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
