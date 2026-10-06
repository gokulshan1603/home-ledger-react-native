import {useCallback, useEffect, useState} from 'react';
import {Loan} from '../types/loan';
import {listenLoans, listLoans} from '../services/loanService';

export const useLoans = () => {
  const [items, setItems] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listLoans());
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    return listenLoans(next => {
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
